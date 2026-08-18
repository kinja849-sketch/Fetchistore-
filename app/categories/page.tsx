"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/app/actions/categories";
import { Category } from "@/lib/supabase/types";

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getCategories();
      setCategories(res.data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="w-full flex-1 bg-[#FBF9F8] text-[#1B1C1C] min-h-screen pb-20 md:pb-8">
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-1.5 my-2 sm:my-4">
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#56642B] tracking-tight">
            Browse All Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#46483C] max-w-md mx-auto font-medium">
            Explore curated local collections for pre-loved and new items delivered straight to your door.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#76786B]">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#76786B]">No categories found in database.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/category/${cat.slug}`}
                className="group flex flex-col gap-2.5 bg-[#F6F3F2] rounded-3xl p-3 hover:scale-[1.02] active:scale-98 transition-all border border-[#E4E2E1]/80 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#E4E2E1] relative">
                  <img
                    src={cat.image_url || "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop&q=80"}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="px-1 space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#56642B] group-hover:text-[#253000] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-[#76786B]">
                    Discover items near you
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
