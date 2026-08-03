# Clerk Authentication Setup — Implementation Prompt

## Goal
Switch authentication across Fetchistore to **Clerk Authentication** using `@clerk/nextjs` as explicitly requested by the user:
- Wrap the app with `<ClerkProvider>` in `app/layout.tsx`.
- Configure `proxy.ts` using `clerkMiddleware()` with required matcher including `/__clerk/:path*`.
- Integrate `<Show when="signed-out">` and `<Show when="signed-in">` along with `<SignInButton mode="modal">`, `<SignUpButton mode="modal">`, and `<UserButton />` in `components/shared/navbar.tsx`.
- Connect authentication state across the welcome landing page, hero CTAs, top header, and bottom navigation using Clerk's `useUser()` / `useAuth()` hooks.

---

## Skills read
- `AGENTS.md` (Workflow & Tech stack overrides per explicit user directive)
- `ui-design` skill

---

## Code inspected
- `package.json`: Contains `@clerk/nextjs` (^7.6.4).
- `.env.local`: Contains `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`.
- `proxy.ts`: Next.js middleware file.
- `app/layout.tsx`: Root layout component.
- `components/shared/navbar.tsx`: Header navigation component.
- `components/home/hero-section.tsx`: Hero component with "Shop Now" trigger.
- `components/shared/bottom-nav.tsx`: App bottom navigation bar.
- `app/page.tsx`: Home page switching between unauthenticated welcome screen and authenticated feed.

---

## Key decisions & Architectural Notes

1. **Clerk Integration**:
   - `proxy.ts`: Export default `clerkMiddleware()` with matcher pattern including `'/__clerk/:path*'`.
   - `app/layout.tsx`: Wrap `<body>` children inside `<ClerkProvider>`, rendering `<Navbar />`, `{children}`, and `<BottomNav />`.
   - `components/shared/navbar.tsx`:
     - Unauthenticated: Display logo, marketing links ("Shop", "About", "Contact"), and Clerk `<SignInButton mode="modal">` / `<SignUpButton mode="modal">`.
     - Authenticated: Hide "Shop", "About", "Contact". Show integrated search bar, filter button, cart icon, and Clerk `<UserButton />`.

2. **Auth-Gated Actions**:
   - Update `components/home/hero-section.tsx` and `components/home/unauthenticated-welcome.tsx` so clicking "Shop Now" or gated actions triggers Clerk modal signup (`<SignUpButton mode="modal">` / `<SignInButton mode="modal">`).

3. **Client Hooks & Layout Switching**:
   - Use `useUser()` from `@clerk/nextjs` in `app/page.tsx`, `navbar.tsx`, and `bottom-nav.tsx` to reactively render `AuthenticatedFeed` or `UnauthenticatedWelcome`.

---

## Files to create/change

#### [MODIFY] `proxy.ts`
- Replace Supabase middleware with `clerkMiddleware()` export and required config matcher including `'/__clerk/:path*'`.

#### [MODIFY] `app/layout.tsx`
- Wrap app contents with `<ClerkProvider>` inside `<body>`, preserving font classes.

#### [MODIFY] `components/shared/navbar.tsx`
- Use Clerk `<Show when="signed-out">` / `<Show when="signed-in">`, `<SignInButton>`, `<SignUpButton>`, and `<UserButton />`.

#### [MODIFY] `components/shared/bottom-nav.tsx`
- Use `useUser()` from `@clerk/nextjs` to show bottom nav dock when signed in.

#### [MODIFY] `components/home/hero-section.tsx` & `components/home/unauthenticated-welcome.tsx`
- Trigger Clerk sign-up modal on "Shop Now" / gated action clicks.

#### [MODIFY] `app/page.tsx`
- Switch between `AuthenticatedFeed` and `UnauthenticatedWelcome` based on Clerk `useUser()` state (`isSignedIn`, `isLoaded`).

---

## Verification Rules & Checklist
1. Is `clerkMiddleware()` used in `proxy.ts`?
2. Does the proxy matcher include `'/__clerk/:path*'`?
3. Is `ClerkProvider` inside `<body>` in `app/layout.tsx`?
4. Are imports from `@clerk/nextjs` or `@clerk/nextjs/server`?
5. Do `npm run typecheck`, `npm run lint`, and `npm run build` pass?

---

## Verification steps
1. `cmd /c "npm run typecheck"`
2. `cmd /c "npm run lint"`
3. `cmd /c "npm run build"`
