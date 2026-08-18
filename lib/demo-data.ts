// ──────────────────────────────────────────────
// Demo data for the Fetchistore homepage.
// Replace with Supabase queries once the schema is live.
// ──────────────────────────────────────────────

export type ProductCondition = "new" | "like_new" | "good" | "fair";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  condition: ProductCondition;
  imageSrc: string;
  distance: number; // km
  category?: string;
}

export interface Category {
  name: string;
  slug: string;
  imageSrc: string;
}

// ── New Arrivals ────────────────────────────────

export const newArrivals: Product[] = [
  {
    id: "na-1",
    title: "Essential Hoodie",
    description: "Unisex Streetwear",
    price: 49.99,
    oldPrice: 79.99,
    condition: "new",
    imageSrc:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=720&fit=crop&q=80",
    distance: 1.2,
  },
  {
    id: "na-2",
    title: "Air Max 270",
    description: "Men's Running Shoe",
    price: 129.99,
    oldPrice: 159.99,
    condition: "like_new",
    imageSrc:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=720&fit=crop&q=80",
    distance: 3.4,
  },
  {
    id: "na-3",
    title: "Wireless Headphones",
    description: "Noise Cancelling",
    price: 89.99,
    condition: "new",
    imageSrc:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=720&fit=crop&q=80",
    distance: 0.8,
  },
  {
    id: "na-4",
    title: "Smart Watch Series 5",
    description: "Fitness Tracker",
    price: 199.99,
    oldPrice: 249.99,
    condition: "new",
    imageSrc:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=720&fit=crop&q=80",
    distance: 5.1,
  },
];

// ── Top Sellers ─────────────────────────────────

export const topSellers: Product[] = [
  {
    id: "ts-1",
    title: "Classic Leather Bag",
    description: "Women's Handbag",
    price: 64.99,
    oldPrice: 99.99,
    condition: "good",
    imageSrc:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=720&fit=crop&q=80",
    distance: 2.1,
  },
  {
    id: "ts-2",
    title: "Retro Sunglasses",
    description: "Unisex Eyewear",
    price: 34.99,
    condition: "like_new",
    imageSrc:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=720&fit=crop&q=80",
    distance: 1.8,
  },
  {
    id: "ts-3",
    title: "Minimalist Backpack",
    description: "Daily Carry",
    price: 55.99,
    oldPrice: 89.99,
    condition: "fair",
    imageSrc:
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=720&fit=crop&q=80",
    distance: 4.5,
  },
  {
    id: "ts-4",
    title: "Running Sneakers",
    description: "Men's Athletic",
    price: 74.99,
    oldPrice: 119.99,
    condition: "new",
    imageSrc:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=720&fit=crop&q=80",
    distance: 0.5,
  },
];

// ── Categories ──────────────────────────────────

export const categories: Category[] = [
  {
    name: "Fashion",
    slug: "fashion",
    imageSrc:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Electronics",
    slug: "electronics",
    imageSrc:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Beauty",
    slug: "beauty",
    imageSrc:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Fitness",
    slug: "fitness",
    imageSrc:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Home Decor",
    slug: "home-decor",
    imageSrc:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    imageSrc:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop&q=80",
  },
];

// ── Gallery images for Subscribe section ────────

export const galleryImages: string[] = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&q=80",
];
