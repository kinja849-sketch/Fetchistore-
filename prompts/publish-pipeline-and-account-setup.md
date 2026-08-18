# Implementation Prompt: Full Publish Pipeline & Cross-User Listings Discovery

## Goal
Close the full publish pipeline and account setup sync for Fetchistore:
1. On account setup / login, automatically sync Clerk user identity into Supabase `public.profiles` (upserting Clerk user ID as `id`, name, avatar, phone, preferred radius).
2. On publishing a listing, send real Clerk user ID as `seller_id`, resolve valid `category_id` (UUID) from database, format PostGIS `location geography(POINT, 4326)`, and set `is_active: true`.
3. Load active listings cross-user from Supabase in `getListings()`, `ListingsContext`, `/shop`, and `/` home feed so published listings are immediately visible to all users.
4. Debug and safeguard production failure modes: missing env keys, RLS compatibility for Clerk text IDs, category UUID vs slug mismatch, geography format string, and form client state vs server action persistence.

## Skills & Reference Read
- `AGENTS.md` (Product rules, schema, RLS, server actions, client context)
- `supabase/schema.sql` (Profiles text ID primary key, listings PostGIS location, categories UUIDs, RLS policies)

## Inspect Code
- `app/actions/listings.ts`
- `app/actions/profile.ts`
- `app/actions/categories.ts`
- `lib/listings-context.tsx`
- `lib/supabase/auth-context.tsx`
- `app/seller/listings/create/page.tsx`
- `app/shop/page.tsx`
- `components/home/authenticated-feed.tsx`

## Decisions
1. **User Identity Sync**:
   Create a client component `<UserSync />` (or integrate in `AuthProvider`/`Layout`) that listens to Clerk `useUser()`. When `user` is present, it invokes `upsertProfileFromClerk` server action to keep `profiles` row synced in Supabase with Clerk ID (`user.id`), name, avatar, and phone.
2. **Category UUID & Slug Resolution**:
   In `createListing` server action and create listing form, dynamically fetch/map categories from Supabase `categories` table. Pass the actual category `id` (UUID) into `category_id` column and slug into `category_slug` column.
3. **Geography Point Formatting**:
   Ensure `location` is formatted as `'POINT(lng lat)'` or `'SRID=4326;POINT(lng lat)'` with valid numbers, and handle default coordinates (`-122.6784 45.5152`) if not provided.
4. **Listings Context & Discovery**:
   Ensure `getListings()` fetches `is_active = true` listings from Supabase, mapping coordinates and distance. On `addListing()`, call `refreshListings()` and `revalidatePath()`.

## Files to Change
- `app/actions/profile.ts` (Add `upsertProfileFromClerk`)
- `app/actions/listings.ts` (Fix `createListing` category UUID lookup, PostGIS format, and `seller_id` sync; update `getListings`)
- `components/shared/user-sync.tsx` [NEW] (Sync Clerk user state to Supabase `profiles`)
- `app/layout.tsx` (Mount `<UserSync />`)
- `lib/listings-context.tsx` (Ensure `addListing` passes Clerk user ID, category UUID, coordinates and triggers refetch)
- `app/seller/listings/create/page.tsx` (Fetch categories from DB, pass Clerk user ID, coordinates, call `addListing`)
- `app/shop/page.tsx` & `components/home/authenticated-feed.tsx` (Ensure rendering active Supabase listings)

## Acceptance Criteria
- Signing in with Clerk creates/upserts a row in Supabase `public.profiles` matching the Clerk user ID.
- Publishing a listing inserts a row in Supabase `public.listings` with valid `seller_id`, `category_id` (UUID), `location` (PostGIS geography point), and `is_active: true`.
- Published listings appear immediately on `/shop` and `/` home feed across all browsers/clients.
- `npm run typecheck` and `npm run lint` pass without errors.
