"use client";

import React from "react";
import { CheckCircle2, Truck, MapPin, PackageCheck, Navigation } from "lucide-react";

export type OrderStatus =
  | "pending"
  | "paid"
  | "cod_pending"
  | "accepted"
  | "out_for_delivery"
  | "nearby"
  | "delivered"
  | "completed"
  | "cancelled";

interface DeliveryControlPanelProps {
  currentStatus: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => void;
  onSimulateMovement?: () => void;
  sellerDistance?: number;
}

export function DeliveryControlPanel({
  currentStatus,
  onStatusChange,
  onSimulateMovement,
  sellerDistance = 2.4,
}: DeliveryControlPanelProps) {
  return (
    <div className="bg-white border border-brand/20 rounded-3xl p-5 shadow-lg shadow-brand/5 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-brand-light text-brand rounded-xl">
            <Truck size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Seller Delivery Control Panel</h3>
            <p className="text-[11px] text-gray-500">Fulfill & update order stage in real-time</p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-brand text-white shadow-sm">
          {currentStatus.replace("_", " ")}
        </span>
      </div>

      {/* Action Buttons for Sequential Order Status Transition */}
      <div className="flex flex-wrap gap-2.5 pt-1">
        {(currentStatus === "pending" || currentStatus === "paid" || currentStatus === "cod_pending") && (
          <button
            onClick={() => onStatusChange("accepted")}
            className="flex-1 min-w-[140px] bg-brand text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold hover:bg-brand-dark transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-brand/20 active:scale-95"
          >
            <CheckCircle2 size={15} />
            <span>Accept Order</span>
          </button>
        )}

        {currentStatus === "accepted" && (
          <button
            onClick={() => onStatusChange("out_for_delivery")}
            className="flex-1 min-w-[160px] bg-brand text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold hover:bg-brand-dark transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-brand/20 active:scale-95 animate-bounce"
          >
            <Truck size={15} />
            <span>Start Live Delivery</span>
          </button>
        )}

        {currentStatus === "out_for_delivery" && (
          <>
            <button
              onClick={() => onStatusChange("nearby")}
              className="flex-1 min-w-[130px] bg-amber-500 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold hover:bg-amber-600 transition-all flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
            >
              <MapPin size={15} />
              <span>Mark Nearby (&lt; 0.5km)</span>
            </button>

            {onSimulateMovement && (
              <button
                onClick={onSimulateMovement}
                className="bg-gray-900 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold hover:bg-black transition-all flex items-center space-x-1 active:scale-95"
                title="Simulate seller moving closer to buyer address"
              >
                <Navigation size={14} className="text-brand" />
                <span>Drive Closer ({sellerDistance.toFixed(1)} km)</span>
              </button>
            )}
          </>
        )}

        {currentStatus === "nearby" && (
          <button
            onClick={() => onStatusChange("delivered")}
            className="flex-1 min-w-[150px] bg-blue-600 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold hover:bg-blue-700 transition-all flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
          >
            <PackageCheck size={15} />
            <span>Confirm Hand-off / Delivered</span>
          </button>
        )}

        {currentStatus === "delivered" && (
          <button
            onClick={() => onStatusChange("completed")}
            className="flex-1 min-w-[150px] bg-green-600 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold hover:bg-green-700 transition-all flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
          >
            <CheckCircle2 size={15} />
            <span>Mark Order Completed</span>
          </button>
        )}

        {currentStatus === "completed" && (
          <div className="w-full text-center py-2 bg-green-50 text-green-700 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-1">
            <CheckCircle2 size={16} />
            <span>Order Completed & Delivered directly to Buyer</span>
          </div>
        )}
      </div>
    </div>
  );
}
