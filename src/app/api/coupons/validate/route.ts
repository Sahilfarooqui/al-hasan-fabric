import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function POST(req: NextRequest) {
  await ensureSeeded();
  const { code, subtotal } = await req.json();
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({ where: { code: String(code).toUpperCase() } });
  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: 'Invalid coupon' }, { status: 400 });
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
  }
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return NextResponse.json({ error: `Minimum order ₹${coupon.minOrder}` }, { status: 400 });
  }

  const discount =
    coupon.type === 'PERCENT'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

  return NextResponse.json({ discount, type: coupon.type, value: coupon.value });
}
