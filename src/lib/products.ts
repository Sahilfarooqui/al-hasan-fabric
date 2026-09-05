import { prisma } from './db';
import { ensureSeeded } from './seed';
import { parseJsonArray } from './utils';
import type { ProductDTO } from '@/types';
import type { Product } from '@prisma/client';

export function toProductDTO(p: Product): ProductDTO {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: parseJsonArray(p.images),
    category: p.category,
    fabricType: p.fabricType,
    sizes: parseJsonArray(p.sizes),
    colors: parseJsonArray(p.colors),
    stock: p.stock,
    featured: p.featured,
    published: p.published,
  };
}

export async function getPublishedProducts(filters?: {
  category?: string;
  fabricType?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  featured?: boolean;
}) {
  await ensureSeeded();
  const where: Record<string, unknown> = { published: true };
  if (filters?.category) where.category = filters.category;
  if (filters?.fabricType) where.fabricType = filters.fabricType;
  if (filters?.featured) where.featured = true;
  if (filters?.q) {
    where.OR = [
      { name: { contains: filters.q } },
      { description: { contains: filters.q } },
      { category: { contains: filters.q } },
    ];
  }
  if (filters?.minPrice != null || filters?.maxPrice != null) {
    where.price = {
      ...(filters.minPrice != null ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice != null ? { lte: filters.maxPrice } : {}),
    };
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' };
  if (filters?.sort === 'price-asc') orderBy = { price: 'asc' };
  if (filters?.sort === 'price-desc') orderBy = { price: 'desc' };
  if (filters?.sort === 'name') orderBy = { name: 'asc' };

  const products = await prisma.product.findMany({ where, orderBy });
  return products.map(toProductDTO);
}

export async function getProductBySlug(slug: string) {
  await ensureSeeded();
  const p = await prisma.product.findUnique({ where: { slug } });
  return p ? toProductDTO(p) : null;
}

export async function getCategories() {
  await ensureSeeded();
  const rows = await prisma.product.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ['category'],
  });
  return rows.map((r) => r.category);
}

export async function getFabricTypes() {
  await ensureSeeded();
  const rows = await prisma.product.findMany({
    where: { published: true },
    select: { fabricType: true },
    distinct: ['fabricType'],
  });
  return rows.map((r) => r.fabricType);
}
