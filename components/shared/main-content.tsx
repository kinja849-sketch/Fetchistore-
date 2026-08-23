"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isMainTabScreen =
    pathname === "/" ||
    pathname === "/shop" ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/shop/category") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/profile");

  const isAuthOrOnboarding =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/sso-callback") ||
    pathname.startsWith("/onboarding");

  const bottomPaddingClass = isAuthOrOnboarding
    ? "pb-0 md:pb-0 h-screen max-h-screen overflow-hidden"
    : isMainTabScreen
    ? "pb-24 md:pb-8"
    : "pb-6 md:pb-6";

  return (
    <main className={`flex-1 w-full flex flex-col min-w-0 overflow-x-hidden ${bottomPaddingClass}`}>
      {children}
    </main>
  );
}
