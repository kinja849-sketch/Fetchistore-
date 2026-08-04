# Implementation Prompt: Mobile-First Responsive UI & 16-Screen Interactive User Flow

## Goal
Replicate and implement the exact mobile design system and 16-screen user flow from the `Fetchistore UI` HTML references (`c:/Users/acer/Desktop/Fetchistore ui/stitch_fetchistore_proximity_marketplace/`). Ensure full responsiveness across all mobile, tablet, and desktop viewports without awkward stretching in shop discovery or any other page.

---

## Skills Read & References
- **`ui-design` Skill**: Clarkson structural reference + NovaTrend visual language.
- **`AGENTS.md` Section 7**: Single source of truth for color tokens, typography (Manrope), Material Symbols Outlined icons, border radii, and screen rules.
- **Reference HTML files** in `c:/Users/acer/Desktop/Fetchistore ui/stitch_fetchistore_proximity_marketplace/`:
  1. `onboarding/code.html`
  2. `shop_discovery/code.html`
  3. `all_categories/code.html`
  4. `product_details/code.html`
  5. `fashion_category/code.html`
  6. `wishlist/code.html`
  7. `cart/code.html`
  8. `orders_tracking/code.html`
  9. `delivery_chat/code.html`
  10. `create_listing/code.html`
  11. `active_listings/code.html`
  12. `sold_items/code.html`
  13. `payments_balance/code.html`
  14. `settings_privacy/code.html`
  15. `profile/code.html`

---

## Key Decisions

1. **Mobile-First Responsive Layout Strategy**:
   - Wrap main content in a responsive container (`max-w-md mx-auto min-h-screen relative shadow-2xl md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-[#FBF9F8]`) or responsive fluid grid so that on small mobile devices it fills 100% width cleanly, and on desktop/tablet it presents as a polished mobile/tablet app shell without wide, broken horizontal stretching.
   - Inject Material Symbols Outlined font link into `layout.tsx` so all Google Material Symbols icons render identically to the HTML prototypes.

2. **16-Screen Interactive User Flow**:
   - **Screen 1: Onboarding** (`/onboarding` & unauthenticated view on `/`) — Bento grid collage, hero typography "Modern Craftsmanship, Near You.", CTA buttons for "Get Started" and "Sign In".
   - **Screen 2: Shop Discovery** (`/` & `/shop`) — Header with location chip & notification icon, search bar with filter button, horizontal promo banner carousel, circular category icon row, and 2-column "Trending Near You" product grid.
   - **Screen 3: All Categories** (`/categories` or `/shop/categories`) — Grid/list of all marketplace categories with image banners and item count.
   - **Screen 4: Product Details** (`/product/[id]`) — High-res image gallery, title/price/rating, condition badge (`like_new`, `new`, etc.), eco tags, distance badge, seller card, interactive variant selector, description, and sticky bottom "Add to Cart" bar.
   - **Screen 5: Fashion Category** (`/shop/category/fashion`) — Filterable sub-category grid specifically for Fashion items with distance and price sort chips.
   - **Screen 6: Wishlist** (`/wishlist`) — Grid of saved pre-loved and new items with one-tap favorite toggle & remove.
   - **Screen 7: Cart & Checkout** (`/cart` & `/checkout`) — Quantity controls, address snapshot, item summary, payment selector (Stripe, bank transfer, e-wallet, COD), and Checkout CTA.
   - **Screen 8: Orders & Tracking** (`/orders` & `/orders/[id]`) — Canonical status timeline (`pending` -> `paid` -> `accepted` -> `out_for_delivery` -> `nearby` -> `delivered` -> `completed`), order details, and driver/seller map link.
   - **Screen 9: Delivery Chat** (`/orders/[id]/chat`) — Order-scoped live messaging interface between buyer and seller with date separators, delivery status chips, and quick action buttons.
   - **Screen 10: Create Listing** (`/seller/listings/create`) — Multi-section seller listing form (image dropzone, title, condition segmented selector, category dropdown, price, location, description, preview card, and fixed bottom publish bar).
   - **Profile Tab Views (Screens 11 - 15)** (`/profile`):
     - **Screen 15: Main Profile Screen** — Avatar, name, bio, location chip, and 4 bento navigation cards/tabs.
     - **Screen 11: Active Listings** — Integrated tab view inside profile showing seller's active items with status badges and quick edit/deactivate actions.
     - **Screen 12: Sold Items** — Integrated tab view inside profile showing sold history, earnings summary bento cards, and buyer delivery details.
     - **Screen 13: Payments & Balance** — Integrated tab view inside profile with hero balance card, available payouts, bank details, and payment method settings.
     - **Screen 14: Settings & Privacy** — Integrated tab view inside profile with personal information, password change, location preferences, notification toggles, and account sign-out.

3. **Global Navigation Rules**:
   - Main tabs (Home, Wishlist, Orders, Profile) show fixed bottom navigation bar with active FILL states on icons.
   - Detail / Transactional pages (Product Details, Cart, Create Listing, Delivery Chat) suppress the bottom nav and show a sticky top header with back button.

---

## Files to Modify / Create

1. **`app/layout.tsx`**: Add Material Symbols Outlined stylesheet link and ensure proper viewport metadata.
2. **`app/globals.css`**: Update CSS variables for exact color tokens (`#56642b`, `#8a9a5b`, `#d9eaa3`, `#7d562d`, `#fbf9f8`, `#f0eded`, `#f6f3f2`, `#1b1c1c`, `#46483c`, `#76786b`, `#ba1a1a`), radii (`1rem`, `2rem`, `3rem`, `9999px`), and mobile container utilities.
3. **`components/shared/bottom-nav.tsx`**: Update tabs & icon styles with Material Symbols Outlined and clean active state matching Stitch HTML.
4. **`components/shared/navbar.tsx`**: Support mobile header views and sticky contextual top bars.
5. **`app/page.tsx` & `components/home/authenticated-feed.tsx`**: Replicate `shop_discovery/code.html` exact responsive mobile grid and layout.
6. **`app/onboarding/page.tsx` & `components/home/unauthenticated-welcome.tsx`**: Replicate `onboarding/code.html` bento collage and typography.
7. **`app/categories/page.tsx`**: Replicate `all_categories/code.html`.
8. **`app/shop/category/[slug]/page.tsx`**: Replicate `fashion_category/code.html`.
9. **`app/product/[id]/page.tsx`**: Replicate `product_details/code.html`.
10. **`app/wishlist/page.tsx`**: Replicate `wishlist/code.html`.
11. **`app/cart/page.tsx`**: Replicate `cart/code.html`.
12. **`app/orders/page.tsx` & `app/orders/[id]/page.tsx`**: Replicate `orders_tracking/code.html`.
13. **`app/orders/[id]/chat/page.tsx`**: Replicate `delivery_chat/code.html`.
14. **`app/seller/listings/create/page.tsx`**: Replicate `create_listing/code.html`.
15. **`app/profile/page.tsx`**: Implement Profile screen with interactive tab state switching for:
    - Main Profile overview
    - Active Listings (`active_listings/code.html`)
    - Sold Items (`sold_items/code.html`)
    - Payments & Balance (`payments_balance/code.html`)
    - Settings & Privacy (`settings_privacy/code.html`)

---

## Acceptance Criteria
- [ ] Responsive across all mobile, tablet, and desktop screen sizes (no awkward horizontal stretching on shop discovery or shop pages).
- [ ] 16 screens implemented with full user flow interactiveness.
- [ ] Profile screen dynamically toggles Active Listings, Sold Items, Payments & Balance, and Settings & Privacy upon click.
- [ ] Design system tokens (Manrope font, Material Symbols icons, exact color palette, radii, pill buttons) match the provided HTML references.
- [ ] Type check and build pass cleanly (`npm run typecheck`).

---

## Verification & Checks
- `npm run typecheck`
- `npm run lint`
- Manual browser verification across mobile (375px - 430px) and desktop viewports.
