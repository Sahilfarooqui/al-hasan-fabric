export const metadata = { title: 'Shipping & Returns' };

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Shipping & Returns</h1>
      <div className="mt-8 space-y-6 text-emerald-deep/80 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-semibold text-emerald-deep">Shipping</h2>
          <p className="mt-2">Orders typically dispatch within 2–4 business days. Delivery across India in 4–8 days depending on location. You will receive tracking details via SMS/WhatsApp.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-emerald-deep">Returns</h2>
          <p className="mt-2">Unworn, unwashed items with tags intact may be returned within 7 days of delivery. Custom-cut fabrics and bridal packs are final sale unless defective.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-emerald-deep">Exchanges</h2>
          <p className="mt-2">Size exchanges are subject to stock. Contact us on WhatsApp with your order ID to arrange a swap.</p>
        </section>
      </div>
    </div>
  );
}
