"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { DeliveryControlPanel, OrderStatus } from "@/components/seller/delivery-control-panel";
import { useAuth } from "@/lib/supabase/auth-context";
import { GoogleMap } from "@/components/maps/google-map";
import { Coordinates, estimateDeliveryEta } from "@/lib/geo";
import { useUserLocation } from "@/lib/hooks/use-user-location";
import { getDirectionsRoute, DirectionsResult } from "@/lib/directions";

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "ord_101";
  const { userProfile } = useAuth();
  const buyerFirstName = (userProfile?.fullName || "there").split(" ")[0];

  const { location: userLocation, refreshLocation } = useUserLocation();
  const buyerCoords: Coordinates | null = userLocation;

  const [orderStatus, setOrderStatus] = useState<OrderStatus>("out_for_delivery");
  const [distanceKm, setDistanceKm] = useState<number>(0.8);
  const [directionsInfo, setDirectionsInfo] = useState<DirectionsResult | null>(null);

  // Derive active seller position relative to buyer location
  const sellerCoords: Coordinates | null = useMemo(() => {
    return buyerCoords
      ? {
          lat: buyerCoords.lat + distanceKm * 0.007,
          lng: buyerCoords.lng - distanceKm * 0.007,
        }
      : null;
  }, [buyerCoords, distanceKm]);

  useEffect(() => {
    if (sellerCoords && buyerCoords) {
      getDirectionsRoute(sellerCoords, buyerCoords).then((res) => {
        setDirectionsInfo(res);
      });
    }
  }, [sellerCoords, buyerCoords]);

  const etaInfo = estimateDeliveryEta(distanceKm);
  const displayEtaText = directionsInfo?.durationText || etaInfo.text;
  const displayDistanceText = directionsInfo?.distanceText || `${distanceKm.toFixed(1)} km`;

  const [chatRole, setChatRole] = useState<"buyer" | "seller">("buyer");
  const [chatMessages, setChatMessages] = useState([
    { sender: "seller", text: `Hi ${buyerFirstName}! I've packed your items and I am currently heading to your home address.`, time: "2:14 PM" },
    { sender: "buyer", text: "Awesome! Thanks Marcus. Please leave it at the front door if I'm ringing down.", time: "2:16 PM" },
    { sender: "seller", text: "Got it! I am about 3 minutes away.", time: "2:20 PM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      { sender: chatRole, text: newMessage.trim(), time: "Just now" },
    ]);
    setNewMessage("");
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    setOrderStatus(newStatus);
    if (newStatus === "nearby") {
      setDistanceKm(0.3);
    } else if (newStatus === "delivered" || newStatus === "completed") {
      setDistanceKm(0.0);
    }
  };

  const handleSimulateMovement = () => {
    const nextDist = Math.max(0.1, Number((distanceKm - 0.3).toFixed(1)));
    setDistanceKm(nextDist);
    if (nextDist <= 0.4 && orderStatus === "out_for_delivery") {
      setOrderStatus("nearby");
    }
  };

  const steps = [
    { title: "Order Placed & Paid", desc: "Payment verified by system", key: "paid" as OrderStatus },
    { title: "Accepted by Seller", desc: "Seller packed items", key: "accepted" as OrderStatus },
    { title: "Out for Delivery", desc: "Seller in transit with live map", key: "out_for_delivery" as OrderStatus },
    { title: "Nearby", desc: "Arriving within 5 mins (< 0.5km)", key: "nearby" as OrderStatus },
    { title: "Delivered & Completed", desc: "Direct to door confirmation", key: "completed" as OrderStatus },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-3">
          <Link href="/orders" className="p-2 text-gray-500 hover:text-brand bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Order #{orderId} Tracking
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Live seller location & direct order-scoped chat
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="bg-brand text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-md shadow-brand/20 animate-pulse">
            {orderStatus.replace("_", " ")}
          </span>
          <Link
            href={`/orders/${orderId}/chat`}
            className="text-xs font-extrabold text-[#161F00] bg-[#8A9A5B] px-3.5 py-1.5 rounded-full hover:bg-[#D9EAA3] transition-colors flex items-center gap-1 shadow-xs"
          >
            <MessageSquare size={14} />
            <span>Chat</span>
          </Link>
          <Link
            href="/seller/orders"
            className="text-xs font-extrabold text-[#56642B] bg-[#8A9A5B]/20 px-3.5 py-1.5 rounded-full border border-[#8A9A5B]/30 hover:bg-[#56642B] hover:text-white transition-colors"
          >
            Seller Portal →
          </Link>
        </div>
      </div>

      {/* Interactive Delivery Control Panel */}
      <DeliveryControlPanel
        currentStatus={orderStatus}
        onStatusChange={handleStatusChange}
        onSimulateMovement={orderStatus === "out_for_delivery" ? handleSimulateMovement : undefined}
        sellerDistance={distanceKm}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Map & Delivery Status Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Delivery Map Box */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-gray-200">
            {/* Overlay Status Badge */}
            <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-100 shadow-md flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#56642B] rounded-full animate-ping" />
              <div>
                <div className="text-[11px] font-extrabold text-gray-900">Seller Live GPS Tracking</div>
                <div className="text-[10px] text-[#56642B] font-extrabold">
                  {distanceKm > 0
                    ? `${displayDistanceText} away • ${displayEtaText}`
                    : "Arrived at buyer door"}
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <GoogleMap
              center={buyerCoords}
              zoom={14}
              height="h-72 sm:h-80"
              showRoute={true}
              interactive={true}
              onRetryLocation={refreshLocation}
              markers={
                buyerCoords && sellerCoords
                  ? [
                      {
                        id: "buyer-destination",
                        position: buyerCoords,
                        title: "Buyer Home Address",
                        type: "buyer",
                      },
                      {
                        id: "seller-delivery-vehicle",
                        position: sellerCoords,
                        title: `Marcus (Seller) — ${displayDistanceText} away`,
                        type: "seller",
                      },
                    ]
                  : []
              }
            />
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
              Delivery Stage Timeline
            </h2>

            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
              {steps.map((step) => {
                const orderSequence: OrderStatus[] = [
                  "paid",
                  "accepted",
                  "out_for_delivery",
                  "nearby",
                  "delivered",
                  "completed",
                ];
                const currentIdx = orderSequence.indexOf(orderStatus);
                const stepIdx = orderSequence.indexOf(step.key);
                const statusState = currentIdx > stepIdx ? "completed" : currentIdx === stepIdx ? "current" : "pending";

                return (
                  <div key={step.key} className="flex items-start space-x-3.5 relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        statusState === "completed"
                          ? "bg-[#56642B] text-white"
                          : statusState === "current"
                          ? "bg-[#8A9A5B] text-white ring-4 ring-[#8A9A5B]/20"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">{step.title}</h4>
                      <p className="text-xs text-gray-500 font-medium">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Scoped Chat (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-extrabold text-gray-900">Order-Scoped Seller Chat</h3>
              <div className="flex bg-gray-100 p-0.5 rounded-full text-[10px] font-bold">
                <button
                  onClick={() => setChatRole("buyer")}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    chatRole === "buyer" ? "bg-[#56642B] text-white" : "text-gray-600"
                  }`}
                >
                  As Buyer
                </button>
                <button
                  onClick={() => setChatRole("seller")}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    chatRole === "seller" ? "bg-[#56642B] text-white" : "text-gray-600"
                  }`}
                >
                  As Seller
                </button>
              </div>
            </div>

            <div className="h-64 overflow-y-auto space-y-3 pr-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === "buyer" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium ${
                      msg.sender === "buyer"
                        ? "bg-[#8A9A5B] text-white rounded-br-none"
                        : "bg-gray-100 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-gray-100">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message as ${chatRole}...`}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#8A9A5B]"
              />
              <button
                type="submit"
                className="p-2 bg-[#56642B] text-white rounded-full hover:bg-[#8A9A5B] transition-colors cursor-pointer"
              >
                <MessageSquare size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
