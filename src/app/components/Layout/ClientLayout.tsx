"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/app/components/Layout/NavBar";
import Footer from "@/app/components/Layout/Footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      <div className="scanline"></div>
      {!isAdminRoute && <NavBar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
} 