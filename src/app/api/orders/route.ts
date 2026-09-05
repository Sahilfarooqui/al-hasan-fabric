import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateOrderNumber } from '@/lib/utils';
import { ensureSeeded } from '@/lib/seed';
import { checkoutSchema } from '@/lib/validation';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  await ensureSeeded();
  const limited = rateLimit(`checkout:${clientIp(req)}`, 20, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: 'Too many orders. Please wait.' }, { status: 429 });
  }

  try {
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = checkoutSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid checkout data', details: parsed.error.flatten() }, { status: 400 });
    }

    const {
      customerName, phone, email, whatsappConsent, address, city, state, pincode,
      items, couponCode,
    } = parsed.data;

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: String(couponCode).toUpperCase() } });
      if (coupon && coupon.active && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (!coupon.minOrder || subtotal >= coupon.minOrder) {
          if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
            discount =
              coupon.type === 'PERCENT'
                ? Math.round((subtotal * coupon.value) / 100)
                : Math.min(coupon.value, subtotal);
            await prisma.coupon.update({
              where: { id: coupon.id },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      }
    }

    const total = Math.max(0, subtotal - discount);

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name || 'item'}` },
          { status: 400 }
        );
      }
    }

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        phone,
        email: email || null,
        whatsappConsent: !!whatsappConsent,
        address,
        city,
        state,
        pincode,
        items: JSON.stringify(items),
        subtotal,
        discount,
        total,
        couponCode: couponCode ? String(couponCode).toUpperCase() : null,
        status: 'PENDING',
        paymentMethod: 'PAYTM',
      },
    });

    await prisma.customer.upsert({
      where: { phone: order.phone },
      create: {
        name: customerName,
        phone: order.phone,
        email: email || null,
        whatsappConsent: !!whatsappConsent,
      },
      update: {
        name: customerName,
        email: email || undefined,
        whatsappConsent: whatsappConsent ? true : undefined,
      },
    });

    return NextResponse.json({ order: { id: order.id, orderNumber: order.orderNumber, total: order.total } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
