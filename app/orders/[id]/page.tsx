"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Truck, MapPin, CheckCircle2, MessageSquare, Send, ArrowLeft, Navigation, ShieldCheck, UserCheck, RefreshCw } from "lucide-react";
import { DeliveryControlPanel, OrderStatus } from "@/components/seller/delivery-control-panel";

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = (params.id as string) || "ord_101";

  const [orderStatus, setOrderStatus] = useState<OrderStatus>("out_for_delivery");
  const [distanceKm, setDistanceKm] = useState<number>(0.8);
  const [chatRole, setChatRole] = useState<"buyer" | "seller">("buyer");
  const [chatMessages, setChatMessages] = useState([
    { sender: "seller", text: "Hi Alex! I've packed your items and I am currently heading to your home address.", time: "2:14 PM" },
    { sender: "buyer", text: "Awesome! Thanks Marcus. Please leave it at the front door if I'm ringing down.", time: "2:16 PM" },
    { sender: "seller", text: "Got it! I am about 3 minutes away near Evergreen Terrace.", time: "2:20 PM" },
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

  // Timeline steps computation based on canonical status machine
  const getStepStatus = (stepKey: OrderStatus) => {
    const orderSequence: OrderStatus[] = [
      "paid",
      "accepted",
      "out_for_delivery",
      "nearby",
      "delivered",
      "completed",
    ];

    const currentIdx = orderSequence.indexOf(orderStatus);
    const stepIdx = orderSequence.indexOf(stepKey);

    if (currentIdx > stepIdx) return "completed";
    if (currentIdx === stepIdx) return "current";
    return "pending";
  };

  const steps = [
    { title: "Order Placed & Paid", desc: "Payment verified by system", key: "paid" as OrderStatus },
    { title: "Accepted by Seller", desc: "Seller packed items", key: "accepted" as OrderStatus },
    { title: "Out for Delivery", desc: "Seller in transit with live map", key: "out_for_delivery" as OrderStatus },
    { title: "Nearby", desc: "Arriving within 5 mins (< 0.5km)", key: "nearby" as OrderStatus },
    { title: "Delivered & Completed", desc: "Direct to door confirmation", key: "completed" as OrderStatus },
  ];

  const etaMinutes = Math.max(1, Math.round(distanceKm * 4));

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-8">
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
            href="/seller/orders"
            className="text-xs font-extrabold text-brand bg-brand-light px-3.5 py-1.5 rounded-full border border-brand/20 hover:bg-brand hover:text-white transition-colors"
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
          <div className="relative w-full h-72 sm:h-80 bg-gray-900 rounded-3xl overflow-hidden shadow-lg border border-gray-200">
            {/* Map background image mock */}
            <Image
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1000&auto=format&fit=crop&q=80"
              alt="Live delivery map"
              fill
              className="object-cover opacity-60"
            />

            {/* Map Overlay Badge */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-100 shadow-md flex items-center space-x-2">
              <div className="w-3 h-3 bg-brand rounded-full animate-ping" />
              <div>
                <div className="text-[11px] font-extrabold text-gray-900">Seller Live GPS Location</div>
                <div className="text-[10px] text-brand font-bold">
                  {distanceKm > 0 ? `${distanceKm} km away • ETA ${etaMinutes} mins` : "Arrived at buyer door"}
                </div>
              </div>
            </div>

            {/* Delivery Pins Visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex flex-col items-center animate-bounce">
                <div className="bg-brand text-white p-2.5 rounded-full shadow-2xl">
                  <Truck size={22} />
                </div>
                <span className="bg-black/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md mt-1">
                  Marcus (Seller - Direct Delivery)
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
              Delivery Stage Timeline
            </h2>

            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
              {steps.map((step, idx) => {
                const statusState = getStepStatus(step.key);
                return (
                  <div key={idx} className="flex items-start space-x-4 relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        statusState === "completed"
                          ? "bg-green-600 text-white shadow-sm"
                          : statusState === "current"
                          ? "bg-brand text-white shadow-md shadow-brand/30 animate-pulse"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {statusState === "completed" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-extrabold ${
                          statusState === "current" ? "text-brand" : "text-gray-900"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Seller Direct Chat & Order Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order-Scoped Seller Chat */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col h-[420px]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="text-brand" size={18} />
                <div>
                  <h2 className="text-sm font-extrabold text-gray-900">Direct Order Chat</h2>
                  <p className="text-[10px] text-gray-500">Order-scoped chat between Buyer & Seller</p>
                </div>
              </div>

              {/* Chat Role Toggle for Testing */}
              <button
                onClick={() => setChatRole(chatRole === "buyer" ? "seller" : "buyer")}
                className="text-[10px] bg-gray-100 hover:bg-brand-light hover:text-brand text-gray-700 font-extrabold px-2.5 py-1 rounded-full border border-gray-200 transition-colors flex items-center space-x-1"
                title="Toggle messaging perspective"
              >
                <UserCheck size={12} />
                <span>As: {chatRole === "buyer" ? "Buyer" : "Seller"}</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === "buyer" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[9px] font-bold text-gray-400 mb-0.5 px-1 uppercase tracking-wider">
                    {msg.sender}
                  </span>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                      msg.sender === "buyer"
                        ? "bg-brand text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-900 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Form */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 border-t border-gray-100 pt-3">
              <input
                type="text"
                placeholder={`Message as ${chatRole}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs focus:ring-2 focus:ring-brand focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 bg-brand text-white rounded-full hover:bg-brand-dark transition-transform active:scale-95 shadow-sm"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Delivery Summary Info Box */}
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 space-y-3 text-xs">
            <h3 className="font-extrabold text-gray-900 text-sm">Delivery & Fulfillment Details</h3>
            <div className="space-y-1.5 text-gray-600">
              <p><span className="font-bold text-gray-800">Destination:</span> 742 Evergreen Terrace, Springfield</p>
              <p><span className="font-bold text-gray-800">Payment:</span> Stripe Card ($179.98)</p>
              <p><span className="font-bold text-gray-800">Delivery Method:</span> Seller Self-Delivery to Door</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
