"use server";

import { createClient } from "@/lib/supabase/server";
import { Category } from "@/lib/supabase/types";

export async function getCategories(): Promise<{
  data: Category[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: (err as Error).message };
  }
}
