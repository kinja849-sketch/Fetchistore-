"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowLeft, ExternalLink, User } from "lucide-react";
import { DeliveryControlPanel, OrderStatus } from "@/components/seller/delivery-control-panel";

interface SellerOrder {
  id: string;
  buyerName: string;
  buyerAddress: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  distanceKm: number;
  createdAt: string;
}

const initialSellerOrders: SellerOrder[] = [
  {
    id: "ord_101",
    buyerName: "Sarah K.",
    buyerAddress: "742 Evergreen Terrace, Springfield (House)",
    items: [
      {
        title: "Essential Oversized Hoodie",
        quantity: 1,
        price: 49.99,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=720&fit=crop&q=80",
      },
      {
        title: "Air Max 270 Sneakers",
        quantity: 1,
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=720&fit=crop&q=80",
      },
    ],
    total: 179.98,
    paymentMethod: "Stripe Card",
    status: "out_for_delivery",
    distanceKm: 1.8,
    createdAt: "Today at 2:05 PM",
  },
  {
    id: "ord_102",
    buyerName: "Sarah Miller",
    buyerAddress: "100 Industrial Parkway, Apt 4B, Springfield",
    items: [
      {
        title: "Vintage Denim Jacket",
        quantity: 1,
        price: 65.00,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=720&fit=crop&q=80",
      },
    ],
    total: 65.00,
    paymentMethod: "COD (Cash on Delivery)",
    status: "paid",
    distanceKm: 3.2,
    createdAt: "Today at 3:12 PM",
  },
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>(initialSellerOrders);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const handleSimulateMovement = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nextDist = Math.max(0.2, Number((ord.distanceKm - 0.4).toFixed(1)));
          const nextStatus = nextDist <= 0.5 && ord.status === "out_for_delivery" ? "nearby" : ord.status;
          return { ...ord, distanceKm: nextDist, status: nextStatus };
        }
        return ord;
      })
    );
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center space-x-3">
          <Link
            href="/profile"
            className="p-2.5 text-gray-500 hover:text-brand bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Seller Order Fulfillment
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Deliver directly to buyer home addresses & manage status updates
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="bg-brand-light text-brand text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-brand/20">
            {orders.length} Active Orders
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black text-gray-900">Order #{order.id}</span>
                  <span className="text-xs text-gray-400 font-medium">• {order.createdAt}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600 font-bold mt-1">
                  <User size={14} className="text-brand mr-1" />
                  <span>Buyer: {order.buyerName}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href={`/orders/${order.id}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-extrabold px-3.5 py-2 rounded-full transition-colors flex items-center space-x-1"
                >
                  <span>View Live Tracking Map</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>

            {/* Buyer Delivery Address Banner */}
            <div className="bg-brand-light/40 border border-brand/15 rounded-2xl p-4 flex items-start space-x-3 text-xs">
              <MapPin className="text-brand shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-extrabold text-gray-900">Destination (Buyer House):</span>
                <p className="text-gray-700 font-medium mt-0.5">{order.buyerAddress}</p>
                <div className="flex items-center space-x-3 text-[11px] font-bold text-brand mt-1.5">
                  <span>Proximity: {order.distanceKm} km away</span>
                  <span>•</span>
                  <span>Payment: {order.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="text-xs">
                    <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                    <p className="text-gray-500 text-[11px]">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seller Delivery Control Component */}
            <DeliveryControlPanel
              currentStatus={order.status}
              onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
              onSimulateMovement={
                order.status === "out_for_delivery" ? () => handleSimulateMovement(order.id) : undefined
              }
              sellerDistance={order.distanceKm}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
