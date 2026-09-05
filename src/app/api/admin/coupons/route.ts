import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

async function guard() {
  const s = await getAdminSession();
  return s.isLoggedIn;
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureSeeded();
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const coupon = await prisma.coupon.create({
    data: {
      code: String(body.code).toUpperCase(),
      type: body.type === 'FIXED' ? 'FIXED' : 'PERCENT',
      value: Number(body.value),
      minOrder: body.minOrder != null && body.minOrder !== '' ? Number(body.minOrder) : null,
      maxUses: body.maxUses != null && body.maxUses !== '' ? Number(body.maxUses) : null,
      active: body.active !== false,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  });
  return NextResponse.json({ coupon });
}

export async function DELETE(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
