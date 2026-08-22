"use client";

import React from "react";
import { X } from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-context";
import { ClerkAuthForm } from "@/components/auth/clerk-auth-form";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-[440px] bg-[#FBF9F8] rounded-3xl shadow-2xl overflow-hidden border border-[#E5E7EB] p-4 sm:p-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 p-2 text-[#76786B] hover:text-[#1B1C1C] hover:bg-[#F0EDED] rounded-full transition-colors cursor-pointer"
          aria-label="Close authentication window"
        >
          <X size={20} />
        </button>

        <ClerkAuthForm isModal onSuccess={closeAuthModal} />
      </div>
    </div>
  );
}
