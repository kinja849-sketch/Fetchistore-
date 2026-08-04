"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Building2,
  Wallet,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ChevronLeft,
  Lock
} from "lucide-react";

export default function PaymentsAndBalancePage() {
  const [activeTab, setActiveTab] = useState<"payouts" | "methods">("payouts");

  const [savedMethods] = useState([
    { id: "1", type: "card", title: "Visa ending in 4242", subtitle: "Expires 12/28", isDefault: true, icon: CreditCard },
    { id: "2", type: "bank", title: "First National Bank", subtitle: "Account •••• 9812", isDefault: false, icon: Building2 },
    { id: "3", type: "ewallet", title: "Apple Pay / Local E-Wallet", subtitle: "Connected", isDefault: false, icon: Wallet },
    { id: "4", type: "cod", title: "Cash on Delivery (COD)", subtitle: "Pay at buyer door", isDefault: false, icon: DollarSign },
  ]);

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
          <h1 className="text-xl sm:text-2xl font-black text-[#1B1C1C]">Payments & Balance</h1>
          <p className="text-xs text-[#76786B]">Manage seller earnings, payout schedules & checkout payment options</p>
        </div>
      </div>

      {/* Hero Earnings & Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Available Balance */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#56642B] via-[#687836] to-[#8A9A5B] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <CreditCard size={180} />
          </div>

          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#D9EAA3]">Seller Account Balance</span>
              <div className="text-3xl sm:text-4xl font-black mt-1">$342.50</div>
            </div>
            <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/30">
              Verified Seller
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/20 text-xs">
            <div>
              <span className="opacity-80 block text-[11px]">Pending Settlement</span>
              <span className="font-extrabold text-sm">$89.00</span>
            </div>
            <div>
              <span className="opacity-80 block text-[11px]">Next Automatic Payout</span>
              <span className="font-extrabold text-sm">Tomorrow (12:00 PM)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="flex items-center space-x-1.5 bg-white text-[#56642B] px-5 py-2.5 rounded-full text-xs font-black hover:bg-[#D9EAA3] transition-all shadow-sm cursor-pointer">
              <ArrowUpRight size={16} />
              <span>Request Instant Payout</span>
            </button>
            <button className="bg-black/20 hover:bg-black/30 backdrop-blur-md text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer">
              Payout Settings
            </button>
          </div>
        </div>

        {/* Quick Stats Bento */}
        <div className="bg-white border border-[#E4E2E1] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#F0EDED] pb-3">
            <ShieldCheck size={18} className="text-[#56642B]" />
            <h3 className="text-xs font-black text-[#1B1C1C] uppercase tracking-wider">Payment Security</h3>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-[#76786B]">
              <span>Stripe Card Protection</span>
              <span className="font-bold text-[#56642B]">Active</span>
            </div>
            <div className="flex justify-between items-center text-[#76786B]">
              <span>COD Door Verification</span>
              <span className="font-bold text-[#56642B]">Active</span>
            </div>
            <div className="flex justify-between items-center text-[#76786B]">
              <span>Bank Transfer Escrow</span>
              <span className="font-bold text-[#56642B]">Enabled</span>
            </div>
          </div>

          <div className="p-3 bg-[#F6F3F2] rounded-2xl flex items-center space-x-2 text-[11px] text-[#76786B]">
            <Lock size={14} className="text-[#56642B] shrink-0" />
            <span>End-to-end encrypted checkout transactions</span>
          </div>
        </div>

      </div>

      {/* Tabs: Payout Methods & Saved Methods */}
      <div className="space-y-6">
        <div className="flex border-b border-[#E4E2E1]">
          <button
            onClick={() => setActiveTab("payouts")}
            className={`pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 mr-6 transition-all ${
              activeTab === "payouts"
                ? "border-[#56642B] text-[#56642B]"
                : "border-transparent text-[#76786B] hover:text-[#1B1C1C]"
            }`}
          >
            Payment Methods ({savedMethods.length})
          </button>
          <button
            onClick={() => setActiveTab("methods")}
            className={`pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "methods"
                ? "border-[#56642B] text-[#56642B]"
                : "border-transparent text-[#76786B] hover:text-[#1B1C1C]"
            }`}
          >
            Seller Payout Account
          </button>
        </div>

        {/* Saved Methods List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className="bg-white border border-[#E4E2E1] rounded-2xl p-5 shadow-xs flex items-center justify-between hover:border-[#8A9A5B] transition-all"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-[#F6F3F2] text-[#56642B] rounded-xl">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-extrabold text-[#1B1C1C]">{method.title}</h4>
                      {method.isDefault && (
                        <span className="bg-[#8A9A5B]/20 text-[#56642B] text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#76786B] mt-0.5">{method.subtitle}</p>
                  </div>
                </div>

                <CheckCircle2 size={18} className={method.isDefault ? "text-[#56642B]" : "text-[#E4E2E1]"} />
              </div>
            );
          })}

          <button className="border-2 border-dashed border-[#E4E2E1] hover:border-[#8A9A5B] rounded-2xl p-5 flex items-center justify-center space-x-2 text-xs font-extrabold text-[#56642B] hover:bg-[#8A9A5B]/10 transition-all cursor-pointer">
            <Plus size={16} />
            <span>Add New Payment Method</span>
          </button>
        </div>
      </div>

    </main>
  );
}
