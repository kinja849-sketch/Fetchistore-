"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { categories } from "@/lib/demo-data";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { ProductCondition } from "@/lib/supabase/types";

export default function EditListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "Essential Hoodie",
    description: "Unisex Streetwear Hoodie in excellent condition.",
    categoryId: "fashion",
    condition: "new" as ProductCondition,
    price: "49.99",
    oldPrice: "79.99",
    quantity: "1",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=720&fit=crop&q=80",
    latitude: "37.7749",
    longitude: "-122.4194",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/listings");
    }, 800);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this listing?")) {
      router.push("/listings");
    }
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
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product Listing</h1>
            <p className="text-sm text-gray-500 mt-1">Update details, price, or active status.</p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50 p-2.5 rounded-full transition-colors"
            title="Delete listing"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
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
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      <ConditionBadge condition={cond} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>
          </div>

          {formData.imageUrl && (
            <div className="relative h-40 w-40 rounded-xl overflow-hidden border border-gray-200">
              <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
            </div>
          )}

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
              <Save size={16} />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
