"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useWishlist } from "@/lib/wishlist-context";
import { useListings, ListingItem } from "@/lib/listings-context";

const PROMO_BANNERS = [
  {
    id: "banner-1",
    tag: "Eco-Friendly",
    tagBg: "bg-[#8A9A5B]/90",
    title: "Sustainable \nHome Collection",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    link: "/shop?category=home-decor",
  },
  {
    id: "banner-2",
    tag: "Handcrafted",
    tagBg: "bg-[#7D562D]/90",
    title: "Local Artisans \nNear You",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
    link: "/shop?category=furniture",
  },
  {
    id: "banner-3",
    tag: "Pre-loved Vintage",
    tagBg: "bg-[#56642B]/90",
    title: "Streetwear Drops \n& Classics",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    link: "/shop?category=mens-outfit",
  },
  {
    id: "banner-4",
    tag: "Smart Tech",
    tagBg: "bg-[#333333]/90",
    title: "Verified Electronics \nDirect to Door",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    link: "/shop?category=electronics",
  },
];

export default function AuthenticatedFeed() {
  const { user } = useUser();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { listings } = useListings();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxDistance, setMaxDistance] = useState(20);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Drag-to-scroll & carousel navigation states
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const toggleFavorite = (product: ListingItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      condition: product.condition,
      category: product.category,
      distanceKm: product.distanceKm,
    });
  };

  const filteredProducts = listings.filter((product) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      product.title.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesDistance = product.distanceKm <= maxDistance;
    return matchesSearch && matchesCategory && matchesDistance;
  });

  return (
    <div className="w-full flex-1 flex flex-col space-y-5 p-4 bg-[#FBF9F8]">
      {/* Search & Filter Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#76786B]">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items near Portland, OR..."
          className="w-full bg-[#F0EDED] text-[#1B1C1C] text-sm font-medium py-3 pl-10 pr-10 rounded-full border border-transparent focus:border-[#8A9A5B] focus:bg-white focus:outline-none transition-all placeholder:text-[#76786B]"
        />
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#56642B] active:scale-95 transition-transform cursor-pointer"
          aria-label="Toggle Filter Options"
        >
          <span className="material-symbols-outlined text-[22px]">tune</span>
        </button>
      </div>

      {/* Filter Modal Drawer */}
      {isFilterOpen && (
        <div className="bg-[#F0EDED] p-4 rounded-3xl border border-[#E4E2E1] space-y-3 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#56642B]">
              Proximity & Filter Options
            </h4>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-xs font-bold text-[#76786B] hover:text-[#1B1C1C] cursor-pointer"
            >
              Close
            </button>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-[#1B1C1C] mb-1">
              <span>Max Distance</span>
              <span>{maxDistance} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-[#56642B] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Promotional Banners Carousel Section */}
      <section className="relative group">
        <button
          onClick={() => scrollCarousel("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md text-[#1B1C1C] hover:bg-[#56642B] hover:text-white transition-all flex items-center justify-center cursor-pointer border border-[#E4E2E1]"
          aria-label="Scroll trends left"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>

        <button
          onClick={() => scrollCarousel("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md text-[#1B1C1C] hover:bg-[#56642B] hover:text-white transition-all flex items-center justify-center cursor-pointer border border-[#E4E2E1]"
          aria-label="Scroll trends right"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>

        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`-mx-4 overflow-x-auto scrollbar-hide px-4 flex gap-3.5 snap-x snap-mandatory select-none touch-pan-x ${
            isMouseDown ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ scrollBehavior: "smooth" }}
        >
          {PROMO_BANNERS.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="snap-center shrink-0 w-[80vw] sm:w-[320px] h-40 relative rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group/card"
            >
              <div
                className="absolute inset-0 bg-cover bg-center w-full h-full group-hover/card:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${banner.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 flex flex-col gap-1 text-white">
                <span className={`text-[10px] font-extrabold tracking-wider uppercase ${banner.tagBg} px-2.5 py-0.5 rounded-full w-fit shadow-xs`}>
                  {banner.tag}
                </span>
                <h2 className="text-base sm:text-lg font-extrabold leading-snug whitespace-pre-line">
                  {banner.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Navigation Pills */}
      <section className="flex justify-between items-start pt-1">
        {[
          { name: "All", slug: "all", icon: "apps" },
          { name: "Fashion", slug: "fashion", icon: "checkroom" },
          { name: "Furniture", slug: "furniture", icon: "chair" },
          { name: "Electronics", slug: "electronics", icon: "devices" },
          { name: "Decor", slug: "home decor", icon: "potted_plant" },
        ].map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.slug)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-[#56642B] text-white shadow-sm scale-105"
                    : "bg-[#F0EDED] text-[#5C6145] hover:bg-[#8A9A5B]/20"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
              </div>
              <span
                className={`text-[11px] font-semibold ${
                  isActive ? "text-[#56642B] font-bold" : "text-[#46483C]"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </section>

      {/* Product Grid Section */}
      <section className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#1B1C1C]">Trending Near You</h3>
          <Link
            href="/shop"
            className="text-xs font-bold text-[#56642B] hover:underline"
          >
            All Categories →
          </Link>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-[#76786B] text-sm">
            No items found matching your filter criteria. Try searching or expanding distance.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-[#F6F3F2] rounded-3xl p-2.5 flex flex-col gap-2 relative group hover:shadow-md transition-all border border-[#E4E2E1]/60"
              >
                <button
                  onClick={(e) => toggleFavorite(product, e)}
                  className="absolute top-4 right-4 z-10 w-7 h-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#56642B] hover:bg-[#56642B] hover:text-white transition-colors shadow-xs cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{
                      fontVariationSettings: isInWishlist(product.id)
                        ? "'FILL' 1"
                        : "'FILL' 0",
                    }}
                  >
                    favorite
                  </span>
                </button>

                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#E4E2E1] relative">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                    <span className="text-[9px] font-extrabold uppercase bg-white/90 text-[#1B1C1C] px-2 py-0.5 rounded-full shadow-xs">
                      {product.condition === "new"
                        ? "New"
                        : product.condition === "like_new"
                        ? "Like New"
                        : product.condition === "good"
                        ? "Good"
                        : "Fair"}
                    </span>
                    <span className="text-[9px] font-extrabold bg-[#56642B] text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">
                        location_on
                      </span>
                      {product.distanceKm}km
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 px-1">
                  <h4 className="text-xs font-bold text-[#1B1C1C] line-clamp-1">
                    {product.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[#76786B]">
                    <span
                      className="material-symbols-outlined text-[14px] text-[#7D562D]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-[10px] font-semibold">
                      4.9 (42)
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-[#56642B] mt-0.5">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
