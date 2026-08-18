"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Coordinates } from "@/lib/geo";
import { getPlacePredictionsAction, getPlaceDetailsAction, PlacePrediction } from "@/app/actions/places";

interface PlacesAutocompleteProps {
  onPlaceSelect: (coords: Coordinates, addressText: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function PlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Search location or address...",
  className = "",
  defaultValue = "",
}: PlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [prevDefault, setPrevDefault] = useState(defaultValue);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (defaultValue !== prevDefault) {
    setPrevDefault(defaultValue);
    setInputValue(defaultValue);
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Place Predictions Fetch
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (!inputValue || inputValue.trim().length < 2) {
        if (active) {
          setPredictions([]);
          setIsOpen(false);
          setIsSearching(false);
        }
        return;
      }

      setIsSearching(true);
      const res = await getPlacePredictionsAction(inputValue);
      if (active) {
        setPredictions(res.predictions || []);
        setIsOpen(res.predictions && res.predictions.length > 0);
        setIsSearching(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [inputValue]);

  const handleSelectPrediction = async (item: PlacePrediction) => {
    setInputValue(item.description);
    setIsOpen(false);
    setPredictions([]);

    const res = await getPlaceDetailsAction(item.placeId);
    if (res.details) {
      onPlaceSelect({ lat: res.details.lat, lng: res.details.lng }, res.details.address);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76786B] flex items-center pointer-events-none">
        {isSearching ? (
          <Loader2 size={18} className="text-[#56642B] animate-spin" />
        ) : (
          <Search size={18} />
        )}
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => {
          if (predictions.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-[#F0EDED] text-[#1B1C1C] rounded-full text-sm font-medium border border-transparent focus:border-[#8A9A5B] focus:bg-white focus:outline-none transition-all placeholder:text-[#76786B]"
      />

      {isOpen && predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E4E2E1] z-50 overflow-hidden max-h-60 overflow-y-auto">
          {predictions.map((item) => (
            <button
              key={item.placeId}
              type="button"
              onClick={() => handleSelectPrediction(item)}
              className="w-full text-left px-4 py-3 hover:bg-[#F6F3F2] transition-colors border-b border-[#F0EDED] last:border-0 flex items-start space-x-2.5 cursor-pointer"
            >
              <MapPin size={16} className="text-[#56642B] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-[#1B1C1C] truncate">
                  {item.mainText || item.description}
                </div>
                {item.secondaryText && (
                  <div className="text-[10px] text-[#76786B] font-semibold truncate">
                    {item.secondaryText}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
