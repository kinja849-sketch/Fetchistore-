"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listingFormSchema, ListingFormValues } from "@/lib/validations/listing";

export async function createListingAction(values: ListingFormValues, sellerId: string) {
  const validated = listingFormSchema.parse(values);
  const supabase = await createClient();

  // Format PostGIS WKT string for spatial location
  const locationWkt = `POINT(${validated.longitude} ${validated.latitude})`;

  const { error } = await supabase
    .from("listings")
    .insert({
      seller_id: sellerId,
      category_id: validated.category_id,
      title: validated.title,
      description: validated.description,
      condition: validated.condition,
      price: validated.price,
      old_price: validated.old_price || null,
      quantity: validated.quantity,
      images: [validated.imageUrl],
      location: locationWkt,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating listing:", error);
    throw new Error(error.message || "Failed to create listing.");
  }

  revalidatePath("/listings");
  revalidatePath("/");
  redirect("/listings");
}

export async function toggleListingActiveAction(id: string, currentStatus: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("listings")
    .update({ is_active: !currentStatus })
    .eq("id", id);

  if (error) {
    throw new Error("Failed to update listing status.");
  }

  revalidatePath("/listings");
  revalidatePath("/");
}

export async function deleteListingAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("listings").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete listing.");
  }

  revalidatePath("/listings");
  revalidatePath("/");
}
