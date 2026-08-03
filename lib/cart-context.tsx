"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  addItem: (item: Omit<CartItem, "quantity">) => void;
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

  // Sync to local storage on client if needed
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fetchistore_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Fallback to initial
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("fetchistore_cart", JSON.stringify(newItems));
    } catch {
      // Ignore write error
    }
  };

  const addItem = (item: Omit<CartItem, "quantity">) => {
    const existingIndex = items.findIndex((i) => i.id === item.id);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      saveCart([...items, { ...item, quantity: 1 }]);
    }
  };

  const removeItem = (id: string) => {
    saveCart(items.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    saveCart(
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    saveCart([]);
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
