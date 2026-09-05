import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { getPublishedProducts } from '@/lib/products';
import { Shield, Truck, Headphones, Sparkles, Star } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

export const dynamic = 'force-dynamic';

const COLLECTIONS = [
  { name: 'Sarees', href: '/shop?category=Sarees', seed: 'ahf-saree', desc: 'Silk & heritage weaves' },
  { name: 'Kurtas', href: '/shop?category=Kurtas', seed: 'ahf-kurta', desc: 'Everyday elegance' },
  { name: 'Bridal', href: '/shop?category=Bridal', seed: 'ahf-bridal', desc: 'Celebration packs' },
  { name: 'Sherwanis', href: '/shop?category=Sherwanis', seed: 'ahf-sherwani', desc: 'Regal occasion wear' },
];

const TESTIMONIALS = [
  { quote: 'The emerald silk saree was breathtaking — fabric quality exceeded expectations.', name: 'Ayesha K.', city: 'Lucknow' },
  { quote: 'WhatsApp styling help made picking the bridal pack stress-free. Highly recommend.', name: 'Fatima R.', city: 'Hyderabad' },
  { quote: 'Midnight sherwani fit was perfect. Fast shipping and beautiful packaging.', name: 'Imran S.', city: 'Delhi' },
];

export default async function HomePage() {
  const featured = await getPublishedProducts({ featured: true });
  const bestsellers = (await getPublishedProducts()).slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden bg-emerald-deep text-cream">
        <div className="absolute inset-0 opacity-35">
          <SafeImage
            src="https://picsum.photos/seed/ahf-hero-silk/1600/900"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 fabric-texture pointer-events-none opacity-40" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-emerald-light/30 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 md:py-36">
          <p className="animate-fade-up text-sm uppercase tracking-[0.3em] text-gold">Heritage Collection 2026</p>
          <h1 className="animate-fade-up max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl" style={{ animationDelay: '80ms' }}>
            Weave Your Story in <span className="text-gold">Emerald & Gold</span>
          </h1>
          <p className="animate-fade-up max-w-xl text-cream/80" style={{ animationDelay: '140ms' }}>
            Premium Indian & Middle-Eastern fabrics and attire — silk sarees, sherwanis, kurtas, and bridal packs crafted for celebration.
          </p>
          <div className="animate-fade-up flex flex-wrap gap-3" style={{ animationDelay: '200ms' }}>
            <Link href="/shop" className="btn-gold">Shop Collection</Link>
            <Link href="/about" className="btn-outline border-cream text-cream hover:bg-cream hover:text-emerald-deep">Our Story</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: 'Pan-India Shipping', desc: 'Fast dispatch across India' },
            { icon: Shield, title: 'Quality Assured', desc: 'Hand-checked fabrics' },
            { icon: Headphones, title: 'WhatsApp Support', desc: 'Personal styling help' },
            { icon: Sparkles, title: 'Heritage Craft', desc: 'Artisan weaves & zari' },
          ].map((b) => (
            <div key={b.title} className="card flex items-start gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
              <b.icon className="h-6 w-6 shrink-0 text-gold" />
              <div>
                <h3 className="font-semibold">{b.title}</h3>
                <p className="text-sm text-emerald-deep/60">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-gold">Explore</p>
            <h2 className="font-display text-3xl font-bold">Featured Collections</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-emerald hover:text-gold">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {COLLECTIONS.map((c) => (
            <Link key={c.name} href={c.href} className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
              <SafeImage
                src={`https://picsum.photos/seed/${c.seed}/600/750`}
                alt={c.name}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
                sizes="(max-width:768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 via-emerald-deep/20 to-transparent" />
              <div className="absolute bottom-0 p-4 text-cream">
                <h3 className="font-display text-xl font-bold">{c.name}</h3>
                <p className="text-xs text-cream/70">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-gold">Curated</p>
            <h2 className="font-display text-3xl font-bold">Staff Picks</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-cream-dark py-16">
        <div className="pointer-events-none absolute inset-0 fabric-texture opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-wider text-gold">Bestsellers</p>
            <h2 className="font-display text-3xl font-bold">Loved by Our Customers</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-wider text-gold">Testimonials</p>
          <h2 className="font-display text-3xl font-bold">Stories from the atelier</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="card p-6 transition hover:shadow-soft">
              <div className="mb-3 flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-emerald-deep/80">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-xs font-semibold text-emerald-deep">
                {t.name} · <span className="font-normal text-emerald-deep/50">{t.city}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 text-center sm:px-6">
        <div className="card relative overflow-hidden bg-emerald-deep px-6 py-14 text-cream">
          <div className="pointer-events-none absolute inset-0 fabric-texture opacity-20" />
          <h2 className="relative font-display text-3xl font-bold">Need help choosing fabric?</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-cream/75">
            Message us on WhatsApp for swatches, sizing, and bridal consultations.
          </p>
          <Link href="/contact" className="btn-gold relative mt-6">Get in Touch</Link>
        </div>
      </section>
    </div>
  );
}
