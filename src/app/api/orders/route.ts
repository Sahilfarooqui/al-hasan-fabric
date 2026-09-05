import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateOrderNumber } from '@/lib/utils';
import { ensureSeeded } from '@/lib/seed';

export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const body = await req.json();
    const {
      customerName, phone, email, whatsappConsent, address, city, state, pincode,
      items, couponCode,
    } = body;

    if (!customerName || !phone || !address || !city || !state || !pincode || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const subtotal = items.reduce(
      (s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity,
      0
    );

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
        phone: String(phone).replace(/\s/g, ''),
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
