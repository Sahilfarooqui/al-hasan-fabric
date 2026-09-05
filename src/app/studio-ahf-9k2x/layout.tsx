import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { ADMIN_BASE } from '@/lib/admin-path';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-emerald/10 bg-emerald-deep text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href={ADMIN_BASE} className="font-display text-lg font-bold">
            Al Hasan <span className="text-gold">Studio</span>
          </Link>
          <Link href="/" className="text-xs text-cream/70 hover:text-gold">View store →</Link>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[200px_1fr]">
        <AdminNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
