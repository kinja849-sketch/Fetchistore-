import Link from "next/link";
import { Product } from "@/lib/demo-data";
import ProductCard from "@/components/home/product-card";

interface ProductShowcaseProps {
  title: string;
  products: Product[];
  ctaHref: string;
  ctaLabel?: string;
}

export default function ProductShowcase({
  title,
  products,
  ctaHref,
  ctaLabel = "View All →",
}: ProductShowcaseProps) {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          <Link
            href={ctaHref}
            className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
