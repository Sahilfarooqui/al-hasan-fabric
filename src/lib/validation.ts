import { z } from 'zod';

const imageEntry = z
  .string()
  .min(1)
  .refine(
    (v) =>
      v.startsWith('data:image/') ||
      v.startsWith('https://') ||
      v.startsWith('http://') ||
      v.startsWith('/'),
    { message: 'Invalid image URL or data URL' }
  );

export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(220).optional(),
  description: z.string().trim().max(5000).default(''),
  price: z.coerce.number().positive().max(10_000_000),
  compareAtPrice: z.union([z.coerce.number().positive().max(10_000_000), z.null()]).optional().nullable(),
  images: z.array(imageEntry).max(8).default([]),
  category: z.string().trim().min(1).max(80).default('General'),
  fabricType: z.string().trim().min(1).max(80).default('Mixed'),
  sizes: z.array(z.string().trim().min(1).max(40)).max(30).default([]),
  colors: z.array(z.string().trim().min(1).max(40)).max(30).default([]),
  stock: z.coerce.number().int().min(0).max(1_000_000).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const couponInputSchema = z.object({
  code: z.string().trim().min(2).max(40),
  type: z.enum(['PERCENT', 'FIXED']),
  value: z.coerce.number().positive().max(1_000_000),
  minOrder: z.union([z.coerce.number().min(0), z.null()]).optional().nullable(),
  maxUses: z.union([z.coerce.number().int().positive(), z.null()]).optional().nullable(),
  active: z.boolean().default(true),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .transform((s) => s.replace(/\s/g, ''))
    .refine((s) => /^[0-9+\-]{10,15}$/.test(s), 'Invalid phone'),
  email: z.union([z.string().email().max(160), z.literal(''), z.undefined()]).optional(),
  whatsappConsent: z.boolean().optional().default(false),
  address: z.string().trim().min(5).max(400),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^[0-9]{6}$/, 'PIN must be 6 digits'),
  couponCode: z.string().trim().max(40).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        name: z.string().min(1).max(200),
        price: z.number().positive(),
        quantity: z.number().int().positive().max(100),
        size: z.string().max(40).optional().default(''),
        color: z.string().max(40).optional().default(''),
        image: z.string().max(2_000_000).optional().default(''),
      })
    )
    .min(1)
    .max(50),
});

export const loginSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(1).max(200),
  csrfToken: z.string().min(8).max(200).optional(),
});

export const uploadSchema = z.object({
  images: z
    .array(
      z.object({
        dataUrl: z
          .string()
          .min(20)
          .max(1_200_000)
          .refine((s) => s.startsWith('data:image/'), 'Must be image data URL'),
        name: z.string().max(120).optional(),
      })
    )
    .min(1)
    .max(8),
});
