"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { upsertProfileFromClerk } from "@/app/actions/profile";

export function UserSync() {
  const { user, isLoaded } = useUser();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (syncedRef.current === user.id) return;

    syncedRef.current = user.id;

    const phone =
      user.primaryPhoneNumber?.phoneNumber ||
      (user.phoneNumbers && user.phoneNumbers.length > 0 ? user.phoneNumbers[0].phoneNumber : null);

    upsertProfileFromClerk({
      userId: user.id,
      fullName: user.fullName || user.username || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "Fetchistore User",
      avatarUrl: user.imageUrl || null,
      phone: phone || null,
    }).catch((err) => {
      console.error("Failed to sync user with Supabase profile:", err);
    });
  }, [user, isLoaded]);

  return null;
}
