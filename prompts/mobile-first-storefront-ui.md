# Implementation Prompt: Mobile-First Storefront UI (Fetchistore)

## Goal
Build and refine the mobile-first version of Fetchistore according to the canonical UI design system specified in `AGENTS.md` (Section 7) and `ui-design` skill. Ensure top-tier responsive mobile experience with bottom navigation, fixed top app bar, proximity product discovery grid, sticky actions, and seamless tab transitions.

## Skills Read
- `.agents/skills/ui-design`
- `AGENTS.md` (Section 7 UI Design Source of Truth)

## Code Inspected
- `app/layout.tsx`
- `app/page.tsx`
- `components/shared/navbar.tsx`
- `components/shared/bottom-nav.tsx`
- `components/home/authenticated-feed.tsx`
- `components/home/unauthenticated-welcome.tsx`

## Design Decisions & Specifications (Strict adherence to AGENTS.md Section 7)
- **Palette**: Primary (`#56642b`), Primary Container (`#8a9a5b`), Surface (`#fbf9f8`), On-Surface (`#1b1c1c`), Outline (`#76786b`).
- **Typography**: Manrope font with clear mobile hierarchy (`display-lg-mobile`, `headline-sm`, `body-md`, `label-md`).
- **Layout & Structure**:
  - **Main Mobile Tabs**: Home, Wishlist, Cart/Orders, Profile with persistent bottom navigation bar.
  - **Transactional Mobile Surfaces**: Product Details, Checkout, Create Listing, Chat suppress bottom nav and feature back-button top bar with sticky full-width pill CTA.
  - **Onboarding / Welcome**: Full-bleed bento image collage, headline "Modern Craftsmanship, Near You.", primary "Get Started" pill button.
  - **Discovery Home**: Top location header + notification bell, distance search/filter pill, category horizontal scroll, 2-column "Trending Near You" product grid with condition pills (`new`, `like_new`, `good`, `fair`) & distance tags.

## Files to Modify / Create
- `app/layout.tsx` (Ensure responsive viewport, color scheme, theme provider integration)
- `components/shared/navbar.tsx` (Mobile top app bar with location + search)
- `components/shared/bottom-nav.tsx` (Mobile tab navigation with active state indicators)
- `components/home/unauthenticated-welcome.tsx` (Bento onboarding mobile view)
- `components/home/authenticated-feed.tsx` (Proximity feed + 2-column card grid)
- `components/home/product-card.tsx` (Mobile card with condition badge, favorite toggle, and distance)
- `app/product/[id]/page.tsx` (Mobile product detail page with sticky bottom CTA)

## Acceptance Criteria
1. Mobile layout strictly matches NovaTrend aesthetic and Clarkson structure.
2. Bottom nav stays sticky at screen bottom on primary tabs and hides on detail/transaction pages.
3. 2-column grid renders cleanly on mobile screen widths without overflow or wrapping errors.
4. All CTAs use full-width/pill styling with correct primary container token `#8a9a5b` / `#56642b`.
5. Product condition and distance badges display properly.

## Verification & Checks
- Run `npm run typecheck` to ensure 0 TypeScript errors.
- Run `npm run lint` to ensure code formatting and lint rules pass.
- Test responsive viewports on mobile (375px - 430px width).
