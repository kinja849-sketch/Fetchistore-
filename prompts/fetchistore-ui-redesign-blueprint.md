# Prompt: Fetchistore Comprehensive UI/UX Redesign & Application Blueprint

## Goal
Redesign and implement the complete UI/UX architecture for **Fetchistore** using the design system defined in the attached design document and the reference implementation from `C:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace`. 

The new UI must adopt:
1. **Design System & Palette**: Primary (`#8A9A5B`), Secondary (`#D4A373`), Tertiary (`#E9EDC9`), Neutral (`#333333`), and Surface (`#FBF9F8`).
2. **Typography**: Google Font `Manrope` for all headlines, body text, and labels.
3. **Mobile & Desktop Responsive Paradigm**: Mobile layout optimized for touch/one-handed use (floating bottom nav, vertical stack, bottom sheets), intelligent desktop layout expansion (multi-column grids, persistent sidebars, enhanced dashboards, larger product cards).
4. **Core Fetchistore Features**: Proximity discovery, condition badges (`new`, `like_new`, `good`, `fair`), seller delivery live map tracking, order chat, multi-payment checkout (Stripe, bank transfer, e-wallet, COD), and seller management.

---

## Skills Read
- `.agents/skills/ui-design` (Clarkson structure + NovaTrend visual language + design tokens)
- `.agents/skills/geolocation` (PostGIS distance & Leaflet map integration)
- `.agents/skills/supabase` (Auth, database tables, and real-time updates)

---

## Code & Assets Inspected
- `app/layout.tsx` & `app/globals.css`
- `C:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace/`
  - `shop_discovery/code.html`
  - `onboarding/code.html`
  - `product_details/code.html`
  - `cart/code.html`
  - `orders_tracking/code.html`
  - `create_listing/code.html`
  - `profile/code.html`

---

## Design System Decisions & Configuration

### 1. Color Palette Tokens (`globals.css` & Tailwind)
- `--color-primary`: `#8A9A5B` (Sage / Olive Green)
- `--color-primary-dark`: `#56642B`
- `--color-primary-light`: `#D9EAA3`
- `--color-secondary`: `#D4A373` (Warm Tan / Ochre)
- `--color-secondary-light`: `#FFDCBD`
- `--color-tertiary`: `#E9EDC9` (Pale Lime / Cream)
- `--color-neutral`: `#333333` (Charcoal)
- `--color-surface`: `#FBF9F8` (Warm Off-white background)
- `--color-surface-card`: `#F6F3F2` / `#FFFFFF`

### 2. Component Design Specifications
- **Search Bar**: Pill-shaped (`rounded-full`), soft shadow, search icon on left with distance radius dropdown on right.
- **Buttons**:
  - `Primary`: Solid `#8A9A5B` background, white text, pill/rounded-2xl shape.
  - `Secondary`: `#E9EDC9` or `#F0EDED` background, dark text.
  - `Inverted`: `#333333` dark charcoal background, white text.
  - `Outlined`: Border with `#8A9A5B` or `#333333`, transparent background.
- **Navbar & Navigation**:
  - **Mobile**: Floating bottom navigation bar with container pill and active icon indicator pill (`bg-[#8A9A5B]`).
  - **Desktop**: Top header with logo, search bar with location radius, category dropdowns, cart drawer, and profile/seller actions + optional collapsible sidebar for discovery.
- **Product Cards**:
  - Rounded corners (`rounded-2xl` / `rounded-3xl`).
  - Image with subtle scale on hover.
  - Title, Price, Distance indicator ("X km away"), and Condition Pill (`new`, `like_new`, `good`, `fair`).
  - Quick action CTA ("Add to cart" / "View details").

---

## Implementation Plan & Files to Modify / Create

### 1. Foundation & Global Configuration
- **[MODIFY]** `app/globals.css`: Integrate Manrope font, color CSS variables (`#8A9A5B`, `#D4A373`, `#E9EDC9`, `#333333`, `#FBF9F8`), and custom utility classes.
- **[MODIFY]** `app/layout.tsx`: Load `Manrope` font from `next/font/google`, set metadata, wrap root providers, update global page background (`bg-[#FBF9F8]`).

### 2. Core Shared UI Components
- **[MODIFY]** `components/shared/navbar.tsx`: Implement top header with desktop expanded navigation, proximity filter, and branding.
- **[MODIFY]** `components/shared/bottom-nav.tsx`: Implement mobile floating bottom nav matching design system reference.
- **[NEW/MODIFY]** `components/ui/product-card.tsx`: Product card with image, condition pill, price, title, seller distance, and add-to-cart action.
- **[NEW]** `components/ui/condition-badge.tsx`: Custom styled badge for item conditions (`new`, `like_new`, `good`, `fair`).
- **[NEW]** `components/ui/trust-bar.tsx`: 4-feature trust bar (Seller Delivery, Secure Payments, Proximity Discovery, Support).

### 3. Application Surfaces
- **[MODIFY]** `app/page.tsx`: Re-architect home & discovery screen featuring Hero, Proximity Radius Filter, "Near You" horizontal/grid carousel, Categories, Top Sellers, and Trust Bar.
- **[MODIFY]** `app/shop/page.tsx`: Category & filterable shop page with mobile drawer filters and desktop multi-column sidebar filter layout.
- **[MODIFY]** `app/product/[id]/page.tsx`: Product detail page with image showcase, distance indicator, seller profile card, condition badge, direct seller chat link, and sticky checkout bar.
- **[MODIFY]** `app/cart/page.tsx` & `app/checkout/page.tsx`: Multi-payment checkout screen supporting Stripe, bank transfer, e-wallet, and COD.
- **[MODIFY]** `app/(dashboard)/orders/[id]/page.tsx`: Order details with live status timeline (`pending` -> `paid` -> `accepted` -> `out_for_delivery` -> `nearby` -> `delivered` -> `completed`), Leaflet delivery map, and order-scoped chat.
- **[MODIFY]** `app/seller/listings/page.tsx` & `app/seller/create/page.tsx`: Seller tools for managing and posting new/used items with location & photos.

---

## Security Requirements
- Ensure RLS policies and server boundary checks are maintained across all data access points.
- No sensitive keys (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`) exposed in client components.

---

## Acceptance Criteria
- Full design system implemented using Manrope typography and exact color palette (`#8A9A5B`, `#D4A373`, `#E9EDC9`, `#333333`).
- Clean mobile presentation with floating bottom navigation and vertical card stack.
- Intelligent desktop expansion using multi-column grid, top bar, and multi-pane view.
- Proximity indicators and condition badges present on all product cards.
- Application compiles cleanly with no TypeScript or ESLint errors.

---

## Verification & Checks
1. Run `npm run typecheck` to verify TypeScript types.
2. Run `npm run lint` to verify code quality.
3. Test layout responsively on mobile (<640px) and desktop (>1024px).
