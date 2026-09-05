import { NextRequest, NextResponse } from 'next/server';

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://picsum.photos https://fastly.picsum.photos https://res.cloudinary.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://api.cloudinary.com https://securegw.paytm.in https://securegw-stage.paytm.in",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://securegw.paytm.in https://securegw-stage.paytm.in",
  "object-src 'none'",
].join('; ');

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Old admin paths must 404 — never reveal the new path
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: securityHeaders(),
    });
  }

  const res = NextResponse.next();
  applySecurityHeaders(res);
  return res;
}

function securityHeaders(): HeadersInit {
  return {
    'Content-Security-Policy': CSP,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'X-DNS-Prefetch-Control': 'on',
  };
}

function applySecurityHeaders(res: NextResponse) {
  const h = securityHeaders();
  Object.entries(h).forEach(([k, v]) => res.headers.set(k, v));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads/).*)'],
};
