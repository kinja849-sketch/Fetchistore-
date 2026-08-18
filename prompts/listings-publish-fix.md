# Implementation Prompt: Seller Listing Publish & Cross-User Discovery Fix

## Goal
Fix listing publishing from `/seller/listings/create` so every published item reliably writes to Supabase `public.listings` with valid Clerk seller ID, category UUID, PostGIS geography coordinates, and `is_active: true`. Ensure published listings immediately appear across all users on Shop/Discover and on the seller's active listings dashboard without relying on local storage or hardcoded demo feeds.

## Skills & Reference Read
- `AGENTS.md` (Product scope, tech stack, RLS, server actions, listing rules)
- `supabase/schema.sql` (Tables: profiles, categories, listings; RLS policies; PostGIS RPC)
- `.agents/skills/ui-design` (NovaTrend visual language & Clarkson UI structure)

## Inspect Code
- `app/seller/listings/create/page.tsx` (Primary seller publish UI)
- `app/(dashboard)/listings/new/page.tsx` (Alternate create route -> redirect)
- `app/(dashboard)/listings/page.tsx` (Alternate seller listings route -> redirect/sync)
- `app/seller/listings/page.tsx` (Active seller listings dashboard)
- `app/actions/listings.ts` (Server actions `createListing`, `getListings`)
- `lib/listings-context.tsx` (`ListingsProvider`, `addListing`, `refreshListings`)
- `lib/supabase/admin.ts` (Admin/Service-role client helper)

## Key Technical Decisions
1. **Unified Publish Route**:
   - `/seller/listings/create` is the single canonical create listing page.
   - Redirect `/listings/new` to `/seller/listings/create`.
   - Redirect `/listings` to `/seller/listings`.

2. **Form Category & Map Coordinates**:
   - Select element loads real UUID `id` from seeded `public.categories`.
   - `coords` state (`{ lat, lng }`) from map pin picker is passed to `addListing(...)` and server action for PostGIS `POINT(lng lat)` format.

3. **Database Write & Error Handling**:
   - `createListing` server action uses admin/server client to ensure inserts succeed regardless of client auth token state.
   - Ensures seller profile exists in `public.profiles` via `ensureProfileExists(sellerId)`.
   - Returns `{ data, error }`. On error, `/seller/listings/create` displays explicit error toast/banner and halts. On success, calls `refreshListings()`, shows success toast, and redirects.

4. **Cross-User Discovery & Seller Dashboard**:
   - `getListings` returns all `is_active = true` rows from `public.listings`.
   - `ListingsContext` maps `category_slug` to item category instead of hardcoding `"general"`.
   - `/seller/listings` renders active items directly from database via `ListingsContext`.

## Files to Change / Create
- `supabase/clerk-compat.sql` [NEW] (Schema compatibility script & RLS policies verification)
- `lib/supabase/admin.ts` [NEW] (Admin client helper for privileged server operations)
- `app/actions/listings.ts` (Fix `createListing` category resolution, PostGIS location format, error returns, and `category` mapping in `getListings`)
- `lib/listings-context.tsx` (Pass lat/lng in `addListing`, map `category_slug` in listing items, handle errors)
- `app/seller/listings/create/page.tsx` (Wire map pin coords, handle `addListing` error result, show failure alert if failed, refresh listings & redirect on success)
- `app/seller/listings/page.tsx` (Render DB listings using `useListings()`)
- `app/(dashboard)/listings/new/page.tsx` (Redirect to `/seller/listings/create`)
- `app/(dashboard)/listings/page.tsx` (Redirect to `/seller/listings`)

## Acceptance Criteria
1. Publishing from `/seller/listings/create` inserts one row into Supabase `public.listings` with Clerk `seller_id`, valid `category_id`, title, description, condition, price, image URL array, PostGIS geography point, and `is_active = true`.
2. Seller A publishing an item immediately sees it on `/seller/listings` and `/shop` / `/` discover feeds across all users/sessions.
3. If an insert fails (due to DB error, missing fields, or network failure), an explicit error message is displayed on the create form and no false success toast or redirect occurs.
4. `cmd /c npm run typecheck` and `cmd /c npm run lint` pass cleanly with zero errors.

## Verification Steps
1. Run `cmd /c npm run typecheck` to confirm zero TypeScript compilation errors.
2. Run `cmd /c npm run lint` to confirm zero ESLint errors.
3. Verify `/seller/listings/create` form validation, map pin coordinate binding, category dropdown UUID binding, and failure error handling.
