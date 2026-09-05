'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ShopFilters({
  categories,
  fabrics,
}: {
  categories: string[];
  fabrics: string[];
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const [min, setMin] = useState(sp.get('min') || '');
  const [max, setMax] = useState(sp.get('max') || '');

  const apply = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams(sp.toString());
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <aside className="card h-fit space-y-6 p-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gold">Search</label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply({ q });
          }}
          className="flex gap-2"
        >
          <input className="input-field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." />
        </form>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gold">Category</label>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => apply({ category: '' })} className={`rounded-full px-3 py-1 text-xs ${!sp.get('category') ? 'bg-emerald-deep text-cream' : 'bg-cream-dark'}`}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => apply({ category: c })} className={`rounded-full px-3 py-1 text-xs ${sp.get('category') === c ? 'bg-emerald-deep text-cream' : 'bg-cream-dark'}`}>{c}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gold">Fabric</label>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => apply({ fabric: '' })} className={`rounded-full px-3 py-1 text-xs ${!sp.get('fabric') ? 'bg-emerald-deep text-cream' : 'bg-cream-dark'}`}>All</button>
          {fabrics.map((f) => (
            <button key={f} onClick={() => apply({ fabric: f })} className={`rounded-full px-3 py-1 text-xs ${sp.get('fabric') === f ? 'bg-emerald-deep text-cream' : 'bg-cream-dark'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gold">Price (₹)</label>
        <div className="flex gap-2">
          <input className="input-field" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} />
          <input className="input-field" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} />
        </div>
        <button className="btn-primary mt-2 w-full py-2 text-xs" onClick={() => apply({ min, max })}>Apply</button>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gold">Sort</label>
        <select
          className="input-field"
          value={sp.get('sort') || ''}
          onChange={(e) => apply({ sort: e.target.value })}
        >
          <option value="">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>
    </aside>
  );
}
