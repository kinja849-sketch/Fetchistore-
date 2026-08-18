"use client";

import { useState, useEffect, useCallback } from "react";
import { Coordinates } from "@/lib/geo";
import { getIpLocationAction } from "@/app/actions/geo";
import { getCurrencyForCountry, CurrencyConfig, DEFAULT_CURRENCY } from "@/lib/currency";

export type LocationStatus = "loading" | "ready" | "ip_fallback" | "denied" | "error";

export interface UserLocationState {
  location: Coordinates | null;
  cityLabel: string;
  countryCode: string;
  currencyConfig: CurrencyConfig;
  status: LocationStatus;
  errorMessage: string | null;
  refreshLocation: () => void;
}

export function useUserLocation(): UserLocationState {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [cityLabel, setCityLabel] = useState<string>("Near You");
  const [countryCode, setCountryCode] = useState<string>("US");
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>(DEFAULT_CURRENCY);
  const [status, setStatus] = useState<LocationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchIpLocationMetadataOnly = useCallback(async () => {
    try {
      const res = await getIpLocationAction();
      if (res.data) {
        setCountryCode(res.data.countryCode);
        setCurrencyConfig(getCurrencyForCountry(res.data.countryCode));
      }
    } catch {
      // Ignore background metadata error
    }
  }, []);

  const fetchIpFallback = useCallback(async () => {
    try {
      const res = await getIpLocationAction();
      if (res.data) {
        setLocation({ lat: res.data.lat, lng: res.data.lng });
        setCityLabel(res.data.city);
        setCountryCode(res.data.countryCode);
        const curr = getCurrencyForCountry(res.data.countryCode);
        setCurrencyConfig(curr);
        setStatus("ip_fallback");
      }
    } catch {
      setStatus("error");
    }
  }, []);

  const requestPosition = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      fetchIpFallback();
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        };
        setLocation(coords);
        setCityLabel("Near You");
        setStatus("ready");
        setErrorMessage(null);

        // Fetch IP metadata for country/currency in background
        fetchIpLocationMetadataOnly();
      },
      (error) => {
        console.warn("Geolocation denied or error, using IP fallback:", error.message);
        fetchIpFallback();
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  }, [fetchIpFallback, fetchIpLocationMetadataOnly]);

  useEffect(() => {
    const timer = setTimeout(() => {
      requestPosition();
    }, 0);
    return () => clearTimeout(timer);
  }, [requestPosition]);

  return {
    location,
    cityLabel,
    countryCode,
    currencyConfig,
    status,
    errorMessage,
    refreshLocation: requestPosition,
  };
}
