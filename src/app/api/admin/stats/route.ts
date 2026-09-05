import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureSeeded();

  const [orders, products, customers, paidOrders] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.product.findMany({ where: { stock: { lte: 10 } }, orderBy: { stock: 'asc' }, take: 10 }),
    prisma.customer.count(),
    prisma.order.findMany({ where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } } }),
  ]);

  const sales = paidOrders.reduce((s, o) => s + o.total, 0);
  const orderCount = await prisma.order.count();

  return NextResponse.json({
    sales,
    orderCount,
    customerCount: customers,
    recentOrders: orders,
    lowStock: products,
  });
}
