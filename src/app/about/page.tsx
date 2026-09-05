export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm uppercase tracking-wider text-gold">Our story</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Al Hasan Fabric</h1>
      <div className="prose prose-emerald mt-8 space-y-4 text-emerald-deep/80 leading-relaxed">
        <p>
          Al Hasan Fabric is a premium clothing and textile house celebrating Indian and Middle-Eastern craftsmanship.
          From Banarasi brocades to linen abayas, every piece is chosen for quality, comfort, and timeless elegance.
        </p>
        <p>
          We work with weavers and ateliers across India to bring you authentic silks, cottons, and embroidered fabrics —
          ready-to-wear and by the meter for your tailor.
        </p>
        <p>
          Whether you are preparing for a wedding, Eid, or everyday grace, we are here to help you find fabrics that feel like home.
        </p>
      </div>
    </div>
  );
}
