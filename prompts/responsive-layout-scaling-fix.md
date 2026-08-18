# Prompt: Comprehensive Device Responsiveness & Content Scaling Fix

## Goal
Fix overall application horizontal layout overflow, content clipping on mobile screen sizes (e.g. 320px–375px Samsung/iPhone viewports), clipped Navbar logo, clipped bottom navigation labels, and unconstrained grid badge overlays across all pages and viewports.

## Skills Read & References
- `.agents/skills/ui-design` — Clarkson structural reference + NovaTrend visual language, responsive breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).
- `AGENTS.md` — Section 7 (UI Design system, locked color tokens, radii, bottom navigation rules).

## Root Cause Analysis
1. **Unconstrained Horizontal Viewport Overflow**:
   - `html`, `body`, and root layout container lacked `overflow-x: hidden` / `max-w-full`.
   - Ambient background blurs and promo banner carousels with negative margins (`-mx-4`) and absolute elements (`left-[-10%]`, `w-96`, `-left-24`) forced the document width to expand beyond `100vw`.
   - On small screens (320px–375px), horizontal body scroll shifted the entire view to the right by ~30px, clipping the left side of the page ("FETCHISTORE" logo became "CHISTORE", left product cards were cut off).

2. **Mobile Header Space Collision**:
   - `Navbar` (`components/shared/navbar.tsx`) placed Logo + Location Chip ("Near You") + Notifications + Auth Buttons in a single `flex justify-between` row.
   - On 360px mobile viewports, the total width of all header elements exceeded available width, causing logo text to clip or shrink off-screen.

3. **Bottom Navigation Vertical Truncation**:
   - `BottomNav` (`components/shared/bottom-nav.tsx`) used fixed `h-16` with `pb-safe`, squishing the tab icon and label text vertically so labels ("Wishlist", "Cart", "Orders") were clipped at the bottom screen edge.

4. **Product Card Badge Overflow**:
   - Product cards in `authenticated-feed.tsx` had absolute condition + distance badges at `left-2` without `right-2` bounds constraint, causing badge overflow on narrow 2-column mobile grids.

## Detailed Plan of Changes

### 1. Root Layout & Viewport Constraints
- **`app/globals.css`**:
  - Add `html, body { overflow-x: hidden; max-w: 100vw; }` and ensure body layout bounds do not scroll horizontally.
  - Set `min-w-0` on container flex children.
- **`app/layout.tsx`**:
  - Add `overflow-x-hidden w-full max-w-full` to root container wrapper `<div className="...">`.

### 2. Header Mobile Optimization
- **`components/shared/navbar.tsx`**:
  - Hide the location pill (`Near You`) on mobile screens (`hidden sm:flex`), showing it only on tablet/desktop.
  - Set `shrink-0` and `min-w-0` on logo link (`FETCHISTORE`) so logo and brand text never shrink or clip.
  - Set compact padding on mobile (`px-3 sm:px-6`).

### 3. Bottom Navigation Label Scaling
- **`components/shared/bottom-nav.tsx`**:
  - Adjust container height to `h-auto min-h-[56px] py-1.5` with flex layout so icons and text labels ("Discover", "Wishlist", "Cart", "Orders", "Profile") have ample vertical room on all mobile devices without bottom truncation.

### 4. Feed & Promo Banner Viewport Containment
- **`components/home/authenticated-feed.tsx`**:
  - Add `overflow-hidden` to outer section wrapper so carousel `-mx-4` scrolling stays bounded within section padding without expanding the page body.
  - Add `right-2 max-w-[calc(100%-16px)] flex-wrap` to product image overlay badges so condition & distance pills stay cleanly bounded inside product card images.
- **`components/home/hero-section.tsx`**, **`components/home/trending-banner.tsx`**, **`components/home/unauthenticated-welcome.tsx`**:
  - Ensure background blurs (`blur-[100px]`, `w-96`) and absolute elements are wrapped in `overflow-hidden` containers so they do not expand document width on small screens.

### 5. Shop & Category Grid Polish
- **`app/shop/page.tsx`**, **`app/categories/page.tsx`**, **`app/shop/category/[slug]/page.tsx`**:
  - Ensure 2-column mobile grids use `gap-2.5 sm:gap-4` with `min-w-0` on all text elements (`truncate`, `line-clamp-1`) so cards scale proportionally on narrow phones (320px–375px).

## Acceptance Criteria
1. On 320px, 360px (Samsung Galaxy S8+), 375px (iPhone SE/12/13/14), and 414px mobile viewports:
   - The logo `FETCHISTORE` displays completely on the left without any truncation or clipping.
   - All section headers ("Trending Near You", "Browse All Categories") are fully visible.
   - Product grid cards fit cleanly in 2 columns with full badges, titles, star ratings, and prices.
   - Bottom navigation labels ("Discover", "Wishlist", "Cart", "Orders", "Profile") display fully without bottom clipping.
2. The page body has zero horizontal scrollbar or side-scrolling whitespace.
3. TypeScript typecheck (`cmd /c npm run typecheck`) passes with 0 errors.

## Verification
```bash
cmd /c npm run typecheck
cmd /c npm run lint
```
