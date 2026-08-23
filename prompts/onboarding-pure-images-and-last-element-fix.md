# Implementation Prompt — Onboarding Pure Images Bento & Last Element Positioning

Fix the onboarding screen (`components/home/unauthenticated-welcome.tsx`) by removing text pills/badges from the bento grid (using images only), removing the middle text pill bar, and locking the entire layout so that "Already have an account? Sign In" is the absolute last element visible at the bottom of a single non-scrollable screen (`100vh`).

---

## 1. Executive Summary & Required Fixes

1. **Bento Grid (Images Only)**:
   - Remove text pill overlays/badges (`Eco-Friendly`, `Like New`, etc.) from bento items.
   - Remove the middle text bar (`📍 Proximity Discovery`, `🚚 Seller-to-Door Delivery`, `⚡ Live Map Tracking`).
   - Fill the bento grid with pure, high-quality images only.

2. **Absolute Last Element & Zero Scroll**:
   - Ensure `Already have an account? Sign In` is the final element at the bottom of the screen.
   - Lock `<main>` in `components/shared/main-content.tsx` with `h-screen max-h-screen overflow-hidden` for auth & onboarding routes.
   - Set `UnauthenticatedWelcome` container to `h-screen max-h-screen flex flex-col justify-between overflow-hidden p-4 sm:p-5 bg-[#FBF9F8]` so the entire content fills the viewport with 0 scrollbar and 0 bottom gap.

---

## 2. File Changes

### A. `components/home/unauthenticated-welcome.tsx`
- Remove middle text pill bar completely.
- Remove overlay text badges inside bento items (images only).
- Position bottom actions so "Already have an account? Sign In" is the last element visible at the bottom of the single non-scrollable screen.

### B. `components/shared/main-content.tsx`
- Lock main container to `h-screen max-h-screen overflow-hidden pb-0` on `/onboarding`, `/sign-in`, and `/sign-up`.

---

## 3. Verification Criteria

1. On `/onboarding`:
   - Bento grid uses pure images only (no text pills, no badge overlays).
   - No middle text pill bar.
   - "Already have an account? Sign In" is the last element at the bottom.
   - Entire screen is 100% visible on a single frame with ZERO scrolling.
2. `npm run typecheck` and `npm run lint` pass cleanly.
