'use client';

import { MessageCircle } from 'lucide-react';

const DEFAULT_WA = '918527267278';

export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WA;
  const href = `https://wa.me/${number}?text=${encodeURIComponent('Hello Al Hasan Fabric! I have a question about your products.')}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
