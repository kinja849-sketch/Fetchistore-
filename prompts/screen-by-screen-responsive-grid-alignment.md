# Prompt: Screen-by-Screen Responsive Grid Alignment & Multi-Device UI Precision

## Goal
Perform a deep-dive overhaul across every single screen in Fetchistore to eliminate forced phone-container clipping, fix desktop styling/grid misalignments, enable smooth multi-device responsiveness (Mobile < 640px, Tablet 640px-1024px, Desktop >= 1024px), and strictly enforce the UI contracts from `AGENTS.md` and `ui-design/SKILL.md`.

---

## Skills & Reference Contracts Inspected
- `AGENTS.md`: Clarkson structural reference + NovaTrend visual language + Design System tokens, responsive grid breakpoints, bottom nav rules.
- `.agents/skills/ui-design/SKILL.md`: Breakpoint specification (`sm: 640px` -> 2-col, `md: 768px` -> tablet nav, `lg: 1024px` -> 3-col/4-col, `xl: 1280px` -> 4-col/6-col grid).

---

## Code Inspected & Root Causes Identified
1. **`app/layout.tsx` Layout Bottleneck**:
   - The root layout wrapped the entire app in `max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl` with a grey background (`bg-[#EFECE8]`) on the sides, forcing desktop viewports into a squished 672px mobile column with broken side margins and invalid Tailwind (`overflow-[#E4E2E1]/50`).
2. **Navbar & BottomNav Positioning & Scope**:
   - `Navbar` and `BottomNav` used fixed centering (`left-1/2 -translate-x-1/2 w-full max-w-2xl`), which shifted off-screen or left white gaps on window resize.
   - `BottomNav` was missing from main tabs (`/wishlist`, `/orders`, `/profile`), violating the AGENTS.md rule that bottom nav must be present on main tabs.
3. **Screen Grid Deficiencies**:
   - `AuthenticatedFeed`: Hardcoded `grid-cols-2` without tablet/desktop grid scaling (`sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`). Drag carousel had clipping issues.
   - `ShopPage` & `CategoryPage`: Grid was constrained inside root layout despite having `max-w-7xl`.
   - `ProductDetailPage`: Restricted to `max-w-xl` single-column, lacking desktop 2-column split (gallery left, specs right).
   - `CartPage` & `CheckoutPage`: Constrained to `max-w-xl`, missing desktop 2-column layout (`lg:grid-cols-12`, order items left, payment/summary sticky right).
   - `WishlistPage` & `OrdersPage`: Missing responsive grid column progression.
   - `ProfilePage` & `Seller` screens: Bento sections lacked multi-column desktop layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).

---

## Detailed Screen-by-Screen Changes

### 1. Root Layout & Fixed Nav Shell (`app/layout.tsx`, `components/shared/navbar.tsx`, `components/shared/bottom-nav.tsx`)
- **`app/layout.tsx`**:
  - Remove forced mobile box (`max-w-2xl bg-[#EFECE8] flex justify-center`).
  - Upgrade container to full-width responsive layout wrapper with max content width: `w-full max-w-7xl mx-auto min-h-screen bg-[#FBF9F8] shadow-sm relative flex flex-col`.
- **`components/shared/navbar.tsx`**:
  - Adapt navbar header container to responsive `max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8`.
  - Provide desktop navigation links (Discover, Shop, Categories, Wishlist, Orders, Profile) on `md:` breakpoints, while maintaining clean mobile header.
- **`components/shared/bottom-nav.tsx`**:
  - Show bottom nav on all main tabs (`/`, `/shop`, `/wishlist`, `/orders`, `/profile`).
  - Mobile-only (`md:hidden`), fixed full-width bottom bar (`fixed bottom-0 left-0 right-0 z-[100] bg-[#FBF9F8]/95 backdrop-blur-xl border-t border-[#E4E2E1]`).
  - Suppress cleanly on transactional subpages (`/product/*`, `/checkout`, `/orders/*/chat`, `/seller/create`).

### 2. Home / Authenticated Feed (`components/home/authenticated-feed.tsx` & `unauthenticated-welcome.tsx`)
- **`AuthenticatedFeed`**:
  - Search & Filter bar: Full width on mobile, responsive inline search + radius filter on desktop.
  - Promo Carousel: Smooth drag-to-scroll, non-clipping width (`w-full sm:w-[340px] md:w-[380px]`).
  - Category Pills: Horizontal scroll on mobile, responsive wrap grid on `md: flex-wrap gap-3`.
  - Product Grid: Change from static `grid-cols-2` to responsive grid: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6`.
- **`UnauthenticatedWelcome`**:
  - Bento grid: Maintain 2-column mobile layout, scale to 3-column bento desktop layout (`grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto`).

### 3. Shop & Category Discovery (`app/shop/page.tsx`, `app/shop/category/[slug]/page.tsx`, `app/categories/page.tsx`)
- Responsive grid: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6`.
- Filter bar & radius slider: Flex-wrap on mobile, clean horizontal toolbar on desktop.

### 4. Product Details (`app/product/[id]/page.tsx`)
- Desktop 2-Column Split: `grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto`.
- Image gallery & thumbnails on left column; title, condition, seller card, sustainability tags, price, and CTA on right column.
- Mobile: Sticky bottom action bar (`md:hidden`), Desktop: Inline action button in detail column.

### 5. Cart & Checkout (`app/cart/page.tsx` & `app/checkout/page.tsx`)
- Responsive 2-Column Layout on desktop (`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8`):
  - Left column (`lg:col-span-7`): Item list with quantity controls, delivery address card, payment method selector.
  - Right column (`lg:col-span-5`): Sticky Order Summary card & Checkout CTA button (`lg:sticky lg:top-24`).

### 6. Wishlist (`app/wishlist/page.tsx`)
- Responsive Product Grid: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto`.

### 7. Orders & Live Delivery Tracking (`app/orders/page.tsx` & `app/orders/[id]/page.tsx`)
- Orders list: `grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto`.
- Order detail: Split view on desktop (`grid grid-cols-1 lg:grid-cols-12 gap-8`), Live Map + Status Timeline on left (`lg:col-span-7`), Order Items + Seller Chat CTA on right (`lg:col-span-5`).

### 8. Profile & Settings (`app/profile/page.tsx`, `app/profile/payments/page.tsx`, `app/profile/settings/page.tsx`)
- Profile Bento Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto` (Selling, Buying, Payments, Settings).
- Balance & Payments: Card hero + payout settings 2-column layout on desktop.

### 9. Seller Management (`app/seller/listings/page.tsx`, `app/seller/listings/create/page.tsx`, `app/seller/sold/page.tsx`)
- Active Listings Grid: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`.
- Create Listing Form: 2-column desktop layout (Form inputs on left, Live Card Preview sticky on right).

---

## Verification Plan
1. **Type Safety & Build Checks**:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
2. **Visual & Responsive Viewport Verification**:
   - Mobile Viewport (375px - iPhone / Galaxy): Verify bottom nav, no horizontal overflow, clean 2-column grid.
   - Tablet Viewport (768px - iPad / Surface): Verify transition to 3-column product grid, top nav links, no clipping.
   - Desktop Viewport (1280px+ - Laptop / Desktop Monitor): Verify full 4 to 6 column product grid, 2-column product details, split cart/checkout, full container alignment.
