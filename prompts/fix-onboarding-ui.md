# Implementation Prompt: Fix Onboarding Mobile UI Alignment & Spacing

## 1. Goal
Fix the Onboarding screen (`components/home/hero-section.tsx`, `components/shared/navbar.tsx`) to eliminate the giant empty white gap above the Bento grid on mobile, restore exact design system tokens (`bg-primary-container`, `text-on-primary-container`), refine Bento grid image harmony, and ensure a tight, visually striking mobile and desktop layout matching `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\onboarding\code.html`.

---

## 2. Skills Read
- `.agents/skills/ui-design` (Clarkson structure + NovaTrend visual language)

---

## 3. Code Inspected
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\onboarding\code.html`
- `components/home/hero-section.tsx`
- `components/shared/navbar.tsx`
- `components/home/unauthenticated-welcome.tsx`
- `app/globals.css`

---

## 4. Planned Changes

### A. Remove Mobile Vertical Centering Gap (`components/home/hero-section.tsx`)
- Change section wrapper styling from:
  `className="relative w-full bg-[#FBF9F8] min-h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] md:min-h-[580px] md:max-h-none lg:min-h-[660px] flex items-center justify-center overflow-hidden py-3 sm:py-8 md:py-16"`
  to:
  `className="relative w-full bg-[#FBF9F8] min-h-0 md:min-h-[580px] lg:min-h-[660px] flex flex-col justify-start md:justify-center overflow-hidden py-2 sm:py-6 md:py-16"`
- Inside `<main>`, use `py-1 sm:py-4 md:py-0` and balanced gap `gap-3 sm:gap-6 md:gap-8 lg:gap-12` so the Bento grid sits directly and comfortably under the header bar without a 200px empty space.

### B. Refine Bento Grid Image & Mobile Heights (`components/home/hero-section.tsx`)
- On mobile (`< md`), set bento grid height to `h-[40vh] min-h-[250px] max-h-[320px]`.
- Replace Bento Item 2 image with high-quality muted earth-toned linen fabric (`https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop`) to replace the bright yellow background image.

### C. Update CTA Button Tokens (`components/home/hero-section.tsx`)
- **Primary CTA ("Get Started")**:
  `w-full max-w-xs md:max-w-sm bg-[#8A9A5B] text-[#253000] font-bold text-xs sm:text-sm py-3.5 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-[#929677] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs`
- **Secondary CTA ("Already have an account? Sign In")**:
  `w-full max-w-xs md:max-w-sm text-[#46483C] font-semibold text-xs sm:text-sm py-2 px-6 sm:px-8 rounded-full hover:bg-[#F6F3F2] hover:text-[#56642B] transition-colors duration-200 cursor-pointer`

### D. Mobile Header Bar Polish (`components/shared/navbar.tsx`)
- Ensure unauthenticated top header displays `FETCHISTORE` centered on mobile with clean font size and letter spacing (`text-lg font-black tracking-[0.2em] text-[#8A9A5B]`).

---

## 5. Verification & Acceptance Criteria
- [ ] Onboarding hero sits directly below top header with no giant white empty top margin on mobile viewports.
- [ ] Bento grid uses soft minimal luxury photography (no bright neon/yellow clashing images).
- [ ] Primary button text uses dark olive `#253000` text on `#8A9A5B` pill background per design tokens.
- [ ] Typography and spacing fit neatly in standard mobile viewports.
- [ ] `npm run typecheck` passes cleanly.

---

## 6. Execution Steps
1. Modify `components/home/hero-section.tsx`.
2. Modify `components/shared/navbar.tsx` if needed.
3. Run `npm run typecheck`.
4. Run `npm run lint`.
