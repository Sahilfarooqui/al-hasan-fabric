import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatINR, parseJsonArray } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }> | { id: string };
  searchParams: Promise<{ paid?: string }> | { paid?: string };
}) {
  const { id } = await Promise.resolve(params);
  const sp = await Promise.resolve(searchParams);
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) notFound();
  const items = JSON.parse(order.items) as Array<{ name: string; quantity: number; price: number; size: string; color: string }>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <CheckCircle className="mx-auto h-16 w-16 text-emerald" />
      <h1 className="mt-4 font-display text-3xl font-bold">
        {sp.paid || order.status !== 'PENDING' ? 'Order confirmed!' : 'Order received'}
      </h1>
      <p className="mt-2 text-emerald-deep/70">Thank you, {order.customerName}. We&apos;ll update you on WhatsApp.</p>
      <div className="card mt-8 p-6 text-left">
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <div><span className="text-emerald-deep/50">Order #</span><br /><strong>{order.orderNumber}</strong></div>
          <div><span className="text-emerald-deep/50">Status</span><br /><strong>{order.status}</strong></div>
          <div><span className="text-emerald-deep/50">Total</span><br /><strong>{formatINR(order.total)}</strong></div>
        </div>
        <ul className="mt-6 space-y-2 border-t border-emerald/10 pt-4 text-sm">
          {items.map((i, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{i.name} ({i.size}/{i.color}) × {i.quantity}</span>
              <span>{formatINR(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`/track?order=${order.orderNumber}&phone=${encodeURIComponent(order.phone)}`} className="btn-outline">Track order</Link>
        <Link href="/shop" className="btn-primary">Continue shopping</Link>
      </div>
    </div>
  );
}
