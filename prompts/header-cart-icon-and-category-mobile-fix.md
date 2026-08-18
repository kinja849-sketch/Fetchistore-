# Prompt: Header Cart Icon Replacement & Mobile Category Pills Responsiveness Fix

## Goal
Fix top header icons and category filter row responsiveness issues on mobile viewports (e.g., iPhone XR 414×896 and standard device sizes):
1. In the top header (`components/shared/navbar.tsx`), remove the extra plain profile icon sitting between notification bell and user avatar. Replace it with a visible shopping-cart icon so the header displays: **Logo → Notification Bell → Shopping Cart → User Avatar**.
2. Fix horizontal category filter pills (`app/shop/page.tsx` and `components/home/authenticated-feed.tsx`) so that on mobile they scroll horizontally without cropping right-edge content or causing page overflow, while maintaining active category selection ("All Categories") and NovaTrend visual design system.

## Skills Read & References
- `.agents/skills/ui-design` — Clarkson structural reference + NovaTrend visual language, responsive breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`).
- `AGENTS.md` — Section 7 (UI Design system, locked color tokens, radii, header & mobile UI rules).

## Proposed Changes

### 1. `components/shared/navbar.tsx`
- Remove the plain `<Link href="/profile">` profile icon button inside `<Show when="signed-in">`.
- Make the `<Link href="/cart">` shopping cart icon button visible across all viewports (remove `hidden md:flex` restrictions).
- Order header items on the right: Location chip (`hidden sm:flex`) → Notifications Bell (`/notifications`) → Shopping Cart Icon (`/cart` with item badge) → User Avatar (`<UserButton />` or Sign In/Sign Up buttons).

### 2. `app/shop/page.tsx`
- Refactor category pills container (`flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide`) to use `-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide flex items-center gap-2 pb-2 pt-1 touch-pan-x min-w-0 w-full max-w-full`.
- Ensure all category pills (`All Categories`, `Electronics`, `Fashion`, `Men's Outfit`, `Women's Outfit`, `Footwear`, `Accessories`, `Home Decor`) have `shrink-0 whitespace-nowrap` so they remain smoothly scrollable without cropping or clipping on 414px (iPhone XR) viewports.
- Preserve active selection state styling for "All Categories".

### 3. `components/home/authenticated-feed.tsx`
- Fix category pills row container: replace `justify-between` with `flex items-center gap-3 sm:gap-6 pt-1 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 min-w-0 touch-pan-x`.
- Ensure category buttons are `shrink-0` with full touch panning support.

### 4. `app/shop/category/[slug]/page.tsx`
- Refactor subcategory filter pills container to match `-mx-4 px-4 sm:mx-0 sm:px-0` touch-friendly horizontal scroll behavior.

## Verification Plan
1. Run `cmd /c npm run typecheck` to verify zero TypeScript errors.
2. Run `cmd /c npm run lint` to verify zero ESLint errors.
3. Test layout on mobile viewports (iPhone XR 414×896, iPhone SE 375×667) to confirm header shows Logo → Notifications → Cart → Avatar and category pills scroll smoothly without clipping or page overflow.

## Acceptance Criteria
- Header shows logo → notification icon → shopping-cart icon → user avatar with no extra profile icon.
- Category filter row is smoothly scrollable without cropping or page overflow on iPhone XR (414×896) and other mobile viewports.
- Active "All Categories" state is preserved.
- Code passes `npm run typecheck` and `npm run lint`.
