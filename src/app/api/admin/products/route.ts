import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { slugify } from '@/lib/utils';
import { ensureSeeded } from '@/lib/seed';
import { toProductDTO } from '@/lib/products';

async function guard() {
  const session = await getAdminSession();
  return session.isLoggedIn;
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureSeeded();
  const products = await prisma.product.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ products: products.map(toProductDTO) });
}

export async function POST(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const slug = body.slug || slugify(body.name);
  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      description: body.description || '',
      price: Number(body.price),
      compareAtPrice: body.compareAtPrice != null ? Number(body.compareAtPrice) : null,
      images: JSON.stringify(body.images || []),
      category: body.category || 'General',
      fabricType: body.fabricType || 'Mixed',
      sizes: JSON.stringify(body.sizes || []),
      colors: JSON.stringify(body.colors || []),
      stock: Number(body.stock || 0),
      featured: !!body.featured,
      published: body.published !== false,
    },
  });
  return NextResponse.json({ product: toProductDTO(product) });
}
