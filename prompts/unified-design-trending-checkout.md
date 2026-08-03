# Implementation Prompt: Unified Primary Color, Redesigned Trending Showcase, Category Navigation, Purchase Checkout Flow, Bottom Navigation & Profile Settings

## 1. Goal
Ensure Fetchistore operates under a **unified, cohesive primary brand color (`#E8553A`)** across every surface of the application. Redesign the **Trending Section** to reflect the high-energy editorial container layout depicted in the user reference image (overlapping trendsetter image, social proof badges, floating featured trending product post card, bold header styling, and primary color backdrop). Implement seamless **Category Navigation**, full **Purchase & Checkout Flow** (Cart, multi-payment options: Stripe Card, Bank Transfer, E-wallet, COD, and order confirmation), **Bottom Navigation Bar** with primary color active indicators, and a comprehensive **Profile Settings Page** (`/profile`).

---

## 2. Skills Read & Code Inspected
- `.agents/skills/ui-design`: Clarkson structural reference + NovaTrend visual language, primary brand color system (`#E8553A`), product card specs, condition badges.
- `AGENTS.md`: Canonical rules for e-commerce scope, multi-payment methods, delivery tracking, RLS, and prompt workflow.
- `app/globals.css`: Brand color tokens (`--color-brand: #E8553A`, `--color-brand-light: #FFF0ED`, `--color-brand-dark: #C4412A`).
- `components/shared/bottom-nav.tsx`: Replicating hardcoded `#D2E987` lime with unified `--color-brand`.
- `components/home/authenticated-feed.tsx` & `trending-banner.tsx`: Refactoring hero/trending sections to match unified primary color and redesigned trending showcase layout.
- `app/product/[id]/page.tsx`: Updating buttons, size pickers, and buy actions to use unified brand color.

---

## 3. Decisions & Architectural Specifications

### A. Unified Application Primary Color (`#E8553A` / `bg-brand` / `text-brand` / `border-brand`)
1. **Primary Color Enforcement**: Replace all remaining non-brand hex accents (e.g. `#D2E987`, `#8BB325`, `#c3de74`) with `--color-brand` (`#E8553A`) and helper variables (`bg-brand`, `text-brand`, `border-brand`, `bg-brand-light`, `hover:bg-brand-dark`).
2. **Interactive Elements**: Active bottom navigation items, category filter badges, action CTAs ("Shop Now", "Add to Cart", "Proceed to Checkout", "Place Order"), cart count badges, price tags, and profile tab highlights will strictly use the unified brand primary color.

### B. Redesigned Trending Showcase Section ("Post is Trending")
1. **Container Design**: Large rounded card (`rounded-3xl` / `rounded-4xl`) with vibrant primary color background (`bg-brand` or primary gradient backdrop) inspired by the user's reference design image.
2. **Typography & Banner Header**: Bold top title ("Own the EDGE · Keep the VIBE"), section tag ("New Arrivals" / "Trending Drops").
3. **Hero Content Grid**:
   - **Left Column**: Subheading ("Where Art Meets your Style"), CTA button ("New Drops →" in white pill with brand arrow), social proof badge ("Rated 5 Stars by The Vybe Tribe" + avatar stack).
   - **Center Column**: Overlapping/cutout model image extending dynamically over the container boundary.
   - **Right Column**: Feature badges ("Future Threads", "Unique Designs", "Limited Drops"), plus a **Floating Featured Trending Product Card** ("Urban Vanguard Tee" / Trending Item) featuring photo, title, rating, price tag (`$26.72`), and quick purchase button.

### C. Category Navigation & Filtering (`/shop`)
1. **Category Bar / Grid**: Category chips (Fashion, Men's Outfit, Women's Outfit, Footwear, Accessories, Electronics, Beauty, Home Decor).
2. **Shop Page (`/shop`)**: Filterable product list supporting category selection, condition filtering (`new`, `like_new`, `good`, `fair`), price range slider, and proximity distance filter ("Near You").

### D. Purchase & Checkout Flow (`/cart`, `/checkout`, `/orders/[id]`)
1. **Cart Management**: Cart state context/modal allowing adding items, modifying quantities, removing items, and viewing total order amount.
2. **Checkout Page (`/checkout`)**:
   - **Delivery Address**: Saved address selector or manual address entry for seller home delivery.
   - **Payment Methods (Canonical)**:
     - `Stripe Card`: Card payment simulation / input.
     - `Bank Transfer`: Direct bank transfer details & instructions.
     - `E-Wallet`: Digital wallet option.
     - `COD (Cash on Delivery)`: Pay on delivery confirmation.
   - **Order Summary**: Itemized list, distance note, delivery fee, total calculation.
   - **Action**: "Place Order" button transitioning to Order Confirmation.
3. **Order Confirmation & Tracking (`/orders/[id]`)**: Live order status timeline (`pending` → `paid` / `cod_pending` → `accepted` → `out_for_delivery` → `delivered`), mock map indicator, seller chat launcher, and order details.

### E. Bottom Navigation Bar (`components/shared/bottom-nav.tsx`)
1. **Tabs**: 5 core tabs — `Home` (`/`), `Shop` (`/shop`), `Cart` (`/cart`), `Orders` (`/orders`), `Profile` (`/profile`).
2. **Styling**: Floating glassmorphism pill (`bg-white/95 backdrop-blur-lg border border-gray-100 rounded-full shadow-2xl p-2`), active tab highlighted with `bg-brand text-white shadow-md shadow-brand/30`.

### F. Profile Settings Page (`/profile`)
1. **Account Profile Details**: Name, email, avatar, role badge (Buyer/Seller).
2. **Proximity Radius Filter Setting**: Interactive slider to configure preferred discovery radius (1 km – 50 km).
3. **Saved Delivery Addresses**: List of delivery locations (Home, Work) with add/edit option.
4. **Seller Quick Actions**: "Create Listing" button, "Manage My Listings", "Seller Orders".
5. **Order History**: Quick view of active & past orders with status badges.

---

## 4. Proposed File Changes

### Modified Files:
- [MODIFY] `app/globals.css` (Ensure brand tokens and utility classes are cleanly configured)
- [MODIFY] `components/shared/bottom-nav.tsx` (Update to 5 tabs, replace old lime color `#D2E987` with `bg-brand text-white shadow-brand/30`, ensure global accessibility)
- [MODIFY] `components/shared/navbar.tsx` (Ensure cart count, primary buttons, user avatar, and links adhere strictly to brand color)
- [MODIFY] `components/home/authenticated-feed.tsx` (Replace old lime color banners with unified primary brand styling)
- [MODIFY] `components/home/trending-banner.tsx` (Redesign Trending Banner section into high-energy showcase with overlapping model, taglines, social proof, and featured product post card)
- [MODIFY] `app/product/[id]/page.tsx` (Update buttons, tags, size selectors to unified brand color)

### New Files:
- [NEW] `lib/cart-context.tsx` (Cart state management for adding items, quantity updates, total calculation)
- [NEW] `app/shop/page.tsx` (Category navigation and filterable shop page)
- [NEW] `app/cart/page.tsx` (Full-page cart view with item summary and checkout trigger)
- [NEW] `app/checkout/page.tsx` (Checkout page with delivery address, multi-payment options: Stripe, Bank, E-wallet, COD, and order placement)
- [NEW] `app/orders/page.tsx` & `app/orders/[id]/page.tsx` (Order history list and live order delivery tracking view)
- [NEW] `app/profile/page.tsx` (Profile settings page with radius slider, delivery addresses, order history, and seller listing management)

---

## 5. Security & Architectural Compliance
- No Stripe secret keys or server secrets exposed to browser.
- All primary color tokens derived from `var(--color-brand)` / CSS brand utilities.
- Mobile-first responsive layout adhering to Clarkson structure and NovaTrend visual language.

---

## 6. Acceptance Criteria & Verification Plan

### Automated Checks:
```bash
npm run typecheck
npm run lint
```

### Manual Verification Steps:
1. **Primary Color Consistency**: Verify that buttons, active bottom nav items, badges, price highlights, category chips, cart badges, checkout CTAs, and profile tabs use `#E8553A` (brand coral).
2. **Redesigned Trending Showcase**: Inspect home page trending section to verify the new container layout with model overlapping effect, "Own the EDGE Keep the VIBE" styling, social proof badge, and floating trending post card.
3. **Category Navigation**: Click category chips on home and `/shop` page; verify filtered products match selected category.
4. **Purchase & Checkout Flow**: Add product to cart, open cart (`/cart`), proceed to checkout (`/checkout`), choose payment method (Card / Bank / E-Wallet / COD), submit order, and verify navigation to order status page (`/orders/[id]`).
5. **Bottom Navigation**: Verify bottom nav pill contains Home, Shop, Cart, Orders, Profile, with active state correctly highlighted in brand color `#E8553A`.
6. **Profile Settings**: Visit `/profile`, test proximity radius slider adjustment, inspect address list, order history link, and seller tools.
