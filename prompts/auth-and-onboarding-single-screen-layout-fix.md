# Implementation Prompt — Auth & Onboarding Single Screen Layout & Whitespace Elimination

Fix the sign-in, sign-up, and onboarding screen layouts to fit strictly within a single non-scrollable screen (`100dvh`) without any vertical scrollbars or empty whitespace.

---

## 1. Executive Summary & Root Cause Analysis

### Root Cause
1. **Global `pb-24` Padding in Root Layout (`app/layout.tsx`)**:
   - `app/layout.tsx` hardcodes `pb-24 md:pb-8` on the root `<main>` container.
   - While `Navbar` and `BottomNav` return `null` on `/sign-in`, `/sign-up`, and `/onboarding`, the root `<main>` container still forced 96px (`6rem`) of bottom padding.
   - Any child container with `h-[100dvh]` inside `<main>` resulted in a total viewport height of `100dvh + 96px`, creating 96px of empty whitespace and forcing vertical scrolling.

2. **Onboarding Page (`components/home/unauthenticated-welcome.tsx`)**:
   - The onboarding screen (`/onboarding`) renders `UnauthenticatedWelcome`, which used flexible margins (`my-4`) and flexible height that pushed content past `100dvh` when combined with root layout padding.

---

## 2. Implementation & File Changes

### A. Root Layout & Main Wrapper (`app/layout.tsx` or `components/shared/main-wrapper.tsx`)
- Make `<main>` padding dynamic and route-aware (or create a lightweight client wrapper for `<main>`):
  - Apply `pb-24 md:pb-8` ONLY when the current route displays `BottomNav` (`/`, `/shop`, `/wishlist`, `/orders`, `/profile`, `/categories`, `/shop/category/...`).
  - Apply `pb-0 md:pb-0` on auth and onboarding routes (`/sign-in`, `/sign-up`, `/onboarding`, `/sso-callback`, `/checkout`, etc.).

### B. Sign-In & Sign-Up Auth Form (`components/auth/clerk-auth-form.tsx`)
- Ensure outer container is `h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between items-center p-3 sm:p-4 bg-[#FFF9E9]`.
- Adjust illustration image height (`h-[130px] xs:h-[150px] sm:h-[170px] shrink-1`) and vertical gaps (`my-1.5`, `space-y-2`) so the form fills `100dvh` cleanly.
- Ensure all inner sections (character image, title, inputs, CTA button, Google button, bottom link, and terms link) fit in the viewport with zero scrollbar.

### C. Onboarding Screen (`components/home/unauthenticated-welcome.tsx`)
- Restructure outer wrapper to `h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between items-center p-4 sm:p-6 bg-[#FBF9F8]`.
- Scale bento grid image collage height to `h-[42vh] max-h-[320px] w-full shrink-1`.
- Tighten text spacing and CTA buttons (`py-3`, `my-1 sm:my-2`) so the entire onboarding experience fits on a single viewport without scrolling.

---

## 3. Verification Criteria

1. Navigating to `/sign-in`:
   - Whole page fits in a single screen frame (`100dvh`).
   - No vertical scrollbar.
   - Zero empty whitespace below "Don't have an account? Create an account".
2. Navigating to `/sign-up`:
   - Fits on a single screen without scrollbar or bottom whitespace.
3. Navigating to `/onboarding`:
   - Fits on a single screen without scrollbar or bottom whitespace.
4. Static checks (`npm run typecheck`, `npm run lint`) pass with 0 errors.
