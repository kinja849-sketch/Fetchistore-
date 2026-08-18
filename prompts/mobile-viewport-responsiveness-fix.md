# Prompt: Cross-Device & Mobile Viewport Responsiveness Overhaul

## Goal
Overhaul cross-device responsiveness in Fetchistore so that on mobile viewports (e.g., Samsung Galaxy S8+ at 360×740, iPhone SE at 375×667, Pixel 5 at 393×851, etc.) 100% of page content, product grid cards, text, prices, badges, and bottom navigation render fully visible without horizontal or vertical clipping, cropping, or layout shifts.

## Skills Read & References
- `.agents/skills/ui-design` — Clarkson structural reference + NovaTrend visual language, responsive breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).
- `AGENTS.md` — Section 7 (UI Design system, locked color tokens, radii, bottom navigation rules).

## Changes Required

### 1. Viewport Meta & Root Layout (`app/layout.tsx` & `app/globals.css`)
- Export explicit `viewport` object in `app/layout.tsx`:
  ```ts
  export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  };
  ```
- Ensure `html` and `body` in `app/globals.css` set `overflow-x: hidden; max-width: 100vw; width: 100%;`.
- Ensure `<main>` container in `app/layout.tsx` has `pb-24 md:pb-8` clearance so product cards at the bottom of pages are never obscured by `BottomNav`.

### 2. Header & Subpage Navigation (`components/shared/navbar.tsx`)
- Enforce `shrink-0 min-w-0` on logo link (`FETCHISTORE`) and container so logo is never clipped.
- Hide non-essential location chip on small mobile screens (`hidden sm:flex`).
- Ensure subpage header titles truncate smoothly with `min-w-0 truncate` between action buttons.

### 3. Product Card Internal Layout Scaling (`components/home/product-card.tsx`, `components/home/authenticated-feed.tsx`, `app/shop/page.tsx`, `app/shop/category/[slug]/page.tsx`)
- Ensure 2-column mobile grid uses `gap-2.5 sm:gap-4` with responsive card padding (`p-2.5 sm:p-3`).
- Position condition badge top-left and distance badge bottom-left inside image container so badges never collide with each other or the wishlist heart.
- Use responsive typography (`text-[11px] sm:text-xs` for titles, `text-xs sm:text-sm` for prices) with `line-clamp-1` and `truncate` so no text overflows or crops.

### 4. Bottom Navigation Bar (`components/shared/bottom-nav.tsx`)
- Set container height to `min-h-[60px] py-1.5` with `flex justify-around items-center` to guarantee icons and text labels ("Discover", "Wishlist", "Cart", "Orders", "Profile") have full vertical clearance without bottom edge clipping.

### 5. Home Hero & Promo Carousel Containment (`components/home/hero-section.tsx`, `components/home/authenticated-feed.tsx`, `components/home/trending-banner.tsx`)
- Ensure promo banner carousel container uses `overflow-hidden` wrapper so `-mx-4` drag scrolling stays bounded.
- Ensure ambient background blur elements use `overflow-hidden` containers.

## Acceptance Criteria
1. 100% of product cards (image, title, rating, price, condition badge, distance indicator, and wishlist heart) display fully without horizontal/vertical cropping on 360×740, 375×667, 390×844 mobile viewports.
2. Bottom navigation bar is fixed at the bottom with 100% visible icon + label text and zero clipping.
3. No horizontal scrollbar or side-scrolling whitespace across any page.
4. Product grids reflow cleanly (2 columns on mobile where intended).
5. TypeScript typecheck (`cmd /c npm run typecheck`) and ESLint pass cleanly with 0 errors.

## Checks
```bash
cmd /c npm run typecheck
cmd /c npm run lint
```
