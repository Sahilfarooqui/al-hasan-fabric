import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { requireCsrf } from '@/lib/csrf';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { couponInputSchema } from '@/lib/validation';

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
  if (!(await requireCsrf(req))) return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = couponInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const coupon = await prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.value,
      minOrder: data.minOrder ?? null,
      maxUses: data.maxUses ?? null,
      active: data.active !== false,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });
  return NextResponse.json({ coupon });
}

export async function DELETE(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await requireCsrf(req))) return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
