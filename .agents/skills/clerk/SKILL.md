---
name: clerk
description: >
  Clerk Auth integration guide for Next.js App Router, middleware, user management,
  authentication hooks, UI components, and Supabase integration. Use this skill whenever
  working on authentication, session management, or user profiles.
---

# Clerk Auth Skill — Fetchistore

This skill defines the authentication standard for Fetchistore using `@clerk/nextjs`.

---

## 1. Overview & Principles

Fetchistore relies on **Clerk Auth** (`@clerk/nextjs`) for user authentication and session management.

### Key Rules
- **No authentication bypass**: All protected routes and server actions must verify user authorization via Clerk.
- **Supabase Sync**: User details from Clerk (e.g. `userId`, `email`, `fullName`, `imageUrl`) are mirrored to Supabase's `profiles` table for database relations and PostGIS distance queries.
- **Strict Approval Policy**: Never perform `git push` to GitHub without explicit review and permission from the user.
- **CodeRabbit Verification**: Pass all code changes through CodeRabbit review / linting / typecheck checks before finalizing.

---

## 2. Environment Variables

Ensure the following environment variables are present in `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

---

## 3. App Router Setup

### Provider (`app/layout.tsx`)

Wrap the application root with `<ClerkProvider>`:

```tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Middleware (`middleware.ts`)

Protect routes using `clerkMiddleware()` and `createRouteMatcher()`:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/cart(.*)',
  '/checkout(.*)',
  '/orders(.*)',
  '/listings/new(.*)',
  '/listings/(.*)/edit(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

---

## 4. Server-Side Authentication

### Server Components & Server Actions

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

// Getting user ID (fast check)
export async function myServerAction() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  // ...
}

// Getting full user record
export async function getProfile() {
  const user = await currentUser();
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
    avatarUrl: user.imageUrl,
  };
}
```

---

## 5. Client-Side Authentication & UI Components

### Auth Hooks (`'use client'`)

```tsx
'use client';

import { useUser, useAuth } from '@clerk/nextjs';

export function UserProfileHeader() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { userId } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in</div>;

  return <div>Welcome, {user.firstName}!</div>;
}
```

### Pre-built Clerk UI Components

```tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export function NavigationAuth() {
  return (
    <div>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
```

---

## 6. Supabase Profile Sync Strategy

When a user registers or logs in via Clerk:
1. Extract Clerk `userId` (e.g. `user_2...`).
2. Insert/Upsert into Supabase `profiles` table:
   ```sql
   insert into public.profiles (id, full_name, avatar_url, updated_at)
   values (p_user_id, p_full_name, p_avatar_url, now())
   on conflict (id) do update set
     full_name = excluded.full_name,
     avatar_url = excluded.avatar_url,
     updated_at = now();
   ```
3. Attach RLS policy using standard user matching where `id = auth.uid()` or by passing verified Clerk token parameters.

---

## 7. Safety & Code Quality Mandate

- **GitHub Push:** Under no circumstances should `git push` be run automatically. Request explicit user review & approval first.
- **CodeRabbit Review:** Run static analysis (`npm run typecheck`, `npm run lint`, CodeRabbit checks) on all touched files to ensure high quality before completing tasks.
