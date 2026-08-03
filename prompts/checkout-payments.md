# Checkout & Multi-Payment Integration — Implementation Prompt

## Goal

Build the Cart & Checkout flow supporting Fetchistore's canonical payment methods: **Stripe** (Card), **Bank Transfer**, **e-Wallet**, and **Cash on Delivery (COD)** with order creation, status initialization (`pending` | `cod_pending`), and delivery address selection.

---

## Skills read

- `AGENTS.md` (Section 1 & 12: Cart, checkout, payments & canonical status rules)

---

## Code inspected

- `lib/supabase/types.ts` — `Order`, `PaymentMethod`, `OrderStatus`
- `components/shared/navbar.tsx` — Shopping cart icon & item count
- `supabase/schema.sql` — `orders` & `order_items` tables

---

## Key decisions

1. **Pages & Routes**:
   - `app/cart/page.tsx` — Cart overview, quantity adjustments, item removal.
   - `app/checkout/page.tsx` — Checkout page with delivery address input & payment method selection tabs (Stripe Card, Bank Transfer, e-Wallet, COD).
   - `app/checkout/actions.ts` — Server Actions to create orders, initialize payment status, and process COD/Bank instructions.

2. **Payment Handling**:
   - **Stripe**: Creates session/payment intent server-side.
   - **Bank Transfer**: Shows transfer instructions + confirmation flow.
   - **e-Wallet**: Abstracted provider payment view.
   - **COD**: Initializes order with `cod_pending` status.

---

## Files to create/change

#### [NEW] `lib/store/cart.ts`
- Client-side cart state/context manager.

#### [NEW] `app/cart/page.tsx`
- Cart UI with item list, order summary, and Proceed to Checkout CTA.

#### [NEW] `app/checkout/page.tsx`
- Multi-payment checkout form with address input and payment selector.

#### [NEW] `app/checkout/actions.ts`
- Server Action for order placement and payment state transition.

---

## Verification requirements

- `npx tsc --noEmit` passes with 0 errors.
- `npm run lint` passes with 0 errors.
- `npm run build` succeeds.
