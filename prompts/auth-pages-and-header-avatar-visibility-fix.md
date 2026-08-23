# Implementation Prompt — Auth Screen Layout, Leaf Icon Removal, Avatar Sync & Header Icon Scoping

Fix sign-in and sign-up single-screen non-scrollable layout, remove the sprout/leaf icon above "Fetchistore", sync user profile avatar image across profile and discovery headers, and restrict header notifications alert, cart icon, and avatar strictly to the Discovery screen (`/`).

---

## 1. Executive Summary & Goals

1. **Sign-In & Sign-Up Screen Layout & Leaf Icon Removal**:
   - Remove the sprout/leaf icon SVG above the "Fetchistore" title on sign-in and sign-up screens (`components/auth/clerk-auth-form.tsx`).
   - Fix the form layout so that the entire content (character illustration, title, inputs, sign in/create account CTA, Google auth button, and bottom account toggle/links) fits inside a single mobile viewport (`100dvh`) without any vertical scrolling or empty scrollable space.
   - Adjust illustration size (`h-[140px]` to `h-[180px]`), margins, paddings, and font sizes to guarantee complete visibility on all mobile screen heights.

2. **User Profile Image & Avatar Sync Across Discovery & Profile**:
   - Ensure the user's updated profile avatar image (from `AuthContext` / `userProfile.avatarUrl` and local uploads/edits) reflects immediately on the Discovery page header avatar and across the app.
   - Replace rigid Clerk `<UserButton />` / fallback initial rendering with a custom unified avatar component that displays `userProfile.avatarUrl` (or Clerk `user.imageUrl` as fallback, or initials) and updates in real-time when the user changes their photo on the Profile screen.

3. **Top Header Icon Scoping (Notifications Alert, Cart Icon, & Avatar Icon)**:
   - Restrict the Notifications bell (`🔔`), Shopping Cart icon (`🛒`), and User Avatar icon in the top header bar (`components/shared/navbar.tsx`) to ONLY appear on the Discovery screen (`pathname === "/"`).
   - On the Profile screen (`/profile`) and all other non-discovery screens (`/shop`, `/wishlist`, `/orders`, `/cart`, `/checkout`, etc.), omit the Notifications bell, Cart icon, and Avatar icon from the top header bar to match exact product requirements.

---

## 2. Skills & Code Inspected

- **Skills Consulted**:
  - `clerk` (`.agents/skills/clerk/SKILL.md`)
  - `ui-design` (`.agents/skills/ui-design/SKILL.md`)
- **Code Inspected**:
  - `components/auth/clerk-auth-form.tsx` — Sign-in & sign-up auth form
  - `components/shared/navbar.tsx` — Top header bar navigation
  - `app/profile/page.tsx` — Profile page & photo editing workflow
  - `lib/supabase/auth-context.tsx` — Supabase / local auth context & profile state
  - `components/shared/user-sync.tsx` — User sync between Clerk & profile state

---

## 3. Implementation Plan & File Changes

### A. `components/auth/clerk-auth-form.tsx`
- Remove the 2-leaf organic SVG icon container situated directly above `<h2 className="... font-serif">Fetchistore</h2>`.
- Change parent wrapper styling to `h-[100dvh] max-h-[100dvh] overflow-hidden p-3 flex flex-col justify-between items-center bg-[#FFF9E9]`.
- Scale down character illustration container to `h-[140px] xs:h-[160px] sm:h-[180px]` with `shrink-1` to prevent overflowing.
- Adjust vertical margins (`mb-2`, `mt-1`, `space-y-2.5`, `py-2.5`) for title, inputs, buttons, and social auth divider so that the entire auth card fits inside the viewport frame without vertical scrolling.

### B. `components/shared/navbar.tsx`
- Create a unified avatar renderer that checks `userProfile.avatarUrl` from `useAuth()` first, then Clerk `user.imageUrl`, and falls back to user initials or default icon.
- Wrap header notification bell, shopping cart button, and user avatar button in a conditional check:
  - Display them ONLY when `pathname === "/"` (Discovery screen).
  - Hide them on `/profile` and all other screens.

### C. `app/profile/page.tsx` & `lib/supabase/auth-context.tsx`
- Ensure updating avatar URL or uploading a file in `handleSaveProfile` / `handleAvatarFileUpload` updates `userProfile.avatarUrl` in `AuthContext` and persists to `localStorage` / Supabase.
- If Clerk user is loaded (`useUser().user`), attempt updating `user.setProfileImage({ file })` when a device image file is uploaded.

---

## 4. Acceptance & Verification Criteria

1. On `/sign-in` and `/sign-up`, no leaf icon appears above "Fetchistore".
2. On `/sign-in` and `/sign-up`, all content (image, title, inputs, CTAs, Google button, bottom link) fits on a single screen without scrolling on mobile viewports.
3. Updating profile photo on `/profile` immediately updates the photo displayed on the Discovery page header avatar.
4. Notifications alert bell (`🔔`), Cart icon (`🛒`), and Avatar icon are ONLY visible in the top header bar on the Discovery page (`/`), and are NOT present on `/profile` or any other screen.
5. Code static checks (`npm run typecheck`, `npm run lint`) pass cleanly.
