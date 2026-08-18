"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useCart } from "@/lib/cart-context";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();

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
    if (pathname.startsWith("/shop/category/")) {
      const slug = pathname.replace("/shop/category/", "");
      return slug ? `${slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Collection` : "Category Discovery";
    }
    return "Fetchistore";
  };

  if (pathname.includes("/chat")) {
    return null;
  }

  if (isSubPage) {
    return (
      <header className="sticky top-0 z-50 bg-[#FBF9F8]/95 backdrop-blur-md border-b border-[#E4E2E1] px-3.5 sm:px-6 py-3 flex items-center justify-between w-full max-w-full overflow-hidden min-w-0">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors shrink-0"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <h1 className="text-sm sm:text-base font-extrabold text-[#1B1C1C] tracking-tight truncate max-w-[180px] sm:max-w-[280px] text-center px-2">
          {getSubPageTitle()}
        </h1>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            href="/cart"
            id="cart-fly-target-header"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors relative"
            aria-label="Shopping Cart"
          >
            <span className="material-symbols-outlined text-[19px]">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 bg-[#ba1a1a] text-white rounded-full flex items-center justify-center border border-white">
                {totalItems}
              </span>
            )}
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors shrink-0"
            aria-label="Home"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[#FBF9F8]/95 backdrop-blur-md border-b border-[#E4E2E1]/60 px-3.5 sm:px-6 lg:px-8 py-3 flex items-center justify-between w-full max-w-full overflow-hidden">
      <div className="flex items-center space-x-3 md:space-x-8 shrink-0 min-w-0">
        <Link href="/" className="flex items-center gap-1.5 text-[#56642B] group shrink-0">
          <span className="material-symbols-outlined text-[24px] sm:text-[26px]">storefront</span>
          <span className="text-base sm:text-lg font-black tracking-wider text-[#56642B] whitespace-nowrap">
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

      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-[#F0EDED] rounded-full text-xs font-semibold text-[#46483C]">
          <span className="material-symbols-outlined text-[14px] text-[#56642B]">
            location_on
          </span>
          <span>Near You</span>
        </div>

        {/* Notifications Bell */}
        <Link
          href="/notifications"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors relative"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </Link>

        {/* Shopping Cart Icon (Header Cart Target) */}
        <Link
          href="/cart"
          id="cart-fly-target-header"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors relative"
          aria-label="Shopping Cart"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 text-[9px] font-bold w-3.5 h-3.5 bg-[#ba1a1a] text-white rounded-full flex items-center justify-center border border-white">
              {totalItems}
            </span>
          )}
        </Link>

        {/* User Avatar / Auth */}
        <Show when="signed-in">
          <UserButton />
        </Show>
        <Show when="signed-out">
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="px-3.5 py-1.5 bg-[#8A9A5B] text-[#161F00] hover:bg-[#D9EAA3] text-xs font-bold rounded-full transition-colors cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="hidden sm:block px-3.5 py-1.5 border border-[#8A9A5B] text-[#56642B] hover:bg-[#F0EDED] text-xs font-bold rounded-full transition-colors cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </Show>
      </div>
    </header>
  );
}
