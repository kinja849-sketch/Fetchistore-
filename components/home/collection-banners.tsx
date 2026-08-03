import Image from "next/image";
import Link from "next/link";

export default function CollectionBanners() {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-900">
          Just For You
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Collection 1 */}
          <Link href="/collections/new" className="block">
            <div className="relative h-[300px] sm:h-[400px] rounded-[12px] overflow-hidden group cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop&q=80"
                alt="New & Fresh Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  New & Fresh
                </h3>
                <span className="inline-block border-2 border-white text-white px-6 py-2 rounded-full font-semibold group-hover:bg-white group-hover:text-gray-900 transition-colors duration-300">
                  Shop Now
                </span>
              </div>
            </div>
          </Link>

          {/* Collection 2 */}
          <Link href="/collections/pre-loved" className="block">
            <div className="relative h-[300px] sm:h-[400px] rounded-[12px] overflow-hidden group cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop&q=80"
                alt="Pre-Loved Finds Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Pre-Loved Finds
                </h3>
                <span className="inline-block border-2 border-white text-white px-6 py-2 rounded-full font-semibold group-hover:bg-white group-hover:text-gray-900 transition-colors duration-300">
                  Shop Now
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
