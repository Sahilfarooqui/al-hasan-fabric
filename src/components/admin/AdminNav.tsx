'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/coupons', label: 'Coupons' },
];

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();

  if (path === '/admin/login') return null;

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
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
