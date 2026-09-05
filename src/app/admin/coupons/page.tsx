'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
};

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const load = () =>
    fetch('/api/admin/coupons').then(async (r) => {
      if (r.status === 401) { router.push('/admin/login'); return; }
      const d = await r.json();
      setCoupons(d.coupons || []);
    });

  useEffect(() => { load(); }, [router]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: fd.get('code'),
        type: fd.get('type'),
        value: fd.get('value'),
        minOrder: fd.get('minOrder') || null,
        maxUses: fd.get('maxUses') || null,
        active: true,
      }),
    });
    e.currentTarget.reset();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete coupon?')) return;
    await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Coupons</h1>
      <form onSubmit={onSubmit} className="card mt-6 grid gap-3 p-5 sm:grid-cols-2">
        <input name="code" required placeholder="CODE" className="input-field uppercase" />
        <select name="type" className="input-field"><option value="PERCENT">Percent</option><option value="FIXED">Fixed ₹</option></select>
        <input name="value" required type="number" placeholder="Value" className="input-field" />
        <input name="minOrder" type="number" placeholder="Min order (optional)" className="input-field" />
        <input name="maxUses" type="number" placeholder="Max uses (optional)" className="input-field" />
        <button type="submit" className="btn-primary sm:col-span-2">Create coupon</button>
      </form>
      <ul className="mt-6 space-y-2">
        {coupons.map((c) => (
          <li key={c.id} className="card flex items-center justify-between p-4 text-sm">
            <div>
              <strong>{c.code}</strong> — {c.type === 'PERCENT' ? `${c.value}%` : `₹${c.value}`}
              <span className="text-emerald-deep/50"> · used {c.usedCount}{c.maxUses != null ? `/${c.maxUses}` : ''}</span>
            </div>
            <button onClick={() => remove(c.id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
