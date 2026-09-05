import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPaytmConfig, generatePaytmChecksum, isDemoMode } from '@/lib/paytm';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (isDemoMode()) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID', paymentId: `DEMO-${Date.now()}`, paymentMethod: 'PAYTM_DEMO' },
      });
      return NextResponse.json({ demo: true, orderId: order.id });
    }

    const config = getPaytmConfig();
    const paytmParams: Record<string, string> = {
      MID: config.mid,
      WEBSITE: config.website,
      INDUSTRY_TYPE_ID: config.industryType,
      CHANNEL_ID: config.channelId,
      ORDER_ID: order.orderNumber,
      CUST_ID: order.phone,
      TXN_AMOUNT: order.total.toFixed(2),
      CALLBACK_URL: config.callbackUrl,
      EMAIL: order.email || `${order.phone}@alhasanfabric.local`,
      MOBILE_NO: order.phone.replace(/\D/g, '').slice(-10),
    };

    const checksum = await generatePaytmChecksum(paytmParams, config.merchantKey);
    paytmParams.CHECKSUMHASH = checksum;

    return NextResponse.json({
      demo: false,
      txnUrl: `${config.host}/theia/processTransaction`,
      params: paytmParams,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}
