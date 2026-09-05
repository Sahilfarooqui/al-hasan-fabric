'use client';

import { useRef, useState } from 'react';
import { Heart, Minus, Plus, ShoppingBag, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { getInstagramUrl } from '@/lib/site';
import type { ProductDTO } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/hooks/useWishlist';
import SafeImage from '@/components/ui/SafeImage';

export default function ProductDetailClient({ product }: { product: ProductDTO }) {
  const [idx, setIdx] = useState(0);
  const [size, setSize] = useState(product.sizes[0] || '');
  const [color, setColor] = useState(product.colors[0] || '');
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');
  const touchX = useRef<number | null>(null);
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  const images = product.images.length ? product.images : ['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80'];

  const add = () => {
    if (product.stock < 1) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: images[0] || '',
      size,
      color,
      quantity: qty,
      stock: product.stock,
    });
    setMsg('Added to cart');
    setTimeout(() => setMsg(''), 2000);
  };

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div
          className="relative aspect-square overflow-hidden rounded-2xl bg-cream-dark"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) {
              if (dx < 0) next();
              else prev();
            }
            touchX.current = null;
          }}
        >
          <SafeImage key={images[idx]} src={images[idx]} alt={`${product.name} photo ${idx + 1}`} fill className="object-cover transition duration-300" sizes="(max-width:1024px) 100vw, 50vw" priority={idx === 0} />
          {images.length > 1 && (
            <>
              <button type="button" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/90 p-2 shadow" aria-label="Previous image">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/90 p-2 shadow" aria-label="Next image">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button key={i} type="button" onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition ${i === idx ? 'w-6 bg-gold' : 'w-1.5 bg-cream/70'}`} aria-label={`Image ${i + 1}`} />
                ))}
              </div>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button key={`${img}-${i}`} onClick={() => setIdx(i)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${i === idx ? 'border-gold' : 'border-transparent'}`}>
                <SafeImage src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm uppercase tracking-wider text-gold">{product.category} · {product.fabricType}</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{product.name}</h1>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-bold">{formatINR(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-lg text-emerald-deep/40 line-through">{formatINR(product.compareAtPrice)}</span>
          )}
        </div>
        <p className="mt-4 leading-relaxed text-emerald-deep/70">{product.description}</p>
        <p className={`mt-3 text-sm font-medium ${product.stock > 5 ? 'text-emerald' : product.stock > 0 ? 'text-amber-700' : 'text-red-600'}`}>
          {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
        </p>

        {product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`rounded-full px-4 py-2 text-sm ${size === s ? 'bg-emerald-deep text-cream' : 'bg-cream-dark'}`}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {product.colors.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`rounded-full px-4 py-2 text-sm ${color === c ? 'bg-gold text-emerald-deep' : 'bg-cream-dark'}`}>{c}</button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded-full border border-emerald/20">
            <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Minus className="h-4 w-4" /></button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button className="p-3" onClick={() => setQty(Math.min(product.stock, qty + 1))} aria-label="Increase"><Plus className="h-4 w-4" /></button>
          </div>
          <button className="btn-primary flex-1" onClick={add} disabled={product.stock < 1}>
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </button>
          <button className="rounded-full border border-emerald/20 p-3" onClick={() => toggle(product.id)} aria-label="Wishlist">
            <Heart className={`h-5 w-5 ${has(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {product.videoUrl ? (
          <a
            href={product.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Instagram className="h-4 w-4" /> Watch reel
          </a>
        ) : (
          <a
            href={getInstagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-deep/70 underline-offset-4 transition hover:text-gold hover:underline"
          >
            <Instagram className="h-4 w-4" /> More looks on Instagram
          </a>
        )}

        {msg && <p className="mt-3 text-sm font-medium text-emerald">{msg}</p>}
      </div>
    </div>
  );
}
