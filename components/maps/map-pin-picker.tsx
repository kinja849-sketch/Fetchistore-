"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Check, X } from "lucide-react";
import { Coordinates } from "@/lib/geo";
import { GoogleMap } from "@/components/maps/google-map";
import { useUserLocation } from "@/lib/hooks/use-user-location";
import { PlacesAutocomplete } from "@/components/maps/places-autocomplete";

export interface MapPinPickerProps {
  initialCoordinates?: Coordinates | null;
  onSelectCoordinates: (coords: Coordinates, addressText?: string) => void;
  onClose?: () => void;
  title?: string;
  isModal?: boolean;
}

export function MapPinPicker({
  initialCoordinates = null,
  onSelectCoordinates,
  onClose,
  title = "Select Location on Map",
  isModal = true,
}: MapPinPickerProps) {
  const { location: userLocation, status: locStatus, refreshLocation } = useUserLocation();
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | null>(
    initialCoordinates || userLocation
  );
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const activeCoords = selectedCoords || userLocation;

  const handleGetCurrentLocation = () => {
    refreshLocation();
    if (userLocation) {
      setSelectedCoords(userLocation);
    }
  };

  const handleConfirm = () => {
    if (activeCoords) {
      onSelectCoordinates(activeCoords, selectedAddress);
      if (onClose) onClose();
    }
  };

  const content = (
    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-[#E4E2E1] space-y-4 max-w-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E4E2E1] pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#8A9A5B]/20 text-[#56642B] flex items-center justify-center">
            <MapPin size={18} />
          </div>
          <h3 className="text-base font-extrabold text-[#1B1C1C]">{title}</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Places Search Autocomplete */}
      <div className="space-y-2">
        <PlacesAutocomplete
          onPlaceSelect={(coords, addressText) => {
            setSelectedCoords(coords);
            setSelectedAddress(addressText);
          }}
          placeholder="Search place, city, or address..."
        />

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="w-full py-2.5 px-4 bg-[#8A9A5B]/15 hover:bg-[#8A9A5B]/30 text-[#56642B] font-bold rounded-2xl transition-colors flex items-center justify-center space-x-2 text-xs cursor-pointer"
        >
          <Navigation className={`w-4 h-4 ${locStatus === "loading" ? "animate-spin" : ""}`} />
          <span>
            {locStatus === "loading"
              ? "Detecting GPS..."
              : locStatus === "denied"
              ? "Location Denied (Retry)"
              : "Use Current Geolocation"}
          </span>
        </button>
      </div>

      {/* Map Renderer with Pin Selection */}
      <div className="relative">
        <GoogleMap
          center={activeCoords}
          zoom={14}
          interactive={true}
          height="h-64"
          onRetryLocation={refreshLocation}
          markers={
            activeCoords
              ? [
                  {
                    id: "pin-selection",
                    position: activeCoords,
                    title: "Drag marker to adjust location",
                    type: "pin",
                    draggable: true,
                  },
                ]
              : []
          }
          onPinChange={(newPos) => setSelectedCoords(newPos)}
        />
        {activeCoords && (
          <div className="absolute top-3 left-3 z-20 bg-[#1B1C1C]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-[#D9EAA3] font-mono font-bold shadow-md">
            {activeCoords.lat.toFixed(4)}°, {activeCoords.lng.toFixed(4)}°
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-full transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!activeCoords}
          className="px-5 py-2.5 bg-[#8A9A5B] hover:bg-[#56642B] disabled:opacity-50 text-white font-black text-xs rounded-full shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <Check size={16} />
          <span>Confirm Pin Location</span>
        </button>
      </div>
    </div>
  );

  if (!isModal) return content;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {content}
    </div>
  );
}
