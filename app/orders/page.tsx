"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getUserOrders } from "@/app/actions/orders";
import { Order } from "@/lib/supabase/types";

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      const activeUserId = user?.id || "demo-buyer-1";
      const res = await getUserOrders(activeUserId);
      setOrders(res.data || []);
      setLoading(false);
    }
    loadOrders();
  }, [user]);

  return (
    <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 bg-[#FBF9F8]">
      <div className="flex justify-between items-center border-b border-[#E4E2E1] pb-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#56642B]">Orders & Tracking</h1>
          <p className="text-xs text-[#76786B]">Live seller-to-door delivery tracking</p>
        </div>
        <span className="text-xs font-bold bg-[#8A9A5B]/20 text-[#56642B] px-3 py-1 rounded-full">
          {orders.length} {orders.length === 1 ? "Active Order" : "Orders"}
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#76786B] text-sm bg-white rounded-3xl border border-[#E4E2E1]">
          Loading your active orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center text-[#76786B] text-sm bg-white rounded-3xl border border-[#E4E2E1] space-y-4 p-8">
          <p className="font-extrabold text-base text-[#1B1C1C]">No active orders found</p>
          <p className="text-xs text-[#76786B]">When you place an order, seller delivery tracking will appear here.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#56642B] text-white px-6 py-2.5 rounded-full text-xs font-extrabold shadow-sm hover:bg-[#8A9A5B] hover:text-[#1B1C1C] transition-all"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => {
            const shortId = order.id.slice(0, 8);
            const statusLabel = (order.status || "pending").replace("_", " ");
            const total = Number(order.total || 0).toFixed(2);

            return (
              <div key={order.id} className="space-y-3">
                <div className="bg-[#F6F3F2] p-4 rounded-3xl border border-[#E4E2E1] space-y-3 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-extrabold text-[#76786B] uppercase tracking-wider">
                        Order #{shortId}
                      </p>
                      <h2 className="text-base font-extrabold text-[#1B1C1C] capitalize">
                        {statusLabel}
                      </h2>
                      <p className="text-xs text-[#56642B] font-bold">
                        Total: ${total}
                      </p>
                    </div>
                    <Link
                      href={`/orders/${order.id}/chat`}
                      className="px-3 py-1.5 rounded-full bg-[#8A9A5B] text-[#161F00] font-extrabold text-xs flex items-center gap-1 hover:bg-[#D9EAA3] transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      Message Seller
                    </Link>
                  </div>

                  {order.delivery_address && (
                    <div className="bg-white p-3 rounded-2xl border border-[#E4E2E1]/60 text-xs space-y-1">
                      <p className="font-extrabold text-[#1B1C1C]">
                        {(order.delivery_address as Record<string, string>).fullName || (order.delivery_address as Record<string, string>).address_line1 || "Delivery Recipient"}
                      </p>
                      <p className="text-[11px] text-[#76786B]">
                        {(order.delivery_address as Record<string, string>).street || (order.delivery_address as Record<string, string>).address_line1}, {order.delivery_address.city}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex justify-end gap-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="bg-[#56642B] text-white text-xs font-extrabold px-4 py-2 rounded-full hover:bg-[#8A9A5B] transition-all"
                    >
                      View Order & Live Map →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
