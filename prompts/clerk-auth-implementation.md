# Implementation Prompt: Transition to Clerk Authentication (@clerk/nextjs)

## Goal
Switch authentication across Fetchistore strictly to **Clerk Authentication** using `@clerk/nextjs` as explicitly instructed by the user:
- Update `AGENTS.md` project stack definition to set Clerk Auth as project law.
- Wrap root layout in `<ClerkProvider>` in `app/layout.tsx`.
- Configure `middleware.ts` using `clerkMiddleware()`.
- Use Clerk `<SignedOut>`, `<SignedIn>`, `<SignInButton mode="modal">`, `<SignUpButton mode="modal">`, and `<UserButton />` in `components/shared/navbar.tsx`.
- Connect authentication state across pages (`app/page.tsx`, `components/shared/bottom-nav.tsx`, `components/home/hero-section.tsx`, `app/profile/page.tsx`, `app/checkout/page.tsx`) using Clerk's `useUser()` / `useAuth()` hooks.

## Skills Read
- `AGENTS.md` (Project laws & workflow)
- `ui-design` skill

## Code Inspected
- `package.json`: Contains `@clerk/nextjs`.
- `middleware.ts`: Next.js middleware file.
- `app/layout.tsx`: Root layout file.
- `components/shared/navbar.tsx`: Top header navigation bar.
- `components/shared/bottom-nav.tsx`: App bottom navigation bar.
- `app/page.tsx`: Main home page.

## Decisions
1. Set Clerk Auth (`@clerk/nextjs`) as locked project law in `AGENTS.md`.
2. Wrap `app/layout.tsx` in `<ClerkProvider>`.
3. Use Clerk `<SignInButton mode="modal">` and `<SignUpButton mode="modal">` for modal authentication.
4. Replace custom auth context references across pages with Clerk `useUser()` / `useAuth()`.

## Files to Change
- `AGENTS.md`
- `package.json`
- `middleware.ts`
- `app/layout.tsx`
- `components/shared/navbar.tsx`
- `components/shared/bottom-nav.tsx`
- `app/page.tsx`
- `components/home/hero-section.tsx`
- `components/home/unauthenticated-welcome.tsx`
- `app/profile/page.tsx`
- `app/profile/settings/page.tsx`
- `app/checkout/page.tsx`

## Security Requirements
- Keep Clerk secret keys on server only (`CLERK_SECRET_KEY`).
- Use `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` on client.

## Acceptance Criteria
- App uses `@clerk/nextjs` for all authentication actions.
- `ClerkProvider` wraps the root layout.
- `clerkMiddleware()` handles request routing in `middleware.ts`.
- `npm run typecheck` and `npm run lint` pass with 0 errors.

## Checks
- `cmd /c npm run typecheck`
- `cmd /c npm run lint`
