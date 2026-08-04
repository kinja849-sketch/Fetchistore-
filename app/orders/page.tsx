"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  orderNumber: string;
  itemTitle: string;
  itemImage: string;
  sellerName: string;
  price: number;
  status: "pending" | "paid" | "accepted" | "out_for_delivery" | "nearby" | "delivered" | "completed";
  estimatedTime: string;
  driverName: string;
}

const DEMO_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "#8892-FZ",
    itemTitle: "Hand-thrown Ceramic Mug Set",
    itemImage:
      "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=600&q=80",
    sellerName: "Clara Studio",
    price: 48.0,
    status: "out_for_delivery",
    estimatedTime: "2:30 PM - 4:00 PM",
    driverName: "David M. (Seller Courier)",
  },
];

export default function OrdersPage() {
  const router = useRouter();

  return (
    <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 bg-[#FBF9F8]">
      <div className="flex justify-between items-center border-b border-[#E4E2E1] pb-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#56642B]">Order & Tracking</h1>
          <p className="text-xs text-[#76786B]">Live seller-to-door delivery tracking</p>
        </div>
        <span className="text-xs font-bold bg-[#8A9A5B]/20 text-[#56642B] px-3 py-1 rounded-full">
          1 Active Order
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEMO_ORDERS.map((order) => (
          <div key={order.id} className="space-y-3">
            {/* Main Active Order Card */}
            <div className="bg-[#F6F3F2] p-4 rounded-3xl border border-[#E4E2E1] space-y-3 shadow-2xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-extrabold text-[#76786B] uppercase tracking-wider">
                    Order {order.orderNumber}
                  </p>
                  <h2 className="text-base font-extrabold text-[#1B1C1C]">
                    Arriving Today
                  </h2>
                  <p className="text-xs text-[#56642B] font-bold">
                    Est: {order.estimatedTime}
                  </p>
                </div>
                <Link
                  href={`/orders/${order.id}/chat`}
                  className="px-3 py-1.5 rounded-full bg-[#8A9A5B] text-[#161F00] font-extrabold text-xs flex items-center gap-1 hover:bg-[#D9EAA3] transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  Message Seller
                </Link>
              </div>

              {/* Item preview */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E4E2E1]/60">
                <img
                  src={order.itemImage}
                  alt={order.itemTitle}
                  className="w-14 h-14 rounded-xl object-cover bg-[#E4E2E1]"
                />
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-[#1B1C1C]">
                    {order.itemTitle}
                  </h3>
                  <p className="text-[10px] text-[#76786B]">
                    Seller: {order.sellerName}
                  </p>
                </div>
                <span className="text-xs font-black text-[#56642B]">
                  ${order.price.toFixed(2)}
                </span>
              </div>

              {/* Status Timeline */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#56642B]">
                  Delivery Timeline
                </h4>
                <div className="space-y-3 pl-2 border-l-2 border-[#8A9A5B]/30 ml-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-4 h-4 rounded-full bg-[#56642B] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <div>
                      <p className="font-bold text-[#1B1C1C]">Order Placed & Paid</p>
                      <p className="text-[10px] text-[#76786B]">Yesterday, 9:00 AM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-4 h-4 rounded-full bg-[#56642B] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <div>
                      <p className="font-bold text-[#1B1C1C]">Accepted by Seller</p>
                      <p className="text-[10px] text-[#76786B]">Today, 8:15 AM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs bg-[#8A9A5B]/15 p-2 rounded-2xl border border-[#8A9A5B]/30">
                    <span className="w-4 h-4 rounded-full bg-[#56642B] text-white flex items-center justify-center text-[10px] animate-pulse">
                      ●
                    </span>
                    <div>
                      <p className="font-extrabold text-[#56642B]">Out for Delivery</p>
                      <p className="text-[10px] text-[#46483C]">
                        Seller courier is en route to your address
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#76786B] opacity-60">
                    <span className="w-4 h-4 rounded-full bg-[#E4E2E1] flex items-center justify-center text-[10px]">
                      ○
                    </span>
                    <div>
                      <p className="font-bold">Delivered & Completed</p>
                      <p className="text-[10px]">Pending confirmation</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier Map Preview Card */}
              <div className="bg-[#E4E2E1] h-36 rounded-2xl relative overflow-hidden flex flex-col justify-end p-3">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="relative z-10 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#8A9A5B] flex items-center justify-center font-bold text-xs">
                      DM
                    </div>
                    <div>
                      <p className="text-xs font-bold">{order.driverName}</p>
                      <p className="text-[10px] opacity-80">Live Location Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="bg-[#56642B] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full hover:bg-[#8A9A5B] transition-all"
                    >
                      Live Map →
                    </Link>
                    <Link
                      href={`/orders/${order.id}/chat`}
                      className="bg-white/90 text-[#1B1C1C] text-[10px] font-extrabold px-3 py-1.5 rounded-full hover:bg-white transition-all"
                    >
                      Live Chat →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
