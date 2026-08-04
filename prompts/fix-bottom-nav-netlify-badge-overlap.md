# Prompt: Fix Netlify Badge Overlap & Bottom Navigation Cut-Off Layout

## Goal
Fix the mobile UI issues shown in the screenshot:
1. Suppress/hide the floating Netlify feedback widget (dark "N" circle) that overlaps and blocks the bottom-left corner of the bottom navigation bar on mobile.
2. Fix the `BottomNav` grid layout so all 5 tabs (`Home`, `Wishlist`, `Cart`, `Orders`, `Profile`) fit cleanly across all mobile screen widths without overflowing or getting cut off.
3. Align tab order with `AGENTS.md` and reference HTML specs: `Home` → `Wishlist` → `Cart` → `Orders` → `Profile`.

## Planned Code Changes

### 1. `app/globals.css`
- Add CSS rules to suppress Netlify feedback widget elements (`iframe#netlify-drawer-iframe`, `netlify-drawer`, `[data-netlify-feedback-button]`, `#netlify-drawer-button`, `#netlify-drawer-root`) so they don't cover the bottom navigation.

### 2. `components/shared/bottom-nav.tsx`
- Change `<nav>` layout from `flex justify-around` to `grid grid-cols-5 w-full z-[100]`.
- Set tab items in canonical order: `Home`, `Wishlist` (or `Watchlist`), `Cart`, `Orders`, `Profile`.
- Ensure equal 20% column width for each nav item with centered flex alignment, `text-[10px]`, `whitespace-nowrap`, and high z-index (`z-[100]`).
- Keep route suppression for transactional pages (`/checkout`, `/product/`, `/cart`, `/orders/.../chat`, `/seller/create`, etc.).

### 3. `components/home/authenticated-feed.tsx` & Page Padding
- Ensure bottom padding `pb-24 md:pb-8` is cleanly applied so product feed cards (like Headphones / Watch) have proper clearance above the fixed bottom navigation bar.

## Verification Plan
1. Run `npm run typecheck`
2. Run `npm run lint`
3. Run `npm run build`
4. Inspect mobile viewport (320px - 414px):
   - Confirm Netlify "N" badge is hidden / non-overlapping.
   - Confirm all 5 bottom nav tabs are visible, centered, and fully interactive.
   - Confirm feed items can be scrolled cleanly above the fixed bottom bar.
