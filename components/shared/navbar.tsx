"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, SlidersHorizontal } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/lib/cart-context";

export function Navbar() {
  const { isSignedIn } = useUser();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const desktopNavLinks = [
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            {/* UNAUTHENTICATED HEADER NAVIGATION */}
            <Show when="signed-out">
              {/* Left */}
              <div className="flex-1 flex items-center">
                <button
                  className="lg:hidden p-2 text-gray-600 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu size={24} />
                </button>
                <nav className="hidden lg:flex space-x-8">
                  {desktopNavLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-xs uppercase tracking-wider font-semibold text-gray-600 hover:text-brand border-b-2 border-transparent hover:border-brand transition-all duration-200 py-1"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Center */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <Link href="/" className="text-xl font-black tracking-widest text-brand">
                  FETCHISTORE
                </Link>
              </div>

              {/* Right */}
              <div className="flex-1 flex items-center justify-end space-x-4 sm:space-x-6">
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-brand transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </Link>

                <div className="flex items-center space-x-3 text-xs uppercase tracking-wider font-semibold">
                  <SignInButton mode="modal">
                    <button className="text-gray-600 hover:text-brand transition-colors cursor-pointer">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-brand text-white px-4 py-2 rounded-full hover:bg-brand-dark transition-all cursor-pointer shadow-md shadow-brand/20">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>

                <Link
                  href="/cart"
                  className="text-gray-600 hover:text-brand transition-colors relative"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </Show>

            {/* AUTHENTICATED APP HEADER */}
            <Show when="signed-in">
              {/* Mobile Menu / Brand Logo */}
              <div className="flex items-center space-x-3">
                <Link href="/" className="text-lg font-black tracking-widest text-brand">
                  FETCHISTORE
                </Link>
              </div>

              {/* Integrated Search Input */}
              <div className="flex-1 max-w-lg mx-2 sm:mx-6">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="what are you looking for?"
                    className="w-full pl-10 pr-10 py-2 bg-gray-100/80 border border-transparent rounded-full text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-brand focus:outline-none transition-all"
                  />
                  <Link
                    href="/shop"
                    aria-label="Filter options"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-brand transition-colors"
                  >
                    <SlidersHorizontal size={16} />
                  </Link>
                </div>
              </div>

              {/* User Controls & Cart */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Link
                  href="/cart"
                  className="p-2 text-gray-700 hover:bg-brand-light rounded-full transition-colors relative"
                  aria-label="Cart"
                >
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-brand text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Clerk User Button */}
                <UserButton />
              </div>
            </Show>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay for Unauthenticated mode */}
      {!isSignedIn && isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col lg:hidden animate-in slide-in-from-left duration-200">
          <div className="flex justify-between items-center px-4 h-16 border-b border-gray-100">
            <span className="text-lg font-bold tracking-widest text-brand">MENU</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-black transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1 px-6 py-8 flex flex-col space-y-6 overflow-y-auto">
            {desktopNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-medium tracking-wide text-black hover:text-brand transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="px-6 py-6 border-t border-gray-100 flex flex-col space-y-4">
            <SignInButton mode="modal">
              <button className="w-full text-center py-2.5 border border-gray-300 rounded-xl text-sm font-semibold hover:border-brand hover:text-brand">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="w-full text-center py-2.5 bg-brand text-white rounded-xl text-sm font-semibold shadow-md hover:bg-brand-dark">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      )}
    </>
  );
}
