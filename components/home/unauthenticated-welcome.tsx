"use client";

import React from "react";
import HeroSection from "@/components/home/hero-section";
import TrustBar from "@/components/home/trust-bar";
import CategoryGrid from "@/components/home/category-grid";
import ProductShowcase from "@/components/home/product-showcase";
import TrendingBanner from "@/components/home/trending-banner";
import CollectionBanners from "@/components/home/collection-banners";
import SubscribeSection from "@/components/home/subscribe-section";
import { Footer } from "@/components/shared/footer";
import { newArrivals, topSellers } from "@/lib/demo-data";
import { SignUpButton } from "@clerk/nextjs";

export default function UnauthenticatedWelcome() {
  return (
    <div>
      {/* Hero Section with Auth Trigger */}
      <div className="relative">
        <HeroSection />
      </div>

      {/* Trust Bar */}
      <TrustBar />

      {/* Category Grid */}
      <SignUpButton mode="modal">
        <div className="cursor-pointer">
          <CategoryGrid />
        </div>
      </SignUpButton>

      {/* New Arrivals Showcase */}
      <SignUpButton mode="modal">
        <div className="cursor-pointer">
          <ProductShowcase
            title="New Arrivals"
            products={newArrivals}
            ctaHref="#"
            ctaLabel="Sign In to Shop New Arrivals"
          />
        </div>
      </SignUpButton>

      {/* Trending Banner */}
      <SignUpButton mode="modal">
        <div className="cursor-pointer">
          <TrendingBanner />
        </div>
      </SignUpButton>

      {/* Top Sellers */}
      <SignUpButton mode="modal">
        <div className="cursor-pointer">
          <ProductShowcase
            title="Top Sellers"
            products={topSellers}
            ctaHref="#"
            ctaLabel="Sign In to Shop Top Sellers"
          />
        </div>
      </SignUpButton>

      {/* Collection Banners */}
      <CollectionBanners />

      {/* Subscribe + Gallery */}
      <SubscribeSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
