import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { requireCsrf } from '@/lib/csrf';
import { prisma } from '@/lib/db';
import { orderStatusSchema } from '@/lib/validation';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await Promise.resolve(params);
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await requireCsrf(req))) return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  const { id } = await Promise.resolve(params);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = orderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const order = await prisma.order.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ order });
}
