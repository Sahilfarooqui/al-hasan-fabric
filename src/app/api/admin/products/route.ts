import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { requireCsrf } from '@/lib/csrf';
import { prisma } from '@/lib/db';
import { slugify } from '@/lib/utils';
import { ensureSeeded } from '@/lib/seed';
import { toProductDTO } from '@/lib/products';
import { productInputSchema } from '@/lib/validation';

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
  if (!(await requireCsrf(req))) return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });

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
  const slug = data.slug || slugify(data.name);
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description || '',
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      images: JSON.stringify(data.images || []),
      category: data.category || 'General',
      fabricType: data.fabricType || 'Mixed',
      sizes: JSON.stringify(data.sizes || []),
      colors: JSON.stringify(data.colors || []),
      stock: data.stock || 0,
      featured: !!data.featured,
      published: data.published !== false,
      videoUrl: data.videoUrl ?? null,
    },
  });
  return NextResponse.json({ product: toProductDTO(product) });
}
