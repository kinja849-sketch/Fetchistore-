"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useListings, ProductCondition } from "@/lib/listings-context";
import { MapPinPicker } from "@/components/maps/map-pin-picker";
import { Coordinates, DEFAULT_COORDINATES } from "@/lib/geo";
import { getCategories } from "@/app/actions/categories";
import { Category } from "@/lib/supabase/types";
import { useUserLocation } from "@/lib/hooks/use-user-location";

const CONDITIONS: { id: ProductCondition; label: string; desc: string }[] = [
  { id: "new", label: "New", desc: "Brand new, unused, in original packaging." },
  { id: "like_new", label: "Like New", desc: "Used slightly, shows minimal to no signs of wear." },
  { id: "good", label: "Good", desc: "Used gently, shows minor wear but functions perfectly." },
  { id: "fair", label: "Fair", desc: "Noticeable wear or minor defects, still usable." },
];

export default function CreateListingPage() {
  const router = useRouter();
  const { user } = useUser();
  const { addListing } = useListings();
  const { location: userCoords, cityLabel, currencyConfig } = useUserLocation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [condition, setCondition] = useState<ProductCondition>("like_new");
  const [price, setPrice] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [customCoords, setCustomCoords] = useState<Coordinates | null>(null);

  const displayCoords = customCoords || userCoords || DEFAULT_COORDINATES;
  const displayLocation = locationInput || (cityLabel && cityLabel !== "Near You" ? cityLabel : "Near You");
  const [showPinPicker, setShowPinPicker] = useState(false);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    async function loadDbCategories() {
      const res = await getCategories();
      if (res.data && res.data.length > 0) {
        setDbCategories(res.data);
        if (res.data[0]?.id) {
          setCategory(res.data[0].id);
        }
      }
    }
    loadDbCategories();
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight - 200;
      if (scrollPosition >= threshold || window.scrollY > 350) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeConditionObj = CONDITIONS.find((c) => c.id === condition) || CONDITIONS[1];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const readers = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((newImages) => {
        setImagePreviews((prev) => [...prev, ...newImages]);
      });
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user?.id) {
      setErrorMessage("You must be signed in to publish a listing.");
      return;
    }

    if (!title || !price) {
      setErrorMessage("Please enter both a title and price for your listing.");
      return;
    }

    setIsSubmitting(true);

    const finalImages =
      imagePreviews.length > 0
        ? imagePreviews
        : [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
          ];

    const parsedPrice = parseFloat(price) || 0;

    const res = await addListing(
      {
        title,
        category,
        price: parsedPrice,
        condition,
        distanceKm: 0.5,
        distance: "0.5 km away",
        imageUrl: finalImages[0],
        images: finalImages,
        description: description || `${title} in ${activeConditionObj.label} condition.`,
        location: displayLocation || "Near You",
        latitude: displayCoords?.lat ?? 45.5152,
        longitude: displayCoords?.lng ?? -122.6784,
      },
      user.id
    );

    if (res.error || !res.data) {
      setErrorMessage(res.error || "Failed to publish listing to Supabase. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setShowToast(true);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/seller/listings`);
    }, 800);
  };

  return (
    <div className="w-full flex-1 bg-[#FBF9F8] text-[#1B1C1C] min-h-screen pb-24">
      {/* Main Form Body */}
      <main className="pt-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
        {errorMessage && (
          <div className="bg-[#BA1A1A]/10 border border-[#BA1A1A]/30 text-[#BA1A1A] px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden Inputs for File & Camera */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
          />

          {/* 1. Product Images */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-[#1B1C1C] block">
                Product Images {imagePreviews.length > 0 && `(${imagePreviews.length})`}
              </label>
              {imagePreviews.length > 0 && (
                <span className="text-xs font-semibold text-[#56642B]">
                  Upload more images below
                </span>
              )}
            </div>

            {imagePreviews.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imagePreviews.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-40 bg-[#F6F3F2] rounded-2xl overflow-hidden border border-[#C6C8B8] group shadow-sm"
                    >
                      <img
                        src={img}
                        alt={`Product preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1.5 transition-colors shadow-md cursor-pointer"
                        title="Remove photo"
                      >
                        <span className="material-symbols-outlined text-xs block">close</span>
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 bg-[#56642B] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                          Cover Photo
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Add More Photos Tile */}
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="h-40 bg-[#F6F3F2] hover:bg-[#E4E2E1]/60 border-2 border-dashed border-[#56642B]/50 rounded-2xl flex flex-col items-center justify-center text-[#56642B] transition-all cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                      add_a_photo
                    </span>
                    <span className="text-xs font-bold mt-1">Add Photo</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="px-4 py-2 bg-[#FBF9F8] text-[#56642B] rounded-full text-xs font-bold border border-[#56642B] hover:bg-[#E4E2E1]/50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">upload</span>
                    Upload Photos
                  </button>
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="px-4 py-2 bg-[#8A9A5B] text-[#253000] rounded-full text-xs font-extrabold hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">camera_alt</span>
                    Take Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-64 bg-[#F6F3F2] rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-[#C6C8B8] overflow-hidden group">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8a9a5b_1px,transparent_1px)] [background-size:16px_16px]" />
                <span className="material-symbols-outlined text-4xl text-[#56642B] mb-2 z-10">
                  add_a_photo
                </span>
                <p className="text-sm text-[#46483C] z-10 mb-5 text-center px-4">
                  Upload high-quality images of your item (select multiple).
                  <br />
                  <span className="text-xs text-[#76786B] italic">
                    Natural lighting recommended.
                  </span>
                </p>
                <div className="flex gap-3 z-10 w-full px-6 justify-center">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="flex-1 py-3 bg-[#FBF9F8] text-[#56642B] rounded-full text-xs font-bold border border-[#56642B] hover:bg-[#E4E2E1]/50 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">upload</span>
                    Upload Multiple
                  </button>
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="flex-1 py-3 bg-[#8A9A5B] text-[#253000] rounded-full text-xs font-extrabold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">camera_alt</span>
                    Camera
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 2. Product Details */}
          <section className="space-y-2">
            <label htmlFor="product_title" className="text-xs font-bold text-[#1B1C1C] block uppercase tracking-wider">
              Product Title *
            </label>
            <input
              id="product_title"
              name="product_title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vintage Cerulean Ceramic Vase or iPhone 15 Pro"
              className="w-full bg-[#FFFFFF] border-0 rounded-full px-6 py-4 text-sm text-[#1B1C1C] placeholder:text-[#76786B]/60 focus:ring-2 focus:ring-[#56642B] shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none transition-all"
            />
          </section>

          {/* 3. Category & Price */}
          <section className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="category" className="text-xs font-bold text-[#1B1C1C] block uppercase tracking-wider">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FFFFFF] border-0 rounded-full px-5 py-3.5 text-sm font-semibold text-[#1B1C1C] focus:ring-2 focus:ring-[#56642B] shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none"
              >
                {dbCategories.length > 0 ? (
                  dbCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home Decor">Home Decor</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Furniture">Furniture</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-xs font-bold text-[#1B1C1C] block uppercase tracking-wider">
                Price ({currencyConfig.symbol}) *
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45.00"
                className="w-full bg-[#FFFFFF] border-0 rounded-full px-6 py-3.5 text-sm font-bold text-[#1B1C1C] placeholder:text-[#76786B]/60 focus:ring-2 focus:ring-[#56642B] shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none transition-all"
              />
            </div>
          </section>

          {/* 4. Condition Segmented Control */}
          <section className="space-y-2">
            <label className="text-xs font-bold text-[#1B1C1C] block uppercase tracking-wider">
              Condition
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" id="condition-chips">
              {CONDITIONS.map((item) => {
                const isActive = condition === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCondition(item.id)}
                    className={`whitespace-nowrap px-6 py-3 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#8A9A5B] text-[#253000] shadow-sm"
                        : "bg-[#F0EDED] text-[#1B1C1C] hover:bg-[#E4E2E1]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#46483C] italic px-2 pt-1 transition-opacity duration-200">
              {activeConditionObj.desc}
            </p>
          </section>

          {/* 5. Description */}
          <section className="space-y-2">
            <label htmlFor="product_desc" className="text-xs font-bold text-[#1B1C1C] block uppercase tracking-wider">
              Description
            </label>
            <textarea
              id="product_desc"
              name="product_desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share the story behind this item, specific dimensions, unique details or accessories included..."
              className="w-full bg-[#FFFFFF] border-0 rounded-2xl px-6 py-4 text-sm text-[#1B1C1C] placeholder:text-[#76786B]/60 focus:ring-2 focus:ring-[#56642B] shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none resize-none transition-all"
            />
          </section>

          {/* 6. Location & Pin Picker */}
          <section className="space-y-2">
            <label htmlFor="location" className="text-xs font-bold text-[#1B1C1C] block uppercase tracking-wider">
              Location & Map Pin
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#46483C] text-xl">
                  location_on
                </span>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={displayLocation}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full bg-[#FFFFFF] border-0 rounded-full pl-12 pr-6 py-3.5 text-sm font-semibold text-[#1B1C1C] focus:ring-2 focus:ring-[#56642B] shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPinPicker(true)}
                className="px-5 py-3.5 bg-[#8A9A5B]/20 hover:bg-[#8A9A5B] text-[#56642B] hover:text-[#161F00] font-black text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 shrink-0 border border-[#8A9A5B]/30"
              >
                <span className="material-symbols-outlined text-sm">map</span>
                <span>Pick Pin on Map</span>
              </button>
            </div>
            {displayCoords && (
              <p className="text-[11px] text-[#56642B] font-mono pl-3 font-semibold">
                📍 Coordinates: {displayCoords.lat.toFixed(4)}°, {displayCoords.lng.toFixed(4)}°
              </p>
            )}
          </section>

          {showPinPicker && (
            <MapPinPicker
              initialCoordinates={displayCoords || DEFAULT_COORDINATES}
              onSelectCoordinates={(newCoords) => {
                setCustomCoords(newCoords);
                setLocationInput(`Lat ${newCoords.lat.toFixed(3)}, Lng ${newCoords.lng.toFixed(3)}`);
              }}
              onClose={() => setShowPinPicker(false)}
              title="Set Listing Map Location"
            />
          )}

          {/* 7. Listing Preview Summary (Bento Card) */}
          <section className="space-y-2 pt-2">
            <label className="text-xs font-bold text-[#1B1C1C] block uppercase tracking-wider">
              Listing Summary
            </label>
            <div className="bg-[#FFFFFF] rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-[#E4E2E1] flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#56642B] bg-[#8A9A5B]/20 p-2 rounded-full">
                  eco
                </span>
                <div>
                  <p className="text-xs font-extrabold text-[#1B1C1C]">Sustainable Impact</p>
                  <p className="text-[11px] text-[#46483C]">Re-homing items reduces carbon footprint.</p>
                </div>
              </div>
              <div className="h-px w-full bg-[#E4E2E1]" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#46483C] font-semibold">Platform Fee</span>
                <span className="font-extrabold text-[#56642B]">5%</span>
              </div>
            </div>
          </section>

          {/* Toast Notification */}
          {showToast && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#56642B] text-white text-xs font-extrabold px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Listing published successfully! Redirection to Shop...
            </div>
          )}

          {/* Floating Sticky Submit Button (Only visible once the user scrolls down, non-exaggerated compact size) */}
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
              isScrolled
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-6 pointer-events-none"
            }`}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#56642B] text-white rounded-full text-xs font-extrabold shadow-xl border border-[#8A9A5B]/40 hover:bg-[#253000] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  List Product{" "}
                  <span className="material-symbols-outlined text-base">check_circle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
