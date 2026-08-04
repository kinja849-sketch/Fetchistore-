# Authentic User Flow Experience Prompt

## Goal
Establish a seamless, authentic end-to-end user flow experience for Fetchistore by connecting missing navigation paths, linking profile bento cards to dedicated pages, ensuring clean guest/authenticated state persistence, unifying order tracking and live seller chat, and verifying all UI interactions match the design system contract in `AGENTS.md`.

## Skills Read
- `.agents/skills/ui-design` — Clarkson structural reference + NovaTrend visual language

## Code Inspected
- `app/layout.tsx` & `app/page.tsx`
- `app/profile/page.tsx`, `app/profile/payments/page.tsx`, `app/profile/settings/page.tsx`
- `app/seller/listings/page.tsx`, `app/seller/sold/page.tsx`, `app/seller/listings/create/page.tsx`
- `app/orders/page.tsx`, `app/orders/[id]/page.tsx`, `app/orders/[id]/chat/page.tsx`
- `components/shared/navbar.tsx`, `components/shared/bottom-nav.tsx`

## Decisions
1. **Profile Navigation**: Connect bento buttons in `/profile` to route directly to `/seller/listings`, `/seller/sold`, `/profile/payments`, and `/profile/settings` so URLs are shareable and back-button navigation functions natively.
2. **Order Tracking & Chat**: Provide clear affordances on `/orders` to open live map tracking (`/orders/[id]`) as well as order-scoped delivery chat (`/orders/[id]/chat`).
3. **Seller Flow**: Ensure listing creation (`/seller/listings/create`) redirects directly to active listings (`/seller/listings`) after submission.
4. **Header Sub-Page Titles**: Update `Navbar` to display clear titles for `/profile/payments`, `/profile/settings`, `/seller/sold`, and `/seller/listings`.

## Files to Change
- `app/profile/page.tsx` [MODIFY]
- `components/shared/navbar.tsx` [MODIFY]
- `components/shared/bottom-nav.tsx` [MODIFY]
- `app/orders/page.tsx` [MODIFY]
- `app/orders/[id]/page.tsx` [MODIFY]
- `app/seller/listings/create/page.tsx` [MODIFY]

## Acceptance Criteria
- [ ] Profile Bento section cards navigate to dedicated URLs (`/seller/listings`, `/seller/sold`, `/profile/payments`, `/profile/settings`).
- [ ] Header displays appropriate back button and section titles on all sub-pages.
- [ ] Order tracking card offers links to both live map tracking and delivery chat.
- [ ] Creating a listing successfully redirects to active seller listings.
- [ ] `npm run typecheck` passes with zero errors.

## Checks & Verification
```bash
npm run typecheck
npm run build
```
