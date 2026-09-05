'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, Menu, ShoppingBag, X, Search, Instagram } from 'lucide-react';
import { getInstagramUrl } from '@/lib/site';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/hooks/useWishlist';

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/track', label: 'Track Order' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { count: wishCount } = useWishlist();

  return (
    <header className="sticky top-0 z-50 border-b border-emerald/10 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-emerald-deep sm:text-2xl">
          Al Hasan <span className="text-gold">Fabric</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-emerald-deep/80 transition hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={getInstagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-emerald-deep hover:bg-emerald-muted"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <Link href="/shop" className="rounded-full p-2 text-emerald-deep hover:bg-emerald-muted" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/wishlist" className="relative rounded-full p-2 text-emerald-deep hover:bg-emerald-muted" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-emerald-deep">
                {wishCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative rounded-full p-2 text-emerald-deep hover:bg-emerald-muted" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-deep text-[10px] font-bold text-cream">
                {count}
              </span>
            )}
          </Link>
          <button
            className="rounded-full p-2 text-emerald-deep hover:bg-emerald-muted md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-emerald/10 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-emerald-muted"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
