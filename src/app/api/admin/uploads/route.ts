import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { requireCsrf } from '@/lib/csrf';
import { persistProductImage } from '@/lib/uploads';
import { uploadSchema } from '@/lib/validation';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await requireCsrf(req))) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  const limited = rateLimit(`upload:${clientIp(req)}`, 30, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: 'Upload rate limit exceeded' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid upload payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const urls: string[] = [];
  for (const img of parsed.data.images) {
    try {
      urls.push(await persistProductImage(img.dataUrl));
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Upload failed' },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ urls });
}
