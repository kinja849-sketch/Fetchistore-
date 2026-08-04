"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod" | "bank">("stripe");
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = items.length > 0 ? 4.5 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      router.push("/orders");
    }, 1200);
  };

  return (
    <div className="w-full flex-1 bg-[#FBF9F8] text-[#1B1C1C] min-h-screen pb-28">
      {/* Sticky Top Header Bar with Back Button */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FBF9F8]/90 border-b border-[#E4E2E1]/60 h-16 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex items-center justify-center p-2 rounded-full hover:bg-[#E4E2E1]/50 active:scale-95 transition-all text-[#56642B] cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-extrabold text-[#56642B] tracking-tight flex-1 text-center pr-8">
          Your Shopping Cart
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-[#ba1a1a] hover:underline"
          >
            Clear
          </button>
        )}
      </header>

      <main className="p-4 sm:p-6 max-w-xl mx-auto space-y-4">

      {items.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <span className="material-symbols-outlined text-[48px] text-[#76786B]">
            local_mall
          </span>
          <p className="text-sm font-bold text-[#1B1C1C]">Your cart is empty</p>
          <Link
            href="/"
            className="inline-block bg-[#8A9A5B] text-[#161F00] text-xs font-extrabold px-5 py-2.5 rounded-full hover:bg-[#D9EAA3] transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Item List */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#F6F3F2] rounded-3xl p-3 flex gap-3 items-center border border-[#E4E2E1]/60"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-2xl object-cover bg-[#E4E2E1] flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-[#1B1C1C] line-clamp-1">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#76786B] hover:text-[#ba1a1a] p-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-extrabold text-[#56642B]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <div className="flex items-center bg-white rounded-full px-2 py-0.5 border border-[#E4E2E1] text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-1.5 font-bold text-[#76786B]"
                      >
                        -
                      </button>
                      <span className="px-2 font-extrabold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-1.5 font-bold text-[#76786B]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address Card */}
          <div className="bg-[#F6F3F2] p-4 rounded-3xl border border-[#E4E2E1] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#56642B]">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              <span>Seller-to-Door Delivery</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-[#E4E2E1]/60">
              <div>
                <p className="text-xs font-bold text-[#1B1C1C]">1234 Greenpoint Ave</p>
                <p className="text-[10px] text-[#76786B]">Apt 4B, Brooklyn, NY</p>
              </div>
              <span className="text-xs font-bold text-[#56642B]">Today by 5:00 PM</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#56642B]">
              Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "stripe" as const, label: "Card (Stripe)", icon: "credit_card" },
                { id: "cod" as const, label: "COD (Cash)", icon: "payments" },
                { id: "bank" as const, label: "Bank Transfer", icon: "account_balance" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === m.id
                      ? "bg-[#56642B] text-white border-[#56642B]"
                      : "bg-[#F0EDED] text-[#46483C] border-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                  <span className="text-[10px] font-bold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#F6F3F2] p-4 rounded-3xl border border-[#E4E2E1] space-y-2 text-xs">
            <div className="flex justify-between text-[#46483C]">
              <span>Subtotal</span>
              <span className="font-bold text-[#1B1C1C]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#46483C]">
              <span>Seller Local Delivery</span>
              <span className="font-bold text-[#1B1C1C]">${deliveryFee.toFixed(2)}</span>
            </div>
            <hr className="border-[#E4E2E1] my-1" />
            <div className="flex justify-between text-sm font-extrabold text-[#1B1C1C]">
              <span>Total</span>
              <span className="text-[#56642B]">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Fixed Checkout Bar */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-[#FBF9F8]/95 backdrop-blur-xl border-t border-[#E4E2E1] p-3 z-50">
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-[#8A9A5B] text-[#161F00] font-extrabold py-3.5 px-6 rounded-full hover:bg-[#D9EAA3] transition-all flex items-center justify-between shadow-sm cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <span className="text-sm">
                {isProcessing ? "Processing Order..." : "Place Order"}
              </span>
              <div className="flex items-center gap-1 text-sm font-black">
                <span>${grandTotal.toFixed(2)}</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </div>
            </button>
          </div>
        </>
      )}
      </main>
    </div>
  );
}
