"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Sliders,
  Bell,
  Shield,
  Key,
  ChevronLeft,
  Save,
  CheckCircle
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/lib/supabase/auth-context";

export default function SettingsAndPrivacyPage() {
  const { user } = useUser();
  const { userProfile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(
    userProfile.fullName || user?.fullName || user?.username || ""
  );
  const [location, setLocation] = useState(userProfile.location || "Greenpoint, NY");
  const [preferredRadius, setPreferredRadius] = useState<number>(userProfile.radiusKm || 10);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    deliveryAlerts: true,
    chatMessages: true,
    promotions: false,
  });

  const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "";

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, location, radiusKm: preferredRadius });
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 space-y-8 bg-[#FBF9F8] relative">
      
      {/* Save Toast */}
      {showSavedMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[110] bg-[#56642B] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={16} />
          <span>Account preferences saved successfully!</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center space-x-4 border-b border-[#E4E2E1] pb-4">
        <Link
          href="/profile"
          className="p-2 bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#8A9A5B] hover:text-white rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1B1C1C]">Settings & Privacy</h1>
          <p className="text-xs text-[#76786B]">Account information, proximity preferences & security</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        
        {/* Account Information Form */}
        <form onSubmit={handleSaveAccount} className="bg-white border border-[#E4E2E1] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EDED] pb-3">
            <div className="flex items-center space-x-2">
              <User size={18} className="text-[#56642B]" />
              <h2 className="text-sm font-black text-[#1B1C1C]">Account Details</h2>
            </div>
            <button
              type="submit"
              className="flex items-center space-x-1 bg-[#56642B] hover:bg-[#3f4b1e] text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#76786B] mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F6F3F2] border border-[#E4E2E1] rounded-2xl text-[#1B1C1C] font-bold focus:outline-none focus:border-[#8A9A5B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#76786B] mb-1">Location Address / Neighborhood</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F6F3F2] border border-[#E4E2E1] rounded-2xl text-[#1B1C1C] font-bold focus:outline-none focus:border-[#8A9A5B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-[#76786B] mb-1">Email Address</label>
              <input
                type="email"
                value={userEmail}
                readOnly
                className="w-full px-4 py-2.5 bg-[#F6F3F2] border border-[#E4E2E1] rounded-2xl text-[#76786B] font-bold cursor-not-allowed"
              />
            </div>
          </div>
        </form>

        {/* Proximity Discovery Filter */}
        <div className="bg-white border border-[#E4E2E1] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EDED] pb-3">
            <div className="flex items-center space-x-2">
              <Sliders size={18} className="text-[#56642B]" />
              <h2 className="text-sm font-black text-[#1B1C1C]">Marketplace Proximity Discovery Radius</h2>
            </div>
            <span className="text-xs font-black text-[#56642B] bg-[#8A9A5B]/20 px-3 py-1 rounded-full">
              {preferredRadius} km
            </span>
          </div>

          <p className="text-xs text-[#76786B]">
            Only listings within this distance will appear in your default search results and seller delivery feed.
          </p>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min={1}
              max={50}
              value={preferredRadius}
              onChange={(e) => setPreferredRadius(Number(e.target.value))}
              className="w-full accent-[#56642B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#76786B] font-bold">
              <span>1 km (Neighborhood Only)</span>
              <span>50 km (Citywide)</span>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-[#E4E2E1] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#F0EDED] pb-3">
            <Bell size={18} className="text-[#56642B]" />
            <h2 className="text-sm font-black text-[#1B1C1C]">Notification Preferences</h2>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { key: "orderUpdates", title: "Order Status Updates", desc: "Get notified when order status changes to accepted, out for delivery, or completed." },
              { key: "deliveryAlerts", title: "Live Seller Delivery Tracking Alerts", desc: "Receive real-time push alerts when seller enters your neighborhood." },
              { key: "chatMessages", title: "Order Chat Notifications", desc: "Instant alerts for direct messages between buyer and seller." },
            ].map((item) => {
              const isChecked = notifications[item.key as keyof typeof notifications];
              return (
                <div key={item.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F3F2]">
                  <div>
                    <span className="font-extrabold text-[#1B1C1C] block">{item.title}</span>
                    <span className="text-[11px] text-[#76786B]">{item.desc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))
                    }
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      isChecked ? "bg-[#56642B] justify-end" : "bg-[#C6C8B8] justify-start"
                    }`}
                  >
                    <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Log Out */}
        <div className="bg-white border border-[#E4E2E1] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#F0EDED] pb-3">
            <Shield size={18} className="text-[#56642B]" />
            <h2 className="text-sm font-black text-[#1B1C1C]">Security & Authentication</h2>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F3F2] text-xs">
            <div className="flex items-center space-x-3">
              <Key size={18} className="text-[#56642B]" />
              <div>
                <span className="font-extrabold text-[#1B1C1C]">Password & Security Keys</span>
                <span className="text-[11px] font-normal text-[#76786B] block">Managed securely via Auth provider</span>
              </div>
            </div>
            <button type="button" className="text-xs font-extrabold text-[#56642B] hover:underline cursor-pointer">
              Update Security
            </button>
          </div>
        </div>

      </div>

    </main>
  );
}
