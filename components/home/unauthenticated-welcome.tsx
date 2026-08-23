"use client";

import Link from "next/link";

export default function UnauthenticatedWelcome() {
  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between p-3.5 sm:p-5 relative overflow-hidden bg-[#FBF9F8]">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#56642b]/10 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8a9a5b]/10 blur-[90px] pointer-events-none" />

      {/* Bento Grid Imagery Collage (Pure Images Only) */}
      <div className="w-full flex-1 max-h-[52vh] sm:max-h-[56vh] bento-grid my-1 animate-fade-in-up">
        {/* Tile 1: Sustainable Velvet Sofa */}
        <div className="bento-item-1 rounded-3xl overflow-hidden shadow-xs relative group bg-[#F0EDED]">
          <div
            className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80')",
            }}
          />
        </div>

        {/* Tile 2: Pre-Loved Red Sneakers */}
        <div className="bento-item-2 rounded-3xl overflow-hidden shadow-xs relative group bg-[#F0EDED]">
          <div
            className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80')",
            }}
          />
        </div>

        {/* Tile 3: Smart Wireless Headphones */}
        <div className="bento-item-3 rounded-3xl overflow-hidden shadow-xs relative group bg-[#F0EDED]">
          <div
            className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80')",
            }}
          />
        </div>

        {/* Tile 4: Vintage Leather Jacket / Bag */}
        <div className="bento-item-4 rounded-3xl overflow-hidden shadow-xs relative group bg-[#F0EDED]">
          <div
            className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80')",
            }}
          />
        </div>
      </div>

      {/* Content & Actions (Clean Single-Screen Lock) */}
      <div className="w-full text-center space-y-2.5 my-1 animate-fade-in-up shrink-0 pb-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1C1C] tracking-tight leading-tight">
          Modern Craftsmanship, Near You.
        </h1>
        <p className="text-xs sm:text-sm text-[#46483C] max-w-md mx-auto leading-relaxed">
          Discover and sell pre-loved and new goods with seller-to-door delivery and live tracking.
        </p>

        <div className="pt-1 flex flex-col items-center gap-2 w-full">
          <Link
            href="/sign-in"
            className="w-full max-w-xs bg-[#8A9A5B] text-[#161F00] font-bold py-3 px-6 rounded-full hover:bg-[#D9EAA3] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98 text-center text-sm"
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>

          {/* Absolute Last Element on Onboarding Screen */}
          <Link
            href="/sign-in"
            className="w-full max-w-xs text-[#46483C] font-semibold py-1.5 px-6 rounded-full hover:bg-[#F0EDED] transition-colors cursor-pointer text-xs text-center"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
