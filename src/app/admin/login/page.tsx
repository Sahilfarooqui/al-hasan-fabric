'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

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
      body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }),
    });
    if (!res.ok) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="text-center font-display text-3xl font-bold">Admin Login</h1>
      <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-xs font-semibold">Email</label>
          <input name="email" type="email" required className="input-field" defaultValue="admin@alhasanfabric.com" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Password</label>
          <input name="password" type="password" required className="input-field" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
