import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { getInstagramUrl } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-emerald/10 bg-emerald-deep text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <h3 className="font-display text-2xl font-bold">
            Al Hasan <span className="text-gold">Fabric</span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Premium Indian &amp; Middle-Eastern fabrics and attire. Crafted with heritage, worn with pride.
          </p>
          <a
            href={getInstagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-cream/80 transition hover:text-gold"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="h-5 w-5" /> @alhasan_fabric
          </a>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/shop" className="hover:text-gold">All Products</Link></li>
            <li><Link href="/shop?category=Sarees" className="hover:text-gold">Sarees</Link></li>
            <li><Link href="/shop?category=Kurtas" className="hover:text-gold">Kurtas</Link></li>
            <li><Link href="/shop?category=Bridal" className="hover:text-gold">Bridal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Help</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/shipping" className="hover:text-gold">Shipping &amp; Returns</Link></li>
            <li><Link href="/track" className="hover:text-gold">Track Order</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Contact</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>WhatsApp: +91 85272 67278</li>
            <li>Pan-India shipping</li>
            <li>COD available on request</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Al Hasan Fabric. All rights reserved.
      </div>
    </footer>
  );
}
