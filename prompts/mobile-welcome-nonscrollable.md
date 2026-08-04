# Implementation Prompt: Non-Scrollable Mobile Welcome Page & Centered Header

## 1. Goal
Refine the mobile welcome screen so it is completely non-scrollable, ending cleanly at "Already have an account? Sign in". Center the FETCHISTORE brand logo on mobile headers (hiding header search/auth buttons on mobile), and restrict all showcase sections (categories, delivery trust bar, new arrivals, footers) strictly to desktop viewports.

---

## 2. Skills & Code Inspected
- `.agents/skills/ui-design`
- `components/shared/navbar.tsx`
- `components/home/unauthenticated-welcome.tsx`
- `components/home/hero-section.tsx`

---

## 3. Implementation Details

### A. Navbar (`components/shared/navbar.tsx`)
- On mobile unauthenticated view (`< md`):
  - Center the `FETCHISTORE` brand logo text (`w-full flex justify-center items-center md:w-auto md:justify-start`).
  - Hide Search icon (`hidden md:flex`).
  - Hide Sign In and Sign Up buttons (`hidden md:flex`).
- On desktop view (`md:` and up):
  - Display logo + nav links on left, Search + Sign In + Sign Up on right.

### B. Storefront Showcases (`components/home/unauthenticated-welcome.tsx`)
- Restore `<div className="hidden md:block">` around TrustBar, CategoryGrid, ProductShowcases, TrendingBanner, CollectionBanners, SubscribeSection, and Footer.
- Shop categories, delivery info, and new arrivals will render **only on desktop**.

### C. Non-Scrollable Mobile Hero (`components/home/hero-section.tsx`)
- Constrain mobile section height to `h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] overflow-hidden` on mobile viewports (`< md`).
- Scale bento grid imagery and text spacing so that:
  - Top: Bento grid collage.
  - Middle: "Modern Craftsmanship, Near You." heading & blurb.
  - Bottom: "Get Started" primary CTA and "Already have an account? Sign in" secondary CTA.
- The page on mobile will fit 100% within the screen height with **no vertical scrollbar**.

---

## 4. Verification & Acceptance Criteria
- [x] Header search, sign-in, and sign-up hidden on mobile screen.
- [x] FETCHISTORE logo centered on mobile top navbar.
- [x] Zero vertical scrolling on mobile welcome page (`< md`).
- [x] "Already have an account? Sign in" is the bottom-most element on mobile.
- [x] Categories, delivery trust bar, and new arrivals render exclusively on desktop (`md:` and above).
- [x] `tsc --noEmit` passes with 0 errors.
