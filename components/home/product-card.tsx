import Image from "next/image";
import { MapPin } from "lucide-react";
import { Product } from "@/lib/demo-data";
import { ConditionBadge } from "@/components/shared/condition-badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="cursor-pointer group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[12px] bg-gray-100">
        <Image
          src={product.imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <ConditionBadge condition={product.condition} />
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-sm text-gray-900 truncate">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {product.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-bold text-base text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-brand" />
          <span className="text-xs text-gray-400">
            {product.distance} km away
          </span>
        </div>
      </div>
    </div>
  );
}
