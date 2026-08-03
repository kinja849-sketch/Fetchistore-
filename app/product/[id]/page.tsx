"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ShoppingBag, Heart, Check, Plus, Minus, CheckCircle2, MapPin } from "lucide-react";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { useCart } from "@/lib/cart-context";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, totalItems } = useCart();

  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);
  const [isFollowing, setIsFollowing] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Mock product detail (customizable by id)
  const product = {
    id: (params?.id as string) || "grey-casual-shoe",
    title: (params?.id as string) === "urban-vanguard-tee" ? "Urban Vanguard Tee" : "Grey Casual shoe",
    category: (params?.id as string) === "urban-vanguard-tee" ? "Men Outfit" : "Men Footwear",
    price: (params?.id as string) === "urban-vanguard-tee" ? 26.72 : 120,
    condition: ((params?.id as string) === "urban-vanguard-tee" ? "new" : "like_new") as "new" | "like_new",
    distance: "1.2 km away",
    seller: {
      name: "Velora Store",
      type: "Official seller",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    images: [
      (params?.id as string) === "urban-vanguard-tee"
        ? "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Premium handcrafted item with soft ergonomic design and durable finish. Delivered straight to your door by local sellers.",
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        condition: product.condition,
        distance: product.distance,
      });
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-28">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand text-white px-6 py-3 rounded-full text-xs font-extrabold shadow-xl flex items-center space-x-2 animate-bounce">
          <Check size={16} />
          <span>Added {quantity}x {product.title} to your cart!</span>
        </div>
      )}

      {/* Detail Top Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-brand-light hover:text-brand transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>
          
          <h1 className="text-base font-black text-gray-900">Product Detail</h1>

          <Link
            href="/cart"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-brand-light hover:text-brand transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-6">
        {/* Main Product Showcase Card */}
        <div className="relative bg-gray-100 rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col items-center border border-gray-200/80">
          <div className="relative w-full aspect-square max-h-[380px] rounded-2xl overflow-hidden">
            <Image
              src={product.images[activeImageIndex]}
              alt={product.title}
              fill
              className="object-cover transition-all duration-300"
              priority
            />
          </div>

          {/* Carousel Dots */}
          <div className="flex space-x-2 mt-4">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`transition-all duration-200 cursor-pointer ${
                  activeImageIndex === idx
                    ? "w-6 h-2 bg-brand rounded-full"
                    : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-500"
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Title, Category & Wishlist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              {product.category}
            </span>
            <ConditionBadge condition={product.condition} />
          </div>

          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {product.title}
            </h2>
            <button
              onClick={() => setIsWishlist(!isWishlist)}
              className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:scale-105 transition-transform cursor-pointer"
              aria-label="Add to wishlist"
            >
              <Heart
                size={22}
                className={isWishlist ? "fill-brand text-brand" : "text-gray-400"}
              />
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
            <MapPin size={14} className="text-brand" />
            <span>{product.distance} (Door delivery available)</span>
          </div>
        </div>

        {/* Seller Info Row */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-brand/10 border border-brand/20">
              <Image
                src={product.seller.avatar}
                alt={product.seller.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold text-gray-900">{product.seller.name}</span>
                <CheckCircle2 size={16} className="text-brand fill-brand text-white" />
              </div>
              <span className="text-xs text-gray-400">{product.seller.type}</span>
            </div>
          </div>

          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              isFollowing
                ? "bg-brand text-white shadow-sm"
                : "bg-gray-100 text-gray-800 hover:bg-brand-light hover:text-brand"
            }`}
          >
            {isFollowing && <Check size={14} />}
            <span>{isFollowing ? "Following" : "Follow"}</span>
          </button>
        </div>

        {/* Size & Quantity Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Select size</span>
            <span className="text-xs font-bold text-gray-400 uppercase">QTY</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Size Options */}
            <div className="flex space-x-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-11 h-11 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    selectedSize === size
                      ? "bg-brand text-white shadow-md shadow-brand/20 scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Quantity Modifier */}
            <div className="flex items-center bg-gray-100 rounded-xl px-2 py-1 space-x-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 text-gray-600 hover:text-brand cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="text-sm font-bold text-gray-900 w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 text-gray-600 hover:text-brand cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block">Total price</span>
            <span className="text-2xl font-black text-brand">${(product.price * quantity).toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-brand hover:bg-brand-dark text-white px-8 py-3.5 rounded-full font-extrabold text-sm flex items-center space-x-2 transition-transform active:scale-95 shadow-lg shadow-brand/25 cursor-pointer"
          >
            <ShoppingBag size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
