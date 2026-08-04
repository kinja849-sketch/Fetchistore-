# Implementation Prompt: Fetchistore Home & Welcome UI Formatting Alignment

## Goal
Apply full structural formatting, layout hierarchy, and responsive desktop/mobile styling from the provided Stitch design documents (`onboarding/code.html`, `shop_discovery/code.html`, `organic_ethereal/DESIGN.md`) to the Fetchistore Home / Welcome UI while preserving all existing application logic (Clerk Auth, Supabase schema types, condition badges, distance filters, and routing).

---

## Skills Read & References Inspected
- `AGENTS.md` (Section 1, 2, 7, 20)
- `.agents/skills/ui-design/SKILL.md`
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\organic_ethereal\DESIGN.md`
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\onboarding\code.html`
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\shop_discovery\code.html`

---

## Decisions & Architecture

1. **Desktop vs. Mobile Welcome Section Differentiation**:
   - **Desktop (md: 768px+)**: Side-by-side layout featuring the 3-item Bento Grid imagery collage on the left (2x2 grid with spanning hero card) and text content/CTAs on the right with ambient glow filters (`blur-[100px]`), pill buttons, and Manrope typography (`font-display-lg`).
   - **Mobile (<768px)**: Stacked welcome hero with mobile-optimized bento layout / top location bar and search filters matching `shop_discovery/code.html` and `onboarding/code.html`.

2. **Organic Ethereal Formatting & Tokens**:
   - **Typography**: Manrope font across Display (48px desktop / 32px mobile), Headline (24px/20px), Body (18px/16px), Label (14px uppercase/tracking).
   - **Shapes & Radii**: Pill-shaped primary buttons (`rounded-full`), soft cards with `rounded-[24px]` and `rounded-[32px]`.
   - **Background Effects**: Ambient glow spheres (`bg-[#56642B]/5 blur-[100px]` and `bg-[#929677]/10 blur-[100px]`), tonal surface layering (`#FBF9F8`, `#F6F3F2`, `#EAE8E7`).

3. **Logic & Context Preservation**:
   - Preserve Clerk auth flow (`isSignedIn`, `SignUpButton` modal triggers for unauthenticated guests).
   - Maintain product cards with `ConditionBadge` (`new`, `like_new`, `good`, `fair`) and proximity distance tag (e.g. `1.2 km away`).
   - Keep routing to `/shop`, `/product/[id]`, `/seller/create`.

---

## Files to Modify / Create

1. `app/globals.css` — Import Manrope font & define ambient animation keyframes (`fadeInUp`).
2. `components/home/hero-section.tsx` — Implement the exact Bento Grid collage & text formatting from `onboarding/code.html`.
3. `components/home/unauthenticated-welcome.tsx` — Wrap the new responsive Hero and layout components with modal auth triggers.
4. `components/home/authenticated-feed.tsx` — Format mobile search, promo banner, category chips, and product grid to align with Organic Ethereal tokens.

---

## Implementation Requirements

- **Hero Section**:
  - Implement `.bento-grid` layout on desktop (3 image containers with subtle hover zoom and high-impact images).
  - Add ambient background blur spots behind content.
  - Heading: "Modern Craftsmanship, Near You." (or "Buy & Sell Nearby, Delivered to Your Door.") using `font-display-lg` styling.
  - CTAs: Primary pill button `#8A9A5B` ("Get Started" / "Start Shopping"), Secondary pill ("+ List an Item" / "Already have an account? Sign In").

- **Mobile Welcome UI**:
  - Clean top bar with location context ("Greenpoint, NY" or radius).
  - Mobile search bar with filter button.
  - Horizontal swipeable promo banners.
  - Circular category quick-nav icons.

---

## Acceptance Criteria
- [ ] Welcome Section renders full Bento grid on desktop and responsive stacked hero on mobile.
- [ ] Manrope typography and Organic Ethereal colors/radii applied consistently.
- [ ] Unauthenticated guests clicking CTAs/products trigger Clerk sign-up modal.
- [ ] Authenticated users see location-aware feed, categories, and new arrivals with working favorite buttons.
- [ ] `npm run typecheck` and `npm run lint` pass cleanly.

---

## Verification & Test Steps
1. Run `npm run typecheck` to confirm zero TypeScript errors.
2. Run `npm run dev` and open in browser.
3. Check Desktop view (>= 768px): Verify 3-item Bento Grid collage on left, text/buttons on right, ambient glow background.
4. Check Mobile view (< 768px): Verify stacked layout, top search bar, circular category icons.
5. Click "Start Shopping" / product cards while signed out → verify Clerk sign-up modal opens.
6. Sign in → verify feed transitions to authenticated proximity view.
