"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getListings, createListing } from "@/app/actions/listings";

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
  images?: string[];
  description: string;
  location: string;
  createdAt: string;
  isSellerItem?: boolean;
}

export interface AddListingInput extends Omit<ListingItem, "id" | "createdAt"> {
  latitude?: number;
  longitude?: number;
}

interface ListingsContextType {
  listings: ListingItem[];
  loading: boolean;
  refreshListings: () => Promise<void>;
  addListing: (newListing: AddListingInput, activeUserId?: string) => Promise<{ data: ListingItem | null; error: string | null }>;
  getListingById: (id: string) => ListingItem | undefined;
  searchListings: (query: string, category?: string) => ListingItem[];
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      setLoading(true);
      try {
        const res = await getListings();
        if (!ignore && res.data) {
          const mapped: ListingItem[] = res.data.map((prod) => ({
            id: prod.id,
            title: prod.title,
            category: prod.category || "general",
            price: prod.price,
            oldPrice: prod.oldPrice,
            condition: prod.condition,
            distanceKm: prod.distance,
            distance: `${prod.distance} km away`,
            imageUrl: prod.imageSrc,
            description: prod.description,
            location: "Near you",
            createdAt: new Date().toISOString(),
          }));
          setListings(mapped);
        }
      } catch (err) {
        console.error("Failed to load listings from Supabase:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const addListing = async (
    item: AddListingInput,
    activeUserId?: string
  ): Promise<{ data: ListingItem | null; error: string | null }> => {
    const res = await createListing(
      {
        title: item.title,
        description: item.description,
        category_id: item.category,
        condition: item.condition,
        price: item.price,
        old_price: item.oldPrice,
        quantity: 1,
        imageUrl: item.imageUrl,
        images: item.images,
        latitude: item.latitude ?? 45.5152,
        longitude: item.longitude ?? -122.6784,
      },
      activeUserId
    );

    if (res.data) {
      const createdItem: ListingItem = {
        id: res.data.id,
        title: res.data.title,
        category: res.data.category || item.category,
        price: res.data.price,
        oldPrice: res.data.oldPrice,
        condition: res.data.condition,
        distanceKm: res.data.distance,
        distance: `${res.data.distance} km away`,
        imageUrl: res.data.imageSrc,
        description: res.data.description,
        location: item.location || "Near you",
        createdAt: new Date().toISOString(),
        isSellerItem: true,
      };
      setListings((prev) => [createdItem, ...prev.filter((p) => p.id !== createdItem.id)]);
      return { data: createdItem, error: null };
    }

    return { data: null, error: res.error || "Failed to create listing" };
  };

  const getListingById = (id: string) => {
    return listings.find((item) => item.id === id);
  };

  const isCategoryMatch = (itemCategory: string, targetCategory: string) => {
    if (!targetCategory || targetCategory.toLowerCase() === "all") return true;
    const cat = itemCategory.toLowerCase().trim();
    const target = targetCategory.toLowerCase().trim();

    if (cat === target) return true;
    
    const aliases: Record<string, string[]> = {
      fashion: ["fashion", "mens-outfit", "womens-outfit", "clothing", "apparel"],
      electronics: ["electronics", "tech", "phones", "gadgets"],
      "home-decor": ["home-decor", "home decor", "decor", "furniture", "home"],
      footwear: ["footwear", "shoes", "sneakers"],
      accessories: ["accessories", "bags", "jewelry"],
      fitness: ["fitness", "sports", "workout"],
      beauty: ["beauty", "skincare", "cosmetics"],
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

  const refreshListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getListings();
      if (res.data) {
        const mapped: ListingItem[] = res.data.map((prod) => ({
          id: prod.id,
          title: prod.title,
          category: prod.category || "general",
          price: prod.price,
          oldPrice: prod.oldPrice,
          condition: prod.condition,
          distanceKm: prod.distance,
          distance: `${prod.distance} km away`,
          imageUrl: prod.imageSrc,
          description: prod.description,
          location: "Near you",
          createdAt: new Date().toISOString(),
        }));
        setListings(mapped);
      }
    } catch (err) {
      console.error("Failed to refresh listings from Supabase:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ListingsContext.Provider
      value={{
        listings,
        loading,
        refreshListings,
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
