"use client";

import React from "react";
import Link from "next/link";
import { useUser, SignUpButton, SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const { user } = useUser();
  const isSignedIn = !!user;

  return (
    <section className="relative w-full bg-[#FBF9F8] min-h-0 md:min-h-[580px] lg:min-h-[660px] flex flex-col justify-start md:justify-center overflow-hidden py-3 sm:py-6 md:py-16">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#56642B]/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#929677]/10 blur-[100px] pointer-events-none -z-10" />

      <main className="w-full max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-center md:justify-between h-full py-1 sm:py-4 md:py-0 gap-4 sm:gap-6 md:gap-8 lg:gap-12 z-10 overflow-hidden">
        
        {/* Imagery Collage Section (Bento Grid) */}
        <div className="w-full md:w-1/2 bento-grid h-[40vh] min-h-[250px] max-h-[320px] md:h-[60vh] md:min-h-[350px] md:max-h-none animate-fade-in-up">
          {/* Bento Item 1 */}
          <div className="bento-item-1 rounded-[22px] md:rounded-3xl overflow-hidden shadow-xs relative group bg-[#F6F3F2] border border-[#E4E2E1]">
            <div
              className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80')",
              }}
            />
          </div>

          {/* Bento Item 2 */}
          <div className="bento-item-2 rounded-[22px] md:rounded-3xl overflow-hidden shadow-xs relative group bg-[#F6F3F2] border border-[#E4E2E1]">
            <div
              className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&auto=format&fit=crop&q=80')",
              }}
            />
          </div>

          {/* Bento Item 3 */}
          <div className="bento-item-3 rounded-[22px] md:rounded-3xl overflow-hidden shadow-xs relative group bg-[#F6F3F2] border border-[#E4E2E1]">
            <div
              className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80')",
              }}
            />
          </div>
        </div>

        {/* Content & Actions Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-3 sm:space-y-5 md:pl-6 animate-fade-in-up">
          
          <div className="space-y-1.5 sm:space-y-3 w-full">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1B1C1C] leading-[1.2] font-sans">
              Modern Craftsmanship, Near You.
            </h1>
            <p className="text-xs sm:text-base text-[#46483C] max-w-sm sm:max-w-lg mx-auto md:mx-0 leading-relaxed font-sans">
              Discover and sell premium new and second-hand goods with local delivery and live tracking.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="w-full flex flex-col items-center md:items-start space-y-2 sm:space-y-3 pt-1 sm:pt-2">
            {!isSignedIn ? (
              <>
                <SignUpButton mode="modal">
                  <button className="w-full max-w-xs md:max-w-sm bg-[#8A9A5B] text-[#253000] font-bold text-xs sm:text-sm py-3.5 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-[#D9EAA3] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                    <span>Get Started</span>
                    <ArrowRight size={16} />
                  </button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <button className="w-full max-w-xs md:max-w-sm text-[#46483C] font-semibold text-xs sm:text-sm py-2 px-6 sm:px-8 rounded-full hover:bg-[#F6F3F2] hover:text-[#56642B] transition-colors duration-200 cursor-pointer">
                    Already have an account? Sign In
                  </button>
                </SignInButton>
              </>
            ) : (
              <>
                <Link
                  href="/shop"
                  className="w-full max-w-xs md:max-w-sm bg-[#8A9A5B] text-[#253000] font-bold text-xs sm:text-sm py-3.5 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-[#D9EAA3] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-center shadow-xs"
                >
                  <span>Start Shopping</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/seller/listings/create"
                  className="w-full max-w-xs md:max-w-sm text-[#46483C] font-semibold text-xs sm:text-sm py-2 px-6 sm:px-8 rounded-full hover:bg-[#F6F3F2] hover:text-[#56642B] transition-colors duration-200 cursor-pointer text-center"
                >
                  List an Item
                </Link>
              </>
            )}
          </div>

        </div>

      </main>
    </section>
  );
}
