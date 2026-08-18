"use server";

import { createClient } from "@/lib/supabase/server";
import { ensureProfileExists } from "@/app/actions/profile";
import { OrderStatus, PaymentMethod, Order } from "@/lib/supabase/types";

export interface CreateOrderItemInput {
  listingId?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderInput {
  buyerId: string;
  sellerId?: string;
  paymentMethod: PaymentMethod;
  total: number;
  deliveryAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  items: CreateOrderItemInput[];
}

export async function createOrder(input: CreateOrderInput): Promise<{
  orderId: string | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    
    // Ensure buyer and seller profiles exist
    const buyerId = input.buyerId || "demo-buyer-1";
    const sellerId = input.sellerId || "demo-seller-1";
    await ensureProfileExists(buyerId);
    await ensureProfileExists(sellerId);

    const initialStatus: OrderStatus = input.paymentMethod === "cod" ? "cod_pending" : "paid";

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: buyerId,
        seller_id: sellerId,
        status: initialStatus,
        payment_method: input.paymentMethod,
        payment_status: input.paymentMethod === "cod" ? "unpaid" : "paid",
        total: input.total,
        delivery_address: input.deliveryAddress,
      })
      .select("id")
      .single();

    if (orderError || !orderData) {
      console.error("Order creation failed in Supabase:", orderError);
      return { orderId: null, error: orderError?.message || "Failed to create order" };
    }

    const orderId = orderData.id;

    // Insert order items
    if (input.items && input.items.length > 0) {
      const itemRows = input.items.map((item) => ({
        order_id: orderId,
        listing_id: item.listingId || null,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
      if (itemsError) {
        console.error("Failed to insert order items:", itemsError);
      }
    }

    // Insert initial delivery update timeline row
    await supabase.from("delivery_updates").insert({
      order_id: orderId,
      status: initialStatus,
      note: input.paymentMethod === "cod" ? "Order placed via Cash on Delivery" : "Order placed and paid",
    });

    return { orderId, error: null };
  } catch (err: unknown) {
    return { orderId: null, error: (err as Error).message };
  }
}

export async function getUserOrders(buyerId: string): Promise<{
  data: Order[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*), delivery_updates(*)")
      .eq("buyer_id", buyerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      return { data: [], error: error.message };
    }

    return { data: (data as Order[]) || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: (err as Error).message };
  }
}

export async function getSellerOrders(sellerId: string): Promise<{
  data: Order[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*), delivery_updates(*)")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as Order[]) || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: (err as Error).message };
  }
}

export async function getOrderById(orderId: string): Promise<{
  data: Order | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*), delivery_updates(*)")
      .eq("id", orderId)
      .single();

    if (error || !data) {
      return { data: null, error: error ? error.message : "Order not found" };
    }

    return { data: data as Order, error: null };
  } catch (err: unknown) {
    return { data: null, error: (err as Error).message };
  }
}
