"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { useAuth } from "@/lib/supabase/auth-context";
import { useListings } from "@/lib/listings-context";

type ProfileSubView = "main" | "active_listings" | "sold_items" | "payments_balance" | "settings_privacy";

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { userProfile, updateProfile } = useAuth();
  const { listings } = useListings();
  const [activeTab, setActiveTab] = useState<ProfileSubView>("main");
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Derived user identity strictly from login or saved profile edit
  const userLoginName = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0];
  const identityName = userProfile.fullName || userLoginName || "User";
  const currentAvatar = mounted ? userProfile.avatarUrl : "";

  // Profile Form State
  const [editName, setEditName] = useState(identityName);
  const [editAvatar, setEditAvatar] = useState(currentAvatar);
  const [editLocation, setEditLocation] = useState(userProfile.location || "Greenpoint, NY");
  const [editRadius, setEditRadius] = useState(userProfile.radiusKm || 5);
  const [editPhone, setEditPhone] = useState(userProfile.phone || "+1 (555) 234-5678");
  const [editBio, setEditBio] = useState(userProfile.bio || "Pre-loved fashion & sustainable home decor enthusiast.");

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setEditAvatar(dataUrl);
          updateProfile({ avatarUrl: dataUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setEditAvatar("");
    updateProfile({ avatarUrl: "" });
  };

  const handleOpenEdit = () => {
    setEditName(userProfile.fullName || userLoginName || "");
    setEditAvatar(userProfile.avatarUrl || "");
    setEditLocation(userProfile.location || editLocation);
    setEditRadius(userProfile.radiusKm || editRadius);
    setEditPhone(userProfile.phone || editPhone);
    setEditBio(userProfile.bio || editBio);
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: editName,
      avatarUrl: editAvatar,
      location: editLocation,
      radiusKm: editRadius,
      phone: editPhone,
      bio: editBio,
    });
    setIsEditing(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Sub-view 1: Active Listings
  if (activeTab === "active_listings") {
    return (
      <div className="w-full flex-1 p-4 space-y-4 bg-[#FBF9F8]">
        <div className="flex items-center justify-between border-b border-[#E4E2E1] pb-3">
          <button
            onClick={() => setActiveTab("main")}
            className="flex items-center gap-1 text-xs font-bold text-[#56642B] bg-[#F0EDED] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#E4E2E1]"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Profile
          </button>
          <h2 className="text-base font-extrabold text-[#1B1C1C]">Active Listings</h2>
          <Link
            href="/seller/listings/create"
            className="text-xs font-extrabold text-white bg-[#56642B] px-3 py-1.5 rounded-full"
          >
            + New
          </Link>
        </div>

        <div className="space-y-3">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-[#F6F3F2] p-3 rounded-3xl border border-[#E4E2E1] flex gap-3 items-center"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-16 h-16 rounded-2xl object-cover bg-[#E4E2E1]"
              />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1B1C1C]">{item.title}</h4>
                <p className="text-[10px] text-[#76786B]">{item.location} • {item.condition.replace("_", " ")}</p>
                <span className="text-xs font-black text-[#56642B]">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <span className="text-[10px] font-extrabold bg-[#8A9A5B]/20 text-[#56642B] px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sub-view 2: Sold Items
  if (activeTab === "sold_items") {
    return (
      <div className="w-full flex-1 p-4 space-y-4 bg-[#FBF9F8]">
        <div className="flex items-center justify-between border-b border-[#E4E2E1] pb-3">
          <button
            onClick={() => setActiveTab("main")}
            className="flex items-center gap-1 text-xs font-bold text-[#56642B] bg-[#F0EDED] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#E4E2E1]"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Profile
          </button>
          <h2 className="text-base font-extrabold text-[#1B1C1C]">Sold Items History</h2>
        </div>

        <div className="bg-[#56642B] text-white p-4 rounded-3xl space-y-1 shadow-sm">
          <p className="text-xs opacity-80 uppercase tracking-wider font-bold">
            Total Seller Sales
          </p>
          <h3 className="text-2xl font-black">$412.50</h3>
          <p className="text-[10px] opacity-90">6 local items delivered to buyers</p>
        </div>

        <div className="space-y-3">
          {[
            {
              id: "si1",
              title: "Vintage Linen Coat",
              price: 140.0,
              buyer: "Sarah K.",
              date: "Aug 2, 2026",
              imageUrl:
                "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=400&q=80",
            },
            {
              id: "si2",
              title: "Reclaimed Wood Stool",
              price: 195.0,
              buyer: "Marcus L.",
              date: "Jul 28, 2026",
              imageUrl:
                "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=400&q=80",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="bg-[#F6F3F2] p-3 rounded-3xl border border-[#E4E2E1] flex gap-3 items-center"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-16 h-16 rounded-2xl object-cover bg-[#E4E2E1]"
              />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1B1C1C]">{item.title}</h4>
                <p className="text-[10px] text-[#76786B]">
                  Delivered to {item.buyer} on {item.date}
                </p>
                <span className="text-xs font-black text-[#56642B]">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <span className="text-[10px] font-extrabold bg-[#56642B] text-white px-2.5 py-1 rounded-full">
                Delivered ✓
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sub-view 3: Payments & Balance
  if (activeTab === "payments_balance") {
    return (
      <div className="w-full flex-1 p-4 space-y-4 bg-[#FBF9F8]">
        <div className="flex items-center justify-between border-b border-[#E4E2E1] pb-3">
          <button
            onClick={() => setActiveTab("main")}
            className="flex items-center gap-1 text-xs font-bold text-[#56642B] bg-[#F0EDED] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#E4E2E1]"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Profile
          </button>
          <h2 className="text-base font-extrabold text-[#1B1C1C]">Payments & Balance</h2>
        </div>

        <div className="bg-[#8A9A5B] text-[#161F00] p-5 rounded-3xl space-y-2 shadow-sm">
          <p className="text-xs font-bold opacity-80 uppercase tracking-wider">
            Available Earnings Balance
          </p>
          <h3 className="text-3xl font-black">$285.00</h3>
          <button className="bg-[#56642B] text-white text-xs font-bold py-2 px-4 rounded-full hover:bg-[#161F00] transition-all cursor-pointer">
            Payout to Bank Account
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#56642B]">
            Saved Payment Methods
          </h4>

          <div className="bg-[#F6F3F2] p-3.5 rounded-3xl border border-[#E4E2E1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#56642B] text-[24px]">
                credit_card
              </span>
              <div>
                <p className="text-xs font-bold text-[#1B1C1C]">Visa ending in 4242</p>
                <p className="text-[10px] text-[#76786B]">Expires 12/28 • Primary Card</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#56642B] text-white px-2 py-0.5 rounded-full">
              Default
            </span>
          </div>

          <div className="bg-[#F6F3F2] p-3.5 rounded-3xl border border-[#E4E2E1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7D562D] text-[24px]">
                account_balance
              </span>
              <div>
                <p className="text-xs font-bold text-[#1B1C1C]">Chase Checking ****9821</p>
                <p className="text-[10px] text-[#76786B]">Payout Bank</p>
              </div>
            </div>
            <button className="text-xs font-bold text-[#56642B] hover:underline cursor-pointer">Manage</button>
          </div>
        </div>
      </div>
    );
  }

  // Main Profile View
  return (
    <div className="w-full flex-1 p-4 space-y-5 bg-[#FBF9F8] relative">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[110] bg-[#56642B] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* User Identity Section */}
      <div className="flex flex-col items-center text-center space-y-3 py-2">
        <div className="relative">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Profile Photo"
              className="w-24 h-24 rounded-full object-cover shadow-md ring-4 ring-[#8A9A5B]/30"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#F6F3F2] border-2 border-dashed border-[#C6C8B8] flex items-center justify-center text-[#76786B] shadow-xs">
              <span className="material-symbols-outlined text-[36px]">person</span>
            </div>
          )}
          <button
            onClick={handleOpenEdit}
            title="Edit Profile"
            className="absolute bottom-0 right-0 bg-[#56642B] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-[#3f4b1e] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-extrabold text-[#1B1C1C]">
              {identityName}
            </h2>
            <button
              onClick={handleOpenEdit}
              className="text-xs font-extrabold text-[#56642B] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              Edit
            </button>
          </div>
          <p className="text-xs text-[#76786B] max-w-xs mx-auto italic">{userProfile.bio || editBio}</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F0EDED] text-[#56642B] px-3.5 py-1.5 rounded-full text-xs font-bold">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span>{userProfile.location || editLocation} • Preferred Radius {userProfile.radiusKm || editRadius} km</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleOpenEdit}
            className="px-5 py-2 bg-[#56642B] text-white rounded-full text-xs font-bold shadow-xs hover:bg-[#3f4b1e] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Bento Sections */}
      <div className="grid grid-cols-1 gap-3">
        {/* Selling Bento */}
        <div className="bg-[#F6F3F2] p-4 rounded-3xl border border-[#E4E2E1] space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8A9A5B]/20 text-[#56642B] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </div>
            <h3 className="text-sm font-extrabold text-[#1B1C1C]">Selling Dashboard</h3>
          </div>

          <div className="space-y-1 pt-1">
            <Link
              href="/seller/listings"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#F0EDED] transition-colors border border-[#E4E2E1]/60 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#56642B] text-[18px]">
                  list_alt
                </span>
                <span className="text-xs font-bold text-[#1B1C1C]">
                  Active Listings (2)
                </span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#76786B]">
                chevron_right
              </span>
            </Link>

            <Link
              href="/seller/sold"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#F0EDED] transition-colors border border-[#E4E2E1]/60 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#56642B] text-[18px]">
                  check_circle
                </span>
                <span className="text-xs font-bold text-[#1B1C1C]">
                  Sold Items History ($412.50)
                </span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#76786B]">
                chevron_right
              </span>
            </Link>
          </div>
        </div>

        {/* Payments Bento */}
        <div className="bg-[#F6F3F2] p-4 rounded-3xl border border-[#E4E2E1] space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFCA98]/40 text-[#7D562D] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <h3 className="text-sm font-extrabold text-[#1B1C1C]">Payments & Balance</h3>
          </div>

          <Link
            href="/profile/payments"
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#F0EDED] transition-colors border border-[#E4E2E1]/60 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7D562D] text-[18px]">
                account_balance_wallet
              </span>
              <div>
                <p className="text-xs font-bold text-[#1B1C1C]">
                  Balance: $285.00 Available
                </p>
                <p className="text-[10px] text-[#76786B]">Cards, Bank & Payout settings</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#76786B]">
              chevron_right
            </span>
          </Link>
        </div>

        {/* Settings Bento */}
        <div className="bg-[#F6F3F2] p-4 rounded-3xl border border-[#E4E2E1] space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E4E2E1] text-[#46483C] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </div>
            <h3 className="text-sm font-extrabold text-[#1B1C1C]">Settings & Privacy</h3>
          </div>

          <Link
            href="/profile/settings"
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#F0EDED] transition-colors border border-[#E4E2E1]/60 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#46483C] text-[18px]">
                security
              </span>
              <span className="text-xs font-bold text-[#1B1C1C]">
                Account & Privacy Preferences
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#76786B]">
              chevron_right
            </span>
          </Link>
        </div>

        {/* Bottom Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full mt-2 bg-[#F0EDED] hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white transition-colors duration-200 py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer border border-[#E4E2E1]"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-5 border border-[#E4E2E1] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#F0EDED] pb-3">
              <h3 className="text-base font-extrabold text-[#1B1C1C] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#56642B]">person_edit</span>
                Edit Profile Information
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Profile Avatar Upload */}
              <div>
                <label className="block font-bold text-[#1B1C1C] mb-2">Profile Photo</label>

                <div className="flex items-center gap-3 mb-3">
                  {editAvatar ? (
                    <img
                      src={editAvatar}
                      alt="Avatar preview"
                      className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-[#8A9A5B]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#F6F3F2] border border-dashed border-[#C6C8B8] flex items-center justify-center text-[#76786B]">
                      <span className="material-symbols-outlined text-[24px]">person</span>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col gap-1.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-[#56642B] text-white text-xs font-bold py-2.5 px-3 rounded-xl hover:bg-[#3f4b1e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">upload</span>
                      <span>{editAvatar ? "Change Photo from Device" : "Upload Photo from Device"}</span>
                    </button>

                    {editAvatar && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="w-full bg-[#F0EDED] text-[#ba1a1a] text-xs font-bold py-1.5 px-3 rounded-xl hover:bg-[#ba1a1a] hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="Or enter custom image URL"
                  className="w-full px-3.5 py-2 bg-[#F6F3F2] border border-[#E4E2E1] rounded-xl text-xs text-[#1B1C1C] focus:outline-none focus:border-[#56642B]"
                />
              </div>
              {/* Full Name */}
              <div>
                <label className="block font-bold text-[#1B1C1C] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F6F3F2] border border-[#E4E2E1] rounded-xl text-xs font-bold text-[#1B1C1C] focus:outline-none focus:border-[#56642B]"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-bold text-[#1B1C1C] mb-1">Location / Neighborhood</label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g. Greenpoint, NY"
                  className="w-full px-3.5 py-2.5 bg-[#F6F3F2] border border-[#E4E2E1] rounded-xl text-xs font-bold text-[#1B1C1C] focus:outline-none focus:border-[#56642B]"
                />
              </div>

              {/* Radius Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-[#1B1C1C]">Discovery Radius (km)</label>
                  <span className="font-extrabold text-[#56642B] bg-[#8A9A5B]/20 px-2.5 py-0.5 rounded-full text-[11px]">
                    {editRadius} km
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={editRadius}
                  onChange={(e) => setEditRadius(Number(e.target.value))}
                  className="w-full accent-[#56642B] cursor-pointer"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-bold text-[#1B1C1C] mb-1">Phone Number (Delivery Notifications)</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F6F3F2] border border-[#E4E2E1] rounded-xl text-xs font-bold text-[#1B1C1C] focus:outline-none focus:border-[#56642B]"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block font-bold text-[#1B1C1C] mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F6F3F2] border border-[#E4E2E1] rounded-xl text-xs text-[#1B1C1C] focus:outline-none focus:border-[#56642B]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-2 pt-3 border-t border-[#F0EDED]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 bg-[#F0EDED] text-[#1B1C1C] rounded-full font-bold text-xs hover:bg-[#E4E2E1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#56642B] text-white rounded-full font-bold text-xs hover:bg-[#3f4b1e] cursor-pointer shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
