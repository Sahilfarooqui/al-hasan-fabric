import { PrismaClient } from "@prisma/client";
import { SEED_COUPONS, SEED_PRODUCTS } from "../src/lib/catalog";

const prisma = new PrismaClient();

async function main() {
  for (const p of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        images: JSON.stringify(p.images),
        category: p.category,
        fabricType: p.fabricType,
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        stock: p.stock,
        featured: p.featured,
        published: p.published,
      },
      update: {
        images: JSON.stringify(p.images),
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        category: p.category,
        fabricType: p.fabricType,
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        featured: p.featured,
        published: p.published,
      },
    });
  }
  console.log(`Upserted ${SEED_PRODUCTS.length} products`);

  for (const c of SEED_COUPONS) {
    const maxUses = "maxUses" in c ? (c as { maxUses?: number }).maxUses ?? null : null;
    const minOrder = "minOrder" in c ? c.minOrder ?? null : null;
    await prisma.coupon.upsert({
      where: { code: c.code },
      create: {
        code: c.code,
        type: c.type,
        value: c.value,
        minOrder,
        maxUses,
        active: c.active,
      },
      update: {
        type: c.type,
        value: c.value,
        active: c.active,
      },
    });
  }
  console.log(`Upserted ${SEED_COUPONS.length} coupons`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
