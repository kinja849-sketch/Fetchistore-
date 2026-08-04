import Image from "next/image";
import { MapPin } from "lucide-react";
import { Product } from "@/lib/demo-data";
import { ConditionBadge } from "@/components/shared/condition-badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="cursor-pointer group block bg-[#F6F3F2] p-3 rounded-[20px] transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-[#EAE8E7]">
        <Image
          src={product.imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2.5 left-2.5">
          <ConditionBadge condition={product.condition} />
        </div>
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-[#333333] flex items-center gap-1 shadow-xs">
          <MapPin className="w-3 h-3 text-[#8A9A5B]" />
          <span>{product.distance} km</span>
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="font-bold text-sm text-[#333333] truncate group-hover:text-[#8A9A5B] transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-[#76786B] mt-0.5 truncate">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-[#E4E2E1]">
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-base text-[#333333]">
              ${product.price.toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-[#76786B] line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9A5B] bg-[#E9EDC9] px-2.5 py-1 rounded-full group-hover:bg-[#8A9A5B] group-hover:text-white transition-all">
            View
          </span>
        </div>
      </div>
    </div>
  );
}
