import { Coordinates, haversineDistance, estimateDeliveryEta } from "@/lib/geo";

export interface DirectionsResult {
  distanceKm: number;
  distanceText: string;
  durationMinutes: number;
  durationText: string;
  polylinePath?: Coordinates[];
  error: string | null;
}

const directionsCache = new Map<string, DirectionsResult>();

/**
 * Calculates routing distance and duration between origin and destination using Google Maps DirectionsService or fallback.
 */
export async function getDirectionsRoute(
  origin: Coordinates,
  destination: Coordinates
): Promise<DirectionsResult> {
  const cacheKey = `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}->${destination.lat.toFixed(4)},${destination.lng.toFixed(4)}`;
  if (directionsCache.has(cacheKey)) {
    return directionsCache.get(cacheKey)!;
  }

  // Check if same coordinates
  if (
    Math.abs(origin.lat - destination.lat) < 0.0001 &&
    Math.abs(origin.lng - destination.lng) < 0.0001
  ) {
    const res: DirectionsResult = {
      distanceKm: 0,
      distanceText: "0 km",
      durationMinutes: 0,
      durationText: "Arrived at destination",
      polylinePath: [origin, destination],
      error: null,
    };
    directionsCache.set(cacheKey, res);
    return res;
  }

  // Attempt Google Maps JS SDK DirectionsService if loaded in browser
  if (
    typeof window !== "undefined" &&
    window.google?.maps?.DirectionsService
  ) {
    try {
      const directionsService = new window.google.maps.DirectionsService();
      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route(
          {
            origin: { lat: origin.lat, lng: origin.lng },
            destination: { lat: destination.lat, lng: destination.lng },
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (res, status) => {
            if (status === google.maps.DirectionsStatus.OK && res) {
              resolve(res);
            } else {
              reject(new Error(`Directions API status: ${status}`));
            }
          }
        );
      });

      const leg = result.routes[0]?.legs[0];
      if (leg) {
        const distanceKm = Number(((leg.distance?.value || 0) / 1000).toFixed(1));
        const durationMinutes = Math.max(1, Math.round((leg.duration?.value || 0) / 60));
        
        const path: Coordinates[] = leg.steps
          ? leg.steps.flatMap((step) =>
              step.path.map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }))
            )
          : [origin, destination];

        const res: DirectionsResult = {
          distanceKm,
          distanceText: leg.distance?.text || `${distanceKm} km`,
          durationMinutes,
          durationText: leg.duration?.text || `~${durationMinutes} mins`,
          polylinePath: path,
          error: null,
        };

        directionsCache.set(cacheKey, res);
        return res;
      }
    } catch (err) {
      console.warn("Google Maps DirectionsService failed or denied, using Haversine calculation:", err);
    }
  }

  // Fallback: Haversine distance + estimated delivery ETA formula
  const dist = haversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
  const eta = estimateDeliveryEta(dist);

  const fallbackRes: DirectionsResult = {
    distanceKm: dist,
    distanceText: `${dist} km`,
    durationMinutes: eta.minutes,
    durationText: eta.text,
    polylinePath: [origin, destination],
    error: null,
  };

  directionsCache.set(cacheKey, fallbackRes);
  return fallbackRes;
}
