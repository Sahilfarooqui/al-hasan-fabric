"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import { isAdminPath } from "@/lib/admin-path";

export default function StoreChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (isAdminPath(path)) return <>{children}</>;
  return (
    <>
      <Header />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
