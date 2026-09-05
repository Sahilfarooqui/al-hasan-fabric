'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useWishlist } from '@/hooks/useWishlist';
import type { ProductDTO } from '@/types';
import SafeImage from '@/components/ui/SafeImage';

export default function ProductCard({ product }: { product: ProductDTO }) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const img = product.images[0] || 'https://picsum.photos/seed/alhasan-fallback/600/800';

  return (
    <article className="group card overflow-hidden transition hover:shadow-soft">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
        <div className="skeleton absolute inset-0 -z-10" />
        <Link href={`/product/${product.slug}`}>
          <SafeImage
            src={img}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        </Link>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-deep">
            Sale
          </span>
        )}
        <button
          onClick={() => toggle(product.id)}
          className="absolute right-3 top-3 rounded-full bg-cream/90 p-2 shadow transition hover:bg-cream"
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 ${wished ? 'fill-red-500 text-red-500' : 'text-emerald-deep'}`} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-gold">{product.category}</p>
        <Link href={`/product/${product.slug}`} className="mt-1 block font-display text-lg font-semibold leading-snug hover:text-emerald">
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-emerald-deep/60">{product.fabricType}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-semibold text-emerald-deep">{formatINR(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-emerald-deep/40 line-through">{formatINR(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
