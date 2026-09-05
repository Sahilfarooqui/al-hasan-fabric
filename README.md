# Al Hasan Fabric

Premium Indian & Middle-Eastern fabric storefront (Next.js 14 + Prisma + PostgreSQL).

## Local run

Requires Node.js 20+.

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

Open http://localhost:3000

## Admin (private)

Admin UI is **not** at `/admin` (returns 404).

Secret path (README only, not on public site):

- `/studio-ahf-9k2x`
- Login: `/studio-ahf-9k2x/login`

Use env credentials. Rate-limited login, httpOnly cookies, CSRF on mutations.

## Product photo uploads

- Gallery multi-select + optional camera in Studio Products
- Client compress to WebP/JPEG (~800KB, max 8 images)
- Cloudinary when CLOUDINARY_* set; else data URLs in Product.images (Render free)
- Local/dev may write public/uploads/products/; prefer JPEG/PNG/WebP

## WhatsApp

Default: 918527267278 (+91 85272 67278) via NEXT_PUBLIC_WHATSAPP_NUMBER.

## Notes

- DEMO_PAYMENTS=true simulates checkout
- Coupons: WELCOME10 GOLD500 EID15
- Deploy: render.yaml + PostgreSQL
- Seed upserts products (refreshes image URLs)
