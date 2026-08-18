"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Coordinates } from "@/lib/geo";
import { getDirectionsRoute } from "@/lib/directions";


export interface MarkerProps {
  id?: string;
  position: Coordinates;
  title?: string;
  type?: "buyer" | "seller" | "listing" | "pin" | "user";
  draggable?: boolean;
}

export interface GoogleMapProps {
  center: Coordinates | null;
  zoom?: number;
  markers?: MarkerProps[];
  onPinChange?: (newPos: Coordinates) => void;
  interactive?: boolean;
  className?: string;
  height?: string;
  showRoute?: boolean;
  onRetryLocation?: () => void;
}

export function GoogleMap({
  center,
  zoom = 14,
  markers = [],
  onPinChange,
  interactive = true,
  className = "",
  height = "h-72 sm:h-80",
  showRoute = false,
  onRetryLocation,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const googleMarkersRef = useRef<google.maps.Marker[]>([]);
  const routePolylineRef = useRef<google.maps.Polyline | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [googleLoaded, setGoogleLoaded] = useState<boolean>(
    () => typeof window !== "undefined" && Boolean(window.google?.maps)
  );
  const [scriptError, setScriptError] = useState<string | null>(null);
  const loadError = !apiKey ? "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured." : scriptError;

  // Script Injection
  useEffect(() => {
    if (!apiKey) return;

    if (typeof window !== "undefined" && Boolean(window.google?.maps)) {
      return;
    }

    const scriptId = "google-maps-js-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setGoogleLoaded(true);
        setScriptError(null);
      };

      script.onerror = () => {
        setScriptError("Failed to load Google Maps JavaScript API SDK.");
      };

      document.head.appendChild(script);
    } else {
      const handleLoad = () => setGoogleLoaded(true);
      const handleError = () => setScriptError("Failed to load Google Maps JavaScript API SDK.");
      script.addEventListener("load", handleLoad);
      script.addEventListener("error", handleError);

      return () => {
        script.removeEventListener("load", handleLoad);
        script.removeEventListener("error", handleError);
      };
    }
  }, [apiKey]);

  // Google Map Initialization & Center Updates
  useEffect(() => {
    if (!googleLoaded || !mapRef.current || !window.google?.maps || !center) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: center.lat, lng: center.lng },
        zoom,
        disableDefaultUI: !interactive,
        zoomControl: interactive,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    } else {
      mapInstanceRef.current.setCenter({ lat: center.lat, lng: center.lng });
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [googleLoaded, center, zoom, interactive]);

  // Markers & Route Rendering
  useEffect(() => {
    if (!googleLoaded || !mapInstanceRef.current || !window.google?.maps) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    googleMarkersRef.current.forEach((m) => m.setMap(null));
    googleMarkersRef.current = [];

    // Clear existing route polyline
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }

    // Render Markers
    markers.forEach((m) => {
      let icon: string | google.maps.Icon | undefined = undefined;

      if (m.type === "buyer" || m.type === "user") {
        icon = {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: "#56642B",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 3,
        };
      } else if (m.type === "seller") {
        icon = {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: "#7D562D",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        };
      } else if (m.type === "listing") {
        icon = {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#8A9A5B",
          fillOpacity: 0.9,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        };
      }

      const marker = new window.google.maps.Marker({
        position: { lat: m.position.lat, lng: m.position.lng },
        map,
        title: m.title || "Location",
        icon,
        draggable: m.draggable && interactive,
      });

      if (m.draggable && onPinChange) {
        marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onPinChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          }
        });
      }

      googleMarkersRef.current.push(marker);
    });

    // Render Route if requested
    if (showRoute) {
      const buyerOrUser = markers.find((m) => m.type === "buyer" || m.type === "user");
      const seller = markers.find((m) => m.type === "seller" || m.type === "listing");

      if (buyerOrUser && seller) {
        getDirectionsRoute(seller.position, buyerOrUser.position).then((route) => {
          if (route.polylinePath && route.polylinePath.length > 0 && mapInstanceRef.current) {
            const path = route.polylinePath.map((p) => ({ lat: p.lat, lng: p.lng }));
            routePolylineRef.current = new window.google.maps.Polyline({
              path,
              geodesic: true,
              strokeColor: "#8A9A5B",
              strokeOpacity: 0.9,
              strokeWeight: 5,
              map: mapInstanceRef.current,
            });
          }
        });
      }
    }
  }, [googleLoaded, markers, showRoute, interactive, onPinChange]);

  // Handle Missing API Key / Load Error State
  if (!apiKey || loadError) {
    return (
      <div
        className={`relative w-full ${height} bg-[#F0EDED] rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-[#E4E2E1] space-y-3 ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-[#BA1A1A]/10 text-[#BA1A1A] flex items-center justify-center">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-[#1B1C1C]">Google Maps Key Missing or Invalid</h4>
          <p className="text-xs text-[#76786B] max-w-md mt-1">
            {loadError || "Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local to enable interactive discovery maps."}
          </p>
        </div>
      </div>
    );
  }

  // Handle No Coordinates State (Location Permission Denied or Loading)
  if (!center) {
    return (
      <div
        className={`relative w-full ${height} bg-[#F0EDED] rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-[#E4E2E1] space-y-3 ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-[#8A9A5B]/15 text-[#56642B] flex items-center justify-center">
          <AlertCircle size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-[#1B1C1C]">Location Access Required</h4>
          <p className="text-xs text-[#76786B] max-w-sm">
            Enable location access in your browser or search for a city/address to view nearby items on the map.
          </p>
        </div>
        {onRetryLocation && (
          <button
            type="button"
            onClick={onRetryLocation}
            className="px-4 py-2 bg-[#56642B] text-white rounded-full text-xs font-bold shadow-xs hover:bg-[#8A9A5B] transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Enable / Retry Location</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${height} rounded-3xl overflow-hidden shadow-sm border border-[#E4E2E1] ${className}`}
    >
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
