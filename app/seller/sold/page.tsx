"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Receipt, CheckCircle2, Truck, DollarSign, Calendar, MapPin } from "lucide-react";

export default function SoldItemsPage() {
  const soldItems = [
    {
      id: "ord-101",
      title: "Handcrafted Ceramic Table Lamp",
      buyer: "Elena Rostova",
      address: "128 Oak Street, Springfield",
      price: "$75.00",
      paymentMethod: "Stripe Card",
      status: "completed",
      deliveredAt: "Yesterday at 4:30 PM",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "ord-102",
      title: "Vintage Leather Jacket (Good Condition)",
      buyer: "Marcus Vance",
      address: "405 Pine Avenue, Springfield",
      price: "$120.00",
      paymentMethod: "COD (Cash on Delivery)",
      status: "delivered",
      deliveredAt: "Aug 2, 2026",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 space-y-8 bg-[#FBF9F8]">
      
      {/* Header Bar */}
      <div className="flex items-center space-x-4 border-b border-[#E4E2E1] pb-4">
        <Link
          href="/profile"
          className="p-2 bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#8A9A5B] hover:text-white rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1B1C1C]">Sold Items History</h1>
          <p className="text-xs text-[#76786B]">Completed seller-to-door sales & transaction receipts</p>
        </div>
      </div>

      {/* Summary Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E4E2E1] rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-[#8A9A5B]/20 text-[#56642B] rounded-xl">
            <Receipt size={22} />
          </div>
          <div>
            <span className="text-[11px] text-[#76786B] font-bold block">Total Items Sold</span>
            <span className="text-xl font-black text-[#1B1C1C]">18 Items</span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E2E1] rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-[#7D562D]/20 text-[#7D562D] rounded-xl">
            <DollarSign size={22} />
          </div>
          <div>
            <span className="text-[11px] text-[#76786B] font-bold block">Total Sales Revenue</span>
            <span className="text-xl font-black text-[#1B1C1C]">$1,420.00</span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E2E1] rounded-2xl p-5 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-[#8A9A5B]/20 text-[#56642B] rounded-xl">
            <Truck size={22} />
          </div>
          <div>
            <span className="text-[11px] text-[#76786B] font-bold block">Fulfillment Success Rate</span>
            <span className="text-xl font-black text-[#1B1C1C]">100% Door Delivered</span>
          </div>
        </div>
      </div>

      {/* Sold History List */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-[#1B1C1C] uppercase tracking-wider">Completed Transactions</h2>

        <div className="space-y-3">
          {soldItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E4E2E1] rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#8A9A5B] transition-all"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#F0EDED]">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#1B1C1C] line-clamp-1">{item.title}</h3>
                  <div className="flex items-center space-x-2 text-[11px] text-[#76786B] mt-1">
                    <span>Buyer: <strong className="text-[#1B1C1C]">{item.buyer}</strong></span>
                    <span>•</span>
                    <span className="flex items-center"><MapPin size={12} className="mr-0.5 text-[#56642B]" />{item.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-[#76786B] mt-1">
                    <Calendar size={12} />
                    <span>Delivered {item.deliveredAt} ({item.paymentMethod})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F0EDED]">
                <div className="text-right">
                  <span className="text-xs font-black text-[#56642B] block">{item.price}</span>
                  <span className="inline-flex items-center text-[10px] font-bold text-[#56642B] bg-[#8A9A5B]/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={11} className="mr-1" />
                    Completed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
