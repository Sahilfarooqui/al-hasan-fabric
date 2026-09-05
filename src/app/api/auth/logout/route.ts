import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { AdminSession, sessionOptions } from '@/lib/auth';

export async function POST() {
  const session = await getIronSession<AdminSession>(cookies(), sessionOptions);
  session.destroy();
  return NextResponse.json({ ok: true });
}
