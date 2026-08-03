"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-surface-dark text-white relative flex items-center justify-center py-2 px-4">
      <p className="text-xs sm:text-sm text-center pr-8 sm:pr-0">
        Free Delivery on Your First Order · Summer Sale Up To 30% Off · Limited Time!
      </p>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 text-white hover:text-gray-300 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
