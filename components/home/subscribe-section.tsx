import Image from "next/image";
import Link from "next/link";
import { galleryImages } from "@/lib/demo-data";

export default function SubscribeSection() {
  return (
    <section className="w-full bg-surface-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Join Our Community
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Get the latest drops, exclusive deals, and nearby seller updates.
          </p>
          
          <form className="flex gap-2 max-w-md mx-auto mt-6">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
            <button
              type="submit"
              className="bg-brand text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {galleryImages.slice(0, 4).map((img, index) => (
            <div key={index} className="relative aspect-square rounded-[12px] overflow-hidden group">
              <Image
                src={img}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand text-sm font-semibold hover:text-brand-dark transition-colors"
          >
            Follow Us on Instagram →
          </Link>
        </div>
      </div>
    </section>
  );
}
