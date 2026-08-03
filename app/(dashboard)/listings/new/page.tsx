"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Upload, CheckCircle } from "lucide-react";
import { categories } from "@/lib/demo-data";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { ProductCondition } from "@/lib/supabase/types";

export default function NewListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: categories[0].slug,
    condition: "new" as ProductCondition,
    price: "",
    oldPrice: "",
    quantity: "1",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=720&fit=crop&q=80",
    latitude: "37.7749",
    longitude: "-122.4194",
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(4),
            longitude: position.coords.longitude.toFixed(4),
          }));
          setIsDetectingLocation(false);
          setLocationSuccess(true);
          setTimeout(() => setLocationSuccess(false), 3000);
        },
        (error) => {
          console.error("Error detecting location:", error);
          setIsDetectingLocation(false);
          alert("Unable to retrieve location. Default coordinates kept.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission and redirect to seller dashboard
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/listings");
    }, 1000);
  };

  const conditionsList: ProductCondition[] = ["new", "like_new", "good", "fair"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/listings"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Seller Dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10">
        <h1 className="text-2xl font-bold text-gray-900">List an Item for Sale</h1>
        <p className="text-sm text-gray-500 mt-1 mb-8">
          Fill in details about your product. Buyers near your location will be able to discover and purchase it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Item Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Item Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Vintage Denim Jacket"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows={4}
                placeholder="Describe condition, size, brand, material, or any defects..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  {conditionsList.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: cond })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                        formData.condition === cond
                          ? "border-brand bg-brand-light text-brand"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <ConditionBadge condition={cond} />
                      {formData.condition === cond && <CheckCircle size={14} className="text-brand" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Pricing & Quantity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Old Price ($) (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                />
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Product Image
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                />
              </div>
            </div>

            {formData.imageUrl && (
              <div className="mt-3 relative h-40 w-40 rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={formData.imageUrl}
                  alt="Product preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Proximity Location */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">Proximity Discovery Location</h2>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer"
              >
                <MapPin size={14} />
                {isDetectingLocation ? "Detecting..." : "Detect Current Location"}
              </button>
            </div>

            {locationSuccess && (
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle size={14} /> Location successfully detected!
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Latitude</label>
                <input
                  type="text"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Longitude</label>
                <input
                  type="text"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Link
              href="/listings"
              className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-dark transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload size={16} />
              {isSubmitting ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
