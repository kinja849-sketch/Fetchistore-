"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag, PackageCheck, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: Store },
    { name: "Cart", href: "/cart", icon: ShoppingBag, badge: totalItems },
    { name: "Orders", href: "/orders", icon: PackageCheck },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg bg-white/95 backdrop-blur-md border border-gray-100/80 rounded-full shadow-2xl p-1.5 transition-all">
      <nav className="flex items-center justify-between px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center space-x-1.5 px-3.5 py-2.5 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-brand text-white font-semibold shadow-md shadow-brand/25 scale-105"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/80"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-gray-500"} />
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`absolute -top-1 -right-1 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border ${
                    isActive
                      ? "bg-white text-brand border-brand"
                      : "bg-brand text-white border-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="text-xs font-bold tracking-tight">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
