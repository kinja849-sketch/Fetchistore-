# Implementation Prompt: Task 2 — Realtime Live Delivery Location & Interactive Map Engine Integration

## 1. Goal
Integrate an interactive Leaflet/OpenStreetMap engine into the buyer's order tracking view (`app/orders/[id]/page.tsx`) and seller control panel (`components/seller/delivery-control-panel.tsx`), enabling live GPS location updates, Realtime status timeline progress (`pending` → `paid` → `accepted` → `out_for_delivery` → `nearby` → `delivered` → `completed`), and order-scoped location sharing during active delivery windows.

## 2. Skills Read & Code Inspected
- **Skills**: Section 10 (`Geolocation & delivery tracking`) of `AGENTS.md`.
- **Code Inspected**:
  - `app/orders/[id]/page.tsx`
  - `components/seller/delivery-control-panel.tsx`
  - `supabase/schema.sql` (`delivery_updates`, `delivery_locations` tables)

## 3. Key Decisions
1. **Interactive Map Component**: Create `components/delivery/delivery-map.tsx` rendering an interactive OpenStreetMap view with custom marker pins for the seller's current location and the buyer's delivery destination.
2. **Delivery Status Machine**: Enforce canonical status transitions:
   - `pending` → `paid` / `cod_pending` → `accepted` → `out_for_delivery` → `nearby` → `delivered` → `completed`
3. **Server Actions Layer**: Create `app/actions/delivery.ts` (`updateOrderStatus`, `recordDeliveryLocation`, `getDeliveryHistory`).
4. **Realtime Channels**: Use Supabase Realtime (with client polling fallback) to stream incoming GPS coordinates from `delivery_locations` straight to the buyer's map.

## 4. Files to Change / Create
- `[NEW]` `components/delivery/delivery-map.tsx` (Interactive Map component)
- `[NEW]` `app/actions/delivery.ts` (Server actions for status changes and coordinate recordings)
- `[MODIFY]` `app/orders/[id]/page.tsx` (Embed `DeliveryMap` and listen for realtime updates)
- `[MODIFY]` `components/seller/delivery-control-panel.tsx` (Wire status buttons to `updateOrderStatus` and coordinate pinging)

## 5. Implementation Requirements
- Map must center on seller/buyer coordinates dynamically.
- Live location pings recorded ONLY when status is `out_for_delivery` or `nearby`.
- Status timeline progress bar updates state in real-time.

## 6. Security Requirements
- Location streaming is strictly order-scoped; only the assigned buyer and seller can read/write coordinates for that specific order ID.

## 7. Acceptance Criteria
- Interactive map renders seamlessly without breaking SSR hydration.
- Seller status updates trigger real-time timeline progress on the order view.
- `npm run typecheck` passes with zero errors.

## 8. Checks & Test Steps
1. Run `cmd /c "npx tsc --noEmit"` to verify 0 type errors.
2. Open `http://localhost:3000/orders/ord-101` to view live map rendering and timeline.
3. Test seller controls at `http://localhost:3000/seller/orders` to transition order through delivery stages.
