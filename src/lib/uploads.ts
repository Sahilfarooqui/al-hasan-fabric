import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

const MAX_DATA_URL_CHARS = 1_100_000; // ~800KB binary after base64
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export function parseDataUrl(dataUrl: string): { mime: string; buffer: Buffer } | null {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  const mime = m[1].toLowerCase();
  if (!ALLOWED_MIME.has(mime) && mime !== 'image/heic' && mime !== 'image/heif') return null;
  if (dataUrl.length > MAX_DATA_URL_CHARS) return null;
  try {
    return { mime, buffer: Buffer.from(m[2], 'base64') };
  } catch {
    return null;
  }
}

function extForMime(mime: string): string {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  return 'jpg';
}

/** Upload to Cloudinary when CLOUDINARY_* env vars are set. */
export async function uploadToCloudinary(dataUrl: string): Promise<string | null> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return null;

  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'al-hasan-fabric/products';
  const crypto = await import('crypto');
  const toSign = `folder=${folder}&timestamp=${timestamp}${secret}`;
  const signature = crypto.createHash('sha1').update(toSign).digest('hex');

  const form = new FormData();
  form.append('file', dataUrl);
  form.append('api_key', key);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    console.error('Cloudinary upload failed', await res.text());
    return null;
  }
  const json = (await res.json()) as { secure_url?: string };
  return json.secure_url || null;
}

/** Save under public/uploads/products (local/dev). Returns public path. */
export async function saveLocalUpload(dataUrl: string): Promise<string | null> {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  // HEIC not converted — reject for local save unless jpeg/png/webp/gif
  if (!ALLOWED_MIME.has(parsed.mime)) return null;

  const dir = path.join(process.cwd(), 'public', 'uploads', 'products');
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${randomBytes(6).toString('hex')}.${extForMime(parsed.mime)}`;
  await writeFile(path.join(dir, name), parsed.buffer);
  return `/uploads/products/${name}`;
}

/**
 * Prefer Cloudinary when configured; else try local public/uploads;
 * else persist the (already client-compressed) data URL for Postgres/Render free.
 */
export async function persistProductImage(dataUrl: string): Promise<string> {
  if (dataUrl.length > MAX_DATA_URL_CHARS) {
    throw new Error('Image too large (max ~800KB compressed)');
  }
  const cloud = await uploadToCloudinary(dataUrl);
  if (cloud) return cloud;

  if (process.env.NODE_ENV !== 'production' || process.env.FORCE_LOCAL_UPLOADS === 'true') {
    const local = await saveLocalUpload(dataUrl);
    if (local) return local;
  } else {
    // Try local anyway (works with persistent disk); fall through to data URL
    try {
      const local = await saveLocalUpload(dataUrl);
      if (local && process.env.USE_LOCAL_UPLOADS === 'true') return local;
    } catch {
      /* ephemeral FS on Render — ignore */
    }
  }

  // Persist compressed data URL in DB (works on Render free without extra services)
  return dataUrl;
}
