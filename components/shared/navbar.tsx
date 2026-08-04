"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isSubPage =
    pathname.startsWith("/product/") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.includes("/chat") ||
    pathname.startsWith("/seller/listings") ||
    pathname.startsWith("/seller/sold") ||
    pathname.startsWith("/seller/orders") ||
    pathname.startsWith("/profile/payments") ||
    pathname.startsWith("/profile/settings") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/shop/category");

  const getSubPageTitle = () => {
    if (pathname.startsWith("/product/")) return "Product Details";
    if (pathname.startsWith("/cart")) return "Shopping Cart";
    if (pathname.startsWith("/checkout")) return "Checkout";
    if (pathname.includes("/chat")) return "Delivery Chat";
    if (pathname.startsWith("/seller/listings/create")) return "Create Listing";
    if (pathname.startsWith("/seller/listings")) return "Active Listings";
    if (pathname.startsWith("/seller/sold")) return "Sold History";
    if (pathname.startsWith("/seller/orders")) return "Seller Orders";
    if (pathname.startsWith("/profile/payments")) return "Payments & Balance";
    if (pathname.startsWith("/profile/settings")) return "Settings & Privacy";
    if (pathname.startsWith("/categories")) return "All Categories";
    if (pathname.startsWith("/shop/category")) return "Category Discovery";
    return "Fetchistore";
  };

  if (pathname.includes("/chat")) {
    return null;
  }

  if (isSubPage) {
    return (
      <header className="sticky top-0 z-50 bg-[#FBF9F8]/95 backdrop-blur-md border-b border-[#E4E2E1] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <h1 className="text-base font-bold text-[#1B1C1C] tracking-tight truncate max-w-[200px] text-center">
          {getSubPageTitle()}
        </h1>

        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors"
          aria-label="Home"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
        </Link>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[#FBF9F8]/95 backdrop-blur-md border-b border-[#E4E2E1]/60 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center gap-1.5 text-[#56642B] group">
          <span className="material-symbols-outlined text-[26px]">storefront</span>
          <span className="text-lg font-black tracking-wider text-[#56642B]">
            FETCHISTORE
          </span>
        </Link>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-extrabold uppercase tracking-wider">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === "/" ? "text-[#56642B]" : "text-[#76786B] hover:text-[#1B1C1C]"
            }`}
          >
            Discover
          </Link>
          <Link
            href="/shop"
            className={`transition-colors ${
              pathname === "/shop" ? "text-[#56642B]" : "text-[#76786B] hover:text-[#1B1C1C]"
            }`}
          >
            Shop
          </Link>
          <Link
            href="/wishlist"
            className={`transition-colors ${
              pathname === "/wishlist" ? "text-[#56642B]" : "text-[#76786B] hover:text-[#1B1C1C]"
            }`}
          >
            Wishlist
          </Link>
          <Link
            href="/orders"
            className={`transition-colors ${
              pathname.startsWith("/orders") ? "text-[#56642B]" : "text-[#76786B] hover:text-[#1B1C1C]"
            }`}
          >
            Orders
          </Link>
          <Link
            href="/profile"
            className={`transition-colors ${
              pathname.startsWith("/profile") ? "text-[#56642B]" : "text-[#76786B] hover:text-[#1B1C1C]"
            }`}
          >
            Profile
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center gap-1 px-3 py-1 bg-[#F0EDED] rounded-full text-xs font-semibold text-[#46483C]">
          <span className="material-symbols-outlined text-[14px] text-[#56642B]">
            location_on
          </span>
          <span>Near You</span>
        </div>

        <Link
          href="/cart"
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors relative"
          aria-label="Cart"
        >
          <span className="material-symbols-outlined text-[18px]">local_mall</span>
        </Link>

        <Link
          href="/notifications"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors relative"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </Link>
      </div>
    </header>
  );
}
