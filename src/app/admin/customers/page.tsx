'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  whatsappConsent: boolean;
  createdAt: string;
};

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch('/api/admin/customers').then(async (r) => {
      if (r.status === 401) { router.push('/admin/login'); return; }
      const d = await r.json();
      setCustomers(d.customers || []);
    });
  }, [router]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Customers / Leads</h1>
        <a href="/api/admin/customers?format=csv" className="btn-outline py-2 text-xs">Export CSV</a>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-emerald/10 text-xs uppercase text-gold">
              <th className="py-2">Name</th><th>Phone</th><th>Email</th><th>WhatsApp</th><th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-emerald/5">
                <td className="py-3">{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email || '—'}</td>
                <td>{c.whatsappConsent ? 'Yes' : 'No'}</td>
                <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="mt-4 text-emerald-deep/50">No customers yet.</p>}
      </div>
    </div>
  );
}
