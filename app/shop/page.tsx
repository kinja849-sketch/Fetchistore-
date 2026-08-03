"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, MapPin, Heart, ShoppingBag, Check } from "lucide-react";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { useCart } from "@/lib/cart-context";

const CATEGORIES = [
  { id: "all", name: "All Categories" },
  { id: "mens-outfit", name: "Men's Outfit" },
  { id: "womens-outfit", name: "Women's Outfit" },
  { id: "footwear", name: "Footwear" },
  { id: "accessories", name: "Accessories" },
  { id: "electronics", name: "Electronics" },
  { id: "home-decor", name: "Home Decor" },
];

const SHOP_ITEMS = [
  {
    id: "urban-vanguard-tee",
    title: "Urban Vanguard Tee",
    category: "mens-outfit",
    price: 26.72,
    condition: "new" as const,
    distanceKm: 0.8,
    distance: "0.8 km away",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "grey-casual-shoe",
    title: "Grey Casual shoe",
    category: "footwear",
    price: 120.0,
    condition: "like_new" as const,
    distanceKm: 1.2,
    distance: "1.2 km away",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "classic-suede-jacket",
    title: "Classic Suede Jacket",
    category: "mens-outfit",
    price: 210.0,
    condition: "good" as const,
    distanceKm: 2.8,
    distance: "2.8 km away",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "urban-minimalist-sneakers",
    title: "Urban Minimalist Sneakers",
    category: "footwear",
    price: 95.0,
    condition: "new" as const,
    distanceKm: 0.5,
    distance: "0.5 km away",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "vintage-chronograph-watch",
    title: "Vintage Chronograph Watch",
    category: "accessories",
    price: 180.0,
    condition: "like_new" as const,
    distanceKm: 3.4,
    distance: "3.4 km away",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "boho-knit-cardigan",
    title: "Boho Soft Knit Cardigan",
    category: "womens-outfit",
    price: 65.0,
    condition: "good" as const,
    distanceKm: 1.9,
    distance: "1.9 km away",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "wireless-anc-headphones",
    title: "Studio Wireless ANC Headphones",
    category: "electronics",
    price: 145.0,
    condition: "like_new" as const,
    distanceKm: 4.1,
    distance: "4.1 km away",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "minimalist-ceramic-vase",
    title: "Minimalist Sculptural Ceramic Vase",
    category: "home-decor",
    price: 42.0,
    condition: "new" as const,
    distanceKm: 2.1,
    distance: "2.1 km away",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
  },
];

export default function ShopPage() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = useMemo(() => {
    return SHOP_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCondition = selectedCondition === "all" || item.condition === selectedCondition;
      const matchesDistance = item.distanceKm <= maxDistance;
      return matchesCategory && matchesSearch && matchesCondition && matchesDistance;
    });
  }, [selectedCategory, searchQuery, selectedCondition, maxDistance]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Explore Nearby Listings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Proximity-based discovery for pre-loved and new items delivered straight to your door.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, brands, sellers..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100/90 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-brand focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-brand text-white shadow-md shadow-brand/20 scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-brand-light hover:text-brand"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-gray-50 border border-gray-100 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        {/* Condition Filters */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <span className="text-xs font-bold text-gray-500 flex items-center mr-1">
            <SlidersHorizontal size={14} className="mr-1.5" /> Condition:
          </span>
          {["all", "new", "like_new", "good", "fair"].map((cond) => (
            <button
              key={cond}
              onClick={() => setSelectedCondition(cond)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCondition === cond
                  ? "bg-brand text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand hover:text-brand"
              }`}
            >
              {cond.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Proximity Distance Radius Slider */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <MapPin size={16} className="text-brand flex-shrink-0" />
          <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
            Radius: <span className="text-brand font-black">{maxDistance} km</span>
          </span>
          <input
            type="range"
            min={1}
            max={20}
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-32 accent-brand cursor-pointer"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-16 h-16 bg-brand-light text-brand rounded-full flex items-center justify-center mx-auto">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No items found</h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search terms or expanding your proximity radius filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const isFav = favorites[product.id];

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-3xl p-3 border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand/20 transition-all duration-300 flex flex-col justify-between"
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

                {/* Product Link & Image */}
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1 mb-2">
                    <div className="flex items-center justify-between">
                      <ConditionBadge condition={product.condition} />
                      <span className="text-[10px] text-gray-400 font-medium">{product.distance}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-brand transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                  </div>
                </Link>

                {/* Footer Price & Add to Cart */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                  <div className="text-sm sm:text-base font-black text-brand">
                    ${product.price.toFixed(2)}
                  </div>
                  <button
                    onClick={() => addItem(product)}
                    className="flex items-center space-x-1 bg-brand hover:bg-brand-dark text-white px-3 py-1.5 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-md shadow-brand/20 cursor-pointer"
                  >
                    <ShoppingBag size={13} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </main>
  );
}
