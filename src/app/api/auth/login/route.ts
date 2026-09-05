import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { AdminSession, sessionOptions, verifyAdminCredentials } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const session = await getIronSession<AdminSession>(cookies(), sessionOptions);
  session.isLoggedIn = true;
  session.email = email;
  await session.save();
  return NextResponse.json({ ok: true });
}
