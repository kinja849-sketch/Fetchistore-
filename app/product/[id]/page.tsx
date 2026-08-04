"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useListings } from "@/lib/listings-context";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { ArrowLeft, Heart, ShoppingBag, MessageCircle, Star } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { getListingById } = useListings();

  const productId = (params?.id as string) || "demo-phone-1";
  
  // Find product from global listings context or fallback
  const listingItem = useMemo(() => {
    return getListingById(productId);
  }, [getListingById, productId]);

  const product = useMemo(() => {
    if (listingItem) {
      return {
        id: listingItem.id,
        title: listingItem.title,
        price: listingItem.price,
        rating: 4.9,
        reviewsCount: 18,
        condition: listingItem.condition,
        distanceKm: listingItem.distanceKm,
        distance: listingItem.distance || `${listingItem.distanceKm} km away`,
        sellerName: listingItem.isSellerItem ? "You (Seller)" : "Local Verified Seller",
        sellerRating: 4.9,
        sellerLocation: listingItem.location || "Portland, OR",
        description: listingItem.description,
        images: [listingItem.imageUrl],
      };
    }

    // Default fallback
    return {
      id: productId,
      title: "Handmade Speckled Ceramic Vase",
      price: 48.0,
      rating: 4.8,
      reviewsCount: 124,
      condition: "like_new" as const,
      distanceKm: 1.2,
      distance: "1.2 km away",
      sellerName: "Clara Studio",
      sellerRating: 4.9,
      sellerLocation: "Greenpoint, NY",
      description:
        "A minimalist, eco-conscious piece for your home. Hand-thrown from locally sourced clay, this vase features a unique speckled finish.",
      images: [
        "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80",
      ],
    };
  }, [listingItem, productId]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleToggleFav = () => {
    toggleWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.images[0],
      condition: product.condition,
      description: product.description,
      distanceKm: product.distanceKm,
    });
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      condition: product.condition,
      distance: product.distance,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#FBF9F8] min-h-screen pb-28">
      {/* Sticky Header with Back Button & Favorite */}
      <header className="sticky top-0 z-40 bg-[#FBF9F8]/95 backdrop-blur-md px-4 py-3 border-b border-[#E4E2E1] flex items-center justify-between">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1] transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-sm font-extrabold text-[#56642B] tracking-tight">Product Details</span>

        <button
          onClick={handleToggleFav}
          aria-label="Toggle wishlist"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0EDED] text-[#56642B] hover:bg-[#E4E2E1] transition-colors cursor-pointer"
        >
          <Heart size={18} className={isFavorited ? "fill-[#56642B] text-[#56642B]" : "text-[#76786B]"} />
        </button>
      </header>

      {/* Main Container */}
      <main className="p-4 sm:p-6 max-w-xl mx-auto space-y-4 w-full flex-1">
        {/* Image Gallery */}
        <div className="w-full aspect-square rounded-3xl overflow-hidden bg-[#E4E2E1] relative shadow-xs">
          <img
            src={product.images[selectedImage] || product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-1.5 items-center">
            <ConditionBadge condition={product.condition} />
            <span className="text-[10px] font-extrabold bg-[#56642B] text-white px-2.5 py-1 rounded-full shadow-xs">
              {product.distance}
            </span>
          </div>
        </div>

        {/* Thumbnail Selector Row */}
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                  selectedImage === idx ? "border-[#56642B] scale-95" : "border-transparent opacity-60"
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Product Details Section */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-start gap-2">
            <h1 className="text-xl font-extrabold text-[#1B1C1C]">
              {product.title}
            </h1>
            <span className="text-xl font-black text-[#56642B] whitespace-nowrap">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#76786B]">
            <div className="flex text-[#7D562D]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-[#7D562D]" />
              ))}
            </div>
            <span className="font-bold text-[#1B1C1C]">{product.rating}</span>
            <span>({product.reviewsCount} reviews)</span>
          </div>

          <p className="text-xs sm:text-sm text-[#46483C] leading-relaxed">
            {product.description}
          </p>

          {/* Eco / Sustainability Tags */}
          <div className="flex gap-2 pt-1 flex-wrap">
            <span className="text-[10px] font-extrabold bg-[#8A9A5B]/15 text-[#56642B] px-3 py-1 rounded-full flex items-center gap-1">
              🌱 Sustainable Choice
            </span>
            <span className="text-[10px] font-extrabold bg-[#FFCA98]/40 text-[#7D562D] px-3 py-1 rounded-full flex items-center gap-1">
              🏠 Seller Door Delivery
            </span>
          </div>

          {/* Seller Card */}
          <div className="bg-[#F6F3F2] p-3.5 rounded-2xl border border-[#E4E2E1] flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8A9A5B] text-white flex items-center justify-center font-bold text-sm">
                {product.sellerName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#1B1C1C]">
                  {product.sellerName}
                </h4>
                <p className="text-[10px] text-[#76786B]">
                  {product.sellerLocation} • ★ {product.sellerRating}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/orders/1/chat")}
              className="text-xs font-extrabold text-[#56642B] bg-[#8A9A5B]/20 hover:bg-[#8A9A5B]/30 px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer"
            >
              <MessageCircle size={14} />
              Chat
            </button>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FBF9F8]/95 backdrop-blur-xl border-t border-[#E4E2E1] p-3 z-50 flex items-center justify-center shadow-lg">
        <div className="w-full max-w-xl flex items-center justify-between gap-3">
          <div className="flex items-center bg-[#F0EDED] rounded-full px-3 py-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 flex items-center justify-center font-bold text-[#1B1C1C] cursor-pointer"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-extrabold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center font-bold text-[#1B1C1C] cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#56642B] text-white font-extrabold py-3.5 px-6 rounded-full hover:bg-[#253000] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98 cursor-pointer"
          >
            <ShoppingBag size={18} />
            <span>{addedNotice ? "Added to Cart ✓" : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
