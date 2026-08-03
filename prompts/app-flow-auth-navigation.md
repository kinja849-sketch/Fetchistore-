# Implementation Prompt: Authenticated App Flow & Mobile Navigation Experience

## Goal
Transform Fetchistore's user flow to distinguish between the public welcome/landing experience and the logged-in app experience, matching the user's reference image:
1. **Unauthenticated state**: Visitors see the welcome landing screen. Selecting "Shop Now" or any product triggers authentication.
2. **Authenticated state**: Upon sign up / sign in, the marketing links ("Shop", "About", "Contact") are hidden. The view transforms into a modern mobile-first application layout with top search bar, categories strip, trending & new arrivals layers, bottom navigation bar (Home, Orders/Cart, Favorites, Profile), and detailed product pages.
3. **Supabase Auth**: Use Supabase Auth as required by project standards (replacing any Clerk references).

---

## Skills Read
- `.agents/skills/ui-design`: Clarkson structure + NovaTrend visual language reference.

---

## Files Inspected
- `app/page.tsx`: Current home page layout.
- `components/shared/navbar.tsx`: Header navigation bar.
- `components/shared/footer.tsx`: Footer component.
- `package.json`: Project dependencies (`@supabase/ssr`, `@supabase/supabase-js`).

---

## Key Decisions & Architecture

1. **Authentication State Management**:
   - Create a `useAuth` / Supabase auth context provider (`lib/supabase/auth-context.tsx`) to track user session state on client side cleanly.
   - Replace `@clerk/nextjs` imports in `navbar.tsx` with Supabase Auth state.

2. **Navbar Conditional Views**:
   - **Unauthenticated**: Displays logo, desktop links ("Shop", "About", "Contact"), and "Sign In" / "Sign Up" buttons.
   - **Authenticated**: Hides "Shop", "About", "Contact" links. Displays a sleek App Top Bar with a full search input ("what are you looking for?"), Filter icon button, and Cart icon with badge.

3. **Homepage Feed (Authenticated App Layout)**:
   - **Promo Carousel / Banner**: Green accent promo card ("Limited Offer: First Purchase Enjoy a Special Offer" with "Shop Now" arrow button).
   - **Categories Bar**: Horizontal scrolling or pill grid with category images/icons (Men's outfit, Women's outfit, Men's footwear, etc.) with "See all" CTA.
   - **New Arrivals & Trending Layers**: 2-column card layout displaying product images, title, price, condition badge, and wishlist heart icon.

4. **Bottom App Navigation Bar**:
   - Sticky bottom navigation bar for authenticated view containing 4 main tabs:
     - **Home** (`/`)
     - **Orders / Cart** (`/cart`)
     - **Favorites** (`/wishlist`)
     - **Profile** (`/profile`)

5. **Product Detail View (`app/product/[id]/page.tsx`)**:
   - Clean app detail header: Back button, "Details" title, Cart icon.
   - Product image slider/carousel with pagination dots.
   - Seller badge & follow button ("Velora Store ✓ Following").
   - Size selector (S, M, L, XL) and Quantity modifier (`- 1 +`).
   - Sticky bottom bar showing total price and prominent "Add to Cart" pill button.

6. **Auth Trigger Flow**:
   - Clicking "Shop Now" or attempting to view/buy items while unauthenticated opens an Auth Dialog/Modal (or redirects to `/auth`) with Email/Password Sign In and Sign Up tabs.

---

## Files to Create / Modify

- `lib/supabase/auth-context.tsx` [NEW]: Supabase React Auth Provider.
- `components/auth/auth-modal.tsx` [NEW]: Supabase Sign In / Sign Up Modal component.
- `components/shared/navbar.tsx` [MODIFY]: Dynamic header based on auth status; replace Clerk with Supabase.
- `components/shared/bottom-nav.tsx` [NEW]: App-style bottom navigation bar for authenticated users.
- `components/home/authenticated-feed.tsx` [NEW]: Authenticated app feed matching reference design (search bar, promo banner, category list, trending/new arrivals grid).
- `components/home/unauthenticated-welcome.tsx` [NEW]: Welcome screen with "Shop Now" trigger to auth.
- `app/page.tsx` [MODIFY]: Render `UnauthenticatedWelcome` or `AuthenticatedFeed` based on auth state.
- `app/product/[id]/page.tsx` [NEW]: Product detail view matching right screen of reference image.
- `package.json` [MODIFY]: Remove unused `@clerk/nextjs` dependency if necessary or keep codebase clean.

---

## Security & Compliance
- Auth managed via Supabase Auth client (`@supabase/ssr` / `@supabase/supabase-js`).
- Public pages read-only; protected actions require valid session.
- No secret keys exposed in client code.

---

## Acceptance Criteria
- [ ] Unauthenticated home page displays welcome screen.
- [ ] Clicking "Shop Now" opens the Auth modal for Sign In / Sign Up.
- [ ] Upon authentication, "Shop", "About", and "Contact" links disappear from header.
- [ ] Authenticated view displays app layout with top search bar, promo card, category pills, and trending/new arrivals grid.
- [ ] Bottom navigation bar visible for quick tab switching (Home, Cart, Favorites, Profile).
- [ ] Product detail page matches reference layout (seller badge, size selector, quantity counter, sticky bottom price & add to cart bar).
- [ ] `npm run typecheck` and `npm run build` pass without errors.

---

## Verification & Test Steps
1. Run `npm run dev`.
2. Visit `http://localhost:3000` while signed out -> verify welcome screen with Shop, About, Contact links.
3. Click "Shop Now" -> verify Auth modal pops up.
4. Sign up / Sign in -> verify navbar updates, Shop/About/Contact links are hidden, top search bar & promo banner appear.
5. Check bottom navigation dock on mobile/desktop.
6. Click on a product -> verify product detail page layout (seller badge, size selection, sticky price bar).
7. Run `npm run typecheck` to confirm zero TypeScript errors.
