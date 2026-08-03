# Home Page UI — Implementation Prompt

## Goal

Build the Fetchistore public storefront home page following the **Clarkson structural reference** (section order & layout) and **NovaTrend visual language** (look & feel), re-implemented in React + Tailwind CSS v4 + lucide-react icons.

This is a **static UI-only** milestone — no Supabase, no auth, no real data fetching. All product/category data comes from hardcoded demo arrays. The page must look production-quality and fully responsive.

---

## Skills read

- `.agents/skills/ui-design/SKILL.md` — Clarkson structure + NovaTrend visual language
- `.agents/skills/ui-design/references/clarkson-home.html` — full structural HTML
- `.agents/skills/ui-design/references/novatrend-reference.png` — visual screenshot

## Code inspected

- `app/page.tsx` — default Next.js page (will be replaced)
- `app/layout.tsx` — default root layout (will be updated)
- `app/globals.css` — default Tailwind v4 import (will be extended)
- `package.json` — Next.js 16, React 19, Tailwind 4 (need to add lucide-react)
- `tsconfig.json` — path alias `@/*` configured
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin configured
- `next.config.ts` — empty config (need to allowlist demo image domains)

---

## Key decisions

1. **No shadcn/ui yet** — installing shadcn adds significant setup overhead (cn util, component files, CSS variables). For this first page we use plain Tailwind + custom components. shadcn/ui will be added when we build forms/dialogs (auth, checkout).

2. **Tailwind v4 theming** — v4 uses `@theme` in CSS instead of `tailwind.config.ts`. Brand colors, border-radius tokens, and the Inter font will be defined in `globals.css` via `@theme inline`.

3. **Demo data** — hardcoded arrays in `lib/demo-data.ts` for products, categories. Each product has: id, title, description, price, oldPrice, condition, image (placeholder URLs), distance. Each category has: name, slug, image.

4. **Images** — use high-quality Unsplash/Pexels URLs matching the product categories (fashion, electronics, beauty, fitness, home decor, accessories). Configure `next.config.ts` to allowlist `images.unsplash.com` and `images.pexels.com`.

5. **Component granularity** — separate files for Navbar, Hero, TrustBar, CategoryGrid, ProductCard, ProductShowcase, TrendingBanner, CollectionBanners, SubscribeSection, Footer, MobileNav. All live under `components/home/` or `components/shared/`.

6. **Inter font** — loaded via `next/font/google` in `layout.tsx`, replacing Geist.

7. **Condition badges** — colored pills per the skill spec (green/blue/amber/gray).

8. **Distance indicator** — shown as "X.X km away" subtext on product cards, using a MapPin icon.

9. **Responsive** — mobile-first: 1-col → 2-col (sm) → 3-col (lg) → 4-col (xl) for product grids. Mobile hamburger nav with slide-in overlay.

10. **Announcement bar** — thin dark bar at the top with a rotating promo message (NovaTrend pattern).

---

## Files to create/change

### Dependencies

#### `package.json`
- Add `lucide-react` to dependencies.

---

### Configuration

#### [NEW] `.env.local`
- Create `.env.local` template with canonical env vars:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`.

#### [MODIFY] `next.config.ts`
- Add `images.remotePatterns` for `images.unsplash.com` and `images.pexels.com`.

#### [MODIFY] `app/layout.tsx`
- Replace Geist with Inter via `next/font/google`.
- Update `<html>` font variable class.
- Update metadata: title → "Fetchistore — New & Pre-loved, Delivered to Your Door", description → Fetchistore blurb.

#### [MODIFY] `app/globals.css`
- Add brand color tokens under `@theme inline`: `--color-brand` (#E8553A), `--color-brand-light` (#FFF0ED), `--color-brand-dark` (#C4412A), `--color-surface-muted` (#F9FAFB), `--color-surface-dark` (#1A1A1A).
- Add border-radius tokens: `--radius-card` (12px), `--radius-pill` (9999px).
- Add font-family: `--font-sans: var(--font-inter)`.
- Add base styling reset tweaks, smooth scroll, custom scrollbar hiding for horizontal carousels.

---

### Demo data

#### [NEW] `lib/demo-data.ts`
- `demoProducts` array (8 items — 4 "new arrivals", 4 "top sellers") with fields: id, title, description, price, oldPrice?, condition, imageSrc, distance.
- `demoCategories` array (6 items: Fashion, Electronics, Beauty, Fitness, Home Decor, Accessories) with: name, slug, imageSrc.
- TypeScript types: `Product`, `ProductCondition`, `Category`.

---

### Shared components

#### [NEW] `components/shared/announcement-bar.tsx`
- Thin dark background bar, white text, centered promo message.
- Fetchistore-specific: "Free Delivery on Your First Order • Summer Sale Up To 30% Off • Limited Time!"

#### [NEW] `components/shared/navbar.tsx`
- Clarkson layout: Left (Shop · About · Contact links) | Center (Fetchistore text logo) | Right (Search icon · User icon · Cart icon with count badge).
- Sticky on scroll. Desktop nav links, hamburger button on mobile.
- Uses lucide-react icons: `Search`, `User`, `ShoppingCart`, `Menu`, `X`.

#### [NEW] `components/shared/mobile-nav.tsx`
- Full-screen slide-in overlay triggered by hamburger.
- Links: Shop, About, Contact, Terms, Privacy.
- Social links at bottom, close button.

#### [NEW] `components/shared/footer.tsx`
- Dark background (#1A1A1A), white text.
- 4-column grid (Clarkson pattern): Logo/blurb | Company links | Useful links | Newsletter form.
- Bottom bar: © Fetchistore | Social text links | "Powered by Next.js".

#### [NEW] `components/shared/condition-badge.tsx`
- Small pill badge. Color map per skill: new→green, like_new→blue, good→amber, fair→gray.
- Props: `condition: ProductCondition`.

---

### Home-specific components

#### [NEW] `components/home/hero-section.tsx`
- Large heading: "Discover Products You'll Love" (or similar Fetchistore-branded text).
- Subtext: "Shop new & pre-loved items from sellers near you. Delivered straight to your door."
- Two CTA buttons: "Shop Now" (brand filled) + "Explore Collection" (outlined).
- Right side / background: hero lifestyle image (generated or Unsplash).
- On mobile: stacked, image as background with dark overlay.

#### [NEW] `components/home/trust-bar.tsx`
- 4-icon horizontal row (Fetchistore messaging from skill):
  - Truck → "Seller Delivery" / "Direct to your door"
  - Shield → "Secure Payments" / "Card, bank, e-wallet, COD"
  - MapPin → "Near You" / "Proximity-first discovery"
  - Headphones → "Customer Support" / "We're here to help"
- Light gray background, centered, with subtle separator above/below.

#### [NEW] `components/home/category-grid.tsx`
- Section title "Shop by Categories" + "View All Categories" link.
- 6 circular/rounded image cards (NovaTrend style) in a scrollable row on mobile, 6-col grid on desktop.
- Each: category image, name, "Shop Now →" link.

#### [NEW] `components/home/product-card.tsx`
- Reusable card following Clarkson pattern + Fetchistore additions:
  - Product image with hover scale effect.
  - Condition badge (top-left overlay).
  - Title, description.
  - Price + optional strikethrough old price.
  - Distance with MapPin icon ("2.3 km away").
- Props: `product: Product`.

#### [NEW] `components/home/product-showcase.tsx`
- Reusable section: title + subtitle + product grid + "Shop All" CTA.
- Used for both "New Arrivals" and "Top Sellers".
- Responsive grid: 1→2→3→4 columns.

#### [NEW] `components/home/trending-banner.tsx`
- Full-width image with dark overlay.
- Heading: "Discover What's Trending" + "Shop Now" CTA button.
- Image: lifestyle/fashion Unsplash URL.

#### [NEW] `components/home/collection-banners.tsx`
- Section title: "Just For You".
- Two side-by-side cards (50/50 on desktop, stacked on mobile).
- Each: full-bleed image, overlay with collection name + "Shop Now" button.
- Collections: "New & Fresh" + "Pre-Loved Finds" (Fetchistore-branded).

#### [NEW] `components/home/subscribe-section.tsx`
- Gray background section.
- "Join Our List" heading + blurb + email input + "Sign Up" button.
- Below: 4-image gallery strip (Unsplash lifestyle images).
- "Follow Us on Instagram" CTA.

---

### Page assembly

#### [MODIFY] `app/page.tsx`
- Import and compose all sections in Clarkson order:
  1. `AnnouncementBar`
  2. `Navbar`
  3. `HeroSection`
  4. `TrustBar`
  5. `CategoryGrid`
  6. `ProductShowcase` (New Arrivals)
  7. `TrendingBanner`
  8. `ProductShowcase` (Top Sellers)
  9. `CollectionBanners`
  10. `SubscribeSection`
  11. `Footer`
- Plus `MobileNav` overlay (hidden by default).

---

## Implementation requirements

1. All components are React Server Components (no `"use client"`) except `Navbar` and `MobileNav` (need state for hamburger toggle).
2. Use `next/image` for all images with proper `width`/`height` or `fill` + `sizes`.
3. Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, `<h1>` (once), `<h2>` per section.
4. ARIA: `aria-label` on nav, hamburger button, cart button; `role="list"` on product grids.
5. All interactive elements have focus-visible styles.
6. Smooth hover transitions (200–300ms ease) on cards, buttons, links.
7. Use `@/*` import alias throughout.

---

## Security requirements

- No secrets, no API keys — this is pure static UI.
- External image domains allowlisted in `next.config.ts`.

---

## Acceptance criteria

- [ ] Page renders with all 11 sections in Clarkson order
- [ ] Visual treatment matches NovaTrend: Inter font, brand coral accent, soft cards, generous spacing
- [ ] Product cards show: image, condition badge, title, description, price, old price (strikethrough), distance
- [ ] Category grid shows 6 categories with images
- [ ] Trust bar shows 4 Fetchistore-specific value props with icons
- [ ] Announcement bar visible at top
- [ ] Fully responsive: mobile (1-col), sm (2-col), lg (3-col), xl (4-col) product grids
- [ ] Mobile hamburger nav works (open/close)
- [ ] Navbar is sticky
- [ ] All buttons use brand accent (#E8553A)
- [ ] Footer has 4-column layout with newsletter form
- [ ] No TypeScript errors (`npm run lint` passes)
- [ ] `npm run build` succeeds
- [ ] Page loads in dev without console errors

---

## Checks

```bash
npm run lint
npm run build
npm run dev    # manual visual inspection at localhost:3000
```

---

## Test steps

1. `npm install` (to pick up lucide-react)
2. `npm run dev`
3. Open `http://localhost:3000`
4. Verify all 11 sections render in order
5. Resize browser: check mobile (< 640px), tablet (768px), desktop (1280px+)
6. Click hamburger on mobile — mobile nav slides in, close button dismisses it
7. Hover product cards — image scales, card lifts
8. Verify condition badges show correct colors
9. Verify distance indicators show on product cards
10. Check that navbar sticks on scroll
11. `npm run build` — confirm zero errors
