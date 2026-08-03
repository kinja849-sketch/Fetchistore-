"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CreditCard, Landmark, Wallet, Banknote, ShieldCheck, MapPin, Truck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type PaymentMethod = "stripe" | "bank_transfer" | "ewallet" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, totalPrice, clearCart } = useCart();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("stripe");
  const [address, setAddress] = useState({
    fullName: "Alex Johnson",
    street: "742 Evergreen Terrace",
    city: "Springfield",
    postalCode: "97477",
    phone: "+1 (555) 234-5678",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      router.push("/orders/ord_101");
    }, 1200);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-8">
      
      {/* Page Title */}
      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Checkout & Door Delivery
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          Choose your payment method. The seller will deliver directly to your home address.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Address & Payment Methods (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Delivery Address */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
              <MapPin className="text-brand" size={20} />
              <h2 className="text-base font-extrabold text-gray-900">
                Buyer Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-500 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method (Multi-Payment) */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
              <CreditCard className="text-brand" size={20} />
              <h2 className="text-base font-extrabold text-gray-900">
                Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Stripe Card */}
              <button
                type="button"
                onClick={() => setSelectedMethod("stripe")}
                className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                  selectedMethod === "stripe"
                    ? "border-brand bg-brand-light/60 ring-2 ring-brand/30"
                    : "border-gray-200 hover:border-brand/40 bg-white"
                }`}
              >
                <CreditCard className={selectedMethod === "stripe" ? "text-brand" : "text-gray-500"} size={20} />
                <div>
                  <div className="text-xs font-extrabold text-gray-900">Stripe Card</div>
                  <div className="text-[11px] text-gray-500">Credit / Debit Card</div>
                </div>
              </button>

              {/* Bank Transfer */}
              <button
                type="button"
                onClick={() => setSelectedMethod("bank_transfer")}
                className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                  selectedMethod === "bank_transfer"
                    ? "border-brand bg-brand-light/60 ring-2 ring-brand/30"
                    : "border-gray-200 hover:border-brand/40 bg-white"
                }`}
              >
                <Landmark className={selectedMethod === "bank_transfer" ? "text-brand" : "text-gray-500"} size={20} />
                <div>
                  <div className="text-xs font-extrabold text-gray-900">Bank Transfer</div>
                  <div className="text-[11px] text-gray-500">Direct account deposit</div>
                </div>
              </button>

              {/* E-Wallet */}
              <button
                type="button"
                onClick={() => setSelectedMethod("ewallet")}
                className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                  selectedMethod === "ewallet"
                    ? "border-brand bg-brand-light/60 ring-2 ring-brand/30"
                    : "border-gray-200 hover:border-brand/40 bg-white"
                }`}
              >
                <Wallet className={selectedMethod === "ewallet" ? "text-brand" : "text-gray-500"} size={20} />
                <div>
                  <div className="text-xs font-extrabold text-gray-900">E-Wallet</div>
                  <div className="text-[11px] text-gray-500">Apple Pay / Google Pay</div>
                </div>
              </button>

              {/* COD */}
              <button
                type="button"
                onClick={() => setSelectedMethod("cod")}
                className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                  selectedMethod === "cod"
                    ? "border-brand bg-brand-light/60 ring-2 ring-brand/30"
                    : "border-gray-200 hover:border-brand/40 bg-white"
                }`}
              >
                <Banknote className={selectedMethod === "cod" ? "text-brand" : "text-gray-500"} size={20} />
                <div>
                  <div className="text-xs font-extrabold text-gray-900">Cash on Delivery (COD)</div>
                  <div className="text-[11px] text-gray-500">Pay when seller arrives</div>
                </div>
              </button>
            </div>

            {/* Sub-details depending on method */}
            {selectedMethod === "stripe" && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-600 block mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    defaultValue="4242 4242 4242 4242"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Expiry</label>
                    <input type="text" placeholder="MM/YY" defaultValue="12/28" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">CVC</label>
                    <input type="text" placeholder="123" defaultValue="123" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs" />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "bank_transfer" && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 text-xs space-y-1">
                <p className="font-bold text-gray-800">Fetchistore Escrow Bank Account:</p>
                <p className="text-gray-600">Bank Name: First Federal National</p>
                <p className="text-gray-600">Account #: 9876-5432-1098</p>
                <p className="text-gray-500 text-[11px] pt-1">
                  Payment is held securely until seller completes door delivery.
                </p>
              </div>
            )}

            {selectedMethod === "cod" && (
              <div className="p-4 bg-brand-light rounded-2xl border border-brand/20 text-xs text-brand space-y-1">
                <p className="font-bold">Cash on Delivery Selected:</p>
                <p className="text-gray-700">
                  Please prepare exact cash amount of <span className="font-extrabold">${totalPrice.toFixed(2)}</span> when the seller brings your order.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order Action (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-200 pb-3">
              Summary ({items.length} {items.length === 1 ? "Item" : "Items"})
            </h2>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">{item.quantity}x</span>
                    <span className="text-gray-700 font-medium truncate max-w-[150px]">{item.title}</span>
                  </div>
                  <span className="font-extrabold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center">
                  <Truck size={14} className="mr-1 text-brand" />
                  Seller Door Delivery
                </span>
                <span className="font-bold text-gray-900">${deliveryFee.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-base font-extrabold text-gray-900">Grand Total</span>
                <span className="text-xl font-black text-brand">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-brand text-white py-4 rounded-full font-extrabold text-sm shadow-xl shadow-brand/25 hover:bg-brand-dark transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Place Order & Start Delivery</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
              <ShieldCheck size={16} className="text-green-600" />
              <span>Buyer Protection Guarantee</span>
            </div>
          </div>
        </div>

      </form>

    </main>
  );
}
