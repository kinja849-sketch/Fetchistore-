# Prompt: Responsive Bottom Navigation & Full-Viewport Layout Precision

## Goal
Completely resolve mobile bottom navigation cut-off/scrolling bugs and enforce multi-device responsiveness across phone, tablet, and desktop viewports.

## Changes to Implement

### 1. Fixed Bottom Navigation Bar (`components/shared/bottom-nav.tsx`)
- Redesign the navbar to use a full-width fixed shell:
  `fixed bottom-0 left-0 right-0 z-50 bg-[#FBF9F8]/95 backdrop-blur-xl border-t border-[#E4E2E1] flex justify-around items-center h-16 pb-safe px-1 md:hidden shadow-lg`
- Render 5 items (`Home`, `Cart`, `Watchlist`, `Orders`, `Profile`) as vertical icon + label stacks.
- Active item uses active pill/text highlight (`text-[#56642B] bg-[#8A9A5B]/15 px-3 py-1 rounded-full flex flex-col items-center justify-center font-extrabold`).
- Cart badge is positioned relative to the cart icon cleanly.
- Route suppression remains active for transactional screens (`/product/`, `/cart`, `/checkout`, `/orders/.../chat`, `/seller/create`, `/listings/`).

### 2. Root Layout Container (`app/layout.tsx`)
- Keep `<main className="flex-1 w-full flex flex-col min-h-0">{children}</main>`.
- `BottomNav` stays outside of `<main>` at root body level.

### 3. Responsive Page Spacing & Grid Padding
- Main tab pages (`AuthenticatedFeed`, `ShopPage`, `WishlistPage`, `OrdersPage`, `ProfilePage`): Set bottom padding `pb-20 md:pb-8` to fit the `h-16` bottom nav bar cleanly on mobile.
- Transactional sub-pages (`ProductDetailPage`, `CartPage`): Set container `pb-24 md:pb-8` and sticky bottom bar `pb-[calc(1rem+env(safe-area-inset-bottom))]`.
- Ensure responsive grid columns across viewports (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`).

## Verification Plan
1. Run `npm run typecheck`
2. Run `npm run lint`
3. Run `npm run build`
4. Verify layout responsiveness across 320px, 375px, 768px (tablet), and 1280px (desktop).
