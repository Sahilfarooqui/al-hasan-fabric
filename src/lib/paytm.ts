import crypto from 'crypto';

export type PaytmParams = Record<string, string | number | undefined>;

function isDemoMode(): boolean {
  if (process.env.DEMO_PAYMENTS === 'true') return true;
  if (!process.env.PAYTM_MID || !process.env.PAYTM_MERCHANT_KEY) return true;
  return false;
}

export function getPaytmConfig() {
  const demo = isDemoMode();
  return {
    demo,
    mid: process.env.PAYTM_MID || 'DEMO_MID',
    merchantKey: process.env.PAYTM_MERCHANT_KEY || 'DEMO_KEY',
    website: process.env.PAYTM_WEBSITE || 'WEBSTAGING',
    industryType: process.env.PAYTM_INDUSTRY_TYPE || 'Retail',
    channelId: process.env.PAYTM_CHANNEL_ID || 'WEB',
    callbackUrl:
      process.env.PAYTM_CALLBACK_URL ||
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/paytm/callback`,
    env: process.env.PAYTM_ENV || 'staging',
    host:
      process.env.PAYTM_ENV === 'production'
        ? 'https://securegw.paytm.in'
        : 'https://securegw-stage.paytm.in',
  };
}

/** Paytm checksum using HMAC-SHA256 (compatible with Paytm Checksum algorithm) */
export function generateChecksum(params: PaytmParams, merchantKey: string): string {
  const filtered: Record<string, string> = {};
  Object.keys(params)
    .sort()
    .forEach((key) => {
      const val = params[key];
      if (val !== undefined && val !== null && key !== 'CHECKSUMHASH') {
        filtered[key] = String(val);
      }
    });

  const payload = Object.keys(filtered)
    .sort()
    .map((k) => filtered[k])
    .join('|');

  const salt = crypto.randomBytes(4).toString('hex');
  const hash = crypto.createHmac('sha256', merchantKey).update(payload + '|' + salt).digest('hex');
  const checksum = Buffer.from(hash + salt).toString('base64');
  return checksum;
}

export function verifyChecksum(
  params: PaytmParams,
  merchantKey: string,
  checksumHash: string
): boolean {
  try {
    const decoded = Buffer.from(checksumHash, 'base64').toString('utf8');
    if (decoded.length < 8) return false;
    const salt = decoded.slice(-8);
    const expectedHash = decoded.slice(0, -8);

    const filtered: Record<string, string> = {};
    Object.keys(params)
      .sort()
      .forEach((key) => {
        const val = params[key];
        if (val !== undefined && val !== null && key !== 'CHECKSUMHASH') {
          filtered[key] = String(val);
        }
      });

    const payload = Object.keys(filtered)
      .sort()
      .map((k) => filtered[k])
      .join('|');

    const hash = crypto.createHmac('sha256', merchantKey).update(payload + '|' + salt).digest('hex');
    return hash === expectedHash;
  } catch {
    return false;
  }
}

/** Use official paytmchecksum if available at runtime */
export async function generatePaytmChecksum(
  body: Record<string, unknown>,
  merchantKey: string
): Promise<string> {
  try {
    const PaytmChecksum = require('paytmchecksum');
    return await PaytmChecksum.generateSignature(JSON.stringify(body), merchantKey);
  } catch {
    return generateChecksum(
      Object.fromEntries(Object.entries(body).map(([k, v]) => [k, String(v)])),
      merchantKey
    );
  }
}

export async function verifyPaytmChecksum(
  body: Record<string, unknown>,
  merchantKey: string,
  checksumHash: string
): Promise<boolean> {
  try {
    const PaytmChecksum = require('paytmchecksum');
    return await PaytmChecksum.verifySignature(JSON.stringify(body), merchantKey, checksumHash);
  } catch {
    return verifyChecksum(
      Object.fromEntries(Object.entries(body).map(([k, v]) => [k, String(v)])),
      merchantKey,
      checksumHash
    );
  }
}

export { isDemoMode };
