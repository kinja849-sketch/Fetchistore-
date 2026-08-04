"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [movedId, setMovedId] = useState<string | null>(null);

  const handleMoveToCart = (item: (typeof wishlistItems)[0]) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: 1,
      image: item.imageUrl,
      condition: item.condition,
    });
    setMovedId(item.id);
    setTimeout(() => {
      removeFromWishlist(item.id);
      setMovedId(null);
    }, 600);
  };

  return (
    <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 bg-[#FBF9F8]">
      <div className="flex justify-between items-end border-b border-[#E4E2E1] pb-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#56642B] tracking-tight">
            Saved Items
          </h1>
          <p className="text-xs text-[#76786B]">
            {wishlistItems.length} items thoughtfully curated for your space.
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs font-bold text-[#ba1a1a] hover:underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <span className="material-symbols-outlined text-[48px] text-[#76786B]">
            favorite_border
          </span>
          <p className="text-sm font-bold text-[#1B1C1C]">Your wishlist is empty</p>
          <p className="text-xs text-[#76786B] max-w-xs mx-auto">
            Explore nearby pre-loved & new items and tap the heart icon to save items here.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#8A9A5B] text-white text-xs font-extrabold px-5 py-2.5 rounded-full hover:bg-[#56642B] transition-all cursor-pointer"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#F6F3F2] rounded-3xl p-3 flex gap-3 relative border border-[#E4E2E1]/60 shadow-2xs group flex-col justify-between"
            >
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-white/80 text-[#76786B] hover:text-[#ba1a1a] hover:bg-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                aria-label="Remove item"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>

              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#E4E2E1]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between pt-1">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1B1C1C] line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-[#76786B] line-clamp-1">
                    {item.description || item.category || "Pre-loved item"}
                  </p>
                  <span className="text-sm font-black text-[#56642B] mt-1 block">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full mt-3 bg-[#8A9A5B] text-[#161F00] text-xs font-bold py-2 px-3 rounded-full hover:bg-[#D9EAA3] transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    add_shopping_cart
                  </span>
                  <span>{movedId === item.id ? "Added!" : "Move to Cart"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
