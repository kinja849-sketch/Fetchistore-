# Implementation Prompt — CodeRabbit Audit Fixes & Quality Improvements

Implement CodeRabbit code quality, typography alignment, UX recovery, and performance optimization suggestions across the codebase.

---

## 1. Executive Summary & CodeRabbit Suggestions

1. **CTA Link Target Alignment (`components/home/unauthenticated-welcome.tsx` & `hero-section.tsx`)**:
   - Update the "Get Started" CTA buttons to link to `/sign-up` (account creation flow) instead of `/sign-in`.

2. **Typography Token Conformance (`components/auth/clerk-auth-form.tsx`)**:
   - Update the "Fetchistore" brand heading to use `font-sans` (Manrope) with `font-bold` (700) instead of `font-serif`, strictly matching the design system rules in `AGENTS.md` and `ui-design` skill.

3. **Verification Recovery UX Controls (`components/auth/clerk-auth-form.tsx`)**:
   - Add "Use another email" action to reset `pendingVerification` state so users can correct mistyped emails.
   - Add "Resend code" action calling `clerk.client.signUp.prepareEmailAddressVerification({ strategy: "email_code" })`.

4. **Google Map Markers Memoization (`app/orders/[id]/page.tsx`)**:
   - Wrap GoogleMap marker array construction in `useMemo` to preserve reference stability across chat re-renders.

5. **SSO Callback Error Retention (`app/(auth)/sso-callback/page.tsx`)**:
   - Preserve error messages on the callback page with a retry button instead of redirecting immediately on error.

---

## 2. File Changes

### A. `components/home/unauthenticated-welcome.tsx` & `components/home/hero-section.tsx`
- Change `<Link href="/sign-in" ...> Get Started </Link>` to `<Link href="/sign-up" ...> Get Started </Link>`.

### B. `components/auth/clerk-auth-form.tsx`
- Change `font-serif` on "Fetchistore" heading to `font-sans font-bold`.
- In `pendingVerification` view, add:
  - "Resend verification code" button.
  - "Use another email address" button (`setPendingVerification(false)`).

### C. `app/orders/[id]/page.tsx`
- Memoize map markers using `useMemo`.

### D. `app/(auth)/sso-callback/page.tsx`
- Display error state cleanly with a "Return to Sign In" retry link when SSO authentication fails.

---

## 3. Acceptance & Verification Criteria

1. "Get Started" button on onboarding page navigates directly to `/sign-up`.
2. Auth form heading uses Manrope (`font-sans font-bold`).
3. Email code verification view provides "Resend code" and "Change email" actions.
4. `npm run typecheck` and `npm run lint` pass with 0 errors.
