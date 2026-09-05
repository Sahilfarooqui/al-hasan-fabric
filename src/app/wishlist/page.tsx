'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';
import type { ProductDTO } from '@/types';

export default function WishlistPage() {
  const { ids, ready } = useWishlist();
  const [products, setProducts] = useState<ProductDTO[]>([]);

  useEffect(() => {
    if (!ready || ids.length === 0) {
      setProducts([]);
      return;
    }
    fetch(`/api/products?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]));
  }, [ids, ready]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Wishlist</h1>
      {!ready ? (
        <p className="mt-6 text-emerald-deep/60">Loading…</p>
      ) : products.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-emerald-deep/60">No saved items yet.</p>
          <Link href="/shop" className="btn-primary mt-4 inline-flex">Browse shop</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
