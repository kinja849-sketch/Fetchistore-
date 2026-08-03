"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Truck, CheckCircle2, ArrowRight, MessageSquare, MapPin } from "lucide-react";

const DEMO_ORDERS = [
  {
    id: "ord_101",
    date: "August 3, 2026",
    status: "out_for_delivery",
    statusLabel: "Out for Delivery",
    itemsCount: 2,
    total: 151.71,
    sellerName: "Marcus Vance (Near You)",
    distance: "0.8 km away",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "ord_99",
    date: "July 28, 2026",
    status: "completed",
    statusLabel: "Completed",
    itemsCount: 1,
    total: 95.0,
    sellerName: "Sarah Chen",
    distance: "1.5 km away",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80",
  },
];

export default function OrdersPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            My Orders & Deliveries
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Track active seller door deliveries and view your order history.
          </p>
        </div>
        <div className="bg-brand-light text-brand p-3 rounded-2xl">
          <Package size={24} />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {DEMO_ORDERS.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            {/* Top Info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-gray-400 mr-2">Order #{order.id}</span>
                <span className="text-xs text-gray-500">{order.date}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  order.status === "out_for_delivery"
                    ? "bg-brand text-white shadow-sm animate-pulse"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {order.statusLabel}
              </span>
            </div>

            {/* Order Body */}
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={order.image} alt="Order item" fill className="object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-extrabold text-gray-900 truncate">
                  Seller: {order.sellerName}
                </h3>
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                  <MapPin size={12} className="mr-1 text-brand" />
                  <span>{order.distance}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"} • Total:{" "}
                  <span className="font-extrabold text-brand">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center space-x-1 bg-brand text-white px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-brand/20 hover:bg-brand-dark transition-all cursor-pointer flex-shrink-0"
              >
                <span>Track Live</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
