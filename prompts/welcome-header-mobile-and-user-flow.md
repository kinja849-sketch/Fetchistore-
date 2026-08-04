# Implementation Prompt: Welcome Header Spacing, Mobile Onboarding Fix, and 6-Stage User Flow Integration

## 1. Goal
Fix top navbar header spacing (tighten gap around Sign-In / Sign-Up and remove Desktop Cart icon on unauthenticated Welcome page), resolve the huge empty vertical space on mobile devices below the "Get Started" hero section, and systematically align the codebase across all 6 stages of the Fetchistore user flow logic.

---

## 2. Skills Read & Inspect
- `.agents/skills/ui-design` (Clarkson structure + NovaTrend visual language)
- Code inspected:
  - `components/shared/navbar.tsx`
  - `components/home/unauthenticated-welcome.tsx`
  - `components/home/hero-section.tsx`
  - `app/page.tsx`, `app/shop/page.tsx`, `app/product/[id]/page.tsx`, `app/cart/page.tsx`, `app/orders/page.tsx`, `app/profile/page.tsx`

---

## 3. Detailed Decisions & Implementation Plan

### A. Header Spacing & Unauthenticated Desktop Cart Removal (`components/shared/navbar.tsx`)
- On the unauthenticated header (`<Show when="signed-out">`):
  1. Remove the `<Link href="/cart">` shopping cart icon on desktop/unauthenticated state as requested.
  2. Redesign header layout flexbox and spacing:
     - Replace outer `flex-1` pushing items to margins with a centered, balanced layout container (`flex items-center justify-between gap-4 sm:gap-6`).
     - Tighten gap between Logo, Nav links (`Shop`, `About`, `Sell Item`, `Orders`), and Auth buttons (`Sign In`, `Sign Up`).
     - Remove excessive empty space so the header is cohesive, balanced, and visually high-end.

### B. Mobile Device Welcome Layout Optimization (`components/home/unauthenticated-welcome.tsx` & `components/home/hero-section.tsx`)
- On mobile devices (`< md`):
  1. Remove the `hidden md:block` restriction on the onboarding showcases below the hero section.
  2. Optimize the hero section's vertical height (`min-h-[580px]` -> responsive padding `py-6 sm:py-10 md:py-16`) to eliminate large empty white gaps below "Get Started" / "Already have an account? Sign In".
  3. Render mobile-optimized discovery sections below the hero:
     - Compact Trust Bar (Seller Delivery, Secure Payments, Near You).
     - Category Grid directory with quick taps.
     - Trending & New Arrivals preview cards with "Sign In / Get Started to Shop" triggers.
     - Collection Banners and Footer to ensure full screen utilization and high conversion engagement.

### C. 6-Stage User Flow Integration
Systematically verify and refine all 6 user flow stages:
1. **Welcome Experience (Onboarding)**: Entry point (`/`) with "Modern Craftsmanship" value proposition and "Get Started" primary action leading to auth modal / marketplace access.
2. **Discovery & Exploration**: Main Shop hub (`/shop`), All Categories grid modal/page, and Category filter views (e.g. Fashion, Electronics) with quick favorite actions.
3. **Purchasing Journey**: Product details (`/product/[id]`) with images, sustainability tags, size selection, Wishlist (`/wishlist`) for saved items, and Cart (`/cart`) with transparent breakdown & local delivery options.
4. **Post-Purchase & Fulfillment**: Orders & Tracking (`/orders`, `/orders/[id]`) with live map tracking seller proximity and integrated order-scoped Delivery Chat.
5. **Selling & Management**: Profile hub (`/profile`), Create Listing (`/seller/create`), Active Listings inventory, and Sold Items history.
6. **Account & Security**: Payments & Balance (`/profile/payments`) for saved cards & seller payout withdrawals, and Settings & Privacy (`/profile/settings`) for 2FA and personal data preferences.

---

## 4. Verification & Checks
- Run `npm run typecheck` or `npx tsc --noEmit` to verify zero TypeScript errors.
- Run `npm run lint` / build check to verify clean syntax.
- Verify responsive layout on mobile (<768px) and desktop (>=1024px) viewports.

---

## 5. Acceptance Criteria
- [x] Cart icon removed from desktop unauthenticated welcome header.
- [x] Header spacing tightened between Logo, Nav links, and Sign-in / Sign-up buttons without large awkward gaps.
- [x] Mobile welcome page effectively utilizes vertical space below CTAs with rich onboarding showcases.
- [x] All 6 stages of the Fetchistore user flow logic seamlessly linked and functional.
