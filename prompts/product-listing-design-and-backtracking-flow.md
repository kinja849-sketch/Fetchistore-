# Implementation Prompt: Product Listing UI Replication, Screen Backtracking, and Category & Search Integration

## 1. Goal
Replicate the exact reference HTML designs for product listing creation, active listings management, and product card/details presentation from `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace` (specifically `create_listing`, `active_listings`, `shop_discovery`, `product_details`). In addition, implement seamless backtracking (back navigation button) across all non-tab transactional & sub-screens, and ensure that newly listed items dynamically appear in their appropriate categories, search query results, product details, cart, and checkout flow.

---

## 2. Skills Read & Referenced
- `.agents/skills/ui-design` (Clarkson structure + NovaTrend visual language, Manrope typography, `#56642b` palette, Material Symbols Outlined, rounded forms, soft surface cards)
- `node_modules/next/dist/docs/` (App Router, Client Components, `useRouter`, `useParams`)

---

## 3. Code Inspected
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\create_listing\code.html` (Reference HTML for product listing creation form)
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\active_listings\code.html` (Reference HTML for active listings grid and management)
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\product_details\code.html` (Reference HTML for product detail layout)
- `app/seller/listings/create/page.tsx` (Current create listing page)
- `app/seller/listings/page.tsx` (Current active seller listings page)
- `lib/listings-context.tsx` (Listings state management and local storage persistence)
- `app/shop/page.tsx` (Shop discovery & search page)
- `app/categories/page.tsx` & `app/shop/category/[slug]/page.tsx` (Category listing pages)
- `app/product/[id]/page.tsx` (Product detail page)

---

## 4. Architectural & Design Decisions
1. **Create Listing UI (`app/seller/listings/create/page.tsx`)**:
   - Replicate the exact layout, section order, color tokens (`bg-[#fbf9f8]`, `bg-[#f6f3f2]`, `bg-[#8a9a5b]`, `text-[#56642b]`), border styles, condition chip selector, image upload/camera picker with preview, category selector, price input, description, location input, sustainable impact bento summary card, and fixed bottom action bar (`List Product`).
   - Include a top header bar with a prominent Back Button (`router.back()`).

2. **Active Listings UI (`app/seller/listings/page.tsx`)**:
   - Replicate the `active_listings/code.html` design: top bar with back button to `/profile`, stats summary, filter chips ("All Active", "Low Stock", "Best Sellers", "Recently Added"), surface cards with 4:5 aspect ratio images, status badge ("Active"), view/save/stock metrics, and Edit/Deactivate management controls.
   - Wire cards directly to `useListings()` so user-created items appear immediately in the inventory grid.

3. **Global Backtracking (Back Navigation) Standard**:
   - Ensure a consistent sticky/fixed Top Header Bar with a Back Button (`router.back()` or explicit fallback link) on all non-bottom-nav transactional and sub-screens:
     - `/seller/listings/create`
     - `/seller/listings`
     - `/shop/category/[slug]`
     - `/categories`
     - `/product/[id]`
     - `/cart`
     - `/checkout`
     - `/orders` & `/orders/[id]/chat`
     - `/profile/settings` & `/profile/payments`
     - `/wishlist`

4. **Category, Search & Purchase Integration**:
   - Update `ListingsProvider` in `lib/listings-context.tsx` and category pages (`app/shop/category/[slug]/page.tsx`, `app/categories/page.tsx`, `app/shop/page.tsx`) to perform robust, normalized category matching (e.g. matching "electronics", "Electronics", "fashion", "Fashion", "home-decor", "Home Decor", etc.).
   - Make `app/shop/category/[slug]/page.tsx` consume `useListings()` dynamically instead of relying on hardcoded static arrays so newly created products immediately populate their respective category pages.
   - Ensure newly added products show up in search query filters across the app.
   - Ensure `/product/[id]` looks up listings from `useListings()` (falling back gracefully to demo items) so clicking any listed product opens its complete details, enables adding to cart, and allows proceeding to checkout.

---

## 5. Files to Change
- `app/seller/listings/create/page.tsx` — Replicate `create_listing` reference design + back button + category/price binding
- `app/seller/listings/page.tsx` — Replicate `active_listings` reference design + back button + dynamic listing grid
- `lib/listings-context.tsx` — Enhance category normalization and listing lookup
- `app/shop/category/[slug]/page.tsx` — Dynamic category filtering from `useListings()` + top bar with back button
- `app/categories/page.tsx` — Add top header with back button + dynamic category counts
- `app/product/[id]/page.tsx` — Connect to `useListings()` + top header with back button + cart addition
- `app/cart/page.tsx` — Add top header with back button
- `app/checkout/page.tsx` — Verify top header back button
- `app/profile/settings/page.tsx` & `app/profile/payments/page.tsx` — Verify/Add top header back buttons
- `app/orders/page.tsx` & `app/orders/[id]/chat/page.tsx` — Verify top header back buttons

---

## 6. Implementation Requirements

### 6.1 Create Listing Page
- Match `create_listing/code.html` UI:
  - Header: Back button + "Create Listing" title in `#56642B`.
  - Image Upload Box: Dashed border, upload/camera buttons, live image preview with remove button.
  - Form Fields: Title input, Category dropdown (Electronics, Fashion, Home Decor, Footwear, Accessories, Furniture, Books, etc.), Price input ($), Condition chips (New, Like New, Good, Fair) with live description text, Description textarea, Location input with pin icon.
  - Summary Bento Card: Sustainable impact indicator and platform fee note.
  - Bottom Bar: Fixed sticky pill button "List Product" with spinner and success toast.
  - On Submit: Call `addListing(...)` and navigate to `/shop?highlight=<id>` or `/seller/listings`.

### 6.2 Active Listings Management
- Match `active_listings/code.html` UI:
  - Top app bar with back button to `/profile`.
  - Header title "Your Inventory" with item count and "New Listing" CTA.
  - Filter chips bar ("All Active", "Low Stock", "Best Sellers", "Recently Added").
  - 4-column responsive grid of surface cards showing active listings from `useListings()`.
  - Management buttons for Edit and Deactivate.

### 6.3 Backtracking Across Screens
- Add a sticky/fixed header with a back button (`router.back()`) on:
  - Create Listing (`/seller/listings/create`)
  - Active Listings (`/seller/listings`)
  - Category view (`/shop/category/[slug]`)
  - Product details (`/product/[id]`)
  - Cart (`/cart`)
  - Checkout (`/checkout`)
  - Orders & Delivery Chat (`/orders`, `/orders/[id]/chat`)
  - Settings & Payments (`/profile/settings`, `/profile/payments`)

### 6.4 Category & Search Integration
- When a product is created in category "Electronics":
  - Viewing `/shop` with category "Electronics" shows the item.
  - Viewing `/shop/category/electronics` shows the item.
  - Searching "iPhone" or the product's title in the search bar finds the item.
  - Clicking the item opens `/product/[id]`, displaying the item's details.
  - Clicking "Add to Cart" adds the item to the cart.
  - Proceeding to `/checkout` allows completing the order via Stripe / COD / Bank Transfer / E-Wallet.

---

## 7. Security Requirements
- Ensure no secret API keys are exposed to the client.
- All listing inputs sanitized and safely rendered in React.

---

## 8. Acceptance Criteria
- [ ] Create Listing page matches the reference HTML visual design (`create_listing/code.html`) with all fields (title, category, price, condition, description, location, images).
- [ ] Active Listings page matches `active_listings/code.html` and displays all seller listings dynamically.
- [ ] Every non-tab transactional screen includes a clear Back Button to navigate back to the previous screen seamlessly.
- [ ] Newly created products appear in their selected category page, in shop discovery, and in search query results.
- [ ] Newly created products can be opened in the product detail view, added to the cart, and purchased through checkout.

---

## 9. Verification & Checks
- Run `npm run typecheck` to ensure no TypeScript compilation errors.
- Run `npm run lint` to verify clean code formatting and lint rules.

---

## 10. Manual Testing Steps
1. Navigate to `/seller/listings/create`. Verify the top bar back button works.
2. Fill out the Create Listing form (e.g. Title: "Wireless Mechanical Keyboard", Category: "Electronics", Price: 75.00, Condition: "Like New", Description: "RGB backlight, wireless bluetooth", Location: "Portland, OR").
3. Click "List Product".
4. Confirm redirection and success notification.
5. Navigate to `/shop` or `/shop/category/electronics`. Verify "Wireless Mechanical Keyboard" appears under Electronics.
6. Type "Mechanical Keyboard" in the search bar. Verify the item appears in search results.
7. Click on the product to open `/product/<listing-id>`. Verify back button is present and product details are accurately rendered.
8. Click "Add to Cart", then navigate to `/cart`. Verify the item is in the cart.
9. Click "Proceed to Checkout", select payment method (e.g. COD or Card), and complete the order.
10. Check `/seller/listings` to verify the item is visible under Active Listings with the back button returning to Profile.
