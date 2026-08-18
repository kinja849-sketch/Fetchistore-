# Real Data End-to-End Implementation Prompt

## Goal
Establish a 100% real Supabase data layer across all core application flows (Home, Discover/Shop, Product Detail, Seller Dashboard, Create Listing, Cart, Checkout, Orders/Tracking, Categories, and Profiles). Eliminate all mock demo arrays, hard-coded product cards, and local-storage fallbacks so the app reads and writes exclusively from Supabase Postgres.

---

## Skills & Reference Reading
- `.agents/skills/ui-design/SKILL.md` (Clarkson structure + NovaTrend visual language)
- `.agents/skills/supabase` (Schema, RLS, typed queries)
- `AGENTS.md` (Tech stack, locked models, order statuses, RLS principles)

---

## Code Inspected
- `supabase/schema.sql`
- `app/actions/listings.ts`
- `app/actions/profile.ts`
- `app/actions/orders.ts` (to be established)
- `app/page.tsx`, `app/shop/page.tsx`, `app/product/[id]/page.tsx`
- `app/seller/listings/page.tsx`, `app/seller/listings/create/page.tsx`
- `app/checkout/page.tsx`, `app/orders/page.tsx`, `app/orders/[id]/page.tsx`
- `lib/listings-context.tsx`, `lib/demo-data.ts`

---

## Key Decisions & Architecture Changes

1. **Clerk User ID & Schema Compatibility**:
   - Update `supabase/schema.sql` so user ID columns (`profiles.id`, `listings.seller_id`, `orders.buyer_id`, `orders.seller_id`, `conversations.buyer_id`, `conversations.seller_id`, `messages.sender_id`, `addresses.buyer_id`, `logs.actor_id`) use `text` instead of strict Supabase `auth.users(id)` UUIDs. This accommodates Clerk string IDs (`user_...`) as well as UUIDs without schema violation errors.
   - Provide SQL commands to be executed in the Supabase SQL Editor if needed, and update local schema types.

2. **Server Actions (No Mock Fallbacks)**:
   - **`app/actions/listings.ts`**: Update `getListings`, `getListingById`, `createListing`, `updateListing`, `deleteListing` to query Supabase directly. Remove all fallback imports from `demo-data.ts`. If queries return empty results, return `data: []` or `data: null` rather than inventing demo items.
   - **`app/actions/orders.ts`**: Create server actions `createOrderAction`, `getUserOrdersAction`, `getOrderByIdAction`, `getSellerOrdersAction`, `updateOrderStatusAction`. Inserts insert real rows into `public.orders` and `public.order_items`.
   - **`app/actions/categories.ts`**: Create server action `getCategories` to load categories directly from `public.categories`.

3. **Context & State Cleanups**:
   - Update `lib/listings-context.tsx` or replace local context with direct server-action / TanStack Query hooks so pages render data from Supabase.
   - Ensure `CartContext` passes real listing IDs and seller IDs to checkout.

4. **Page & Component Integration**:
   - **Home (`app/page.tsx`)**: Read active listings and categories from Supabase actions. Render empty state gracefully when database is empty.
   - **Shop (`app/shop/page.tsx`, `app/categories/page.tsx`)**: Connect category pills and filters directly to `getListings` parameters.
   - **Product Detail (`app/product/[id]/page.tsx`)**: Fetch single listing by ID from Supabase `listings`. Show 404/not found if missing.
   - **Seller Dashboard (`app/seller/listings/page.tsx`)**: Filter `listings` where `seller_id = userId`.
   - **Create Listing (`app/seller/listings/create/page.tsx`)**: Form submit calls `createListingAction`, inserting into Supabase `listings` with active user's ID.
   - **Checkout (`app/checkout/page.tsx`)**: Submitting form calls `createOrderAction`, creating `orders` and `order_items` in Supabase, then redirecting to `/orders/[id]`.
   - **Orders Page (`app/orders/page.tsx`, `app/orders/[id]/page.tsx`)**: Fetch real buyer orders from `orders` table.

---

## Files to Modify / Create

- `supabase/schema.sql` (update user ID types to `text` and adjust RLS policies)
- `app/actions/listings.ts` (purge demo fallbacks, strictly return Supabase rows)
- `app/actions/orders.ts` (NEW - order creation, listing items, status retrieval)
- `app/actions/categories.ts` (NEW - category listing fetch)
- `app/actions/profile.ts` (user profile sync with Supabase `profiles` table)
- `lib/listings-context.tsx` (remove `INITIAL_DEMO_LISTINGS` fallback)
- `app/page.tsx`
- `app/shop/page.tsx`
- `app/product/[id]/page.tsx`
- `app/seller/listings/page.tsx`
- `app/seller/listings/create/page.tsx`
- `app/checkout/page.tsx`
- `app/orders/page.tsx`
- `app/orders/[id]/page.tsx`

---

## Security & RLS Requirements
- RLS enabled on all tables.
- Public read access for active listings (`is_active = true`) and categories.
- User-restricted writes for listings (`seller_id = userId`).
- Order viewing restricted to `buyer_id = userId` or `seller_id = userId`.
- Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`) strictly kept on server side.

---

## Acceptance Criteria
1. `npm run typecheck` passes with 0 errors.
2. `npm run lint` passes with 0 errors.
3. Home, Shop, Product Detail, Seller Dashboard, Checkout, and Orders pages operate strictly against Supabase database tables.
4. Empty database state shows clean empty UI, never invents mock product items.
5. Creating a listing persists to `public.listings`.
6. Placing an order persists to `public.orders` and `public.order_items` and appears immediately in `/orders`.

---

## Verification Plan

### Automated Checks
```bash
npm run typecheck
npm run lint
```

### Manual Verification
1. Load `/` and `/shop` - verify listings render from Supabase.
2. Create a new listing at `/seller/listings/create` - verify row is created in `listings`.
3. View `/seller/listings` - verify only user's active listings appear.
4. Add product to cart and complete checkout at `/checkout` - verify order row is created in `orders` and `order_items`.
5. Visit `/orders` - verify newly created order appears in buyer's order history.
