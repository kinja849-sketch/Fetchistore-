# Prompt: Discover & Product Detail Fly-to-Header-Cart Effect Alignment

## Goal
Align the cart fly animation system across Fetchistore so that both Discover product cards and the full product detail page fly their respective product photos directly into the top header cart icon (`#cart-fly-target-header` beside the user avatar) with Web Audio API sound synthesis and target landing pulse:
1. **Unified Target (`#cart-fly-target-header`)**: Ensure the top header cart icon (beside user avatar) has `id="cart-fly-target-header"` and is present and measurable in the DOM across both main pages and subpages (e.g. `/product/[id]`).
2. **Discover / Display Cards**: Add a prominent Add to Cart button on every product card in the Discover grid (`components/home/product-card.tsx` and `components/home/authenticated-feed.tsx`). On tap, add the item to cart immediately, play synthesized sound, and launch the card's product thumbnail along a curved arc toward `#cart-fly-target-header`.
3. **Product Detail Page**: Ensure adding to cart from `/product/[id]` flies the main gallery image toward `#cart-fly-target-header` (the same header cart) with sound and target pulse.
4. **Animation & Sound Engine**: Update `lib/cart-fly-animation.ts` to target `#cart-fly-target-header` as the primary end point, computing a quadratic Bezier arc with scale decay (~1.0 to 0.2) and Web Audio API whoosh + pluck sound.

## Skills Read & References
- `.agents/skills/ui-design` — Clarkson structural reference + NovaTrend visual language.
- `AGENTS.md` — Section 7 (UI Design system, locked color tokens, header rules) & Section 15.

## Proposed Changes

### 1. `components/shared/navbar.tsx`
- Change cart icon ID from `cart-fly-target-desktop` to `id="cart-fly-target-header"` on the main header.
- Add the cart button `<Link href="/cart" id="cart-fly-target-header">` (with item count badge) to the subpage header layout (so it is visible & measurable on `/product/[id]`).

### 2. `lib/cart-fly-animation.ts`
- Refactor `flyImageToCart`:
  - Accept `sourceEl` or `{ sourceEl, cartSelector }`.
  - Default target selector: `#cart-fly-target-header` (falling back to `.cart-target` or top-right offset).
  - Calculate quadratic Bezier arc upwards toward `#cart-fly-target-header`.
  - Animate scale down to ~0.2 and opacity fade at arrival.
  - Play Web Audio whoosh at start and pluck on landing.
  - Add `.cart-fly-pulse` class to `#cart-fly-target-header` on arrival.

### 3. `components/home/product-card.tsx` & `components/home/authenticated-feed.tsx`
- Ensure every product card has an Add to Cart button.
- Attach `ref` to the product image element.
- On Add to Cart click:
  - `e.preventDefault()` and `e.stopPropagation()` (do not navigate to product page).
  - Call `addItem(...)` to update cart state.
  - Call `flyImageToCart(cardImageRef.current)`.

### 4. `app/product/[id]/page.tsx`
- Ensure `handleAddToCart` passes `mainImageRef.current` to `flyImageToCart(mainImageRef.current, { cartSelector: "#cart-fly-target-header" })`.

### 5. `app/layout.tsx`
- Update persistent fallback anchor ID to `id="cart-fly-target-header"` (positioned top right at fixed coordinates).

## Verification Plan

### Automated Checks
- Run `cmd /c npm run typecheck` to verify 0 TypeScript errors.
- Run `cmd /c npm run lint` to verify 0 ESLint errors.

### Manual Verification
1. On Discover page (`/`), tap **Add to Cart** on a product card.
   - Confirm card thumbnail flies in an upward arc to the top header cart beside avatar.
   - Confirm synthesized whoosh + pluck sound plays.
   - Confirm header cart badge increments and header cart icon pulses.
2. Open a Product Detail page (`/product/<id>`).
   - Tap **Add to Cart**.
   - Confirm main gallery photo flies to the top header cart beside avatar with whoosh sound and pulse.

## Acceptance Criteria
- Discover cards have visible Add to Cart controls.
- Discover cards fly thumbnail to `#cart-fly-target-header` (top header cart next to avatar).
- Product Detail page flies gallery image to `#cart-fly-target-header`.
- Web Audio API synthesized sound plays on tap without external audio files.
- `npm run typecheck` passes with 0 errors.
