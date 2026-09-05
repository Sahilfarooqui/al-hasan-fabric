import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPaytmConfig, verifyPaytmChecksum } from '@/lib/paytm';

export async function POST(req: NextRequest) {
  const config = getPaytmConfig();
  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((v, k) => {
    params[k] = String(v);
  });

  const checksum = params.CHECKSUMHASH || '';
  const body = { ...params };
  delete body.CHECKSUMHASH;

  const valid = checksum ? await verifyPaytmChecksum(body, config.merchantKey, checksum) : false;
  const orderNumber = params.ORDERID || params.ORDER_ID;
  const status = params.STATUS || params.RESPSTATUS;
  const txnId = params.TXNID || params.TXN_ID;

  if (orderNumber) {
    const order = await prisma.order.findFirst({ where: { orderNumber } });
    if (order) {
      const paid = valid && (status === 'TXN_SUCCESS' || status === 'SUCCESS');
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: paid ? 'PAID' : 'PENDING',
          paymentId: txnId || order.paymentId,
          paymentMethod: 'PAYTM',
        },
      });
      const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${site}/order/${order.id}?paid=${paid ? '1' : '0'}`, 303);
    }
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${site}/shop`, 303);
}
