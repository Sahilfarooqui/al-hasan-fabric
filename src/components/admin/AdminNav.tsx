'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ADMIN_BASE, clearCsrfCache } from '@/lib/admin-fetch';

const links = [
  { href: ADMIN_BASE, label: 'Dashboard' },
  { href: `${ADMIN_BASE}/products`, label: 'Products' },
  { href: `${ADMIN_BASE}/orders`, label: 'Orders' },
  { href: `${ADMIN_BASE}/customers`, label: 'Customers' },
  { href: `${ADMIN_BASE}/coupons`, label: 'Coupons' },
];

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();

  if (path === `${ADMIN_BASE}/login`) return null;

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearCsrfCache();
    router.push(`${ADMIN_BASE}/login`);
  };

  return (
    <nav className="card h-fit space-y-1 p-3">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`block rounded-lg px-3 py-2 text-sm font-medium ${path === l.href ? 'bg-emerald-deep text-cream' : 'hover:bg-emerald-muted'}`}
        >
          {l.label}
        </Link>
      ))}
      <button onClick={logout} className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">
        Logout
      </button>
    </nav>
  );
}
