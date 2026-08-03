# Implementation Prompt: Seller Delivery Controls, Live Tracking Simulator & Order Fulfillment Flow

## 1. Goal
Implement interactive **Seller Delivery Controls & Live Status Updates** for Fetchistore. Allow sellers to view active incoming orders (`pending`, `paid`, `cod_pending`), accept orders (`accepted`), initiate live delivery (`out_for_delivery`), update location (`nearby`), and complete direct-to-door delivery (`delivered` -> `completed`). Upgrade the order tracking view (`/orders/[id]`) with live status sync, dynamic location simulation, and seller delivery status buttons.

---

## 2. Skills Read & Code Inspected
- `.agents/skills/ui-design`: Clarkson structural reference, NovaTrend visual language, primary brand color (`#E8553A`), mobile-first card design.
- `AGENTS.md`: Canonical rules for seller delivery to buyer address, canonical order status machine (`pending` -> `paid` | `cod_pending` -> `accepted` -> `out_for_delivery` -> `nearby` -> `delivered` -> `completed`), order-scoped chat, and multi-payment workflows.
- `app/orders/[id]/page.tsx`: Existing order tracking page with mock map and buyer-seller chat.
- `app/(dashboard)/listings/page.tsx`: Existing seller dashboard view.

---

## 3. Decisions & Architectural Specifications

### A. Seller Order Management Portal (`app/seller/orders/page.tsx`)
1. **Order List for Seller**: Display list of orders assigned to the logged-in seller/user with status badges (`cod_pending`, `paid`, `accepted`, `out_for_delivery`, `delivered`, `completed`).
2. **Order Actions Bar**:
   - `Accept Order`: Transition status from `paid` or `cod_pending` -> `accepted`.
   - `Start Delivery`: Transition status from `accepted` -> `out_for_delivery`.
   - `Mark Nearby`: Update delivery status to `nearby` (ETA 3-5 mins).
   - `Mark Delivered`: Update status to `delivered` (prompts buyer/seller confirmation for COD).
   - `Complete Order`: Finalize order as `completed`.
3. **Live GPS Location Simulator**:
   - Provide a "Simulate Movement / Update Location" trigger for the seller during `out_for_delivery` mode, which dynamically updates the seller's coordinates and distance to buyer house.

### B. Enhanced Buyer & Seller Order Tracking (`app/orders/[id]/page.tsx`)
1. **Interactive Delivery Control Bar**:
   - Allow toggling between "Buyer View" and "Seller Control View" so the user can test the live delivery workflow seamlessly on a single screen.
2. **Dynamic Live Map & ETA Bar**:
   - Animated position pin for the delivering seller.
   - Dynamic distance readout ("0.5 km away", "ETA 3 mins").
3. **Interactive Order-Scoped Chat**:
   - Real-time chat input allowing both seller and buyer messages to be sent and updated dynamically.

---

## 4. Proposed File Changes

### Modified Files:
- [MODIFY] `app/orders/[id]/page.tsx` (Add interactive seller delivery status controls, dynamic map animation state, and live chat state updates)

### New Files:
- [NEW] `app/seller/orders/page.tsx` (Seller Order Fulfillment Dashboard with stage transitions, buyer delivery address specs, and live location simulation controls)
- [NEW] `components/seller/delivery-control-panel.tsx` (Reusable delivery action bar component for order status advancement)

---

## 5. Security & Architectural Compliance
- State transitions follow canonical status machine defined in `AGENTS.md`.
- Mobile-first responsive design matching NovaTrend aesthetic (`#E8553A` primary accent).
- TypeScript strict typing (no `any`).

---

## 6. Acceptance Criteria & Verification Plan

### Automated Checks:
```bash
cmd /c npm run typecheck
cmd /c npm run lint
```

### Manual Verification Steps:
1. **Seller Dashboard Orders (`/seller/orders`)**: Inspect incoming orders list, test status advancement (`paid`/`cod_pending` -> `accepted` -> `out_for_delivery` -> `nearby` -> `delivered` -> `completed`).
2. **Order Tracking Page (`/orders/[id]`)**: Verify live status timeline updates when seller changes state.
3. **Live Map & Proximity**: Test location simulation during `out_for_delivery` mode and verify distance/ETA updates.
4. **Order Chat**: Send test messages in the order chat window and verify real-time display.
