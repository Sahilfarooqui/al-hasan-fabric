export const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/alhasan_fabric/';

export function getInstagramUrl() {
  return process.env.NEXT_PUBLIC_INSTAGRAM_URL || DEFAULT_INSTAGRAM_URL;
}
