# Prompt: Supabase Realtime Sync & End-to-End Server Actions Integration

## Goal
Wire full dynamic data connectivity between Next.js App Router server actions / API endpoints and Supabase PostgreSQL with PostGIS geolocation querying, live order status updates via Supabase Realtime, order-scoped chat subscriptions, and Stripe payment webhook handling for Fetchistore.

---

## Skills & Reference Contracts Inspected
- `AGENTS.md`: Section 8 (Supabase source of truth), Section 10 (Geolocation & tracking), Section 12 (Cart, checkout, payments), Section 13 (Chat), Section 14 (Security & Env limits).
- `.agents/skills/supabase`: PostgreSQL PostGIS spatial functions, Server Actions with `@supabase/ssr`, Realtime channels for location and messages.
- `.agents/skills/stripe`: PaymentIntent & Checkout session verification, webhook handler rules.

---

## Code Inspected & Context
1. `supabase/schema.sql`: Authoritative schema featuring `profiles`, `listings` (geography POINT), `orders`, `delivery_updates`, `delivery_locations`, `conversations`, `messages`, and strict RLS policies.
2. `app/actions/listings.ts` & `app/actions/profile.ts`: Existing initial Server Actions for fetching/creating listings and managing profiles.
3. `lib/supabase/client.ts` & `lib/supabase/server.ts`: Supabase browser & server client configurations.
4. `components/home/authenticated-feed.tsx`, `app/orders/[id]/page.tsx`, `app/orders/[id]/chat/page.tsx`: Components ready for live query integration and Realtime subscription binding.

---

## Decisions
1. **Server Actions vs Client SDK**: Use Server Actions (`@supabase/ssr`) for privileged queries (creating orders, updating delivery status, listing mutations) to guarantee RLS enforcement and hide secrets.
2. **Realtime Channels**: Bind Supabase Realtime client hooks in browser components for live delivery map updates (`delivery_locations` inserts) and live chat (`messages` inserts).
3. **Distance Calculations**: Implement PostGIS `ST_Distance` and `ST_DWithin` spatial helpers inside `app/actions/listings.ts` for proximity-first discovery filtering.
4. **Stripe Integration**: Add `/api/webhooks/stripe` route handler using `stripe` SDK to handle `payment_intent.succeeded` events and transition orders from `pending` -> `paid`.

---

## Files to Change / Create

### Server Actions & Backend Helpers
- [MODIFY] [listings.ts](file:///c:/Users/acer/Documents/antigravity/intelligent-maxwell/app/actions/listings.ts) — Integrate PostGIS radius search & category filter querying.
- [NEW] [orders.ts](file:///c:/Users/acer/Documents/antigravity/intelligent-maxwell/app/actions/orders.ts) — Server actions for `createOrder`, `updateOrderStatus`, `recordDeliveryLocation`.
- [NEW] [chat.ts](file:///c:/Users/acer/Documents/antigravity/intelligent-maxwell/app/actions/chat.ts) — Server actions for `sendMessage`, `getConversationMessages`.
- [NEW] [stripe.ts](file:///c:/Users/acer/Documents/antigravity/intelligent-maxwell/app/api/webhooks/stripe/route.ts) — Webhook handler for Stripe payment events.

### Client Realtime Hooks & Page Integrations
- [NEW] [use-realtime-delivery.ts](file:///c:/Users/acer/Documents/antigravity/intelligent-maxwell/lib/supabase/hooks/use-realtime-delivery.ts) — React hook for order live map position streaming.
- [NEW] [use-realtime-chat.ts](file:///c:/Users/acer/Documents/antigravity/intelligent-maxwell/lib/supabase/hooks/use-realtime-chat.ts) — React hook for order chat message updates.
- [MODIFY] [page.tsx](file:///c:/Users/acer/Documents/antigravity/intelligent-maxwell/app/orders/[id]/page.tsx) — Connect live location tracking & status timeline to Supabase Realtime.
- [MODIFY] [page.tsx](file:///c:/Users/acer/Documents/antigravity/intelligent-maxwell/app/orders/[id]/chat/page.tsx) — Connect order messaging to Supabase Realtime subscription.

---

## Implementation Requirements
1. **PostGIS Querying**: Spatial distance function query using SQL raw template or PostGIS RPC in Supabase to return listings within specified `radius_km`.
2. **Order Lifecycle Machine**: Enforce transition rules (`pending`/`cod_pending` -> `accepted` -> `out_for_delivery` -> `nearby` -> `delivered` -> `completed`).
3. **Realtime Channels**: Use channel name format `order-delivery-[orderId]` and `order-chat-[orderId]` for low-latency updates.
4. **Error Handling**: Graceful fallback to client context mock data when Supabase connection string / environment keys are absent in local development.

---

## Security Requirements
- Ensure RLS policies in `schema.sql` are respected; never use service role key in client components.
- Verify Stripe Webhook Signature (`stripe-signature` header) before processing payment events.

---

## Acceptance Criteria
- [ ] Spatial proximity queries correctly filter listings based on latitude/longitude and radius.
- [ ] Order creation saves order items, delivery address, and status into Supabase.
- [ ] Realtime delivery tracking streams new GPS coordinates to buyer map view without full page reload.
- [ ] Realtime chat streams instant messages between buyer and seller in order-scoped room.
- [ ] Stripe webhook handler updates order `payment_status` and status to `paid`.

---

## Checks
- `cmd /c "npm run typecheck"`
- `cmd /c "npm run lint"`

---

## Exact Test Steps
1. Run `cmd /c "npm run typecheck"` to ensure zero TypeScript errors.
2. Run `cmd /c "npm run lint"` to confirm clean code quality.
3. Open `http://localhost:3000/orders/ord-1/chat` and send a test message; verify instant arrival in chat log.
4. Open `http://localhost:3000/seller/orders` and transition an order to `out_for_delivery`; confirm `delivery_updates` row creation and live tracking map activation.
