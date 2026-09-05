import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/shop/ProductCard';
import { getPublishedProducts } from '@/lib/products';
import { Shield, Truck, Headphones, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featured = await getPublishedProducts({ featured: true });
  const bestsellers = (await getPublishedProducts()).slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden bg-emerald-deep text-cream">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&q=80"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 md:py-32">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Heritage Collection 2026</p>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Weave Your Story in <span className="text-gold">Emerald & Gold</span>
          </h1>
          <p className="max-w-xl text-cream/80">
            Premium Indian & Middle-Eastern fabrics and attire — silk sarees, sherwanis, kurtas, and bridal packs crafted for celebration.
          </p>
          <div className="flex flex-wrap gap-3">
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
            <div key={b.title} className="card flex items-start gap-3 p-5">
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
            <p className="text-sm uppercase tracking-wider text-gold">Curated</p>
            <h2 className="font-display text-3xl font-bold">Featured Collections</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-emerald hover:text-gold">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-cream-dark py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
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

      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold">Need help choosing fabric?</h2>
        <p className="mx-auto mt-3 max-w-lg text-emerald-deep/70">Message us on WhatsApp for swatches, sizing, and bridal consultations.</p>
        <Link href="/contact" className="btn-primary mt-6">Get in Touch</Link>
      </section>
    </div>
  );
}
