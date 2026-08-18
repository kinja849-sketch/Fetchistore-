# Prompt: Fix Device Responsiveness & Navigation Clicks Across Fetchistore

## Goal
Fix device responsiveness across all screens (especially categories, shop discovery, home, and subpages) and resolve broken or unhandled click/navigation links so every interactive element immediately navigates to its intended target.

## Skills Read & References
- `.agents/skills/ui-design` — Clarkson structural reference + NovaTrend visual language, responsive breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).
- `AGENTS.md` — Section 7 (UI Design system, locked color tokens, radii, bottom navigation rules).

## Issues Identified & Code Inspected
1. **Broken & Missing Navigation Links**:
   - `components/home/product-card.tsx` — Was a plain `<div>` with `cursor-pointer` but missing `<Link>` or navigation handler.
   - `components/home/product-showcase.tsx` — Displayed `ProductCard` without passing href or wrapping in `<Link>`.
   - `components/home/category-grid.tsx` — Linked to `/category/${slug}` instead of `/shop/category/${slug}` (which led to 404 / failed navigation).
   - `components/home/collection-banners.tsx` — Linked to non-existent `/collections/new` and `/collections/pre-loved` paths.
   - `components/shared/bottom-nav.tsx` — Hidden completely when user is signed out (`!user`), leaving mobile screens without bottom navigation.

2. **Double Headers & Subpage Stacking**:
   - `app/categories/page.tsx` and `app/shop/category/[slug]/page.tsx` rendered their own sticky `<header>` while `Navbar` (`components/shared/navbar.tsx`) also rendered a sticky subpage header, resulting in double headers stacking on mobile.

3. **Device Responsiveness & Layout Across Viewports**:
   - `app/categories/page.tsx` grid layout and padding needed responsive polish for mobile (320px–640px), tablet (640px–1024px), and desktop (1024px+).
   - `app/shop/category/[slug]/page.tsx` filter pills and product grid cards needed flexible scaling and touch targets.
   - `app/shop/page.tsx` search/filter bar and product cards needed mobile responsiveness adjustments.
   - `components/shared/bottom-nav.tsx` needs to be visible on main tabs for both signed-in and signed-out users.

## Changes Required

### 1. Navigation & Links Fixes
- **`components/home/product-card.tsx`**:
  - Wrap card content in `<Link href={`/product/${product.id}`}>` with `block cursor-pointer`.
- **`components/home/category-grid.tsx`**:
  - Update category href to `/shop/category/${category.slug}`.
- **`components/home/collection-banners.tsx`**:
  - Update collection links to `/shop?condition=new` and `/shop?condition=like_new`.
- **`components/shared/bottom-nav.tsx`**:
  - Show bottom nav on main tabs (`/`, `/shop`, `/categories`, `/wishlist`, `/cart`, `/orders`, `/profile`) for ALL users (authenticated or guest).

### 2. Header Deduplication & Clean Subpages
- **`app/categories/page.tsx`**:
  - Remove redundant inline header and rely on `Navbar` subpage header.
- **`app/shop/category/[slug]/page.tsx`**:
  - Remove redundant inline header and rely on `Navbar` subpage header.
- **`components/shared/navbar.tsx`**:
  - Update subpage title map to handle category slug names dynamically (e.g. "Fashion Collection").

### 3. Device Responsiveness & Layout Improvements
- **`app/categories/page.tsx`**:
  - Optimize grid for all screen sizes: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6`.
  - Add container constraints, responsive text sizing, touch feedback, and soft background styling matching NovaTrend system.
- **`app/shop/category/[slug]/page.tsx`**:
  - Improve responsive grid (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4`), scrollable filter pill bar, and price/cart button targets.
- **`app/shop/page.tsx`**:
  - Polish search input, filter bar wrap, and grid responsive columns (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6`).
- **`components/home/authenticated-feed.tsx`**:
  - Fix grid card favorite button stopPropagation and touch responsiveness.

## Acceptance Criteria
1. Clicking any category, collection banner, or product card immediately navigates to its corresponding page without 404s or non-responsive clicks.
2. The category page (`/categories`) and category slug page (`/shop/category/[slug]`) display a single, clean header on mobile and desktop.
3. Mobile (320px–640px), tablet (640px–1024px), and desktop (1024px+) viewports render clean grid layouts with no horizontal scroll overflow or awkward overlap.
4. Bottom navigation bar is visible on mobile for all main tabs, whether logged in or logged out.
5. All TypeScript typechecks pass with 0 errors.

## Checks
```bash
npm run typecheck
npm run lint
```
