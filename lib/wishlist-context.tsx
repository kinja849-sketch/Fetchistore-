"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  description?: string;
  imageUrl: string;
  condition: "new" | "like_new" | "good" | "fair";
  distanceKm?: number;
  distance?: string;
  category?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

const DEFAULT_WISHLIST: WishlistItem[] = [
  {
    id: "w1",
    title: "Hand-Thrown Ceramic Lamp",
    description: "Earthy textured clay, linen shade.",
    price: 185.0,
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    condition: "like_new",
  },
  {
    id: "w2",
    title: "Artisan Wool Rug",
    description: "Hand-woven, natural dyes. 5x8 ft.",
    price: 450.0,
    imageUrl:
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80",
    condition: "good",
  },
];

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(DEFAULT_WISHLIST);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("fetchistore_wishlist_items");
        if (saved) {
          const parsed = JSON.parse(saved);
          queueMicrotask(() => setWishlistItems(parsed));
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  }, []);

  // Sync changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("fetchistore_wishlist_items", JSON.stringify(wishlistItems));
    } catch {
      // Ignore storage errors
    }
  }, [wishlistItems]);

  const toggleWishlist = (item: WishlistItem) => {
    setWishlistItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((i) => i.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
