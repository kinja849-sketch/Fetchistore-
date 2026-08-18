"use server";

import { createClient } from "@/lib/supabase/server";
import { UserProfileData } from "@/lib/supabase/auth-context";

export async function getProfile(): Promise<{
  data: UserProfileData | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      return {
        data: {
          fullName: user.user_metadata?.full_name || "",
          avatarUrl: user.user_metadata?.avatar_url || "",
          location: "Greenpoint, NY",
          radiusKm: 5,
          phone: "+1 (555) 234-5678",
          bio: "Pre-loved fashion & sustainable home decor enthusiast.",
        },
        error: null,
      };
    }

    return {
      data: {
        fullName: data.full_name || "",
        avatarUrl: data.avatar_url || "",
        location: data.address_text || "Greenpoint, NY",
        radiusKm: data.preferred_radius_km || 5,
        phone: data.phone || "",
        bio: data.bio || "",
      },
      error: null,
    };
  } catch (err: unknown) {
    return { data: null, error: (err as Error).message };
  }
}

export async function updateProfile(input: Partial<UserProfileData>): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: input.fullName,
      avatar_url: input.avatarUrl,
      preferred_radius_km: input.radiusKm,
      phone: input.phone,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export interface ClerkProfileSyncInput {
  userId: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  preferredRadiusKm?: number;
}

export async function upsertProfileFromClerk(input: ClerkProfileSyncInput): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    if (!input.userId) {
      return { success: false, error: "No Clerk user ID provided" };
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: input.userId,
        full_name: input.fullName || "Fetchistore User",
        avatar_url: input.avatarUrl || null,
        phone: input.phone || null,
        preferred_radius_km: input.preferredRadiusKm ?? 10.0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Failed to sync profile from Clerk to Supabase:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    console.error("Error in upsertProfileFromClerk:", err);
    return { success: false, error: (err as Error).message };
  }
}

export async function ensureProfileExists(userId: string, name?: string, avatarUrl?: string): Promise<void> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("id").eq("id", userId).single();
    if (!data) {
      await supabase.from("profiles").upsert(
        {
          id: userId,
          full_name: name || "Fetchistore User",
          avatar_url: avatarUrl || null,
          role: "user",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    }
  } catch (e) {
    console.error("Failed to ensure profile exists:", e);
  }
}
