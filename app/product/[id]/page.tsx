"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { ArrowLeft, Heart, ShoppingBag, MessageCircle, Star, MapPin } from "lucide-react";
import { getListingById } from "@/app/actions/listings";
import { ProductCondition } from "@/lib/supabase/types";
import { flyImageToCart } from "@/lib/cart-fly-animation";
import { GoogleMap } from "@/components/maps/google-map";
import { useUserLocation } from "@/lib/hooks/use-user-location";
import { formatPrice } from "@/lib/currency";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { location: userLocation, currencyConfig } = useUserLocation();

  const productId = (params?.id as string) || "";
  
  const [product, setProduct] = useState<{
    id: string;
    title: string;
    price: number;
    rating: number;
    reviewsCount: number;
    condition: ProductCondition;
    distanceKm: number;
    distance: string;
    sellerName: string;
    sellerRating: number;
    sellerLocation: string;
    description: string;
    images: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!productId) return;
      setLoading(true);
      const res = await getListingById(productId);
      if (res.data) {
        setProduct({
          id: res.data.id,
          title: res.data.title,
          price: res.data.price,
          rating: 4.9,
          reviewsCount: 18,
          condition: res.data.condition as ProductCondition,
          distanceKm: res.data.distance || 1.5,
          distance: `${res.data.distance || 1.5} km away`,
          sellerName: "Local Verified Seller",
          sellerRating: 4.9,
          sellerLocation: "Near you",
          description: res.data.description,
          images: [res.data.imageSrc || "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=720&fit=crop&q=80"],
        });
      } else {
        setProduct(null);
      }
      setLoading(false);
    }
    load();
  }, [productId]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const mainImageRef = React.useRef<HTMLImageElement>(null);

  const isFavorited = product ? isInWishlist(product.id) : false;

  const handleToggleFav = () => {
    if (!product) return;
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
    if (!product) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      condition: product.condition,
      distance: product.distance,
    });
    flyImageToCart(mainImageRef.current);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  if (loading) {
    return (
      <div className="w-full flex-1 flex items-center justify-center min-h-[60vh] text-[#76786B] text-sm">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-4 text-center">
        <p className="text-lg font-black text-[#1B1C1C]">Product not found</p>
        <p className="text-xs text-[#76786B]">This listing may have been sold or removed by the seller.</p>
        <button
          onClick={() => router.push("/shop")}
          className="bg-[#56642B] text-white text-xs font-extrabold px-6 py-2.5 rounded-full hover:bg-[#8A9A5B] transition-all"
        >
          Back to Shop
        </button>
      </div>
    );
  }

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
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery & Thumbnails */}
          <div className="space-y-4">
            <div className="w-full aspect-square rounded-3xl overflow-hidden bg-[#E4E2E1] relative shadow-xs">
              <img
                ref={mainImageRef}
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
          </div>

          {/* Right Column: Product Details & Purchase Actions */}
          <div className="space-y-5">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B1C1C]">
                {product.title}
              </h1>
              <span className="text-2xl font-black text-[#56642B] whitespace-nowrap">
                {formatPrice(product.price, currencyConfig)}
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

            {/* Seller Card & Proximity Map */}
            <div className="bg-[#F6F3F2] p-4 rounded-2xl border border-[#E4E2E1] space-y-3">
              <div className="flex items-center justify-between">
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
                  onClick={() => router.push("/orders")}
                  className="text-xs font-extrabold text-[#56642B] bg-[#8A9A5B]/20 hover:bg-[#8A9A5B]/30 px-3.5 py-1.5 rounded-full flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle size={14} />
                  Chat
                </button>
              </div>

              {/* Map Card */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#46483C]">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#56642B]" />
                    Seller Proximity Neighborhood
                  </span>
                  <span className="text-[#56642B] font-extrabold">{product.distance}</span>
                </div>
                <GoogleMap
                  center={userLocation}
                  zoom={13}
                  height="h-36"
                  interactive={false}
                  markers={
                    userLocation
                      ? [
                          {
                            id: "seller-loc",
                            position: userLocation,
                            title: `${product.sellerName} (${product.distance})`,
                            type: "seller",
                          },
                        ]
                      : []
                  }
                />
              </div>
            </div>

            {/* Desktop Purchase Action Bar */}
            <div className="hidden md:flex items-center gap-4 pt-4 border-t border-[#E4E2E1]">
              <div className="flex items-center bg-[#F0EDED] rounded-full px-3 py-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center font-bold text-[#1B1C1C] cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-extrabold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center font-bold text-[#1B1C1C] cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#56642B] text-white font-extrabold py-3.5 px-6 rounded-full hover:bg-[#253000] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98 cursor-pointer text-sm"
              >
                <ShoppingBag size={18} />
                <span>{addedNotice ? "Added to Cart ✓" : `Add to Cart • ${formatPrice(product.price * quantity, currencyConfig)}`}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FBF9F8]/95 backdrop-blur-xl border-t border-[#E4E2E1] p-3 z-50 flex items-center justify-center shadow-lg md:hidden">
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
            <span>{addedNotice ? "Added to Cart ✓" : `Add to Cart • ${formatPrice(product.price * quantity, currencyConfig)}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
