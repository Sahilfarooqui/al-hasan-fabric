import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export interface AdminSession {
  isLoggedIn: boolean;
  email?: string;
  csrfToken?: string;
}

const sessionPassword =
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32
    ? process.env.SESSION_SECRET
    : 'complex_password_at_least_32_characters_long';

export const sessionOptions: SessionOptions = {
  password: sessionPassword,
  cookieName: 'ahf_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

/** Hash of ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH). Computed once per process. */
let envPasswordHash: string | null = null;

function getAdminPasswordHash(): string {
  if (process.env.ADMIN_PASSWORD_HASH) {
    return process.env.ADMIN_PASSWORD_HASH;
  }
  if (!envPasswordHash) {
    const plain = process.env.ADMIN_PASSWORD || 'Admin@123';
    envPasswordHash = bcrypt.hashSync(plain, 12);
  }
  return envPasswordHash;
}

export async function getAdminSession() {
  return getIronSession<AdminSession>(cookies(), sessionOptions);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@alhasanfabric.com';
  if (email !== adminEmail) {
    // Dummy compare to reduce timing leaks
    await bcrypt.compare(password, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oQ8qKzqKzqKu');
    return false;
  }
  return bcrypt.compare(password, getAdminPasswordHash());
}

export async function getSessionFromRequest(req: NextRequest) {
  const res = NextResponse.next();
  return getIronSession<AdminSession>(req, res, sessionOptions);
}
