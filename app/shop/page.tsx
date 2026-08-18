"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, Heart, ShoppingBag } from "lucide-react";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { flyImageToCart } from "@/lib/cart-fly-animation";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useListings, ListingItem } from "@/lib/listings-context";

const CATEGORIES = [
  { id: "all", name: "All Categories" },
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "mens-outfit", name: "Men's Outfit" },
  { id: "womens-outfit", name: "Women's Outfit" },
  { id: "footwear", name: "Footwear" },
  { id: "accessories", name: "Accessories" },
  { id: "home-decor", name: "Home Decor" },
];

export default function ShopPage() {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { listings } = useListings();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [maxDistance, setMaxDistance] = useState<number>(20);

  const handleToggleFavorite = (product: ListingItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      condition: product.condition,
      category: product.category,
      distanceKm: product.distanceKm,
    });
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return listings.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);

      const matchesCondition =
        selectedCondition === "all" || item.condition === selectedCondition;

      const matchesDistance = item.distanceKm <= maxDistance;

      return matchesCategory && matchesSearch && matchesCondition && matchesDistance;
    });
  }, [listings, selectedCategory, searchQuery, selectedCondition, maxDistance]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight">
            Explore Nearby Listings
          </h1>
          <p className="text-xs sm:text-sm text-[#76786B] font-semibold mt-1">
            Proximity-based discovery for pre-loved and new items delivered straight to your house door.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76786B]" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, phones, brands..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#EAE8E7] rounded-full text-sm text-[#333333] placeholder-[#76786B] focus:bg-white focus:ring-2 focus:ring-[#8A9A5B] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="w-full min-w-0 flex flex-wrap items-center gap-1.5 sm:gap-2 py-1">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#8A9A5B] text-white shadow-sm ring-2 ring-[#8A9A5B]/30 font-extrabold"
                  : "bg-[#F6F3F2] text-[#333333] hover:bg-[#E9EDC9] hover:text-[#5C6145]"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-[#F6F3F2] border border-[#E4E2E1] rounded-[24px] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        {/* Condition Filters */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <span className="text-xs font-extrabold text-[#76786B] flex items-center mr-1">
            <SlidersHorizontal size={14} className="mr-1.5" /> Condition:
          </span>
          {["all", "new", "like_new", "good", "fair"].map((cond) => (
            <button
              key={cond}
              onClick={() => setSelectedCondition(cond)}
              className={`px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCondition === cond
                  ? "bg-[#8A9A5B] text-white shadow-xs"
                  : "bg-white text-[#333333] border border-[#E4E2E1] hover:border-[#8A9A5B] hover:text-[#8A9A5B]"
              }`}
            >
              {cond.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Proximity Distance Radius Slider */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <MapPin size={16} className="text-[#8A9A5B] flex-shrink-0" />
          <span className="text-xs font-bold text-[#333333] whitespace-nowrap">
            Radius: <span className="text-[#8A9A5B] font-extrabold">{maxDistance} km</span>
          </span>
          <input
            type="range"
            min={1}
            max={50}
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-32 accent-[#8A9A5B] cursor-pointer"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#F6F3F2] rounded-[24px] border border-[#E4E2E1]">
          <div className="w-16 h-16 bg-[#E9EDC9] text-[#5C6145] rounded-full flex items-center justify-center mx-auto">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-[#333333]">No items found</h3>
          <p className="text-sm text-[#76786B]">
            Try adjusting your search terms or expanding your proximity radius filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {filteredProducts.map((product) => {
            const isFav = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="group relative bg-[#F6F3F2] rounded-[22px] p-3 border border-[#E4E2E1] shadow-xs hover:shadow-md hover:border-[#8A9A5B]/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Heart Button */}
                <button
                  onClick={(e) => handleToggleFavorite(product, e)}
                  aria-label="Add to favorites"
                  className="absolute top-5 right-5 z-10 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-xs hover:scale-110 transition-transform cursor-pointer"
                >
                  <Heart
                    size={15}
                    className={isFav ? "fill-[#8A9A5B] text-[#8A9A5B]" : "text-[#76786B]"}
                  />
                </button>

                {/* Product Link & Image */}
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative w-full aspect-square rounded-[16px] overflow-hidden bg-[#EAE8E7] mb-3">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1 mb-2">
                    <div className="flex items-center justify-between">
                      <ConditionBadge condition={product.condition} />
                      <span className="text-[10px] text-[#76786B] font-extrabold">{product.distance}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#333333] group-hover:text-[#8A9A5B] transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                  </div>
                </Link>

                {/* Footer Price & Add to Cart */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E4E2E1] mt-2">
                  <div className="text-sm sm:text-base font-extrabold text-[#333333]">
                    ${product.price.toFixed(2)}
                  </div>
                  <button
                    onClick={(e) => {
                      addItem({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.imageUrl,
                        condition: product.condition,
                        distance: product.distance,
                      });
                      const cardImg = e.currentTarget.closest(".group")?.querySelector("img");
                      flyImageToCart({ sourceEl: cardImg || (e.currentTarget as HTMLElement), cartSelector: "#cart-fly-target-header" });
                    }}
                    className="flex items-center space-x-1 bg-[#8A9A5B] hover:bg-[#56642B] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-xs cursor-pointer"
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
