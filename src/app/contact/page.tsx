'use client';

import { FormEvent, useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const text = `Hello Al Hasan Fabric!%0AName: ${fd.get('name')}%0APhone: ${fd.get('phone')}%0AMessage: ${fd.get('message')}`;
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Contact</h1>
      <p className="mt-2 text-emerald-deep/70">Reach us on WhatsApp for orders, fabric queries, and bridal consults.</p>
      <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6">
        <input name="name" required placeholder="Your name" className="input-field" />
        <input name="phone" required placeholder="Phone" className="input-field" />
        <textarea name="message" required rows={4} placeholder="How can we help?" className="input-field" />
        <button type="submit" className="btn-primary w-full">Open WhatsApp</button>
        {sent && <p className="text-sm text-emerald">WhatsApp opened — send the prefilled message to reach us.</p>}
      </form>
    </div>
  );
}
