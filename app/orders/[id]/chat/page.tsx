"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ChatMessage {
  id: string;
  sender: "seller" | "buyer" | "system";
  text: string;
  time: string;
}

export default function DeliveryChatPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = (params.id as string) || "1";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "system",
      text: "Order #8892-FZ is accepted by Clara Studio. Seller delivery initiated.",
      time: "10:15 AM",
    },
    {
      id: "m2",
      sender: "seller",
      text: "Hi! I am en route with your Hand-thrown Ceramic Lamp. I should arrive in about 20 minutes.",
      time: "10:30 AM",
    },
    {
      id: "m3",
      sender: "buyer",
      text: "Great! Please ring the apartment 4B doorbell when you arrive.",
      time: "10:32 AM",
    },
    {
      id: "m4",
      sender: "seller",
      text: "Will do! I am near Greenpoint Ave now.",
      time: "10:40 AM",
    },
  ]);

  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "buyer",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#FBF9F8] h-screen max-h-screen relative overflow-hidden">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-[#FBF9F8]/95 backdrop-blur-md px-4 py-3 border-b border-[#E4E2E1] flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="text-center">
          <h1 className="text-xs font-extrabold text-[#1B1C1C]">Clara Studio (Seller)</h1>
          <p className="text-[10px] text-[#56642B] font-bold">Order #{orderId} • Out for Delivery</p>
        </div>

        <button
          onClick={() => router.push("/orders")}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0EDED] text-[#56642B] hover:bg-[#E4E2E1] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
        </button>
      </header>

      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <div key={msg.id} className="text-center py-2">
                <span className="text-[10px] font-bold bg-[#8A9A5B]/15 text-[#56642B] px-3 py-1 rounded-full border border-[#8A9A5B]/30">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isBuyer = msg.sender === "buyer";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBuyer ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isBuyer
                    ? "bg-[#56642B] text-white rounded-br-none"
                    : "bg-[#F0EDED] text-[#1B1C1C] rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-[#76786B] mt-1 px-1">{msg.time}</span>
            </div>
          );
        })}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-[#FBF9F8]/95 backdrop-blur-xl border-t border-[#E4E2E1] p-3 z-50 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message to seller..."
          className="flex-1 bg-[#F0EDED] text-xs font-medium py-3 px-4 rounded-full border border-transparent focus:border-[#8A9A5B] focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-[#8A9A5B] text-[#161F00] flex items-center justify-center hover:bg-[#D9EAA3] transition-all cursor-pointer flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>
    </div>
  );
}
