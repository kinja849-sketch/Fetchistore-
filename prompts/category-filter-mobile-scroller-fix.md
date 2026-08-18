# Prompt: Category Filter Row Mobile Scroller & Responsiveness Fix

## Goal
Fix mobile viewport overflow, right-edge cropping, and layout boundaries of category filter rows across Fetchistore (`app/shop/page.tsx`, `components/home/authenticated-feed.tsx`, and `app/shop/category/[slug]/page.tsx`) so that on 414px viewports (iPhone XR and similar mobile screens) every pill is 100% visible or smoothly scrollable without horizontal page overflow or clipping.

## Skills Read & References
- `.agents/skills/ui-design` — Clarkson structure + NovaTrend visual design system, mobile-first responsive breakpoints.
- `AGENTS.md` — Section 7 (UI Design System locked tokens, spacing, and mobile rules).

## Changes Required

### 1. `app/shop/page.tsx`
- Replace overflow-x container with a constrained double-wrapper: outer `w-full min-w-0 overflow-hidden py-1` + inner `flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-0.5 touch-pan-x min-w-0`.
- Remove negative horizontal margins (`-mx-4`) that extended the scroll box past 414px mobile viewport bounds.
- Use mobile-optimized pill padding (`px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs`).
- Remove `scale-105` transformation from selected pill state to prevent vertical clipping; use `ring-2 ring-[#8A9A5B]/30 font-extrabold` instead.

### 2. `components/home/authenticated-feed.tsx`
- Wrap category pills section in `w-full min-w-0 overflow-hidden py-1`.
- Set inner row to `flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide py-1 px-0.5 touch-pan-x min-w-0`.
- Replace `scale-105` on active icon circle with `ring-2 ring-[#56642B]/30` to eliminate top/bottom bounding box clipping.

### 3. `app/shop/category/[slug]/page.tsx`
- Wrap subcategory filter pills in `w-full min-w-0 overflow-hidden py-1`.
- Set inner row to `flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-0.5 touch-pan-x min-w-0` with `shrink-0` buttons and ring-highlighted selected state.

## Verification Plan
1. Run `cmd /c npm run typecheck` to verify 0 TypeScript errors.
2. Run `cmd /c npm run lint` to verify 0 ESLint errors.
3. Verify on mobile viewports (414×896 iPhone XR) that no category pills are cut off, active selection is clearly visible, and zero horizontal page overflow occurs.
