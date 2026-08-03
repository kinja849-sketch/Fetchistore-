"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart, SlidersHorizontal, Search } from "lucide-react";
import { ConditionBadge } from "@/components/shared/condition-badge";

const CATEGORIES = [
  {
    id: "mens-outfit",
    name: "Men's outfit",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "womens-outfit",
    name: "Woman's outfit",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "mens-footwear",
    name: "Men's footwears",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80",
  },
];

const NEW_ARRIVALS = [
  {
    id: "grey-casual-shoe",
    title: "Grey Casual shoe",
    category: "Men Footwear",
    price: 120,
    condition: "like_new" as const,
    distance: "1.2 km away",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "brown-jacket",
    title: "Classic Suede Jacket",
    category: "Men Outfit",
    price: 210,
    condition: "good" as const,
    distance: "2.8 km away",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "velora-sneakers",
    title: "Urban Minimalist Sneakers",
    category: "Footwear",
    price: 95,
    condition: "new" as const,
    distance: "0.5 km away",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "leather-watch",
    title: "Vintage Chronograph Watch",
    category: "Accessories",
    price: 180,
    condition: "like_new" as const,
    distance: "3.4 km away",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
  },
];

export default function AuthenticatedFeed() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-6">
      
      {/* Mobile Top Search Bar */}
      <div className="sm:hidden flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="what are you looking for?"
            className="w-full pl-10 pr-10 py-2.5 bg-gray-100/90 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <Link href="/shop" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand">
            <SlidersHorizontal size={18} />
          </Link>
        </div>
      </div>

      {/* Hero Offer Banner (Primary Brand Accent Palette) */}
      <div className="relative overflow-hidden rounded-3xl bg-brand text-white p-6 sm:p-8 flex items-center justify-between shadow-lg">
        <div className="space-y-4 max-w-[60%] z-10">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold rounded-full tracking-wide">
            Limited Offer
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
            First Purchase Enjoy a Special Offer
          </h1>
          <div>
            <Link
              href="/product/grey-casual-shoe"
              className="inline-flex items-center space-x-2 bg-white text-brand hover:bg-brand-light px-5 py-2.5 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-md"
            >
              <span>Shop Now</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Promo Image Overlay */}
        <div className="relative w-32 sm:w-44 h-32 sm:h-44 flex-shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80"
            alt="Special offer"
            fill
            className="object-cover rounded-2xl shadow-md border-2 border-white/20"
          />
        </div>

        {/* Indicator dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-white/40" />
          <span className="w-5 h-2 rounded-full bg-white" />
          <span className="w-2 h-2 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Categories Layer */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Categories</h2>
          <Link href="/shop" className="text-xs font-bold text-brand hover:underline">
            See all
          </Link>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="flex items-center space-x-2 bg-gray-100/80 hover:bg-brand-light hover:border-brand/30 border border-transparent p-2 pr-4 rounded-2xl flex-shrink-0 transition-all"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-200">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              </div>
              <span className="text-xs font-bold text-gray-800">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* New Arrivals Layer */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">New Arrival</h2>
          <Link href="/shop?sort=newest" className="text-xs font-bold text-brand hover:underline">
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {NEW_ARRIVALS.map((product) => {
            const isFav = favorites[product.id];

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group relative bg-white rounded-3xl p-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand/20 transition-all duration-200 flex flex-col"
              >
                {/* Heart Button */}
                <button
                  onClick={(e) => toggleFavorite(product.id, e)}
                  aria-label="Add to favorites"
                  className="absolute top-5 right-5 z-10 p-2 bg-white/90 rounded-full shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart
                    size={16}
                    className={isFav ? "fill-brand text-brand" : "text-gray-400"}
                  />
                </button>

                {/* Image */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Meta */}
                <div className="space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <ConditionBadge condition={product.condition} />
                      <span className="text-[10px] text-gray-400">{product.distance}</span>
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-brand transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                  </div>

                  <div className="text-sm font-extrabold text-brand">
                    ${product.price}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
