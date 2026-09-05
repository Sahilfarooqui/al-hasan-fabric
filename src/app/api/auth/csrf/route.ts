import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { ensureCsrfToken } from '@/lib/csrf';

export async function GET() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const csrfToken = await ensureCsrfToken();
  return NextResponse.json({ csrfToken });
}
