"use server";

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText?: string;
  secondaryText?: string;
}

export interface PlaceDetailsResult {
  lat: number;
  lng: number;
  address: string;
}

const PLACES_API_KEY = process.env.GOOGLE_MAPS_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * Searches for place predictions matching the query using Google Places Autocomplete API.
 */
export async function getPlacePredictionsAction(
  query: string
): Promise<{ predictions: PlacePrediction[]; error: string | null }> {
  if (!query || query.trim().length < 2) {
    return { predictions: [], error: null };
  }

  if (!PLACES_API_KEY) {
    return { predictions: [], error: "GOOGLE_MAPS_PLACES_API_KEY is not configured." };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query.trim()
    )}&types=geocode|establishment&key=${PLACES_API_KEY}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.status === "OK" && Array.isArray(data.predictions)) {
      const predictions: PlacePrediction[] = data.predictions.map(
        (item: {
          place_id: string;
          description: string;
          structured_formatting?: { main_text?: string; secondary_text?: string };
        }) => ({
          placeId: item.place_id,
          description: item.description,
          mainText: item.structured_formatting?.main_text,
          secondaryText: item.structured_formatting?.secondary_text,
        })
      );
      return { predictions, error: null };
    }

    if (data.status === "ZERO_RESULTS") {
      return { predictions: [], error: null };
    }

    return { predictions: [], error: data.error_message || `Places API status: ${data.status}` };
  } catch (err: unknown) {
    return { predictions: [], error: (err as Error).message };
  }
}

/**
 * Retrieves exact lat/lng coordinates and formatted address for a selected place_id using Google Place Details API.
 */
export async function getPlaceDetailsAction(
  placeId: string
): Promise<{ details: PlaceDetailsResult | null; error: string | null }> {
  if (!placeId) {
    return { details: null, error: "Missing placeId" };
  }

  if (!PLACES_API_KEY) {
    return { details: null, error: "GOOGLE_MAPS_PLACES_API_KEY is not configured." };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=geometry,formatted_address,name&key=${PLACES_API_KEY}`;

    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();

    if (data.status === "OK" && data.result?.geometry?.location) {
      const loc = data.result.geometry.location;
      return {
        details: {
          lat: Number(loc.lat.toFixed(6)),
          lng: Number(loc.lng.toFixed(6)),
          address: data.result.formatted_address || data.result.name || `${loc.lat}, ${loc.lng}`,
        },
        error: null,
      };
    }

    return { details: null, error: data.error_message || `Place Details API status: ${data.status}` };
  } catch (err: unknown) {
    return { details: null, error: (err as Error).message };
  }
}
