import ProductCard from '@/components/shop/ProductCard';
import ShopFilters from '@/components/shop/ShopFilters';
import { getCategories, getFabricTypes, getPublishedProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>> | Record<string, string | undefined>;
}) {
  const sp = await Promise.resolve(searchParams);
  const products = await getPublishedProducts({
    category: sp.category,
    fabricType: sp.fabric,
    q: sp.q,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sort: sp.sort,
  });
  const categories = await getCategories();
  const fabrics = await getFabricTypes();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-gold">Catalog</p>
        <h1 className="font-display text-4xl font-bold">Shop Fabrics & Attire</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <ShopFilters categories={categories} fabrics={fabrics} />
        <div>
          <p className="mb-4 text-sm text-emerald-deep/60">{products.length} products</p>
          {products.length === 0 ? (
            <div className="card p-12 text-center text-emerald-deep/60">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
