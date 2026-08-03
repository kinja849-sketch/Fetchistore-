import { z } from "zod";

export const listingFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  category_id: z.string().min(1, "Please select a category"),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  price: z.coerce.number().min(0.01, "Price must be greater than $0"),
  old_price: z.coerce.number().optional().nullable(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  imageUrl: z.string().url("Please provide a valid image URL"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;
