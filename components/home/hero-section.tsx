"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser, SignUpButton } from "@clerk/nextjs";

export default function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative w-full bg-[#FAFAFA] min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Mobile background overlay */}
      <div className="absolute inset-0 lg:hidden z-0">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop&q=80"
          alt="Fashion Shopping"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl py-12 lg:py-0">
            <span className="text-brand text-xs uppercase tracking-widest font-semibold block mb-4">
              TRENDING NOW
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Discover Products You&apos;ll Love
            </h1>
            <p className="text-lg text-gray-500 mt-4 max-w-md">
              Shop new & pre-loved items from sellers near you. Delivered straight to your door.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {!isSignedIn ? (
                <SignUpButton mode="modal">
                  <button className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors inline-block text-center shadow-lg shadow-brand/20 cursor-pointer">
                    Shop Now
                  </button>
                </SignUpButton>
              ) : (
                <Link
                  href="/shop"
                  className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors inline-block text-center shadow-lg shadow-brand/20 cursor-pointer"
                >
                  Shop Now
                </Link>
              )}

              {!isSignedIn ? (
                <SignUpButton mode="modal">
                  <button className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-colors inline-block text-center cursor-pointer">
                    Explore Collection
                  </button>
                </SignUpButton>
              ) : (
                <Link
                  href="/shop"
                  className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-colors inline-block text-center cursor-pointer"
                >
                  Explore Collection
                </Link>
              )}
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-3">
                {["bg-brand", "bg-amber-400", "bg-blue-500", "bg-emerald-500"].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white ${color} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Loved by 10,000+ customers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Image */}
      <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full z-0">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop&q=80"
          alt="Fashion Shopping"
          fill
          className="object-cover object-center rounded-l-[40px]"
          priority
        />
      </div>
    </section>
  );
}
