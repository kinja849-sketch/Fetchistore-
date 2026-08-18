# Implementation Prompt: Fix Clerk Keyless Message, Enable Multi-Image Upload & Environment Variables

## Goal
Resolve four critical issues reported by the user:
1. Ensure Clerk Auth is enforced for all users (new & existing) and verified users can proceed seamlessly.
2. Fix image upload to support selecting and displaying **multiple product images** (with thumbnail previews and delete buttons) on the Create Listing page.
3. Fix the "Missing NEXT_PUBLIC_SUPABASE_URL in environment variables" error banner and ensure safe environment variable fallbacks across Supabase clients.
4. Completely eliminate and hide the Clerk Keyless mode dev toast/banner ("You've created your first user! Head to the dashboard to customize authentication settings...") so it never appears anywhere in the application.

## Code Inspected & Affected Files
- `app/layout.tsx` (ClerkProvider wrapper)
- `app/globals.css` (Global CSS to suppress keyless prompt overlays)
- `app/seller/listings/create/page.tsx` (Multi-image upload state, inputs, gallery grid, and form submission)
- `lib/listings-context.tsx` (Multi-image input interface and context handling)
- `lib/validations/listing.ts` (Zod schema with array of image URLs)
- `app/actions/listings.ts` (Server action inserting array of images into Supabase)
- `lib/supabase/client.ts`, `lib/supabase/admin.ts`, `lib/supabase/server.ts` (Safe env fallback handling)
- `.env.local` (Local environment variable configuration)

## Key Technical Decisions
1. **Clerk Banner Suppression**: Add explicit `.env.local` Clerk keys and global CSS selectors in `app/globals.css` to hide any Clerk keyless prompt elements from the DOM entirely.
2. **Multi-Image State**: Convert single `imagePreview` string into `images: string[]` array in `CreateListingPage`. Update file input to `multiple`, render thumbnail gallery with delete buttons, and allow adding more photos.
3. **Environment Variable Fallbacks**: Provide default fallback Supabase credentials in client/admin/server factories if `.env.local` variables are omitted, preventing runtime crashes and red banner errors.

## Acceptance Criteria
- [ ] No Clerk keyless prompt toast or notification badge appears in the application UI.
- [ ] Users can upload 1, 2, or multiple photos for a product listing, view thumbnail previews, delete individual photos, and submit them.
- [ ] No "Missing NEXT_PUBLIC_SUPABASE_URL" error banner is shown anywhere on the site.
- [ ] `npm run typecheck` and `npm run lint` pass without errors.
