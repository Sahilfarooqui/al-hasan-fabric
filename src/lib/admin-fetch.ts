'use client';

import { ADMIN_BASE } from './admin-path';

let cachedCsrf: string | null = null;

export async function getCsrfToken(force = false): Promise<string> {
  if (cachedCsrf && !force) return cachedCsrf;
  const res = await fetch('/api/auth/csrf', { credentials: 'include' });
  if (!res.ok) throw new Error('Unauthorized');
  const data = await res.json();
  cachedCsrf = data.csrfToken as string;
  return cachedCsrf;
}

export function clearCsrfCache() {
  cachedCsrf = null;
}

export async function adminFetch(input: string, init: RequestInit = {}) {
  const method = (init.method || 'GET').toUpperCase();
  const headers = new Headers(init.headers || {});
  if (method !== 'GET' && method !== 'HEAD') {
    const token = await getCsrfToken();
    headers.set('x-csrf-token', token);
    if (!headers.has('Content-Type') && init.body && typeof init.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }
  }
  const res = await fetch(input, { ...init, headers, credentials: 'include' });
  if (res.status === 401) {
    clearCsrfCache();
    if (typeof window !== 'undefined') {
      window.location.href = `${ADMIN_BASE}/login`;
    }
  }
  return res;
}

export { ADMIN_BASE };
