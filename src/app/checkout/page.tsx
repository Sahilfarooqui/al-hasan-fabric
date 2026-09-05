'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatINR } from '@/lib/utils';

export default function CheckoutPage() {
  const { items, subtotal, clearCart, count } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  if (count === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Nothing to checkout</h1>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">Shop Now</Link>
      </div>
    );
  }

  const applyCoupon = async () => {
    setCouponMsg('');
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: coupon, subtotal }),
    });
    const data = await res.json();
    if (!res.ok) {
      setDiscount(0);
      setCouponMsg(data.error || 'Invalid coupon');
      return;
    }
    setDiscount(data.discount);
    setCouponMsg(`Applied: -₹${data.discount}`);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerName: String(fd.get('name') || ''),
      phone: String(fd.get('phone') || ''),
      email: String(fd.get('email') || '') || undefined,
      whatsappConsent: fd.get('whatsappConsent') === 'on',
      address: String(fd.get('address') || ''),
      city: String(fd.get('city') || ''),
      state: String(fd.get('state') || ''),
      pincode: String(fd.get('pincode') || ''),
      couponCode: coupon || undefined,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
        image: i.image,
      })),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');

      const payRes = await fetch('/api/paytm/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.order.id }),
      });
      const pay = await payRes.json();
      if (!payRes.ok) throw new Error(pay.error || 'Payment init failed');

      if (pay.demo) {
        clearCart();
        router.push(`/order/${data.order.id}?paid=1`);
        return;
      }

      // Real Paytm: submit form to Paytm gateway
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = pay.txnUrl;
      Object.entries(pay.params).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = String(v);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      clearCart();
      form.submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  };

  const total = Math.max(0, subtotal - discount);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold">Checkout</h1>
      <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="card space-y-4 p-6">
          <h2 className="font-display text-xl font-bold">Shipping details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Full name *</label>
              <input name="name" required className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Phone *</label>
              <input name="phone" required pattern="[0-9+\-\s]{10,15}" className="input-field" placeholder="10-digit mobile" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Email (optional)</label>
              <input name="email" type="email" className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Address *</label>
              <textarea name="address" required rows={2} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">City *</label>
              <input name="city" required className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">State *</label>
              <input name="state" required className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">PIN code *</label>
              <input name="pincode" required pattern="[0-9]{6}" className="input-field" />
            </div>
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="whatsappConsent" className="mt-1" />
            <span>Yes, send me offers and order updates on WhatsApp</span>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <aside className="card h-fit space-y-4 p-6">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between gap-2">
                <span className="text-emerald-deep/70">{i.name} × {i.quantity}</span>
                <span>{formatINR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input className="input-field" placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
            <button type="button" onClick={applyCoupon} className="btn-outline shrink-0 px-4 py-2 text-xs">Apply</button>
          </div>
          {couponMsg && <p className="text-xs text-emerald">{couponMsg}</p>}
          <div className="space-y-1 border-t border-emerald/10 pt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald"><span>Discount</span><span>-{formatINR(discount)}</span></div>}
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? 'Processing…' : 'Pay with Paytm'}
          </button>
          <p className="text-center text-[11px] text-emerald-deep/50">Demo mode simulates payment when DEMO_PAYMENTS=true</p>
        </aside>
      </form>
    </div>
  );
}
