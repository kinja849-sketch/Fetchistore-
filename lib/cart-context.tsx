"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: "new" | "like_new" | "good" | "fair";
  distance?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const INITIAL_DEMO_ITEMS: CartItem[] = [
  {
    id: "urban-vanguard-tee",
    title: "Urban Vanguard Tee",
    price: 26.72,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    condition: "new",
    distance: "0.8 km away",
    quantity: 1,
  },
  {
    id: "grey-casual-shoe",
    title: "Grey Casual shoe",
    price: 120.0,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
    condition: "like_new",
    distance: "1.2 km away",
    quantity: 1,
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_DEMO_ITEMS);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("fetchistore_cart");
        if (saved) {
          const parsed = JSON.parse(saved);
          queueMicrotask(() => setItems(parsed));
        }
      } catch {
        // Ignore JSON parse error
      }
    }
  }, []);

  // Sync cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("fetchistore_cart", JSON.stringify(items));
    } catch {
      // Ignore write error
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = item.quantity || 1;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      } else {
        return [...prev, { ...item, quantity: qty }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 4.99 : 0;
  const totalPrice = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
