import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { toProductDTO } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const ids = req.nextUrl.searchParams.get('ids');
  if (ids) {
    const list = ids.split(',').filter(Boolean);
    const products = await prisma.product.findMany({ where: { id: { in: list }, published: true } });
    return NextResponse.json({ products: products.map(toProductDTO) });
  }
  const products = await prisma.product.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ products: products.map(toProductDTO) });
}
