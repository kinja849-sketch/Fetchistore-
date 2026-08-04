# Implementation Prompt: Device-Aware, Profile-Centered & Delivery-Aware Marketplace Flow

## Goal
Refine and enforce Fetchistore's full marketplace flow across all 12 core screens with:
1. **Device-Aware Responsiveness**: Adaptive spacing, layout density, bottom vs sidebar/top navigation, and touch/click targets across Phone, Tablet, and Desktop breakpoints.
2. **Mandatory & Consistent Profile Context**: Profile details (avatar, name, role badge, location chip, seller/buyer status) visible in top headers, bottom nav, and profile sections.
3. **Pervasive Delivery Awareness**: Truck/delivery icon (`Material Symbols local_shipping` / `Truck`) present on product cards, trust bars, cart/checkout options, active seller/buyer orders, and delivery tracking/chat.
4. **Exact Bottom Navigation Pattern**: Mobile bottom nav featuring **Cart**, **Watchlist**, **Orders**, and **Profile** (plus Home/Shop tabs as required) styled with the exact Manrope font and earthy color pills (`#56642b` primary, `#8a9a5b` sage container, `#f0eded` surface container).
5. **Structured Profile Bento Layout**: Profile screen containing **Selling** (Active Listings & Sold Items), **Buying** (Orders & Saved), **Payments & Balance**, and **Settings & Privacy** with seamless routing to payment and seller tools.
6. **Coherent Flow Across All 12 Core Screens**:
   - Onboarding
   - Shop Discovery (Home/Shop)
   - Product Details
   - Wishlist / Watchlist
   - Cart
   - Delivery Chat & Tracking
   - Create Listing
   - Active Listings
   - Sold Items
   - Payments & Balance
   - Settings & Privacy
   - Profile

## Skills Read
- `.agents/skills/ui-design` (Clarkson structure + NovaTrend visual language + color tokens + typography)
- `AGENTS.md` (Product rules, status machine, role capabilities, design system)

## Key Files to Touch/Update
- `components/shared/bottom-nav.tsx` - Standardize bottom nav to include Cart, Watchlist, Orders, Profile with device responsiveness.
- `components/shared/navbar.tsx` - Ensure profile context chip, delivery status indicator, and desktop nav responsiveness.
- `app/globals.css` & `tailwind.config.ts` - Ensure earthy color tokens (`#56642b`, `#8a9a5b`, `#7d562d`, `#f0eded`, `#fbf9f8`) and Manrope font setup are locked.
- `app/profile/page.tsx` - Structure with 4 bento cards: Selling (Active Listings, Sold Items), Buying, Payments & Balance, Settings & Privacy.
- `app/profile/payments/page.tsx` or `app/payments/page.tsx` - Payments & Balance dashboard screen.
- `app/profile/settings/page.tsx` or `app/settings/page.tsx` - Settings & Privacy screen.
- `app/seller/listings/page.tsx` & `app/seller/sold/page.tsx` - Active Listings and Sold Items management screens.
- `app/wishlist/page.tsx` - Watchlist/Wishlist screen with quick actions and delivery distance.
- `app/cart/page.tsx` & `app/checkout/page.tsx` - Cart and checkout flow with delivery icons and profile address context.
- `app/orders/[id]/chat/page.tsx` or `app/chat/page.tsx` - Delivery Chat & Live Tracking screen with delivery icon & status steps.
- `app/product/[id]/page.tsx` - Product details page with delivery distance chip, seller-to-door delivery badge, sticky add to cart.
- `app/onboarding/page.tsx` - Onboarding bento collage flow.

## Implementation Requirements
- **Design System Enforcement**: Use Manrope font, Material Symbols / Lucide icons, exact earthy tokens, `1rem`/`2rem`/`9999px` radii.
- **Device Adaptability**: Mobile-first with tablet/desktop grid scaling (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`), adaptive container margins (`px-4 sm:px-6 lg:px-8`), and hidden mobile bottom nav on desktop in favor of top/sidebar nav.
- **Delivery Visibility**: Everywhere order tracking or seller delivery is relevant, display the delivery icon with clear status labels.

## Verification & Acceptance Criteria
1. Responsive layout works smoothly on mobile, tablet, and desktop viewports.
2. Bottom nav displays Cart, Watchlist, Orders, and Profile with exact active pill styling.
3. Profile context is displayed consistently across header, bottom nav, and profile bento views.
4. Delivery icon appears across product detail, cart, checkout, active orders, and chat.
5. All 12 screens are accessible and form a complete coherent flow.
6. TypeScript check (`npm run typecheck`) passes without errors.
