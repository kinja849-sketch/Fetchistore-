# Database Schema, PostGIS, & Supabase Client Setup — Implementation Prompt

## Goal

Set up the core Postgres database schema, PostGIS extensions, Row Level Security (RLS) policies, initial seed data SQL script, and client-side/server-side Supabase utilities for Fetchistore using `@supabase/supabase-js` and `@supabase/ssr`.

---

## Skills read

- `AGENTS.md` (Section 8: Supabase — source of truth)

---

## Code inspected

- `.env.local` — contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `DATABASE_URL`
- `.gitignore` — verified `.env*` is git-ignored so secrets remain private
- `package.json` — needs `@supabase/supabase-js` and `@supabase/ssr`

---

## Key decisions

1. **Security & Env protection**:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` exposed safely to client.
   - `DATABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` remain server-only (no `NEXT_PUBLIC_` prefix) and are git-ignored.

2. **Database Extensions**:
   - `uuid-ossp` for UUID generation.
   - `postgis` for spatial geography types (`geography(POINT, 4326)`) enabling proximity distance filtering (`ST_DWithin`, `ST_Distance`).

3. **Core Tables**:
   - `profiles` (buyer/seller profile, coordinates, search radius)
   - `addresses` (buyer delivery locations)
   - `categories` (slugs, icons/images, sort order)
   - `listings` (title, description, price, condition, images[], spatial location)
   - `orders` (buyer, seller, status state machine, payment method, delivery snapshot)
   - `order_items` (items in order)
   - `delivery_updates` (status timeline + history)
   - `delivery_locations` (real-time GPS points while out for delivery)
   - `conversations` & `messages` (order-scoped buyer-seller chat)
   - `logs` (audit log)

4. **Supabase Client Architecture**:
   - `lib/supabase/client.ts` — Browser client (using `createBrowserClient` from `@supabase/ssr`).
   - `lib/supabase/server.ts` — Server Component / Action client (using `createServerClient` from `@supabase/ssr`).
   - `lib/supabase/types.ts` — TypeScript type definitions matching the SQL schema.

---

## Files to create/change

### Configuration & Dependencies

#### [MODIFY] `package.json`
- Install `@supabase/supabase-js` and `@supabase/ssr`.

#### [NEW] `supabase/schema.sql`
- Complete SQL script creating extensions, custom ENUM types, tables, indexes (including Spatial GIST indexes), triggers (for `updated_at`), RLS policies, and seed data for categories and demo listings.

#### [NEW] `lib/supabase/types.ts`
- Database TypeScript definitions matching `schema.sql`.

#### [NEW] `lib/supabase/client.ts`
- Singleton browser client using `@supabase/ssr`.

#### [NEW] `lib/supabase/server.ts`
- Server-side client helper using `cookies()` from `next/headers`.

---

## Security requirements

- All RLS policies must enforce:
  - Public read access for active listings & categories.
  - Profile/Listing updates limited strictly to row owners (`auth.uid() = user_id`).
  - Orders & chat messages accessible only to the buyer or seller of that order.
- Service role key used exclusively on the server side when needed for administrative tasks.

---

## Acceptance criteria

- [ ] `@supabase/supabase-js` and `@supabase/ssr` installed.
- [ ] `supabase/schema.sql` created with complete PostGIS schema, RLS policies, and seed data.
- [ ] `lib/supabase/types.ts` created with full TypeScript interface definitions.
- [ ] `lib/supabase/client.ts` and `lib/supabase/server.ts` created.
- [ ] Type check (`npx tsc --noEmit`) passes with 0 errors.
- [ ] Linter (`npm run lint`) passes with 0 errors.
- [ ] Next.js build (`npm run build`) passes.

---

## Verification steps

1. Install dependencies via terminal (`cmd /c "npm install @supabase/supabase-js @supabase/ssr"`).
2. Run `npx tsc --noEmit` and `npm run lint`.
3. Verify production build with `npm run build`.
