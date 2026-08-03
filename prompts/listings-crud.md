# Seller Product Listing CRUD & Image Upload — Implementation Prompt

## Goal

Build the Seller Listing Management flow allowing sellers to list new and second-hand items with title, description, category, condition (`new`, `like_new`, `good`, `fair`), price, old price, quantity, location coordinates, and image uploads.

---

## Skills read

- `AGENTS.md` (Section 1: Seller tools & Listing rules; Section 11: Listing rules)
- `.agents/skills/ui-design/SKILL.md` (Condition badges & NovaTrend UI language)

---

## Code inspected

- `.env.local` — Supabase URL & Anon Key for storage/data
- `lib/supabase/types.ts` — `Listing` & `ProductCondition` interfaces
- `components/shared/condition-badge.tsx` — condition badge pill component
- `supabase/schema.sql` — `listings` table schema with PostGIS geography location

---

## Key decisions

1. **Pages & Routes**:
   - `app/(dashboard)/listings/page.tsx` — Seller's listings overview (list of active/inactive items).
   - `app/(dashboard)/listings/new/page.tsx` — New product listing form.
   - `app/(dashboard)/listings/[id]/edit/page.tsx` — Edit existing product listing form.
   - `app/(dashboard)/listings/actions.ts` — Server Actions for `createListing`, `updateListing`, `toggleListingActive`, and `deleteListing`.

2. **Listing Validation Requirements**:
   - At least 1 image, title, description, category, condition (`new`, `like_new`, `good`, `fair`), price (≥ 0), and location coordinates required per AGENTS.md Section 11.
   - Soft-delete supported (`is_active = false`).

3. **UI Form Components**:
   - React Hook Form + Zod schema validation.
   - Condition radio/button selector using Fetchistore condition pill colors (green, blue, amber, gray).
   - Browser geolocation auto-fill for listing location coordinates.

---

## Files to create/change

#### [NEW] `lib/validations/listing.ts`
- Zod schema for listing form validation.

#### [NEW] `app/(dashboard)/listings/page.tsx`
- Grid/List view of seller's listings with quick status toggles.

#### [NEW] `app/(dashboard)/listings/new/page.tsx`
- Form for creating new item listing.

#### [NEW] `app/(dashboard)/listings/[id]/edit/page.tsx`
- Form for editing an existing item listing.

#### [NEW] `app/(dashboard)/listings/actions.ts`
- Server Actions handling database writes and image uploads.

---

## Verification requirements

- `npx tsc --noEmit` passes with 0 errors.
- `npm run lint` passes with 0 errors.
- `npm run build` succeeds.
