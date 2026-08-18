"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useListings } from "@/lib/listings-context";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, SlidersHorizontal } from "lucide-react";

export default function CategorySlugPage() {
  const params = useParams();
  const rawSlug = (params.slug as string) || "fashion";
  const { searchListings } = useListings();
  const { addItem } = useCart();
  const [selectedSub, setSelectedSub] = useState("all");

  const categoryTitle = useMemo(() => {
    return rawSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }, [rawSlug]);

  const categoryProducts = useMemo(() => {
    return searchListings("", rawSlug);
  }, [rawSlug, searchListings]);

  const filteredProducts = useMemo(() => {
    if (selectedSub === "all") return categoryProducts;
    return categoryProducts.filter(
      (item) =>
        item.title.toLowerCase().includes(selectedSub.toLowerCase()) ||
        item.description.toLowerCase().includes(selectedSub.toLowerCase()) ||
        item.condition === selectedSub.toLowerCase()
    );
  }, [categoryProducts, selectedSub]);

  return (
    <div className="w-full flex-1 bg-[#FBF9F8] text-[#1B1C1C] min-h-screen pb-20 md:pb-8">
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#1B1C1C] capitalize">
              {categoryTitle} Collection
            </h1>
            <p className="text-xs sm:text-sm text-[#76786B] font-semibold mt-0.5">
              {filteredProducts.length} items available in your area
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button className="flex items-center gap-1.5 text-xs font-bold text-[#56642B] bg-[#F0EDED] px-3.5 py-2 rounded-full border border-[#E4E2E1] hover:bg-[#E4E2E1] transition-colors cursor-pointer">
              <SlidersHorizontal size={14} />
              Filter
            </button>
          </div>
        </div>

        {/* Subcategory Filter Pills */}
        <div className="w-full min-w-0 flex flex-wrap items-center gap-1.5 sm:gap-2 py-1">
          {["all", "new", "like_new", "good", "fair"].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSub(sub)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-extrabold capitalize whitespace-nowrap transition-all cursor-pointer ${
                selectedSub === sub
                  ? "bg-[#56642B] text-white shadow-sm ring-2 ring-[#56642B]/30"
                  : "bg-[#F0EDED] text-[#46483C] hover:bg-[#E4E2E1]"
              }`}
            >
              {sub === "all" ? "All Items" : sub.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#F6F3F2] rounded-3xl border border-[#E4E2E1]">
            <h3 className="text-base font-bold text-[#1B1C1C]">
              No items listed in {categoryTitle} yet
            </h3>
            <p className="text-xs text-[#76786B] max-w-sm mx-auto">
              Be the first to list an item in this category or check back later!
            </p>
            <Link
              href="/seller/listings/create"
              className="inline-block bg-[#56642B] text-white text-xs font-extrabold px-6 py-2.5 rounded-full hover:bg-[#253000] transition-all cursor-pointer"
            >
              + Create Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#F6F3F2] rounded-3xl p-3 flex flex-col justify-between group hover:shadow-md transition-all border border-[#E4E2E1]/60 relative"
              >
                <div>
                  <Link href={`/product/${prod.id}`} className="block">
                    <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#E4E2E1] relative mb-2">
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 z-10">
                        <ConditionBadge condition={prod.condition} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-[#1B1C1C] line-clamp-1 group-hover:text-[#56642B] transition-colors">
                        {prod.title}
                      </h4>
                      <p className="text-[10px] text-[#76786B] font-semibold">
                        {prod.distance || `${prod.distanceKm} km away`}
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E4E2E1] mt-2">
                  <span className="text-xs sm:text-sm font-extrabold text-[#56642B]">
                    ${prod.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() =>
                      addItem({
                        id: prod.id,
                        title: prod.title,
                        price: prod.price,
                        image: prod.imageUrl,
                        condition: prod.condition,
                        distance: prod.distance || `${prod.distanceKm} km away`,
                      })
                    }
                    className="p-1.5 sm:p-2 bg-[#8A9A5B] hover:bg-[#56642B] text-white rounded-full transition-transform active:scale-95 cursor-pointer shadow-xs"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
