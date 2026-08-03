"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Tag, Sparkles, Clock, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function TrendingBanner() {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: "urban-vanguard-tee",
      title: "Urban Vanguard Tee",
      price: 26.72,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      condition: "new",
      distance: "0.5 km away",
    });
  };

  return (
    <section className="w-full py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Editorial Container */}
        <div className="relative bg-brand rounded-3xl sm:rounded-[36px] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl text-white">
          
          {/* Background Decorative Ripples */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Headline Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-white/20 pb-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">
              Own the <span className="underline decoration-white/40">EDGE</span> Keep the <span className="bg-white text-brand px-3 py-1 rounded-2xl shadow-md inline-block">VIBE</span>
            </h1>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-300" />
              <span>Trending Post Showcase</span>
            </div>
          </div>

          {/* Grid Layout: Left Taglines, Center Model, Right Featured Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full tracking-wide">
                New Arrivals
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                Where Art Meets Your Style
              </h2>

              <p className="text-white/90 text-sm sm:text-base font-medium max-w-md leading-relaxed">
                Step into the future of streetwear today. Discover proximity-first pre-loved & new drops delivered straight from nearby sellers.
              </p>

              <div>
                <Link
                  href="/shop?sort=trending"
                  className="inline-flex items-center space-x-2 bg-white text-brand hover:bg-brand-light px-7 py-3.5 rounded-full font-extrabold text-sm transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 group"
                >
                  <span>New Drops</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Social Proof Box */}
              <div className="pt-2">
                <div className="inline-flex items-center space-x-3 bg-white/15 backdrop-blur-md p-2.5 pr-5 rounded-2xl border border-white/20">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="User avatar"
                    />
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="User avatar"
                    />
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                      alt="User avatar"
                    />
                  </div>
                  <div>
                    <div className="flex items-center text-amber-300 text-xs font-bold">
                      <Star size={12} className="fill-amber-300 mr-1" />
                      <span>Rated 5 Stars</span>
                    </div>
                    <p className="text-[11px] text-white/80 font-medium">by The Vybe Tribe</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Overlapping Cutout Media (3 Cols on LG) */}
            <div className="lg:col-span-3 hidden sm:flex justify-center relative min-h-[300px] lg:min-h-[380px]">
              <div className="relative w-full h-[320px] lg:h-[400px]">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
                  alt="Trending style model"
                  fill
                  className="object-cover rounded-3xl border-4 border-white/30 shadow-2xl hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Value Highlights & Featured Product Post (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Highlights pills */}
              <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                <span className="flex items-center space-x-1 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold">
                  <Tag size={12} />
                  <span>Future Threads</span>
                </span>
                <span className="flex items-center space-x-1 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold">
                  <Sparkles size={12} />
                  <span>Unique Designs</span>
                </span>
                <span className="flex items-center space-x-1 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold">
                  <Clock size={12} />
                  <span>Limited Drops</span>
                </span>
              </div>

              {/* Floating Featured Product Card (Post is Trending) */}
              <div className="bg-white text-gray-900 rounded-3xl p-4 sm:p-5 shadow-2xl border border-gray-100 hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand">
                    ★ Featured Trending Product
                  </span>
                  <span className="text-[10px] bg-brand-light text-brand px-2 py-0.5 rounded-full font-bold">
                    0.5 km away
                  </span>
                </div>

                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-gray-100">
                  <Image
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
                    alt="Urban Vanguard Tee"
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                  Urban Vanguard Tee
                </h3>
                <p className="text-xs text-gray-500 font-medium mb-3">
                  Unmatched comfort with heavyweight premium cotton.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="text-lg font-black text-brand">
                    $26.72
                  </div>
                  <button
                    onClick={handleQuickAdd}
                    className="flex items-center space-x-1.5 bg-brand text-white hover:bg-brand-dark px-4 py-2 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-md shadow-brand/20"
                  >
                    <ShoppingBag size={14} />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
