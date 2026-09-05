'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_BASE } from '@/lib/admin-path';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(fd.get('email') || '').trim(), password: String(fd.get('password') || '') }),
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Invalid email or password');
      setLoading(false);
      return;
    }
    router.push(ADMIN_BASE);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="text-center font-display text-3xl font-bold">Studio Login</h1>
      <p className="mt-2 text-center text-xs text-emerald-deep/50">Authorized access only</p>
      <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-xs font-semibold">Email</label>
          <input name="email" type="email" required autoComplete="username" className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Password</label>
          <input name="password" type="password" required autoComplete="current-password" className="input-field" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
