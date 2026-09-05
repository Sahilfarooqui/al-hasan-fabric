import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { orderNumber, phone } = await req.json();
  if (!orderNumber || !phone) {
    return NextResponse.json({ error: 'Order ID and phone required' }, { status: 400 });
  }
  const order = await prisma.order.findFirst({
    where: {
      orderNumber: String(orderNumber).trim(),
      phone: String(phone).replace(/\s/g, ''),
    },
  });
  if (!order) {
    return NextResponse.json({ error: 'Order not found. Check ID and phone.' }, { status: 404 });
  }
  const items = JSON.parse(order.items) as Array<{ name: string; quantity: number }>;
  return NextResponse.json({
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      customerName: order.customerName,
      createdAt: order.createdAt.toISOString(),
      items: items.map((i) => ({ name: i.name, quantity: i.quantity })),
    },
  });
}
