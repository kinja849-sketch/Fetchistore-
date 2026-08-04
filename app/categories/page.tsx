"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useListings } from "@/lib/listings-context";

const CATEGORIES = [
  {
    name: "Fashion",
    slug: "fashion",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Furniture",
    slug: "furniture",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Electronics",
    slug: "electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Books",
    slug: "books",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Home Decor",
    slug: "decor",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Footwear",
    slug: "footwear",
    imageUrl:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
  },
];

export default function AllCategoriesPage() {
  const router = useRouter();
  const { searchListings } = useListings();

  return (
    <div className="w-full flex-1 bg-[#FBF9F8] text-[#1B1C1C] min-h-screen pb-24">
      {/* Sticky Top Header with Back Button */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FBF9F8]/90 border-b border-[#E4E2E1]/60 h-16 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex items-center justify-center p-2 rounded-full hover:bg-[#E4E2E1]/50 active:scale-95 transition-all text-[#56642B]"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-extrabold text-[#56642B] tracking-tight flex-1 text-center pr-8">
          All Categories
        </h1>
      </header>

      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-1 my-2">
          <p className="text-xs text-[#46483C] max-w-xs mx-auto font-medium">
            Explore curated local collections for pre-loved and new items.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const items = searchListings("", cat.slug);
            const countStr = `${items.length} ${items.length === 1 ? "item" : "items"} near you`;

            return (
              <Link
                key={cat.name}
                href={`/shop/category/${cat.slug}`}
                className="group flex flex-col gap-2 bg-[#F6F3F2] rounded-3xl p-3 hover:scale-[1.02] transition-all border border-[#E4E2E1]/60 shadow-xs"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#E4E2E1] relative">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="px-1">
                  <h3 className="text-sm font-bold text-[#56642B]">{cat.name}</h3>
                  <p className="text-[11px] font-semibold text-[#76786B]">{countStr}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
