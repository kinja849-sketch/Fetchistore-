"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { Coordinates, haversineDistance, parseWktPoint, formatWktPoint } from "@/lib/geo";

export interface NearbyListingItem {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  condition: "new" | "like_new" | "good" | "fair";
  imageSrc: string;
  distance: number;
  lat: number;
  lng: number;
  category: string;
}

/**
 * Fetch nearby listings relative to real user coordinates (lat, lng).
 * Uses PostGIS `nearby_listings` RPC if available, with Haversine fallback on real Supabase listings.
 */
export async function getNearbyListingsAction(
  lat: number,
  lng: number,
  radiusKm: number = 25
): Promise<{ data: NearbyListingItem[]; error: string | null }> {
  try {
    const supabase = createAdminClient();

    // 1. Attempt PostGIS RPC call
    const { data: rpcData, error: rpcError } = await supabase.rpc("nearby_listings", {
      lat,
      lng,
      radius_meters: radiusKm * 1000,
    });

    if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
      const mapped: NearbyListingItem[] = rpcData.map((item: Record<string, unknown>) => ({
        id: String(item.id),
        title: String(item.title),
        description: String(item.description || ""),
        price: Number(item.price),
        oldPrice: item.old_price ? Number(item.old_price) : undefined,
        condition: (item.condition as NearbyListingItem["condition"]) || "good",
        imageSrc: Array.isArray(item.images) && item.images.length > 0 ? String(item.images[0]) : String(item.image_url || ""),
        distance: Number(item.distance_km || 0),
        lat: Number(item.latitude || lat),
        lng: Number(item.longitude || lng),
        category: String(item.category_slug || item.category || "general"),
      }));
      return { data: mapped, error: null };
    }

    // 2. Query active listings from Supabase listings table
    const { data: rawListings, error: fetchError } = await supabase
      .from("listings")
      .select("*")
      .eq("is_active", true);

    if (fetchError || !rawListings) {
      return { data: [], error: fetchError ? fetchError.message : null };
    }

    const filtered: NearbyListingItem[] = rawListings
      .map((item: Record<string, unknown>) => {
        const parsedCoords = parseWktPoint(typeof item.location === "string" ? item.location : null);
        const itemLat = parsedCoords ? parsedCoords.lat : typeof item.latitude === "number" ? item.latitude : lat;
        const itemLng = parsedCoords ? parsedCoords.lng : typeof item.longitude === "number" ? item.longitude : lng;

        const dist = haversineDistance(lat, lng, itemLat, itemLng);
        return {
          id: String(item.id),
          title: String(item.title),
          description: String(item.description || ""),
          price: Number(item.price),
          oldPrice: item.old_price ? Number(item.old_price) : undefined,
          condition: (item.condition as NearbyListingItem["condition"]) || "good",
          imageSrc: Array.isArray(item.images) && item.images.length > 0 ? String(item.images[0]) : String(item.image_url || ""),
          distance: dist,
          lat: itemLat,
          lng: itemLng,
          category: String(item.category_slug || "general"),
        };
      })
      .filter((item: NearbyListingItem) => item.distance <= radiusKm)
      .sort((a: NearbyListingItem, b: NearbyListingItem) => a.distance - b.distance);

    return { data: filtered, error: null };
  } catch (err: unknown) {
    return { data: [], error: (err as Error).message };
  }
}

/**
 * Record a live seller GPS delivery location ping into delivery_locations.
 */
export async function recordSellerLocationAction(
  orderId: string,
  lat: number,
  lng: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createAdminClient();
    const wkt = formatWktPoint(lat, lng);

    const { error } = await supabase.from("delivery_locations").insert({
      order_id: orderId,
      location: wkt,
      recorded_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to record delivery location:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Get latest recorded seller delivery position for an order.
 */
export async function getLatestSellerLocationAction(
  orderId: string
): Promise<{ position: Coordinates | null; error: string | null }> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("delivery_locations")
      .select("location, recorded_at")
      .eq("order_id", orderId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return { position: null, error: error ? error.message : "No location recorded yet" };
    }

    const pos = parseWktPoint(data.location);
    return { position: pos, error: null };
  } catch (err: unknown) {
    return { position: null, error: (err as Error).message };
  }
}

export interface IpLocationResult {
  lat: number;
  lng: number;
  city: string;
  countryCode: string;
  currency: string;
}

/**
 * Perform IP-geolocation lookup to resolve approximate city, country, and coordinates.
 */
export async function getIpLocationAction(): Promise<{ data: IpLocationResult; error: string | null }> {
  try {
    const res = await fetch("https://ipapi.co/json/", { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      if (json.latitude && json.longitude) {
        return {
          data: {
            lat: Number(json.latitude),
            lng: Number(json.longitude),
            city: json.city || json.region || "Your City",
            countryCode: json.country_code || "US",
            currency: json.currency || "USD",
          },
          error: null,
        };
      }
    }
  } catch (err) {
    console.warn("IP geolocation fetch failed, using fallback:", err);
  }

  // Fallback to default region (Jakarta / WIB or US)
  return {
    data: {
      lat: -6.2088,
      lng: 106.8456,
      city: "Jakarta",
      countryCode: "ID",
      currency: "IDR",
    },
    error: null,
  };
}

