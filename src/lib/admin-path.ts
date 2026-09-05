/** Obscure admin base path — do not expose on the public storefront. */
export const ADMIN_BASE = '/studio-ahf-9k2x';

export function adminUrl(path = ''): string {
  if (!path || path === '/') return ADMIN_BASE;
  return `${ADMIN_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export function isAdminPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === ADMIN_BASE || pathname.startsWith(`${ADMIN_BASE}/`);
}
