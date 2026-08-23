# Implementation Prompt — Onboarding Bento Collage & Single Screen Fit

Enhance the onboarding welcome screen (`components/home/unauthenticated-welcome.tsx`) with a rich 4-card bento grid collage (featuring pre-loved & new furniture, sneakers, fashion, and tech with floating proximity badges), eliminate the empty whitespace between images and text, suppress the Netlify floating badge, and enforce a 100% single-screen non-scrollable layout.

---

## 1. Executive Summary & Goals

1. **Rich 4-Card Bento Grid Collage**:
   - Replace the limited 3-card layout with a balanced 4-card bento collage:
     - Card 1: Sustainable Velvet Sofa (Furniture)
     - Card 2: Pre-Loved Red Sneakers (Footwear)
     - Card 3: Smart Wireless Headphones (Tech)
     - Card 4: Vintage Leather Jacket / Bag (Fashion)
   - Add floating condition & proximity badges on each card (`New • 1.2km away`, `Like New • Direct Delivery`, `Eco-Friendly`, `Live Tracking`).

2. **Eliminate Middle Gap & Whitespace**:
   - Add a row of subtle trust feature pills (`📍 Nearby Discovery`, `🚚 Seller-to-Door`, `⚡ Live Map Tracking`) below the bento collage to fill the empty space smoothly.
   - Adjust flex growth (`flex-1`) so the image collage and feature highlights occupy the vertical middle section naturally without leaving an empty void.

3. **Eliminate Bottom Scrollable Gap & Netlify Badge**:
   - Update CSS in `app/globals.css` to suppress Netlify's floating badge/drawer button (`[class*="netlify"]`, `[id*="netlify"]`).
   - Enforce `h-[100dvh] max-h-[100dvh] overflow-hidden` on the onboarding container to prevent any vertical scrollbars or bottom whitespace.

---

## 2. File Changes

### A. `components/home/unauthenticated-welcome.tsx`
- Expand bento grid to 4 rich product cards with floating condition pills and distance tags.
- Add trust highlight row (`📍 Nearby Discovery`, `🚚 Seller-to-Door Delivery`, `⚡ Live Tracking`).
- Apply `h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between` layout.

### B. `app/globals.css`
- Update `.bento-grid` to support balanced 4-card grid on mobile (`grid-template-columns: repeat(2, 1fr)`, `grid-template-rows: repeat(2, 1fr)`).
- Extend Netlify badge suppression selectors to hide Netlify's circular "N" badge on mobile screens.

---

## 3. Verification Criteria

1. On `/onboarding`:
   - 4 rich product cards with proximity pills render in the collage.
   - No empty white space between the collage and the "Modern Craftsmanship, Near You" title.
   - Entire page fits on a single screen without vertical scrollbars.
   - Netlify badge is hidden.
2. `npm run typecheck` and `npm run lint` pass cleanly.
