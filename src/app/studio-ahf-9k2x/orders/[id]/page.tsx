'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatINR } from '@/lib/utils';
import { ADMIN_BASE, adminFetch } from '@/lib/admin-fetch';

const STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState('');

  const load = () =>
    adminFetch(`/api/admin/orders/${id}`).then(async (r) => {
      if (r.status === 401) { router.push(`${ADMIN_BASE}/login`); return; }
      const d = await r.json();
      setOrder(d.order);
      setStatus(d.order.status);
    });

  useEffect(() => { load(); }, [id, router]);

  const save = async () => {
    await adminFetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    load();
  };

  if (!order) return <p>Loading…</p>;
  const items = JSON.parse(String(order.items)) as Array<{ name: string; quantity: number; price: number; size: string; color: string }>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{String(order.orderNumber)}</h1>
      <div className="card mt-6 space-y-3 p-5 text-sm">
        <p><strong>Customer:</strong> {String(order.customerName)} · {String(order.phone)}</p>
        <p><strong>Address:</strong> {String(order.address)}, {String(order.city)}, {String(order.state)} {String(order.pincode)}</p>
        <p><strong>WhatsApp opt-in:</strong> {order.whatsappConsent ? 'Yes' : 'No'}</p>
        <p><strong>Total:</strong> {formatINR(Number(order.total))} (discount {formatINR(Number(order.discount))})</p>
        <ul className="border-t border-emerald/10 pt-3">
          {items.map((i, idx) => (
            <li key={idx}>{i.name} ({i.size}/{i.color}) × {i.quantity} — {formatINR(i.price * i.quantity)}</li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <select className="input-field max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={save} className="btn-primary">Update status</button>
        </div>
      </div>
    </div>
  );
}
