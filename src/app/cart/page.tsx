'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatINR } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, count } = useCart();

  if (count === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-emerald-deep/60">Discover our heritage collection.</p>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="card flex gap-4 p-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-semibold hover:text-emerald">{item.name}</Link>
                    <p className="text-xs text-emerald-deep/60">{item.size} · {item.color}</p>
                  </div>
                  <button onClick={() => removeItem(item.productId, item.size, item.color)} aria-label="Remove">
                    <Trash2 className="h-4 w-4 text-emerald-deep/40 hover:text-red-600" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <select
                    className="rounded-lg border border-emerald/20 bg-cream-ivory px-2 py-1 text-sm"
                    value={item.quantity}
                    onChange={(e) => updateQty(item.productId, item.size, item.color, Number(e.target.value))}
                  >
                    {Array.from({ length: Math.min(item.stock, 10) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span className="font-semibold">{formatINR(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="card h-fit p-6">
          <h2 className="font-display text-xl font-bold">Summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">{formatINR(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-emerald-deep/50">Shipping calculated at checkout</p>
          <Link href="/checkout" className="btn-primary mt-6 w-full">Proceed to Checkout</Link>
        </aside>
      </div>
    </div>
  );
}
