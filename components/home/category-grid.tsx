import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/demo-data";

export default function CategoryGrid() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shop by Categories
          </h2>
          <Link
            href="/categories"
            className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors hidden sm:block"
          >
            View All Categories →
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link href={`/category/${category.slug}`} key={category.slug}>
              <div className="relative group cursor-pointer text-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden bg-gray-100 ring-2 ring-transparent group-hover:ring-brand transition-all duration-300">
                  <Image
                    src={category.imageSrc}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-3 font-semibold text-sm text-gray-900">
                  {category.name}
                </h3>
                <span className="text-xs text-brand font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity block">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
