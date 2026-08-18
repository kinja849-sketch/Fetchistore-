/**
 * Fetchistore Geospatial & Location Utilities
 * Handles Haversine distance calculations, WKT PostGIS formatting, and urban delivery ETA estimation.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CityPreset {
  name: string;
  lat: number;
  lng: number;
}

// Default city presets for fallback discovery and seller locations
export const CITY_PRESETS: CityPreset[] = [
  { name: "Greenpoint, Brooklyn, NY", lat: 40.73061, lng: -73.935242 },
  { name: "Williamsburg, Brooklyn, NY", lat: 40.7081, lng: -73.9571 },
  { name: "Manhattan, NY", lat: 40.7831, lng: -73.9712 },
  { name: "Portland, OR", lat: 45.5152, lng: -122.6784 },
  { name: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
];

export const DEFAULT_COORDINATES: Coordinates = CITY_PRESETS[0];

/**
 * Calculates the straight-line Haversine distance between two sets of coordinates in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Number(distance.toFixed(1));
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimates delivery arrival time in minutes based on distance in km.
 * Assumes average urban seller delivery speed of 25 km/h + 2 mins handling buffer.
 */
export function estimateDeliveryEta(
  distanceKm: number,
  averageSpeedKmH: number = 25
): { minutes: number; text: string } {
  if (distanceKm <= 0.05) {
    return { minutes: 0, text: "Arrived at destination" };
  }

  const travelHours = distanceKm / averageSpeedKmH;
  const travelMinutes = travelHours * 60;
  // Add a minimum 2 min buffer for parking/walking to door
  const totalMinutes = Math.max(1, Math.round(travelMinutes + 2));

  if (totalMinutes < 60) {
    return { minutes: totalMinutes, text: `Arriving in ~${totalMinutes} mins` };
  }

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return {
    minutes: totalMinutes,
    text: `Arriving in ~${hours}h ${mins}m`,
  };
}

/**
 * Formats coordinates into PostGIS WKT string: `POINT(longitude latitude)`
 */
export function formatWktPoint(lat: number, lng: number): string {
  return `POINT(${lng} ${lat})`;
}

/**
 * Parses PostGIS WKT string `POINT(longitude latitude)` or GeoJSON object into Coordinates object.
 */
export function parseWktPoint(location: unknown): Coordinates | null {
  if (!location) return null;

  if (typeof location === "string") {
    // Format: "POINT(-73.935242 40.73061)"
    const match = location.match(/POINT\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (match) {
      return {
        lng: parseFloat(match[1]),
        lat: parseFloat(match[2]),
      };
    }
  }

  // Handle GeoJSON object { type: 'Point', coordinates: [lng, lat] }
  if (typeof location === "object" && location !== null) {
    const geoObj = location as { coordinates?: [number, number] };
    if (Array.isArray(geoObj.coordinates) && geoObj.coordinates.length >= 2) {
      return {
        lng: geoObj.coordinates[0],
        lat: geoObj.coordinates[1],
      };
    }
  }

  return null;
}
