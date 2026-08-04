# Implementation Prompt: Mobile Onboarding & Bottom Nav Fix

## Goal
Restructure the Home / Welcome UI so that on Mobile devices (<768px), the page exclusively displays the clean Onboarding UI layout from `onboarding/code.html` (Bento Grid collage, headline, blurb, and pill CTAs), hiding desktop storefront showcase sections (categories, new arrivals, trending banners). Additionally, ensure the `BottomNav` bar is strictly hidden on desktop and only visible on mobile.

---

## Skills Read & References Inspected
- `AGENTS.md` (Section 1, 2, 7, 20)
- `.agents/skills/ui-design/SKILL.md`
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\onboarding\code.html`
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\organic_ethereal\DESIGN.md`

---

## Decisions & Architecture

1. **BottomNav Visibility**:
   - Add `md:hidden` to `components/shared/bottom-nav.tsx` so the floating pill bottom navigation is rendered **only on mobile viewports**.

2. **Mobile Welcome UI vs Desktop Storefront**:
   - **Mobile (<768px)**: Render exclusively the Onboarding UI screen matching `onboarding/code.html`:
     - Top Bento Grid collage (3 image tiles).
     - Headline: "Modern Craftsmanship, Near You."
     - Subtitle: "Discover and sell premium new and second-hand goods with local delivery and live tracking."
     - Action CTAs: Full-width pill button "Get Started" (opens sign-up modal) and "Already have an account? Sign In".
     - All extra storefront sections (Categories, New Arrivals, Trending Banner, Top Sellers, Collections, Subscribe, Footer) are hidden on mobile (`hidden md:block`).
   - **Desktop (≥768px)**: Renders the full side-by-side Bento Hero along with the complete storefront section flow (Trust bar, Category grid, Product showcases, Banners, Subscribe strip, and Footer).

---

## Files to Modify

1. `components/shared/bottom-nav.tsx` — Add `md:hidden` class wrapper.
2. `components/home/hero-section.tsx` — Refine mobile/desktop image assets and bento layout using the exact image URLs and styling from `onboarding/code.html`.
3. `components/home/unauthenticated-welcome.tsx` — Wrap extra storefront sections (`TrustBar`, `CategoryGrid`, `ProductShowcase`, `TrendingBanner`, `CollectionBanners`, `SubscribeSection`, `Footer`) in `hidden md:block` to keep the mobile welcome view strictly focused on the Onboarding layout.

---

## Acceptance Criteria
- [ ] Bottom Nav bar is hidden on Desktop (≥768px) and visible only on Mobile (<768px).
- [ ] Mobile Welcome page displays ONLY the Onboarding UI (Bento collage, title, subtitle, CTAs) without categories, new arrivals, or extra banners cluttering the screen.
- [ ] Desktop Welcome page displays the complete storefront with side-by-side hero and showcase sections.
- [ ] `npm run typecheck` passes with zero errors.

---

## Verification Steps
1. Run `node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run typecheck`.
2. Verify Mobile view (<768px):
   - Floating BottomNav appears.
   - Welcome screen shows only the clean Onboarding bento collage and action buttons. No categories or product grids below.
3. Verify Desktop view (≥768px):
   - Floating BottomNav is hidden.
   - Side-by-side hero and full storefront categories, showcase grids, and footer appear.
