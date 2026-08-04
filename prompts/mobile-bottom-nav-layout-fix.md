# Prompt: Mobile Bottom Navigation Bar & Layout Precision Fix

## Goal
Fix mobile layout defects across Fetchistore:
1. Ensure the `BottomNav` bar stays permanently fixed and centered at the bottom of the screen on all main tab mobile views, never scrolling with page content.
2. Suppress `BottomNav` on transactional sub-pages (Product Details, Cart, Checkout, Order Chat, Create Listing) where dedicated sticky action bars exist, preventing overlapping navigation elements and content cropping.
3. Remove duplicate bottom padding between `app/layout.tsx` and individual page components to eliminate excessive empty gaps while guaranteeing no content is clipped on mobile screens.

## Reference Skills & Specs
- `AGENTS.md` — Section 7: Global UI Rules (Main tabs show bottom nav; transactional screens suppress bottom nav and use back-button top bar).
- `.agents/skills/ui-design` — Clarkson structure + NovaTrend visual language (Manrope, rounded pills, surface-container `#F0EDED`, primary `#56642B` / `#8A9A5B`).

## Findings & Root Cause Analysis
1. **Scrolling / Jump issue with BottomNav**:
   - `BottomNav` is rendered inside `app/layout.tsx`. When page components in `{children}` contain CSS transforms (such as `.animate-fade-in-up`), or when parent elements have layout overflow, fixed elements inside scroll contexts can scroll or shift unexpectedly.
   - `BottomNav` lacked explicit safe area bottom spacing (`env(safe-area-inset-bottom)`), causing clipping on modern mobile devices.

2. **Overlapping Action Bars & Content Cropping**:
   - `BottomNav` only suppressed `/checkout`. On `/product/[id]`, `/orders/[id]/chat`, `/cart`, and `/seller/create`, both `BottomNav` (`z-50`) and page-specific sticky action bars (`z-40` / `z-50`) rendered simultaneously, clipping buttons and cropping content.

3. **Excessive Empty Gaps**:
   - `app/layout.tsx` declared `pb-24 md:pb-8` globally on the `{children}` wrapper, while almost every page component ALSO declared `pb-28` or `pb-28` internally. This resulted in ~200px+ of stacked bottom whitespace.

## Planned Code Changes

### 1. `components/shared/bottom-nav.tsx`
- Expand `isTransactionalPage` route check to suppress `BottomNav` on:
  - `/product/[id]` (Product Details)
  - `/cart` (Cart with fixed Checkout bar)
  - `/checkout` (Checkout flow)
  - `/orders/[id]/chat` (Order Chat)
  - `/seller/create`, `/listings/new`, `/listings/[id]/edit` (Listing management forms)
- Ensure container uses `fixed bottom-3 md:hidden z-50` with `bottom-[calc(0.75rem+env(safe-area-inset-bottom))]` for safe positioning.

### 2. `app/layout.tsx`
- Replace `<div className="flex-1 pb-24 md:pb-8">{children}</div>` with `<main className="flex-1 w-full flex flex-col">{children}</main>`.
- Remove redundant global `pb-24` from layout so individual main tab pages handle bottom nav spacing cleanly without double padding.

### 3. Page Component Padding Adjustments
- `components/home/authenticated-feed.tsx`: Standardize container to `pb-24 md:pb-8`.
- `app/shop/page.tsx`: Standardize container to `pb-24 md:pb-8`.
- `app/wishlist/page.tsx`: Standardize container to `pb-24 md:pb-8`.
- `app/orders/page.tsx`: Standardize container to `pb-24 md:pb-8`.
- `app/profile/page.tsx`: Standardize container to `pb-24 md:pb-8`.
- `app/product/[id]/page.tsx`: Set container `pb-24 md:pb-8` to accommodate the sticky mobile "Add to Cart" action bar.
- `app/cart/page.tsx`: Set container `pb-24 md:pb-8` to accommodate the sticky mobile Checkout action bar.

## Verification Plan
1. Run `npm run typecheck` to verify zero TypeScript errors.
2. Run `npm run lint` to verify zero ESLint errors.
3. Test mobile view (e.g. 375px width):
   - Check `/` (Home) and `/shop`: `BottomNav` is fixed, centered, and does not scroll with content.
   - Check `/product/grey-casual-shoe`: `BottomNav` is suppressed; sticky "Add to Cart" bar is fully visible and touchable.
   - Check `/cart`: `BottomNav` is suppressed; sticky Checkout bar is visible without extra bottom white gaps.
   - Check `/wishlist`, `/orders`, `/profile`: `BottomNav` is fixed and visible; content bottom spacing is clean without excessive empty space.
