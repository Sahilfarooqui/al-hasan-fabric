import { Suspense } from "react";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-emerald-deep/60">Loading shop…</div>}>
      {children}
    </Suspense>
  );
}
