# Supabase Auth & Profile Management — Implementation Prompt

## Goal

Build authentication (Login, Register, Logout) using Supabase Auth (`@supabase/ssr`), user profile management with browser geolocation integration for proximity discovery, and user delivery addresses management.

---

## Skills read

- `AGENTS.md` (Section 1: Auth, Roles, Geolocation & delivery tracking)

---

## Code inspected

- `.env.local` — Supabase credentials configured
- `lib/supabase/client.ts` — Browser Supabase client helper
- `lib/supabase/server.ts` — Server Supabase client helper
- `lib/supabase/types.ts` — TypeScript definitions for `Profile` & `Address`
- `supabase/schema.sql` — `profiles` and `addresses` tables with PostGIS & RLS

---

## Key decisions

1. **App Router Auth Structure**:
   - `app/(auth)/login/page.tsx` — Login form (email/password)
   - `app/(auth)/register/page.tsx` — Registration form with full name & location permission prompt
   - `app/(auth)/actions.ts` — Server Actions for `login`, `signup`, and `signOut`
2. **Profile & Location**:
   - Browser Geolocation API captures `latitude` & `longitude` upon user consent.
   - Converted to PostGIS WKT string `POINT(lon lat)` and saved in `profiles.location`.
3. **Delivery Address Management**:
   - `app/(dashboard)/profile/page.tsx` — User profile view, preferred distance radius slider (e.g. 5km - 50km), and address CRUD list.

---

## Files to create/change

#### [NEW] `app/(auth)/login/page.tsx`
- Clean NovaTrend styled login page with email & password fields.

#### [NEW] `app/(auth)/register/page.tsx`
- Registration page with full name, email, password, and location request button.

#### [NEW] `app/(auth)/actions.ts`
- `login(formData)`: Authenticates user with Supabase Auth and redirects.
- `signup(formData)`: Registers new user, sets metadata.
- `signOut()`: Ends user session.

#### [NEW] `app/(dashboard)/profile/page.tsx`
- Dashboard page for user profile settings, saved delivery addresses, and preferred proximity radius.

---

## Security requirements

- All auth state mutations happen via Server Actions with input validation.
- User can only read and update their own addresses and profile via RLS policies.

---

## Acceptance criteria

- [ ] Login & Registration pages created with full form validation.
- [ ] Server actions for login, signup, and signout implemented.
- [ ] Profile page for address management created.
- [ ] Type check (`npx tsc --noEmit`) passes with 0 errors.
- [ ] Linter (`npm run lint`) passes with 0 errors.
- [ ] Next.js build (`npm run build`) passes.
