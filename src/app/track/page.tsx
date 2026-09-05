'use client';

import { FormEvent, useState } from 'react';
import { formatINR } from '@/lib/utils';

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<null | {
    orderNumber: string;
    status: string;
    total: number;
    customerName: string;
    createdAt: string;
    items: Array<{ name: string; quantity: number }>;
  }>(null);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    const res = await fetch('/api/orders/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber, phone }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Not found');
      return;
    }
    setResult(data.order);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Track your order</h1>
      <p className="mt-2 text-sm text-emerald-deep/60">Enter order ID and the phone used at checkout.</p>
      <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-xs font-semibold">Order ID</label>
          <input className="input-field" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="AHF-..." required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Phone</label>
          <input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" type="submit">Track</button>
      </form>
      {result && (
        <div className="card mt-6 p-6">
          <p className="text-sm text-emerald-deep/50">Status</p>
          <p className="text-2xl font-bold text-emerald">{result.status}</p>
          <p className="mt-4 text-sm">Order <strong>{result.orderNumber}</strong> for {result.customerName}</p>
          <p className="text-sm">Total {formatINR(result.total)}</p>
          <ul className="mt-3 space-y-1 text-sm text-emerald-deep/70">
            {result.items.map((i, idx) => (
              <li key={idx}>{i.name} × {i.quantity}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
