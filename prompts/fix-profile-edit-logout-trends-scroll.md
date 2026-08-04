# Implementation Prompt — Profile Edit, Logout, & Trends Scroll Fixes

Fix three core user experience issues across Fetchistore: missing Profile Editing functionality, missing/broken Logout capability, and non-scrollable Trends Carousel on Shop Discovery.

---

## 1. Executive Summary & Goals

1. **Profile Edit & Persistence**:
   - Allow users to edit their profile (Full Name, Avatar URL / Photo, Location / Address, Preferred Radius, and Bio/Phone) from the main Profile page (`app/profile/page.tsx`) and Settings (`app/profile/settings/page.tsx`).
   - Persist user profile updates in local storage and auth context so changes immediately reflect across the UI (Profile header, Navbar, settings).

2. **Logout / Sign Out Button**:
   - Add a prominent, accessible "Log Out" button on the main Profile page and fix the sign-out button in Settings (`app/profile/settings/page.tsx`).
   - Replace direct Clerk `useClerk().signOut()` calls with `useAuth().signOut()` from `@/lib/supabase/auth-context` (with safe fallback) so users can reliably sign out of demo/Supabase accounts and reset session state.

3. **Shop Discovery Trends Carousel Scrolling**:
   - Enable horizontal scrolling (left & right) across the promotional trends banner situated between the search section and category navigation pills in `components/home/authenticated-feed.tsx`.
   - Add mouse drag-to-scroll interactivity (`cursor-grab` / `cursor-grabbing`), touch panning, and visible Left/Right navigation arrow controls so desktop and mobile users can scroll across all trend cards effortlessly.

---

## 2. Skills & Code Inspected

- **Skills Consulted**: `ui-design` (`.agents/skills/ui-design/SKILL.md`)
- **Code Inspected**:
  - `app/profile/page.tsx` — Main profile page & sub-views
  - `app/profile/settings/page.tsx` — Settings & Privacy page
  - `lib/supabase/auth-context.tsx` — Supabase & Demo Auth state provider
  - `components/home/authenticated-feed.tsx` — Shop discovery feed & trends banner
  - `components/shared/navbar.tsx` & `components/shared/bottom-nav.tsx` — Shared navigation

---

## 3. Detailed File Changes

### A. `lib/supabase/auth-context.tsx`
- Extend `AuthContext` to support profile updates (`updateProfile({ fullName, avatarUrl, location, radius, phone, bio })`).
- Persist profile metadata updates to `localStorage` (for demo/local mode) and sync with Supabase `user_metadata` when authenticated.

### B. `app/profile/page.tsx`
- Connect to `useAuth()` context for user identity and profile state.
- Wire up the Edit icon button (`<span className="material-symbols-outlined">edit</span>`) to open an **Edit Profile Modal / Drawer**.
- Add form fields in the modal for: Full Name, Avatar Image URL / Preset Selection, Location (e.g. "Greenpoint, NY"), Preferred Radius (km), and Phone/Bio.
- Add a prominent **Log Out / Sign Out** button to the main Profile page (e.g. in the user card header and below bento sections).
- Replace `@clerk/nextjs` import/calls with `useAuth().signOut()`.

### C. `app/profile/settings/page.tsx`
- Replace `@clerk/nextjs` `useClerk()` call with `useAuth().signOut()`.
- Connect form inputs for Full Name and Preferred Radius to `updateProfile` action so updates save cleanly.
- Add a dedicated "Sign Out" action button with confirmation state.

### D. `components/home/authenticated-feed.tsx`
- Refactor the Promotional Banners Carousel section:
  - Add container ref (`useRef<HTMLDivElement>`) and scroll helper functions (`scrollLeft`, `scrollRight`).
  - Add mouse drag handling (`onMouseDown`, `onMouseMove`, `onMouseUp`, `onMouseLeave`) for smooth click-and-drag horizontal scrolling on desktop.
  - Position floating Left (`<`) and Right (`>`) scroll navigation buttons that appear on hover.
  - Ensure touch pan (`touch-pan-x`) and momentum scrolling remain smooth on touch devices.

---

## 4. Security & Quality Requirements
- RLS and server boundaries respected (no raw secret key exposure).
- Safe handling of auth sign-out clearing state without throwing exceptions if Clerk is unconfigured.
- Proper accessibility (ARIA labels on scroll buttons and edit modal trigger/close buttons).

---

## 5. Verification & Acceptance Criteria
1. Clicking the Edit button on `/profile` opens the Edit Profile modal; editing fields and saving immediately updates the profile avatar, name, and location on the page.
2. Clicking "Log Out" on `/profile` or `/profile/settings` successfully signs out the user and clears state.
3. On Shop Discovery (`/`), the trends banner can be scrolled left and right using mouse drag, scroll arrows, touch swipe, or scroll wheel.
4. `npm run typecheck` and `npm run lint` pass without errors.
