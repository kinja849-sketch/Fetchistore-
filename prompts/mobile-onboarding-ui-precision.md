# Implementation Prompt: Mobile Onboarding UI Precision & Spacing Alignment

## 1. Goal
Refine the Mobile Onboarding UI to match the exact visual reference image and Stitch design specifications: centered "FETCHISTORE" header, balanced Bento Grid collage taking ~45vh, perfectly proportioned typography, and tight, comfortable spacing for the CTA buttons ("Get Started" and "Already have an account? Sign In") without awkward empty gaps.

---

## 2. Code & Reference Inspected
- Reference Image provided in User Request.
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\onboarding\code.html`
- `components/shared/navbar.tsx`
- `components/home/hero-section.tsx`
- `components/home/unauthenticated-welcome.tsx`

---

## 3. Precise UI & Spacing Enhancements

### A. Top Navbar Header (`components/shared/navbar.tsx`)
- On mobile unauthenticated view (`< md`):
  - Height fixed at `h-14` / `h-16` with background `#FBF9F8`.
  - Centered brand logo: **FETCHISTORE** in `#8A9A5B` (olive green), `text-lg font-black tracking-[0.2em]`.
  - Hide Search icon, Sign In, and Sign Up buttons on mobile header (`hidden md:flex`).

### B. Bento Grid Image Collage (`components/home/hero-section.tsx`)
- Grid structure on mobile (`< md`):
  - 2 columns × 2 rows, `gap-3` (12px), height `h-[42vh]` (min `270px`, max `340px`).
  - Item 1 (Left tall): `grid-col 1 / 2`, `grid-row 1 / 3`, `rounded-[24px]` (Minimalist living room sofa image).
  - Item 2 (Right top): `grid-col 2 / 3`, `grid-row 1 / 2`, `rounded-[24px]` (White pillow image).
  - Item 3 (Right bottom): `grid-col 2 / 3`, `grid-row 2 / 3`, `rounded-[24px]` (Ceramic bowls image).
- Grid structure on desktop (`md:` and above):
  - 3 columns × 2 rows, `gap-6`, `h-[55vh]` (min `420px`).

### C. Typography & CTA Spacing (`components/home/hero-section.tsx`)
- Content section below Bento Grid:
  - Stack layout with balanced spacing (`space-y-3 sm:space-y-5`, `pt-2 sm:pt-4`).
  - Heading: **Modern Craftsmanship, Near You.** (`text-[26px] sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1B1C1C] leading-[1.2]`).
  - Description: "Discover and sell premium new and second-hand goods with local delivery and live tracking." (`text-xs sm:text-base text-[#46483C] max-w-sm sm:max-w-lg mx-auto md:mx-0 leading-relaxed`).
  - Primary CTA Button: **Get Started ->** (`bg-[#8A9A5B] text-white md:text-[#253000] font-bold text-sm py-3.5 px-8 rounded-full w-full max-w-xs md:max-w-sm flex items-center justify-center gap-2 hover:bg-[#56642B] transition-all shadow-sm`).
  - Secondary CTA Button: **Already have an account? Sign In** (`text-[#46483C] font-semibold text-xs sm:text-sm py-2 px-6 hover:text-[#8A9A5B] transition-colors`).

---

## 4. Verification & Acceptance Criteria
- [x] Header logo centered in olive green `#8A9A5B` on mobile.
- [x] Bento Grid proportioned at ~42vh on mobile with rounded 24px cards.
- [x] No giant empty gaps; text & CTA buttons sit cohesively directly below the bento collage.
- [x] Mobile screen fits cleanly within viewport height, ending at "Already have an account? Sign In".
- [x] Application logic (auth modals, routing, clerk hooks, desktop showcases) completely preserved.
- [x] `tsc --noEmit` passes with 0 errors.
