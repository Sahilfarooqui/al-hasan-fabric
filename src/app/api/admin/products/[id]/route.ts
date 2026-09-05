import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toProductDTO } from '@/lib/products';

async function guard() {
  const s = await getAdminSession();
  return s.isLoggedIn;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await Promise.resolve(params);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product: toProductDTO(product) });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await Promise.resolve(params);
  const body = await req.json();
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: Number(body.price),
      compareAtPrice: body.compareAtPrice != null && body.compareAtPrice !== '' ? Number(body.compareAtPrice) : null,
      images: JSON.stringify(body.images || []),
      category: body.category,
      fabricType: body.fabricType,
      sizes: JSON.stringify(body.sizes || []),
      colors: JSON.stringify(body.colors || []),
      stock: Number(body.stock),
      featured: !!body.featured,
      published: !!body.published,
    },
  });
  return NextResponse.json({ product: toProductDTO(product) });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await Promise.resolve(params);
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
