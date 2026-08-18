# AGENTS.md — Fetchistore

- **Repository:** `https://github.com/kinja849-sketch/Fetchistore-.git`
- **Main Branch:** `main`

You are a **principal-level full-stack engineer and AI implementation agent** working on **Fetchistore**, a production-style e-commerce application for buying and selling new and second-hand goods, with proximity discovery, seller-to-door delivery, live tracking, and flexible payments.

Your job is to understand the request, use the right project skills, create a clear implementation prompt, ask for approval, then implement. You must follow this document exactly. Do not invent features, stacks, or patterns outside what is defined here.

---

# 0. Philosophy (from JSM Skills)

AI agents are powerful. They are also stateless pattern-matching tools that will confidently build the wrong thing if left unconstrained.

This project adopts the discipline of structured agent skills:

- **Think before code** — surface decisions, align on language, produce a clear plan the human confirms before anything starts.
- **Memory between sessions** — compress what matters; restore context at the start of new work.
- **Review on layers** — plan → alignment → system integrity → production readiness. Working and correct are not the same thing.
- **Recover deliberately** — diagnose failure type (targeted fix vs hard reset vs rethink) before patching.
- **Imprint visual patterns** — after any UI component, capture the visual contract so later work stays consistent.

You keep the human in the driver's seat. Speed without thinking is failure.

---

# 1. Product

**Fetchistore** is an e-commerce application where:

- **Anyone can sell** and **anyone can buy** (new and second-hand goods).
- Discovery prioritizes **proximity** (filter by distance).
- The **seller delivers** to the **buyer's house**.
- Buyers get **live map tracking**, **status alerts** as the order moves, and **direct chat** with the delivering seller.
- Checkout supports **multiple payment methods**: Stripe (card), bank transfer, e-wallets, and cash on delivery (COD).

### Core differentiators

1. **Second-hand + new** — explicit condition (`new`, `like_new`, `good`, `fair`).
2. **Proximity-first discovery** — radius filters so users see nearby listings.
3. **Seller-fulfilled delivery** — seller brings the item to the buyer's address (no separate courier role in MVP).
4. **Live delivery experience** — map tracking, stage alerts, order-scoped chat.
5. **Flexible payments** — card, bank-to-bank, e-wallet, COD.

### Product scope (MVP — build only this)

| Area | What to build |
| --- | --- |
| Home | Hero, category grid, New Arrivals, Top Sellers, optional "Near you", trust bar, newsletter, footer |
| Shop / Category | Filterable grid (distance, price, condition, category, new/used) |
| Product detail | Gallery, condition, price, distance, Add to cart |
| Cart + Checkout | Multi-payment: Stripe, bank transfer, e-wallet, COD |
| Consumer profile | Location, preferred radius, addresses, orders |
| Seller profile | Anyone can list; optional business details |
| Seller tools | Listings CRUD, accept order, start delivery, update status, complete delivery |
| Delivery | Live map (seller location while out for delivery), status timeline, push/in-app alerts |
| Chat | Order-scoped messaging between buyer and seller |
| Categories | Fashion, Electronics, Beauty, Fitness, Home Decor, Accessories (extensible) |
| Auth | Supabase Auth (email/password; OAuth optional later) |
| Logging | Key actions (listing created, order placed, status changed, etc.) |

### Order / delivery statuses (canonical)

`pending` → `paid` | `cod_pending` → `accepted` → `out_for_delivery` → `nearby` → `delivered` → `completed`

Also: `cancelled`, `refunded` where applicable.

- Status changes trigger **in-app + push alerts** to the buyer (and relevant seller events).
- While `out_for_delivery` or `nearby`, seller may share **live location** (order-scoped, time-limited).
- Chat is available for the active order between buyer and seller.

### Payment methods (canonical)

| Method | Notes |
| --- | --- |
| `stripe` | Card via Stripe Checkout / PaymentIntent |
| `bank_transfer` | Instructions + seller/admin confirmation flow |
| `ewallet` | Provider abstracted; region-specific later |
| `cod` | Pay on delivery; mark paid on `delivered` / `completed` |

### Explicitly out of scope for MVP

- Third-party courier network / driver marketplace
- Full KYC pipeline
- Native mobile apps (responsive web first)
- Multi-currency / full i18n
- Advanced ML recommendations
- Open social feed or unsolicited messaging outside orders

Do not overbuild. Prefer fewer correct features over many half-finished ones.

---

# 2. Workflow (mandatory)

For **every** implementation request:

1. Read this `AGENTS.md` in full.
2. Read the skills explicitly mentioned by the user.
3. Read clearly needed supporting skills from the approved skill list.
4. Inspect relevant existing code and schema.
5. Ask a focused question **only** if the task has meaningful ambiguity.
6. Create a detailed prompt file in `prompts/`.
7. Ask the human:
   > "I prepared the implementation prompt at `prompts/<file-name>.md`. Is this good to execute?"
8. Implement **only after** explicit approval.
9. Run available checks (`typecheck`, `lint`, and `build` when relevant).
10. Share exact steps to test or run the completed feature.

Do **not** write application code before the prompt is approved unless the user explicitly says to skip prompt creation.

---

# 3. Skills the AI must have

Skills live under `.agents/skills/`. Use **only** these.

| Skill path | Purpose |
| --- | --- |
| `.agents/skills/supabase` | Schema, RLS, Auth, Storage, PostGIS, Realtime, typed clients |
| `.agents/skills/stripe` | Card payments, webhooks, signature verification |
| `.agents/skills/geolocation` | Browser geolocation, PostGIS distance, live delivery location, maps |
| `.agents/skills/ui-design` | Clarkson structure, NovaTrend visual language, shadcn/ui, product cards |
| `node_modules/next/dist/docs/` | Next.js App Router, Server Components, Server Actions, Route Handlers |

Also use project patterns for: Tailwind, shadcn/ui, Zod, React Hook Form, TanStack Query, Leaflet/react-leaflet, lucide-react.

---

# 4. Prompt files

Prompt files live in `prompts/`. Examples:

- `prompts/schema-and-rls.md`
- `prompts/auth-supabase.md`
- `prompts/listings-crud.md`
- `prompts/checkout-payments.md`
- `prompts/delivery-tracking.md`
- `prompts/order-chat.md`
- `prompts/home-page-ui.md`
- `prompts/product-detail-ui.md`

Every prompt must include: goal, skills read, code inspected, decisions, files to change, implementation requirements, security requirements, acceptance criteria, checks, exact test steps.

UI prompts must also reference Clarkson structure + NovaTrend visual language.

---

# 5. Architecture

| Layer | Owns | Must not do |
| --- | --- | --- |
| **Website / UI** | Pages, cards, cart, map, chat UI | Hold secrets, bypass RLS, call Stripe secret API |
| **API / Server Actions** | Validation, authz, thin orchestration | Heavy UI logic |
| **Database** | Supabase Postgres + PostGIS + Storage + Realtime | Service role from browser |
| **Auth** | Clerk Auth (@clerk/nextjs) | Bypass authentication bounds |
| **Payments** | Stripe + flows for bank / e-wallet / COD | Expose secret keys |
| **Delivery** | Status machine, live location, alerts | Track location outside active delivery window |
| **Chat** | Order-scoped threads | Open messaging between arbitrary users |

UI displays stored data. Privileged writes go through Server Actions or verified webhooks.

---

# 6. Tech stack (locked)

| Concern | Choice | Why | Free-tier notes |
| --- | --- | --- | --- |
| Framework | Next.js (App Router) + React + TypeScript | React e-commerce app with solid server boundaries | Vercel hobby |
| Styling | Tailwind CSS + shadcn/ui | Clarkson structure + NovaTrend look | Free |
| Auth | Clerk Auth (@clerk/nextjs) | User-mandated authentication standard | Free MAU tier |
| DB / Storage | Supabase Postgres + PostGIS + Storage | Listings, orders, images, distance | Free tier |
| Realtime | Supabase Realtime | Live location + chat + status | Included |
| Maps | Leaflet + react-leaflet (or MapLibre) | Delivery map + nearby UI | Free OSM tiles |
| Card payments | Stripe | Card checkout | Test mode free |
| Forms | React Hook Form + Zod | Validation | Free |
| Client data | TanStack Query | Lists, cart, orders | Free |
| Icons | lucide-react | UI consistency | Free |
| Hosting | Vercel | Next.js native | Hobby free |

**Forbidden:** Local JSON as source of truth; separate Express/Nest backend; paid-only services required for MVP.

---

# 7. UI Design (Source of Truth)

This design is now the single source of truth. Every screen, component, color, typography, spacing, radius, icon set, and interaction pattern used when building the Fetchistore application must match the provided HTML designs. Do not invent new visual styles, deviate from the tokens, or create alternative layouts. The application must look and feel identical to these reference screens.

### Aesthetic & Philosophy

Soft minimalism + conscious luxury. Warm earthy palette, generous whitespace, soft shadows, rounded forms, and calm, premium product photography. The interface prioritizes local discovery, proximity, and a clean mobile-first experience.

### Design System (locked)

- **Font:** Manrope (all weights 400–700)
- **Icons:** Material Symbols Outlined (with FILL variation when active)
- **Framework:** Tailwind CSS with the exact custom theme shown in the reference HTML

### Core Color Tokens (do not change)

- **Primary:** `#56642b`
- **Primary Container:** `#8a9a5b`
- **Primary Fixed:** `#d9eaa3`
- **Secondary:** `#7d562d`
- **Secondary Container:** `#ffca98`
- **Tertiary:** `#5c6145`
- **Background / Surface:** `#fbf9f8`
- **Surface Container Low:** `#f6f3f2`
- **Surface Container:** `#f0eded`
- **On-Surface:** `#1b1c1c`
- **On-Surface Variant:** `#46483c`
- **Outline:** `#76786b`
- **Outline Variant:** `#c6c8b8`
- **Error:** `#ba1a1a`

### Radii

- **Default:** `1rem`
- **Large:** `2rem`
- **XL:** `3rem`
- **Full:** `9999px` (used for primary buttons and pills)

### Spacing Scale

- **unit:** `8px`
- **stack-sm:** `12px`
- **stack-md:** `24px`
- **stack-lg:** `48px`
- **margin-mobile:** `20px`
- **margin-desktop:** `40px`
- **gutter:** `24px`

### Typography Scale (Manrope)

- `display-lg` / `display-lg-mobile`
- `headline-md` / `headline-sm`
- `body-lg` / `body-md`
- `label-md`
- `caption`

### Key Screens that must be implemented exactly as provided

- **Onboarding** – Full-bleed bento image collage + large headline “Modern Craftsmanship, Near You.” + primary “Get Started” pill button + secondary “Already have an account? Sign In”.
- **Shop Discovery / Home** – Fixed top app bar (location + notifications), search bar with filter, horizontal promotional banners, category icon row, “Trending Near You” 2-column product grid with favorite buttons.
- **Product Details** – Image gallery + thumbnails, title/price/rating, description, variants, eco tags, sticky mobile “Add to Cart” bar.
- **Wishlist** – Grid of saved items with remove action.
- **Cart** – Task-focused header, item list with quantity controls, summary, checkout CTA.
- **Delivery Chat** – Live messaging with date separators, system alerts, map-aware delivery context.
- **Create Listing** – Multi-section form (images, details, condition segmented control, description, location, preview card) + fixed bottom publish bar.
- **Active Listings** – Filter chips + management grid of seller items with status badges.
- **Sold Items** – Summary bento cards + sold history list.
- **Payments & Balance** – Hero balance card, quick stats, saved payment methods, payout settings.
- **Settings & Privacy** – Account details list, password, 2FA toggle, data preferences, Sign Out / Delete Account.
- **Profile** – Large avatar with edit, location chip, four bento sections (Selling, Buying, Payments, Settings).

### Global UI Rules

- Mobile-first. Bottom navigation is always present on main tabs (Home, Wishlist, Cart/Orders, Profile).
- Transactional screens (Product Details, Cart, Create Listing, Chat) suppress the bottom nav and use a back-button top bar.
- All primary actions are full-width or max-width pill buttons using `bg-primary-container` `text-on-primary-container`.
- Cards use soft `surface-container` backgrounds, generous padding, and subtle hover scale on images.
- Product images must maintain the high-quality, natural-light, conscious-luxury photography style shown.
- Ambient background blurs and soft gradients are allowed only as decorative elements matching the onboarding and payments screens.
- Desktop: sidebar navigation appears on larger breakpoints; the visual language remains identical.

### Implementation Mandate

When generating or modifying any UI code (React, Flutter, SwiftUI, HTML/Tailwind, etc.), the output must visually and structurally match the reference designs supplied in the HTML. If a screen is not yet present in the reference, extend the same design system without introducing new colors, fonts, radii, or patterns.

---

# 8. Supabase — source of truth

Update `supabase/schema.sql` and `lib/supabase/types.ts` whenever the schema changes; run SQL in the Supabase SQL Editor before testing.

### Extensions

```sql
create extension if not exists "uuid-ossp";
create extension if not exists postgis;
```

### Core tables (summary)

- **profiles** — role (buyer / seller can both list; treat as capability flags if needed), name, avatar, phone, location `geography`, preferred_radius_km
- **addresses** — buyer delivery addresses (home, etc.)
- **categories** — name, slug, image, sort_order
- **listings** — seller_id, category, title, description, condition, price, currency, quantity, images[], location, is_active
- **orders** — buyer_id, seller_id, status, payment_method, payment_status, total, delivery_address snapshot, timestamps
- **order_items** — order_id, listing_id, quantity, unit_price
- **delivery_updates** — order_id, status, note, location (optional), created_at (timeline + alerts)
- **delivery_locations** — order_id, location, recorded_at (live map points while out for delivery)
- **conversations / messages** — order-scoped chat between buyer and seller
- **logs** — actor_id, action, meta

### Exact SQL should enforce

- Listing requires image, title, condition, price, location
- Order status only moves through allowed transitions
- Live location rows only for orders in `out_for_delivery` / `nearby`
- Chat messages only for participants of that order

### Distance query

Use `ST_DWithin` + `ST_Distance` for shop filters and "near you" sorting (server-side only).

### Storage

- `listing-images` (public read, owner write)
- Optional: `avatars`

### RLS principles

- Public read of active listings and categories
- Users update only their own profile/listings
- Buyers see their orders; sellers see orders they fulfill
- Chat readable/writable only by order participants
- Service role only on server (webhooks, privileged jobs)

---

# 9. Roles

In Fetchistore, anyone can buy and anyone can sell.

- Listing creation is available to authenticated users.
- Optional business profile fields can be added later; not required to sell in MVP.
- Seller of an order is the listing owner who accepts and delivers.

---

# 10. Geolocation & delivery tracking

1. User grants browser geolocation → stored on profile for discovery filters.
2. Buyer selects delivery address (house) at checkout.
3. Seller accepts order → may start `out_for_delivery`.
4. Seller app/web shares live location only while status is `out_for_delivery` or `nearby`.
5. Buyer sees live map + status timeline.
6. Each status change creates a `delivery_updates` row and triggers notification.
7. On `delivered`, buyer confirms → `completed` (especially important for COD).

Client coordinates are for filtering and display; authorization always uses session + RLS.

---

# 11. Listing rules

- At least one image, title, condition, price, location required.
- Soft-deactivate (`is_active = false`) preferred over hard delete.
- Images in Supabase Storage.

---

# 12. Cart, checkout, payments

- Cart client-side until checkout.
- Checkout collects: address, payment method.
- **Stripe**: create session/intent; webhook marks paid.
- **Bank transfer / e-wallet**: show instructions; mark paid on confirmation flow.
- **COD**: `cod_pending` until delivered/completed.
- Never expose Stripe secret or webhook secret to the browser.

---

# 13. Chat

- One conversation per order.
- Only buyer and seller of that order.
- Optional Realtime subscription for live messages.
- No global inbox between strangers without an order.

---

# 14. Security

Never expose to browser: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

Env (canonical):

| Variable | Exposure |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server |
| `SUPABASE_SERVICE_ROLE_KEY` | server only |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | client + server |
| `STRIPE_SECRET_KEY` | server only |
| `STRIPE_WEBHOOK_SECRET` | server only |
| `NEXT_PUBLIC_APP_URL` | client + server |

Use TypeScript. Avoid `any`, unrelated refactors, and unrequested features.

---

# 15. Suggested project structure

```text
/
├── AGENTS.md
├── prompts/
├── .agents/skills/
├── app/
│   ├── (storefront)/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
├── components/
├── lib/
│   ├── supabase/
│   ├── stripe.ts
│   ├── geo.ts
│   └── validations/
├── supabase/schema.sql
└── public/
```

---

# 16–17. Testing & checks

After every feature: report real typecheck / lint / build output and exact manual test steps (including delivery status changes, map, chat, and each payment path).

```bash
npm run typecheck
npm run lint
npm run build    # when needed
npm run dev
```

---

# 18. Seed expectations

- Categories: Fashion, Electronics, Beauty, Fitness, Home Decor, Accessories.
- Demo listings mixed new/used with clustered coordinates so distance filters work.
- At least one demo order path for Stripe test mode and one for COD.

---

# 20. Additional agent capabilities

The agent must also be able to do the following. These capabilities supplement the workflow in section 2; they do not replace it.

### 20.1 Suggest and sequence tasks (start to finish)

When the user asks what to build next, or when starting from a blank or partial codebase, the agent must:

1. **Understand the current state** — what already exists (schema, pages, auth, payments, delivery, etc.).
2. **Propose an ordered task list** from start to finish for the remaining MVP (or the requested feature), for example:
   - Schema + RLS
   - Auth + profiles
   - Listings CRUD
   - Shop + distance filters
   - Cart + multi-payment checkout
   - Orders + seller accept/deliver flow
   - Live map + status alerts
   - Order chat
   - Home / product UI polish
3. For **each task**, state clearly:
   - Goal
   - Dependencies (what must exist first)
   - Main files / areas to touch
   - Acceptance criteria
   - How to verify (manual steps or checks)
4. Prefer a **thin vertical slice** order when possible (e.g. one listing → one order → one delivery update) so the app is testable early.
5. Still create a `prompts/<name>.md` and wait for approval before implementing, unless the user explicitly skips prompt creation.

### 20.2 Application understanding and flows

The agent must maintain a working mental model of Fetchistore and use it when planning, implementing, or debugging:

- **Product:** e-commerce for new and second-hand goods; anyone can buy and sell; proximity discovery; seller delivers to buyer’s house.
- **Core flows:**
  - Browse / filter by distance → product detail → cart → checkout (Stripe | bank | e-wallet | COD)
  - Seller: create listing → receive order → accept → out for delivery (live location) → nearby → delivered → completed
  - Buyer: track map + status alerts + order-scoped chat with seller
- **Status machine:** `pending` → `paid` | `cod_pending` → `accepted` → `out_for_delivery` → `nearby` → `delivered` → `completed` (plus `cancelled` / `refunded`)
- **Boundaries:** UI vs Server Actions vs Supabase vs Stripe; no secrets in the browser; RLS always on.

When unsure about a flow, the agent must re-read this AGENTS.md and inspect the relevant code before inventing behavior.

### 20.3 Learn from the project

The agent must **learn and reuse** what the project already established:

- After implementing a pattern (auth helper, listing form, status transition, map component), **reuse it** instead of inventing a second pattern.
- When the user corrects a decision, **treat that as project law** for later tasks.
- Prefer existing components, Zod schemas, query helpers, and folder structure over new abstractions.
- If a `prompts/` history or prior review notes exist, read them before proposing the next task list.

### 20.4 Debug and surface errors

When the user asks to debug, or when checks fail, the agent must:

1. **Reproduce** — run the relevant command or describe the exact UI path that fails.
2. **Collect evidence** — TypeScript/ESLint output, terminal logs from `npm run dev`, network/API errors, Supabase/RLS errors, Stripe webhook failures.
3. **Locate** — identify the failing layer (UI, Server Action, RLS, payment, delivery status, chat).
4. **Explain** — state the likely root cause in plain language.
5. **Fix** — smallest change that resolves the issue; do not drive-by refactor.
6. **Verify** — re-run the failing check or give exact steps for the user to confirm.
7. **Report** — summarize: what broke, why, what changed, how to retest.

The agent must not claim “no errors” without running checks or inspecting logs. If it cannot run something in the environment, it must say so and give the user the exact commands to run.

### 20.5 How these capabilities interact with the main workflow

- Task suggestion (20.1) happens **before** or **instead of** jumping into a single feature, when the user wants a roadmap.
- Understanding (20.2) and learning (20.3) apply on **every** request.
- Debugging (20.4) may skip full prompt ceremony only for **clear, isolated bugfixes** the user asked to fix now; larger behavior changes still need a prompt and approval.

---

# 19. Final rules

1. Keep changes small.
2. Use the relevant skill.
3. Preserve server/client boundaries and RLS.
4. Ask one focused question if needed.
5. Write the prompt before coding.
6. Wait for approval.
7. Implement.
8. Run checks.
9. Deliver exact test steps.

---

**Fetchistore** is an e-commerce application for new and second-hand goods, proximity-aware discovery, seller delivery to the buyer's home, live tracking, order chat, and multi-method payments.

- The **Clarkson HTML** is the structural UI contract.
- The **NovaTrend image** is the visual language contract.
- **Supabase** is the data and auth contract.
- This **AGENTS.md** is the process and architecture contract.

**Build only what the current approved prompt asks for.**

---

> **Fetchistore** is now the official name, framed as **e-commerce**, with your delivery and payment rules included. When you want the first implementation prompt (schema, auth, or home UI), say which one to start with.
