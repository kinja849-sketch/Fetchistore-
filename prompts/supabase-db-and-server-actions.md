# Implementation Prompt: Task 1 — Supabase DB Execution & Server Actions

## 1. Goal
Execute the Supabase database schema & RLS policies, clean up residual Clerk dependencies, build typed Supabase Server Actions for Listings CRUD, categories, profiles, and PostGIS distance-based proximity discovery, while maintaining safe client fallback for local demo state.

## 2. Skills Read & Code Inspected
- **Skills**: Section 8 & Section 14 of `AGENTS.md` (Supabase DB, PostGIS, Storage, RLS, Env Security).
- **Code Inspected**:
  - `supabase/schema.sql` (Tables: profiles, categories, listings, orders, order_items, delivery_updates, delivery_locations, conversations, messages, logs)
  - `lib/supabase/client.ts`
  - `lib/supabase/server.ts`
  - `lib/supabase/types.ts`
  - `lib/supabase/auth-context.tsx`
  - `package.json` (Removing `@clerk/nextjs` residual package)
  - `app/page.tsx`, `components/shared/navbar.tsx`

## 3. Key Decisions
1. **Auth Enforcement**: Standardize strictly on Supabase Auth. Completely remove `@clerk/nextjs` from `package.json` and imports.
2. **Server Actions Layer**: Create `app/actions/listings.ts` and `app/actions/profile.ts` using `lib/supabase/server.ts` for privileged database writes and PostGIS spatial distance filtering (`ST_DWithin` / `ST_Distance`).
3. **Graceful Fallback**: If Supabase environment variables are missing or unconfigured, server actions and auth helpers must fallback cleanly to demo data (`lib/demo-data.ts`) so local offline development never breaks.
4. **Storage Bucket Rules**: Define standard bucket access helpers for `listing-images` and `avatars`.

## 4. Files to Change / Create
- `[DELETE]` `prompts/auth-clerk.md` (Cleanup outdated prompt)
- `[MODIFY]` `package.json` (Remove `@clerk/nextjs`)
- `[MODIFY]` `app/page.tsx` (Remove Clerk imports; use Supabase `useAuth` hook)
- `[MODIFY]` `lib/supabase/server.ts` & `lib/supabase/client.ts` (Robust error handling and type exports)
- `[NEW]` `app/actions/listings.ts` (Server Actions: `getListings`, `getListingById`, `createListing`, `updateListing`, `deleteListing`, `getNearbyListings`)
- `[NEW]` `app/actions/profile.ts` (Server Actions: `getProfile`, `updateProfile`)
- `[MODIFY]` `components/home/authenticated-feed.tsx` & `components/home/unauthenticated-welcome.tsx`
- `[MODIFY]` `app/seller/listings/create/page.tsx` (Wire creation form to `createListing` server action with context fallback)

## 5. Implementation Requirements
- All database queries must enforce Row Level Security (RLS) policies.
- Distance query must support `lat`, `lng`, and `radius_km` parameter filtering.
- Listing payload must validate `title`, `price`, `condition`, `category`, `image_url`, `location` using Zod schema (`lib/validations/listing.ts`).
- Storage upload helper must return public URLs from Supabase Storage `listing-images`.

## 6. Security Requirements
- `SUPABASE_SERVICE_ROLE_KEY` must NEVER be exposed to browser code.
- Client requests must use `@supabase/ssr` with RLS constraints active.

## 7. Acceptance Criteria
- `@clerk/nextjs` removed completely from dependencies and codebase without build errors.
- `getListings` and `createListing` server actions function properly with Supabase database or graceful demo fallback.
- `npm run typecheck` passes with zero errors.
- Dev server running smoothly on `http://localhost:3000`.

## 8. Checks & Test Steps
1. Run `cmd /c "npx tsc --noEmit"` to verify 0 type errors.
2. Open `http://localhost:3000` in the browser to confirm homepage loads smoothly without Clerk errors.
3. Test listing creation flow at `http://localhost:3000/seller/listings/create`.
