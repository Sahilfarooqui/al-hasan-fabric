'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/lib/utils';
import { ADMIN_BASE, adminFetch } from '@/lib/admin-fetch';

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    adminFetch('/api/admin/orders').then(async (r) => {
      if (r.status === 401) { router.push(`${ADMIN_BASE}/login`); return; }
      const d = await r.json();
      setOrders(d.orders || []);
    });
  }, [router]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Orders</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-emerald/10 text-xs uppercase text-gold">
              <th className="py-2">Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-emerald/5">
                <td className="py-3"><Link className="font-medium text-emerald hover:underline" href={`${ADMIN_BASE}/orders/${o.id}`}>{o.orderNumber}</Link></td>
                <td>{o.customerName}<br /><span className="text-xs text-emerald-deep/50">{o.phone}</span></td>
                <td>{formatINR(o.total)}</td>
                <td>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="mt-4 text-emerald-deep/50">No orders yet.</p>}
      </div>
    </div>
  );
}
