# Implementation Prompt: Navbar & Bottom Navigation Visibility Refinement

## Goal
Restrict the bottom navigation bar to authenticated dashboard routes on mobile devices only, and remove the mobile menu hamburger/dropdown drawer entirely from the unauthenticated welcome/onboarding screen.

## Skills Read
- `.agents/skills/ui-design`

## Code Inspected
- `components/shared/bottom-nav.tsx`
- `components/shared/navbar.tsx`
- `app/layout.tsx`

## Design Decisions & Technical Changes

1. **Bottom Navigation Visibility (`components/shared/bottom-nav.tsx`)**:
   - Add authentication check (`const { isSignedIn, isLoaded } = useUser()`).
   - Return `null` when `!isSignedIn` or `!isLoaded` so the floating bottom navbar is only visible when the user is signed in to the dashboard/app.

2. **Welcome Screen Header Menu (`components/shared/navbar.tsx`)**:
   - Remove the mobile hamburger menu button (`<button onClick={() => setIsMobileMenuOpen(true)}>`) from the unauthenticated section.
   - Remove the mobile drawer menu overlay (`{!isSignedIn && isMobileMenuOpen && ...}`) for unauthenticated users.
   - Desktop navigation links (`Shop`, `About`, `Sell Item`, `Orders`) remain accessible on desktop / large screen devices (`hidden lg:flex`).

3. **Layout Padding Alignment (`app/layout.tsx`)**:
   - Ensure page container bottom padding is dynamic or cleanly handled so unauthenticated screens do not leave extra whitespace at the bottom.

## Implementation Files
- `components/shared/bottom-nav.tsx`
- `components/shared/navbar.tsx`

## Acceptance Criteria
- When signed out on the welcome screen:
  - No bottom navigation bar is visible on mobile devices.
  - No hamburger menu button or dropdown menu drawer is visible on mobile devices.
  - Navigation links remain visible on desktop/large screens (`lg:` breakpoint).
- When signed in on the dashboard / app:
  - Bottom navigation bar appears cleanly on mobile devices.

## Verification Steps
1. Run `cmd /c npm run typecheck`
2. Run `cmd /c npm run lint`
3. Test unauthenticated welcome screen on mobile and desktop viewports.
4. Test authenticated dashboard screen on mobile and desktop viewports.
