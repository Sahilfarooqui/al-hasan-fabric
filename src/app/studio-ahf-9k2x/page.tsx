'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import { ADMIN_BASE, adminFetch } from '@/lib/admin-fetch';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<{
    sales: number;
    orderCount: number;
    customerCount: number;
    recentOrders: Array<{ id: string; orderNumber: string; customerName: string; total: number; status: string }>;
    lowStock: Array<{ id: string; name: string; stock: number }>;
  } | null>(null);

  useEffect(() => {
    adminFetch('/api/admin/stats')
      .then(async (r) => {
        if (r.status === 401) {
          router.push(`${ADMIN_BASE}/login`);
          return null;
        }
        return r.json();
      })
      .then((d) => d && setData(d));
  }, [router]);

  if (!data) return <p className="text-emerald-deep/60">Loading dashboard…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5"><p className="text-xs uppercase text-gold">Sales</p><p className="mt-1 text-2xl font-bold">{formatINR(data.sales)}</p></div>
        <div className="card p-5"><p className="text-xs uppercase text-gold">Orders</p><p className="mt-1 text-2xl font-bold">{data.orderCount}</p></div>
        <div className="card p-5"><p className="text-xs uppercase text-gold">Customers</p><p className="mt-1 text-2xl font-bold">{data.customerCount}</p></div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">Recent orders</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.recentOrders.map((o) => (
              <li key={o.id} className="flex justify-between gap-2">
                <Link href={`${ADMIN_BASE}/orders/${o.id}`} className="hover:text-emerald">{o.orderNumber} · {o.customerName}</Link>
                <span>{formatINR(o.total)} · {o.status}</span>
              </li>
            ))}
            {data.recentOrders.length === 0 && <li className="text-emerald-deep/50">No orders yet</li>}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold">Low stock</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.lowStock.map((p) => (
              <li key={p.id} className="flex justify-between">
                <Link href={`${ADMIN_BASE}/products`} className="hover:text-emerald">{p.name}</Link>
                <span className={p.stock <= 5 ? 'text-red-600 font-semibold' : ''}>{p.stock}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
