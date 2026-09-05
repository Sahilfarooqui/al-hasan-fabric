'use client';

import { FormEvent, useState } from 'react';

const DEFAULT_WA = '918527267278';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WA;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = encodeURIComponent(String(fd.get('name') || ''));
    const phone = encodeURIComponent(String(fd.get('phone') || ''));
    const message = encodeURIComponent(String(fd.get('message') || ''));
    const text = `Hello Al Hasan Fabric!%0AName: ${name}%0APhone: ${phone}%0AMessage: ${message}`;
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Contact</h1>
      <p className="mt-2 text-emerald-deep/70">
        Reach us on WhatsApp (+91 85272 67278) for orders, fabric queries, and bridal consults.
      </p>
      <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6">
        <input name="name" required placeholder="Your name" className="input-field" maxLength={120} />
        <input name="phone" required placeholder="Phone" className="input-field" maxLength={15} />
        <textarea name="message" required rows={4} placeholder="How can we help?" className="input-field" maxLength={1000} />
        <button type="submit" className="btn-primary w-full">Open WhatsApp</button>
        {sent && <p className="text-sm text-emerald">WhatsApp opened — send the prefilled message to reach us.</p>}
      </form>
    </div>
  );
}
