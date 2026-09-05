import { randomBytes } from 'crypto';
import { getAdminSession } from './auth';

export function generateCsrfToken(): string {
  return randomBytes(24).toString('hex');
}

export async function ensureCsrfToken(): Promise<string> {
  const session = await getAdminSession();
  if (!session.csrfToken) {
    session.csrfToken = generateCsrfToken();
    await session.save();
  }
  return session.csrfToken;
}

export async function requireCsrf(req: Request): Promise<boolean> {
  const session = await getAdminSession();
  if (!session.isLoggedIn || !session.csrfToken) return false;
  const header = req.headers.get('x-csrf-token') || '';
  return header.length > 0 && header === session.csrfToken;
}
