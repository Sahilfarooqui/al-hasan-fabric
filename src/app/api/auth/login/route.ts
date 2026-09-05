import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { AdminSession, sessionOptions, verifyAdminCredentials } from '@/lib/auth';
import { generateCsrfToken } from '@/lib/csrf';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limited = rateLimit(`login:${ip}`, 20, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const { email, password } = parsed.data;
  const ok = await verifyAdminCredentials(email, password);
  if (!ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const session = await getIronSession<AdminSession>(cookies(), sessionOptions);
  session.isLoggedIn = true;
  session.email = email;
  session.csrfToken = generateCsrfToken();
  await session.save();

  return NextResponse.json({ ok: true, csrfToken: session.csrfToken });
}
