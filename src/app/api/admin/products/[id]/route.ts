import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { requireCsrf } from '@/lib/csrf';
import { prisma } from '@/lib/db';
import { toProductDTO } from '@/lib/products';
import { productInputSchema } from '@/lib/validation';

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
  if (!(await requireCsrf(req))) return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  const { id } = await Promise.resolve(params);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug || undefined,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      images: JSON.stringify(data.images || []),
      category: data.category,
      fabricType: data.fabricType,
      sizes: JSON.stringify(data.sizes || []),
      colors: JSON.stringify(data.colors || []),
      stock: data.stock,
      featured: !!data.featured,
      published: !!data.published,
    },
  });
  return NextResponse.json({ product: toProductDTO(product) });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await requireCsrf(req))) return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  const { id } = await Promise.resolve(params);
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
