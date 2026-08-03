"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { ConditionBadge } from "@/components/shared/condition-badge";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, deliveryFee, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-brand-light text-brand rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900">Your Cart is Empty</h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Discover pre-loved and new items nearby with seller door delivery.
          </p>
        </div>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 bg-brand text-white px-7 py-3.5 rounded-full text-sm font-extrabold shadow-lg shadow-brand/25 hover:bg-brand-dark transition-all active:scale-95"
          >
            <span>Start Shopping</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-8">
      
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Review your selected items before proceeding to seller door checkout.
          </p>
        </div>
        <span className="text-xs font-bold bg-brand-light text-brand px-3.5 py-1.5 rounded-full">
          {items.length} {items.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>

              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between">
                  <ConditionBadge condition={item.condition} />
                  {item.distance && (
                    <span className="text-[10px] text-gray-400 font-semibold">{item.distance}</span>
                  )}
                </div>

                <h3 className="text-sm font-extrabold text-gray-900 truncate">
                  {item.title}
                </h3>

                <div className="text-sm font-black text-brand">
                  ${item.price.toFixed(2)}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2 bg-gray-100/80 rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-600 hover:text-brand transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-extrabold text-gray-900 w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-600 hover:text-brand transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-200 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span className="font-extrabold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span className="flex items-center">
                  <MapPin size={14} className="mr-1 text-brand" />
                  Seller Door Delivery
                </span>
                <span className="font-extrabold text-gray-900">${deliveryFee.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-base font-extrabold text-gray-900">Total</span>
                <span className="text-xl font-black text-brand">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center space-x-2 bg-brand text-white py-4 rounded-full font-extrabold text-sm shadow-xl shadow-brand/25 hover:bg-brand-dark transition-all active:scale-95 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Link>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-2 border-t border-gray-200/60">
              <ShieldCheck size={16} className="text-green-600" />
              <span>Seller-fulfilled door delivery & secure checkout</span>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
