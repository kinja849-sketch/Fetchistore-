"use client";

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function UnauthenticatedWelcome() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between p-5 relative overflow-hidden bg-[#FBF9F8]">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#56642b]/10 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8a9a5b]/10 blur-[90px] pointer-events-none" />

      {/* Bento Grid Imagery Collage */}
      <div className="w-full bento-grid my-4 animate-fade-in-up">
        <div className="bento-item-1 rounded-3xl overflow-hidden shadow-sm relative group bg-[#F0EDED]">
          <div
            className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80')",
            }}
          />
        </div>
        <div className="bento-item-2 rounded-3xl overflow-hidden shadow-sm relative group bg-[#F0EDED]">
          <div
            className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80')",
            }}
          />
        </div>
        <div className="bento-item-3 rounded-3xl overflow-hidden shadow-sm relative group bg-[#F0EDED]">
          <div
            className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80')",
            }}
          />
        </div>
      </div>

      {/* Content & Actions */}
      <div className="w-full text-center space-y-4 my-4 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-[#1B1C1C] tracking-tight leading-tight">
          Modern Craftsmanship, Near You.
        </h1>
        <p className="text-base text-[#46483C] max-w-md mx-auto">
          Discover and sell pre-loved and new goods with seller-to-door delivery and live tracking.
        </p>

        <div className="pt-2 flex flex-col items-center gap-3 w-full">
          <SignUpButton mode="modal">
            <button className="w-full max-w-xs bg-[#8A9A5B] text-[#161F00] font-bold py-3.5 px-6 rounded-full hover:bg-[#D9EAA3] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98">
              <span>Get Started</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </SignUpButton>

          <SignInButton mode="modal">
            <button className="w-full max-w-xs text-[#46483C] font-semibold py-2.5 px-6 rounded-full hover:bg-[#F0EDED] transition-colors cursor-pointer text-sm">
              Already have an account? Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
