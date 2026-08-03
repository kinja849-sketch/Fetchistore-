"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, MapPin, Sliders, Package, Store, Plus, Shield, Bell, CheckCircle2, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const { user } = useUser();
  const [preferredRadius, setPreferredRadius] = useState<number>(10);
  const [savedAddresses, setSavedAddresses] = useState([
    { id: "1", label: "Home", street: "742 Evergreen Terrace", city: "Springfield", postal: "97477", isDefault: true },
    { id: "2", label: "Work", street: "100 Industrial Parkway", city: "Springfield", postal: "97478", isDefault: false },
  ]);

  const userName = user?.fullName || "Alex Johnson";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "alex.johnson@example.com";
  const userAvatar = user?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-8">
      
      {/* User Info Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-brand/20 shadow-md">
            <Image src={userAvatar} alt={userName} fill className="object-cover" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{userName}</h1>
              <span className="bg-brand-light text-brand text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Buyer & Seller
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">{userEmail}</p>
            <div className="flex items-center text-xs text-brand font-bold mt-1">
              <MapPin size={13} className="mr-1" />
              <span>Springfield (Discovery Active)</span>
            </div>
          </div>
        </div>

        <Link
          href="/listings/new"
          className="flex items-center space-x-2 bg-brand text-white px-5 py-3 rounded-full text-xs font-extrabold shadow-lg shadow-brand/25 hover:bg-brand-dark transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Post New Item to Sell</span>
        </Link>
      </div>

      {/* Grid Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Proximity Radius Filter Setting */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Sliders className="text-brand" size={20} />
            <h2 className="text-base font-extrabold text-gray-900">
              Proximity Discovery Radius
            </h2>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            Filter all local marketplace listings by distance from your current location for fast seller door delivery.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-600">Preferred Search Radius</span>
              <span className="text-brand font-black text-sm">{preferredRadius} km</span>
            </div>

            <input
              type="range"
              min={1}
              max={50}
              value={preferredRadius}
              onChange={(e) => setPreferredRadius(Number(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>1 km (Strict Neighborhood)</span>
              <span>50 km (Citywide)</span>
            </div>
          </div>
        </div>

        {/* Saved Delivery Addresses */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="text-brand" size={20} />
              <h2 className="text-base font-extrabold text-gray-900">
                Delivery Addresses
              </h2>
            </div>
            <button className="text-xs font-bold text-brand hover:underline cursor-pointer">
              + Add New
            </button>
          </div>

          <div className="space-y-3">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-gray-900">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="bg-brand text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    {addr.street}, {addr.city} {addr.postal}
                  </p>
                </div>
                <CheckCircle2 size={16} className={addr.isDefault ? "text-brand" : "text-gray-300"} />
              </div>
            ))}
          </div>
        </div>

        {/* Seller Tools */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Store className="text-brand" size={20} />
            <h2 className="text-base font-extrabold text-gray-900">
              Seller Dashboard & Listings
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <Link
              href="/listings"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-brand-light hover:text-brand transition-colors font-bold text-gray-800"
            >
              <span>Manage My Listings</span>
              <ChevronRight size={16} />
            </Link>

            <Link
              href="/listings/new"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-brand-light hover:text-brand transition-colors font-bold text-gray-800"
            >
              <span>Create New Listing</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Account & Orders Shortcut */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Package className="text-brand" size={20} />
            <h2 className="text-base font-extrabold text-gray-900">
              Orders & Preferences
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <Link
              href="/orders"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-brand-light hover:text-brand transition-colors font-bold text-gray-800"
            >
              <span>View Active & Past Orders</span>
              <ChevronRight size={16} />
            </Link>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 text-gray-800 font-bold">
              <span>Notification Preferences</span>
              <Bell size={16} className="text-brand" />
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
