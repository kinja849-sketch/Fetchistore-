/* eslint-disable @typescript-eslint/no-explicit-any */

declare namespace google {
  namespace maps {
    enum SymbolPath {
      CIRCLE = 0,
      FORWARD_CLOSED_ARROW = 1,
    }

    enum TravelMode {
      DRIVING = "DRIVING",
      WALKING = "WALKING",
      BICYCLING = "BICYCLING",
      TRANSIT = "TRANSIT",
    }

    enum DirectionsStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      MAX_WAYPOINTS_EXCEEDED = "MAX_WAYPOINTS_EXCEEDED",
      INVALID_REQUEST = "INVALID_REQUEST",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface MapMouseEvent {
      latLng: LatLng | null;
    }

    interface MapOptions {
      center?: { lat: number; lng: number };
      zoom?: number;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      styles?: Array<{
        featureType?: string;
        elementType?: string;
        stylers?: Array<Record<string, any>>;
      }>;
    }

    class Map {
      constructor(element: HTMLElement, options?: MapOptions);
      setCenter(center: { lat: number; lng: number }): void;
      setZoom(zoom: number): void;
    }

    interface MarkerIcon {
      path?: SymbolPath | string;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }

    type Icon = MarkerIcon;

    interface MarkerOptions {
      position: { lat: number; lng: number };
      map: Map;
      title?: string;
      icon?: string | MarkerIcon;
      draggable?: boolean;
    }

    class Marker {
      constructor(options?: MarkerOptions);
      setMap(map: Map | null): void;
      addListener(event: string, handler: (e: MapMouseEvent) => void): void;
    }

    interface PolylineOptions {
      path: Array<{ lat: number; lng: number }>;
      geodesic?: boolean;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      map?: Map;
    }

    class Polyline {
      constructor(options?: PolylineOptions);
      setMap(map: Map | null): void;
    }

    interface DirectionsRequest {
      origin: { lat: number; lng: number } | string;
      destination: { lat: number; lng: number } | string;
      travelMode: TravelMode;
    }

    interface DirectionsLegStep {
      path: LatLng[];
    }

    interface DirectionsLeg {
      distance?: { text: string; value: number };
      duration?: { text: string; value: number };
      steps?: DirectionsLegStep[];
    }

    interface DirectionsRoute {
      legs: DirectionsLeg[];
    }

    interface DirectionsResult {
      routes: DirectionsRoute[];
    }

    class DirectionsService {
      route(
        request: DirectionsRequest,
        callback: (result: DirectionsResult | null, status: DirectionsStatus) => void
      ): void;
    }

    namespace places {
      interface PlaceResult {
        name?: string;
        formatted_address?: string;
        geometry?: {
          location?: LatLng;
        };
      }

      interface AutocompleteOptions {
        types?: string[];
      }

      class Autocomplete {
        constructor(inputElement: HTMLInputElement, options?: AutocompleteOptions);
        addListener(event: string, handler: () => void): void;
        getPlace(): PlaceResult;
      }
    }
  }
}

interface Window {
  google?: typeof google;
}
