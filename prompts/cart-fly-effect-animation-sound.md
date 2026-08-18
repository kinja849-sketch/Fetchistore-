# Prompt: Cart Fly Effect Animation, Pulse & Web Audio Sound Implementation

## Goal
Implement a smooth, interactive 2D thumbnail "fly-to-cart" animation with Web Audio API sound synthesis and landing pulse feedback when a buyer adds an item to cart in Fetchistore:
1. **Coordinate Translation & Path Calculation**: Measure bounds of product image (`sourceEl`) and target cart icon (`#cart-fly-target` for mobile or `#cart-fly-target-desktop` for desktop) using `getBoundingClientRect()`. Calculate a curved arc using a quadratic Bezier trajectory ($P_0$ start, $P_1$ control point raised upward, $P_2$ end landing).
2. **Animation Loop & Scaling**: Use `requestAnimationFrame` to animate a fixed-positioned thumbnail clone along the Bezier arc while shrinking scale (from 1.0 to ~0.15) and fading opacity near arrival. Clean up DOM elements upon completion.
3. **Web Audio API Real-time Sound Synthesis**: Synthesize a realistic 2-stage audio effect (a low-pass filtered whoosh on launch followed by a soft sine/triangle pluck on landing) using browser `AudioContext` without external sound asset files.
4. **Target Anchors & Pulse CSS**: Ensure persistent anchors (`#cart-fly-target-desktop` on Navbar cart icon and `#cart-fly-target` on BottomNav cart icon or fallback layout anchor) exist. Trigger a subtle CSS pulse animation on arrival (`.cart-fly-pulse`).
5. **Product Detail & Storefront Wiring**: Wire the `flyImageToCart` helper into `app/product/[id]/page.tsx` on Add to Cart (using the main gallery image as source) and provide option for product cards on Discover/Shop.
6. **Accessibility**: Respect `prefers-reduced-motion` (skip trajectory flight, immediately trigger pulse & sound if allowed).

## Skills Read & References
- `.agents/skills/ui-design` — Clarkson structural reference + NovaTrend visual language (material symbols, rounded radii, soft minimalism).
- `AGENTS.md` — Section 7 & Section 15 (UI design rules, tech stack constraints, standard workflow).

## Proposed Changes

### 1. `lib/cart-fly-animation.ts` [NEW]
- Create `flyImageToCart(sourceEl: HTMLElement | null, options?: { isMobile?: boolean }): void`.
- Function logic:
  - Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. If true, trigger target pulse and synthesized audio, then return early without DOM clone trajectory.
  - Locate target element: check desktop anchor `#cart-fly-target-desktop` when `window.innerWidth >= 768`, else mobile anchor `#cart-fly-target`. Fallback to `.cart-target` class or viewport offset if missing.
  - Calculate `startX`, `startY`, `endX`, `endY` centers.
  - Determine control point `controlX = (startX + endX) / 2`, `controlY = Math.min(startY, endY) - 100` (arced upwards).
  - Clone `sourceEl` (or inner `img`), set fixed positioning (`top: 0, left: 0`, `z-index: 9999`, pointer-events: none, smooth border-radius, shadow).
  - Synthesize launch whoosh audio via `AudioContext` (white noise / oscillator with low-pass frequency ramp down/up).
  - Animate using `requestAnimationFrame` over ~600–750ms duration:
    - Quadratic Bezier equation: $B(t) = (1-t)^2 P_0 + 2(1-t)t P_1 + t^2 P_2$.
    - Scale: $1.0 - t \times 0.85$.
    - Opacity: $1.0$ until $t > 0.8$, then fade to $0$.
  - Upon arrival ($t \ge 1$):
    - Remove clone from DOM.
    - Play soft pluck audio (sine wave ~520Hz decaying to ~260Hz with exponential gain decay).
    - Add `.cart-fly-pulse` class to target element for 400ms.

### 2. `app/globals.css`
- Add `@keyframes cart-pulse` and `.cart-fly-pulse`:
  - Keyframes scaling from `1.0` -> `1.25` -> `0.95` -> `1.0` with subtle green/brand glow (`box-shadow: 0 0 12px rgba(86,100,43,0.5)`).

### 3. `components/shared/navbar.tsx` & `components/shared/bottom-nav.tsx` & `app/layout.tsx`
- In `components/shared/navbar.tsx`: Add `id="cart-fly-target-desktop"` to the cart Link component.
- In `components/shared/bottom-nav.tsx`: Add `id="cart-fly-target"` to the cart Link icon container.
- In `app/layout.tsx`: Add hidden persistent fallback anchors `<div id="cart-fly-target-desktop" className="hidden md:block fixed top-3 right-16 w-8 h-8 pointer-events-none z-0" />` and `<div id="cart-fly-target" className="block md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 pointer-events-none z-0" />` if the nav elements are absent/unmounted on subpages.

### 4. `app/product/[id]/page.tsx`
- Add `useRef<HTMLImageElement>(null)` for the main product image.
- Attach `ref={mainImageRef}` to the active main image `<img>` or wrapper.
- In `handleAddToCart()`:
  - Add item to cart context immediately.
  - Call `flyImageToCart(mainImageRef.current)`.

## Verification Plan

### Automated Checks
- Run `cmd /c npm run typecheck` to verify zero TypeScript errors.
- Run `cmd /c npm run lint` to verify zero ESLint rules violations.

### Manual Verification
1. Open a product detail page (`/product/<id>`).
2. Tap **Add to Cart**.
3. Confirm product image thumbnail smoothly arcs up and into the cart target icon while shrinking.
4. Confirm Web Audio API plays a brief synthesized whoosh and soft pluck sound.
5. Confirm cart icon pulses upon thumbnail landing.
6. Verify fallback targets work seamlessly on mobile and desktop viewports.

## Acceptance Criteria
- Thumbnail flies along quadratic Bezier curve into cart target with scaling and opacity transition.
- Synthesized Web Audio API sound plays cleanly without any asset loading errors or external file dependencies.
- Persistent anchors ensure precision landing across mobile and desktop.
- `prefers-reduced-motion` is respected.
- `npm run typecheck` and `npm run lint` execute with 0 errors.
