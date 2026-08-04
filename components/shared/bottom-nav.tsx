"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/lib/cart-context";

export function BottomNav() {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const { totalItems } = useCart();

  const isMainScreen =
    pathname === "/" ||
    pathname === "/shop" ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/profile");

  if (!isLoaded || !isSignedIn || !isMainScreen) {
    return null;
  }

  type NavItem = {
    name: string;
    href: string;
    iconSymbol: string;
    badge?: number;
  };

  const navItems: NavItem[] = [
    { name: "Discover", href: "/", iconSymbol: "explore" },
    { name: "Wishlist", href: "/wishlist", iconSymbol: "favorite" },
    { name: "Cart", href: "/cart", iconSymbol: "local_mall", badge: totalItems },
    { name: "Orders", href: "/orders", iconSymbol: "local_shipping" },
    { name: "Profile", href: "/profile", iconSymbol: "person" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-[#FBF9F8]/95 backdrop-blur-xl border-t border-[#E4E2E1] grid grid-cols-5 items-center h-16 pb-safe px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden pointer-events-auto">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 w-full h-full text-center ${
              isActive
                ? "text-[#56642B] font-bold"
                : "text-[#76786B] hover:text-[#1B1C1C]"
            }`}
          >
            <div
              className={`relative flex items-center justify-center px-3 py-1 rounded-full transition-colors ${
                isActive ? "bg-[#8A9A5B]/20 text-[#56642B]" : ""
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                }}
              >
                {item.iconSymbol}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold w-4 h-4 bg-[#ba1a1a] text-white rounded-full flex items-center justify-center border border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] tracking-tight mt-0.5 whitespace-nowrap truncate max-w-full ${
                isActive ? "font-bold text-[#56642B]" : "font-medium text-[#76786B]"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
