"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/demo-data";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { useCart } from "@/lib/cart-context";
import { flyImageToCart } from "@/lib/cart-fly-animation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const cardImageRef = useRef<HTMLDivElement>(null);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.imageSrc,
      condition: product.condition,
      distance: `${product.distance}km away`,
    });

    flyImageToCart(cardImageRef.current);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="cursor-pointer group block bg-[#F6F3F2] p-2.5 sm:p-3 rounded-[20px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-[#E4E2E1]/60"
    >
      <div ref={cardImageRef} className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-[#EAE8E7]">
        <Image
          src={product.imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 z-10">
          <ConditionBadge condition={product.condition} />
        </div>
        <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-extrabold text-[#333333] flex items-center gap-0.5 shadow-xs">
          <MapPin className="w-2.5 h-2.5 text-[#8A9A5B]" />
          <span>{product.distance}km</span>
        </div>
        <button
          onClick={handleQuickAdd}
          title="Quick Add to Cart"
          aria-label="Quick Add to Cart"
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-[#56642B] text-[#1B1C1C] hover:text-white backdrop-blur-md flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-2 sm:mt-3 px-0.5">
        <h3 className="font-extrabold text-xs sm:text-sm text-[#1B1C1C] truncate group-hover:text-[#56642B] transition-colors">
          {product.title}
        </h3>
        <p className="text-[11px] text-[#76786B] mt-0.5 truncate font-medium">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-1 mt-2 pt-1 border-t border-[#E4E2E1]">
          <div className="flex items-baseline gap-1">
            <span className="font-extrabold text-xs sm:text-base text-[#56642B]">
              ${product.price.toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-[10px] sm:text-xs text-[#76786B] line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#56642B] bg-[#E9EDC9] px-2 py-0.5 rounded-full group-hover:bg-[#56642B] group-hover:text-white transition-all">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
