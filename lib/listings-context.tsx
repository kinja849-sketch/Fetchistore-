"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ProductCondition = "new" | "like_new" | "good" | "fair";

export interface ListingItem {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  condition: ProductCondition;
  distanceKm: number;
  distance: string;
  imageUrl: string;
  description: string;
  location: string;
  createdAt: string;
  isSellerItem?: boolean;
}

const INITIAL_DEMO_LISTINGS: ListingItem[] = [
  {
    id: "demo-phone-1",
    title: "iPhone 15 Pro - 256GB Natural Titanium",
    category: "electronics",
    price: 850.0,
    oldPrice: 999.0,
    condition: "like_new",
    distanceKm: 0.5,
    distance: "0.5 km away",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    description: "Flawless condition iPhone 15 Pro, battery health 98%. Comes with original USB-C cable and box.",
    location: "Portland, OR",
    createdAt: new Date().toISOString(),
  },
  {
    id: "urban-vanguard-tee",
    title: "Urban Vanguard Tee",
    category: "mens-outfit",
    price: 26.72,
    oldPrice: 35.0,
    condition: "new",
    distanceKm: 0.8,
    distance: "0.8 km away",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    description: "100% organic heavy cotton oversized t-shirt in washed olive.",
    location: "Greenpoint, NY",
    createdAt: new Date().toISOString(),
  },
  {
    id: "grey-casual-shoe",
    title: "Grey Casual Sneakers",
    category: "footwear",
    price: 120.0,
    oldPrice: 150.0,
    condition: "like_new",
    distanceKm: 1.2,
    distance: "1.2 km away",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
    description: "Worn twice indoors. Extremely comfortable cushioned soles.",
    location: "Greenpoint, NY",
    createdAt: new Date().toISOString(),
  },
  {
    id: "classic-suede-jacket",
    title: "Classic Suede Jacket",
    category: "mens-outfit",
    price: 210.0,
    condition: "good",
    distanceKm: 2.8,
    distance: "2.8 km away",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    description: "Authentic vintage suede leather jacket with warm inner lining.",
    location: "Brooklyn, NY",
    createdAt: new Date().toISOString(),
  },
  {
    id: "minimalist-ceramic-vase",
    title: "Minimalist Sculptural Ceramic Vase",
    category: "home-decor",
    price: 42.0,
    condition: "new",
    distanceKm: 2.1,
    distance: "2.1 km away",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
    description: "Handcrafted matte ceramic vase, perfect for dried florals.",
    location: "Portland, OR",
    createdAt: new Date().toISOString(),
  },
  {
    id: "studio-anc-headphones",
    title: "Studio Wireless ANC Headphones",
    category: "electronics",
    price: 145.0,
    condition: "like_new",
    distanceKm: 3.5,
    distance: "3.5 km away",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description: "Active Noise Cancelling over-ear headphones with 30-hour battery life.",
    location: "Portland, OR",
    createdAt: new Date().toISOString(),
  },
];

interface ListingsContextType {
  listings: ListingItem[];
  addListing: (newListing: Omit<ListingItem, "id" | "createdAt">) => ListingItem;
  getListingById: (id: string) => ListingItem | undefined;
  searchListings: (query: string, category?: string) => ListingItem[];
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<ListingItem[]>(INITIAL_DEMO_LISTINGS);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fetchistore_user_listings");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setListings(parsed);
          }
        } catch {
          // fallback to initial demo listings
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fetchistore_user_listings", JSON.stringify(listings));
    }
  }, [listings]);

  const addListing = (item: Omit<ListingItem, "id" | "createdAt">): ListingItem => {
    const newListing: ListingItem = {
      ...item,
      id: `listing-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isSellerItem: true,
    };

    setListings((prev) => [newListing, ...prev]);
    return newListing;
  };

  const getListingById = (id: string) => {
    return listings.find((item) => item.id === id);
  };

  const isCategoryMatch = (itemCategory: string, targetCategory: string) => {
    if (!targetCategory || targetCategory.toLowerCase() === "all") return true;
    const cat = itemCategory.toLowerCase().trim();
    const target = targetCategory.toLowerCase().trim();

    if (cat === target) return true;
    
    // Normalize aliases
    const aliases: Record<string, string[]> = {
      fashion: ["fashion", "mens-outfit", "womens-outfit", "clothing", "apparel"],
      electronics: ["electronics", "tech", "phones", "gadgets"],
      "home-decor": ["home-decor", "home decor", "decor", "furniture", "home"],
      footwear: ["footwear", "shoes", "sneakers"],
      accessories: ["accessories", "bags", "jewelry"],
      furniture: ["furniture", "home-decor", "decor"],
      books: ["books", "media"],
    };

    for (const [, list] of Object.entries(aliases)) {
      if (list.includes(cat) && list.includes(target)) {
        return true;
      }
    }

    return cat.includes(target) || target.includes(cat);
  };

  const searchListings = (query: string, category?: string) => {
    const q = query.trim().toLowerCase();
    return listings.filter((item) => {
      const matchesCategory = !category || isCategoryMatch(item.category, category);
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  };

  return (
    <ListingsContext.Provider
      value={{
        listings,
        addListing,
        getListingById,
        searchListings,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error("useListings must be used within a ListingsProvider");
  }
  return context;
}
