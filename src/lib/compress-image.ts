'use client';

const MAX_DIM = 1600;
const MAX_BYTES = 800_000;
const QUALITY_STEPS = [0.82, 0.72, 0.62, 0.5];

export async function compressImageFile(file: File): Promise<{ dataUrl: string; name: string }> {
  if (!file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(file.name)) {
    throw new Error('Only images are allowed');
  }

  // HEIC: browsers often can't decode — ask for JPEG if createImageBitmap fails
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) {
    throw new Error('Could not read image. Prefer JPEG/PNG/WebP (HEIC may need conversion on device).');
  }

  let { width, height } = bitmap;
  const scale = Math.min(1, MAX_DIM / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const preferWebp = canvas.toDataURL('image/webp', 0.8).startsWith('data:image/webp');
  const mime = preferWebp ? 'image/webp' : 'image/jpeg';

  for (const q of QUALITY_STEPS) {
    const dataUrl = canvas.toDataURL(mime, q);
    // rough byte estimate from base64 length
    const bytes = Math.ceil((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);
    if (bytes <= MAX_BYTES) {
      return { dataUrl, name: file.name };
    }
  }

  const dataUrl = canvas.toDataURL('image/jpeg', 0.45);
  return { dataUrl, name: file.name };
}
