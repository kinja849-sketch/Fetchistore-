export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProductCondition = "new" | "like_new" | "good" | "fair";

export type OrderStatus =
  | "pending"
  | "paid"
  | "cod_pending"
  | "accepted"
  | "out_for_delivery"
  | "nearby"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "stripe" | "bank_transfer" | "ewallet" | "cod";

export type PaymentStatus = "unpaid" | "paid" | "pending" | "refunded";

export interface Profile {
  id: string;
  role: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null; // WKT / PostGIS string
  preferred_radius_km: number;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  buyer_id: string;
  label: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  location: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  category_id: string | null;
  title: string;
  description: string;
  condition: ProductCondition;
  price: number;
  old_price?: number | null;
  currency: string;
  quantity: number;
  images: string[];
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Computed / joined fields
  distance_km?: number;
  category?: Category;
  seller?: Partial<Profile>;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  total: number;
  delivery_address: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  seller?: Partial<Profile>;
  buyer?: Partial<Profile>;
}

export interface OrderItem {
  id: string;
  order_id: string;
  listing_id: string | null;
  quantity: number;
  unit_price: number;
  listing?: Partial<Listing>;
}

export interface DeliveryUpdate {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  location: string | null;
  created_at: string;
}

export interface DeliveryLocation {
  id: string;
  order_id: string;
  location: string;
  recorded_at: string;
}

export interface Conversation {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  last_message?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  meta: Json;
  created_at: string;
}
