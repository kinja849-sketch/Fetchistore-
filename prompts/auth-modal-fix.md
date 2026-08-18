# Implementation Prompt: Fix Auth Modal Rendering and Account Creation Flow

## Goal
Fix the non-responsive authentication issue where clicking "Get Started" or "Sign In" did not open the auth modal, and ensure account creation works smoothly via Supabase Auth (with local fallback when Supabase credentials are missing).

## Skills Read
- `AGENTS.md` (Tech stack rules: Supabase Auth locked)
- `lib/supabase/auth-context.tsx`
- `components/auth/auth-modal.tsx`

## Code Inspected
- `app/layout.tsx`: Discovered `AuthModal` was omitted from layout DOM tree.
- `components/auth/auth-modal.tsx`: Modal component handling tab switching, form submit, and demo auth.
- `lib/supabase/auth-context.tsx`: Auth context managing user, session, profiles, sign up, sign in.
- `components/shared/navbar.tsx`: Header navigation bar.

## Decisions
1. Mount `<AuthModal />` directly inside `<AuthProvider>` in `app/layout.tsx`.
2. Update `signUpWithEmail` and `signInWithEmail` in `lib/supabase/auth-context.tsx` to handle unconfigured Supabase environment gracefully by creating local authenticated state when Supabase credentials aren't set in `.env.local`.
3. Add a "Sign In" trigger button in `components/shared/navbar.tsx` for unauthenticated desktop users.

## Files to Change
- `app/layout.tsx`
- `lib/supabase/auth-context.tsx`
- `components/shared/navbar.tsx`

## Security Requirements
- Do not expose any secret keys on the client.
- Use Supabase Auth as standard provider.

## Acceptance Criteria
- Clicking "Get Started" or "Sign In" opens the Auth Modal immediately.
- Users can create account via email/password/name in Sign Up tab.
- Users can sign in via Sign In tab.
- Users can sign in via 1-click Demo User button.
- Navbar shows Sign In button when logged out and profile indicator when logged in.
- `npm run typecheck` passes with 0 errors.

## Checks
- `npm run typecheck`
- `npm run lint`
