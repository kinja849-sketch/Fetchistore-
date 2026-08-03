import Link from "next/link";
import Image from "next/image";
import { Plus, Tag, MapPin, Eye, EyeOff } from "lucide-react";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { ProductCondition } from "@/lib/supabase/types";

// Demo initial listings list for preview
const initialSellerListings = [
  {
    id: "l-1",
    title: "Essential Hoodie",
    category: "Fashion",
    price: 49.99,
    oldPrice: 79.99,
    condition: "new" as ProductCondition,
    isActive: true,
    imageSrc: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=720&fit=crop&q=80",
    distance: 1.2,
  },
  {
    id: "l-2",
    title: "Air Max 270",
    category: "Footwear",
    price: 129.99,
    oldPrice: 159.99,
    condition: "like_new" as ProductCondition,
    isActive: true,
    imageSrc: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=720&fit=crop&q=80",
    distance: 3.4,
  },
];

export default function SellerListingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your new & pre-loved items for sale.
          </p>
        </div>
        <Link
          href="/listings/new"
          className="bg-brand text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-dark transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          Create New Listing
        </Link>
      </div>

      {initialSellerListings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No active listings</h3>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            Start selling your items to buyers near you today.
          </p>
          <Link
            href="/listings/new"
            className="bg-brand text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-dark transition-colors inline-flex items-center gap-2"
          >
            <Plus size={16} /> Create Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialSellerListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-full bg-gray-100">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <ConditionBadge condition={item.condition} />
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-700 flex items-center gap-1">
                  <MapPin size={12} className="text-brand" />
                  {item.distance} km
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-medium uppercase text-gray-400 tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-extrabold text-brand">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${item.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      item.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    {item.isActive ? "Active" : "Inactive"}
                  </span>

                  <Link
                    href={`/listings/${item.id}/edit`}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    Edit Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
