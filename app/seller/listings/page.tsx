"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, MapPin, Eye, Edit3, Trash2 } from "lucide-react";
import { useListings } from "@/lib/listings-context";

export default function ActiveListingsPage() {
  const { listings } = useListings();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredListings = listings.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 space-y-8 bg-[#FBF9F8]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E4E2E1] pb-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/profile"
            className="p-2 bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#8A9A5B] hover:text-white rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1B1C1C]">Active Seller Listings</h1>
            <p className="text-xs text-[#76786B]">Manage your marketplace items, price, stock & availability</p>
          </div>
        </div>

        <Link
          href="/seller/listings/create"
          className="flex items-center space-x-2 bg-[#56642B] text-white px-5 py-2.5 rounded-full text-xs font-extrabold shadow-sm hover:bg-[#8A9A5B] hover:text-[#1B1C1C] transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Post New Item</span>
        </Link>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {["all", "fashion", "electronics", "home decor", "footwear"].map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-[#56642B] text-white shadow-sm"
                  : "bg-[#F0EDED] text-[#46483C] hover:bg-[#E4E2E1]"
              }`}
            >
              {cat === "all" ? `All Active (${listings.length})` : cat}
            </button>
          );
        })}
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="py-12 text-center text-[#76786B] text-sm bg-white rounded-3xl border border-[#E4E2E1]">
          No active seller listings found. Click &quot;Post New Item&quot; to add your first product!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E4E2E1] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-[#F0EDED]">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#56642B] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.condition.replace("_", " ")}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#1B1C1C] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center shadow-xs">
                    <MapPin size={11} className="mr-1 text-[#56642B]" />
                    {item.distance}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#76786B] tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-black text-[#1B1C1C] line-clamp-1">{item.title}</h3>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-base font-black text-[#56642B]">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#76786B] flex items-center">
                      <Eye size={13} className="mr-1" />
                      142 views
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-4 bg-[#F6F3F2] border-t border-[#F0EDED] flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full font-bold text-[11px] bg-[#8A9A5B]/20 text-[#56642B]">
                  Active (Listed)
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    aria-label="Edit listing"
                    className="p-2 text-[#76786B] hover:text-[#56642B] hover:bg-white rounded-full transition-colors cursor-pointer"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    aria-label="Deactivate listing"
                    className="p-2 text-[#76786B] hover:text-[#BA1A1A] hover:bg-white rounded-full transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
