# Implementation Prompt — Chat Header Duplication, Profile Avatar Upload, & Global Wishlist Sync

Fix header duplication on Delivery Chat, enable native profile photo upload, and establish global Wishlist persistence and synchronization across Fetchistore.

---

## 1. Executive Summary & Goals

1. **Remove Delivery Chat Header Duplication**:
   - In `components/shared/navbar.tsx`, suppress the global `Navbar` header when `pathname.includes("/chat")`.
   - Ensure `app/orders/[id]/chat/page.tsx` renders a single, clean header bar with seller name, order status, back navigation, and delivery icon.

2. **Profile Avatar Upload**:
   - In `app/profile/page.tsx`, add a native file upload input (`<input type="file" accept="image/*" />`) and "Upload Photo from Device" button inside the Edit Profile modal.
   - Convert uploaded image files to Data URLs via `FileReader` so users can upload custom avatar photos directly from their local device and save them to their profile.

3. **Global Wishlist Context & Synchronization**:
   - Create `lib/wishlist-context.tsx` with `localStorage` persistence.
   - Wrap `<WishlistProvider>` in `app/layout.tsx`.
   - Connect `components/home/authenticated-feed.tsx`, `app/shop/page.tsx`, and `app/product/[id]/page.tsx` so toggling the favorite heart icon updates the global wishlist.
   - Update `app/wishlist/page.tsx` to display the user's active saved items with instant item removal, clear all, and move-to-cart functionality.

---

## 2. Skills & Code Inspected

- **Skills Consulted**: `ui-design` (`.agents/skills/ui-design/SKILL.md`)
- **Code Inspected**:
  - `components/shared/navbar.tsx` — Global header bar logic
  - `app/orders/[id]/chat/page.tsx` — Delivery chat route and header
  - `app/profile/page.tsx` — Main profile page & Edit Profile modal
  - `app/wishlist/page.tsx` — Wishlist page
  - `components/home/authenticated-feed.tsx` & `app/shop/page.tsx` — Product lists with favorite toggle
  - `app/layout.tsx` — Root layout providers

---

## 3. Files to Create / Modify

#### [NEW] `lib/wishlist-context.tsx`
- Create `WishlistContext` with `items`, `toggleWishlist`, `removeFromWishlist`, `clearWishlist`, `isInWishlist`.
- Persist saved items in `localStorage` under `fetchistore_wishlist_items`.

#### [MODIFY] `app/layout.tsx`
- Wrap `CartProvider` and app contents inside `<WishlistProvider>`.

#### [MODIFY] `components/shared/navbar.tsx`
- Return `null` when `pathname.includes("/chat")` to eliminate duplicate headers on Delivery Chat.

#### [MODIFY] `app/profile/page.tsx`
- Add native file upload control (`<input type="file" accept="image/*" />`) to the Edit Profile modal.
- Implement `handleAvatarFileUpload` using `FileReader` to process selected image files and update the profile avatar photo.

#### [MODIFY] `app/wishlist/page.tsx`
- Connect to `useWishlist()`. Render active favorited items dynamically.
- Handle item removal, clear all, and "Move to Cart" (which adds to cart and removes from wishlist).

#### [MODIFY] `components/home/authenticated-feed.tsx` & `app/shop/page.tsx`
- Connect product favorite heart buttons to `useWishlist().toggleWishlist(product)`.

---

## 4. Verification Criteria & Acceptance Tests

1. Navigate to `/orders/1/chat`. Verify that ONLY ONE header bar appears at the top (seller name & order status). No double header.
2. Navigate to `/profile`. Open Edit Profile modal. Click "Upload Photo from Device", select an image file. Verify avatar preview updates immediately and saves to profile.
3. On `/` or `/shop`, click the heart icon on any product. Navigate to `/wishlist`. Verify that exact selected item appears on the wishlist.
4. On `/wishlist`, remove an item or click "Move to Cart". Verify the item is removed from wishlist and added to cart.
5. Run `cmd /c npx tsc --noEmit` and ensure 0 errors.
