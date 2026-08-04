# Implementation Prompt: Create Listing UI & Authenticated Profile Name Fix

## 1. Goal
Implement the exact `create_listing` visual design from the reference HTML (`c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\create_listing\code.html`), connect listing creation to a persistent global listings store so newly listed products immediately appear in Main Feed, Shop discovery, and Search results (e.g. searching for a listed "phone"), and eliminate all hardcoded "Alex" references in favor of authentic user profile state upon signup/login.

## 2. Skills & References Read
- `AGENTS.md` (Workflow & Rules)
- `.agents/skills/ui-design` (Clarkson structure & NovaTrend visual language)
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\create_listing\code.html` (Reference UI HTML)

## 3. Code Inspected
- `app/seller/listings/create/page.tsx` (Current create listing page)
- `app/profile/page.tsx` (Profile view & user state)
- `lib/supabase/auth-context.tsx` & `components/auth/auth-modal.tsx` (Auth & profile defaults containing hardcoded "Alex")
- `app/shop/page.tsx` (Shop discovery & search filtering)
- `components/home/authenticated-feed.tsx` & `components/home/unauthenticated-welcome.tsx` (Home feed listings)
- `lib/demo-data.ts` (Product types & demo items)

## 4. Key Decisions & Architecture
- **Listings State Management**: Create a `ListingsContext` (`lib/listings-context.tsx`) wrapped around the application in `app/layout.tsx`. It will manage active listings with localStorage persistence and default items so newly created listings immediately populate across all feeds (Home, Shop Discovery, Search, Seller Active Listings).
- **Create Listing UI**: Match `code.html` exactly:
  - Header: Back button + "Create Listing" title (no nav shells).
  - Product Images section: Upload image file or trigger camera input (with live image preview).
  - Product Title input.
  - Condition Segmented Control: New, Like New, Good, Fair with dynamic descriptive subtext.
  - Category selector & Price input.
  - Description textarea.
  - Location input with icon.
  - Listing Summary Bento Card (Sustainable Impact info & 5% Platform Fee).
  - Fixed bottom action bar with "List Product" button.
- **Search Integration**: Ensure `ShopPage` search input and Home page search filter against the combined list of default products and user-created listings from `ListingsContext`.
- **Profile Name Fix**:
  - Remove all hardcoded "Alex" defaults from `lib/supabase/auth-context.tsx`, `auth-modal.tsx`, `profile/page.tsx`, and checkout/orders demo states.
  - Default user identity to authenticated user's full name, email username, or user-chosen name upon signup.
  - Persist profile updates to `localStorage` / auth state.

## 5. Files to Create / Modify
1. `lib/listings-context.tsx` [NEW] — Global state and persistence for listings (CRUD + search support).
2. `app/seller/listings/create/page.tsx` [MODIFY] — Implement the complete reference UI & form handler for listing creation.
3. `app/shop/page.tsx` [MODIFY] — Connect to `ListingsContext` so created products are searchable and displayed in Shop.
4. `components/home/authenticated-feed.tsx` [MODIFY] — Connect home feed to `ListingsContext` so created products appear on the main home feed.
5. `components/home/unauthenticated-welcome.tsx` [MODIFY] — Connect unauthenticated feed to `ListingsContext`.
6. `lib/supabase/auth-context.tsx` [MODIFY] — Remove hardcoded "Alex" defaults; initialize user profile dynamically from sign-up or sign-in state.
7. `components/auth/auth-modal.tsx` [MODIFY] — Pass custom name on signup and set default profile.
8. `app/profile/page.tsx` [MODIFY] — Ensure identity name dynamically matches signed-in user and active listings show created items.
9. `app/layout.tsx` [MODIFY] — Wrap application with `ListingsProvider`.

## 6. Acceptance Criteria
- [ ] `/seller/listings/create` visually matches `create_listing/code.html` (images upload/camera, title, condition chips + description, category, price, description, location, listing summary card, fixed list button).
- [ ] Submitting a new product (e.g. "iPhone 15 Pro" or "Vintage Leather Jacket") adds it to the system immediately.
- [ ] Navigating to Home (`/`) or Shop (`/shop`) or typing "iPhone" in search displays the newly created product.
- [ ] Signing up or logging in with a username/email uses that name in Profile (`/profile`), header, and seller cards instead of hardcoded "Alex".

## 7. Verification Plan
- Run `npm run typecheck` to verify zero TypeScript errors.
- Run `npm run lint` to verify clean lint status.
- Manual test steps:
  1. Open app and sign up/sign in as a new user (e.g., "Sam Porter").
  2. Navigate to Profile (`/profile`) and verify name displays "Sam Porter" (not "Alex").
  3. Navigate to `/seller/listings/create`.
  4. Upload an image, type title "Samsung Galaxy S24 Ultra", select condition "Like New", category "Electronics", price "750", location "Portland, OR", and submit.
  5. Confirm redirection to active listings showing the new phone.
  6. Go to Main Home (`/`) and Shop (`/shop`), search for "Samsung" or "Galaxy" or "phone", and verify the item appears in the search results.
