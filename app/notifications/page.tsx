"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Package, Truck, MessageSquare, Tag, CheckCircle2, Trash2 } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "delivery" | "order" | "chat" | "promo";
  read: boolean;
  link: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Driver is nearby!",
    message: "Your seller is 0.5 km away with your order #ORD-101.",
    time: "5m ago",
    type: "delivery",
    read: false,
    link: "/orders/ord-101",
  },
  {
    id: "notif-2",
    title: "Order Accepted",
    message: "Seller accepted your order for Essential Hoodie.",
    time: "25m ago",
    type: "order",
    read: false,
    link: "/orders/ord-101",
  },
  {
    id: "notif-3",
    title: "New Message from Seller",
    message: "'I am heading out to deliver your item now!'",
    time: "1h ago",
    type: "chat",
    read: true,
    link: "/orders/ord-101/chat",
  },
  {
    id: "notif-4",
    title: "Weekly Proximity Deals",
    message: "Check out 12 new pre-loved items within 3 km of your location.",
    time: "1d ago",
    type: "promo",
    read: true,
    link: "/shop",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "delivery":
        return <Truck className="w-5 h-5 text-[#56642B]" />;
      case "order":
        return <Package className="w-5 h-5 text-[#7D562D]" />;
      case "chat":
        return <MessageSquare className="w-5 h-5 text-[#5C6145]" />;
      case "promo":
        return <Tag className="w-5 h-5 text-[#8A9A5B]" />;
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between border-b border-[#E4E2E1] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#8A9A5B]/15 flex items-center justify-center text-[#56642B]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1B1C1C] tracking-tight">Notifications</h1>
            <p className="text-xs text-[#46483C]">Delivery stage alerts, messages & order updates</p>
          </div>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="text-xs font-semibold text-[#56642B] hover:underline cursor-pointer"
            >
              Mark read
            </button>
            <span className="text-[#C6C8B8]">|</span>
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-[#BA1A1A] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F0EDED] text-[#76786B] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1B1C1C]">You&apos;re all caught up!</h3>
          <p className="text-xs text-[#46483C]">No new notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Link
              key={notif.id}
              href={notif.link}
              className={`block p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] ${
                notif.read
                  ? "bg-[#FBF9F8] border-[#E4E2E1]"
                  : "bg-[#F0EDED]/80 border-[#8A9A5B]/40 shadow-2xs"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#F6F3F2] flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-extrabold text-[#1B1C1C] truncate">{notif.title}</h4>
                    <span className="text-[11px] font-medium text-[#76786B] shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-xs text-[#46483C] mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                </div>

                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#56642B] shrink-0 mt-1.5" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
