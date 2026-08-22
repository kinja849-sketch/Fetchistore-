# Implementation Prompt: Clerk Authentication UI Redesign

## Goal
Redesign Fetchistore's authentication experience (Sign In & Sign Up) to match the provided high-fidelity luxury fashion mockups while maintaining 100% Clerk authentication logic (`@clerk/nextjs`).

---

## Skills Read
- `.agents/skills/clerk/SKILL.md`: Clerk Auth integration standards, hooks (`useSignIn`, `useSignUp`), session handling, Supabase sync.
- `.agents/skills/ui-design/SKILL.md`: Clarkson structure & NovaTrend visual language (colors, radii, typography, soft minimalism).

---

## Code Inspected
- `app/layout.tsx`: Root layout wrapping application with `<ClerkProvider>`.
- `middleware.ts`: Clerk middleware configuration.
- `components/shared/navbar.tsx`: Sign In / Sign Up triggers and UserButton integration.
- `components/auth/auth-modal.tsx`: Existing modal component.
- `lib/supabase/auth-context.tsx`: Context sync helpers.

---

## Key Decisions & Architecture

1. **Clerk Authentication Logic (`@clerk/nextjs`)**:
   - Use Clerk's `useSignIn()` and `useSignUp()` client hooks for custom form state management, validation, password visibility, error handling, email code verification (if required), and Google OAuth redirection (`signIn.authenticateWithRedirect({ strategy: 'oauth_google' })`).
   - Preserve existing ClerkProvider and middleware configuration in `app/layout.tsx` and `middleware.ts`.

2. **UI Design Specification (Matching Reference Images)**:
   - **Background & Container**: Earthy soft background `#FBF9F8`, centered responsive card container (`max-w-md` / `max-w-lg`).
   - **Hero Visual Art**: Copy hero artwork graphics from uploaded reference images into `public/images/auth/sign-in-hero.jpg` and `public/images/auth/sign-up-hero.jpg`.
   - **Branding Header**:
     - Olive green leaf logo icon (`#56642b`).
     - "Fetchistore" serif title styling.
     - Bold headline ("Welcome Back" / "Create Your Account").
     - Subtitle text ("Sign in to continue your style journey." / "Join our community for exclusive style, early access and personal edits.").
   - **Inputs**:
     - Email: Mail icon, placeholder "Email", rounded border (`rounded-2xl` / `rounded-xl`).
     - Password: Lock icon, placeholder "Password", Eye / EyeOff toggle icon.
     - "Forgot password?" link on Sign In.
   - **Buttons & Dividers**:
     - Primary button: Olive green `#56642b` pill/rounded button, white text ("Sign In" / "Create Account").
     - Divider line with "or continue with" (Sign In) / "or" (Sign Up).
     - Google OAuth button: White background with Google multicolor logo and outline border.
   - **Footers & Switching**:
     - Toggle links between Sign In and Sign Up screens ("Don't have an account? Create an account" / "Already have an account? Sign In").
     - Terms & Privacy footer links on Sign Up screen.

3. **Routes & Components**:
   - Create `app/(auth)/sign-in/[[...sign-in]]/page.tsx` for dedicated Sign In page.
   - Create `app/(auth)/sign-up/[[...sign-up]]/page.tsx` for dedicated Sign Up page.
   - Create `app/(auth)/sso-callback/page.tsx` for SSO OAuth callback handler page.
   - Create `components/auth/clerk-auth-form.tsx` as reusable auth component supporting both modal and page views with seamless tab switching.
   - Update `components/shared/navbar.tsx` to link to custom auth screens or open the redesigned modal.

---

## Files to Create / Modify

- `public/images/auth/sign-in-hero.jpg` [NEW]: Sign In hero illustration artwork.
- `public/images/auth/sign-up-hero.jpg` [NEW]: Sign Up hero illustration artwork.
- `components/auth/clerk-auth-form.tsx` [NEW]: Custom Clerk Auth component with full design matching reference images.
- `app/(auth)/sign-in/[[...sign-in]]/page.tsx` [NEW]: Dedicated Sign In page route.
- `app/(auth)/sign-up/[[...sign-up]]/page.tsx` [NEW]: Dedicated Sign Up page route.
- `app/(auth)/sso-callback/page.tsx` [NEW]: SSO OAuth callback handler page for Clerk.
- `components/shared/navbar.tsx` [MODIFY]: Update nav buttons to trigger custom Clerk auth flow.

---

## Security & Compliance
- No secrets exposed in browser.
- Clerk handles all authentication token generation and security.
- Input validation with user-friendly error messages.

---

## Acceptance Criteria
- [ ] Sign In screen matches `media_1787409287461.jpg` visually (hero image, logo, typography, inputs, buttons, colors).
- [ ] Sign Up screen matches `media_1787409287465.jpg` visually (hero image, logo, typography, inputs, buttons, colors).
- [ ] Email/Password sign-in and sign-up functional via Clerk `useSignIn` & `useSignUp`.
- [ ] Google OAuth single sign-on functional via Clerk.
- [ ] Password eye toggle works.
- [ ] Switching between Sign In and Sign Up tabs/links works seamlessly.
- [ ] `npm run typecheck` and `npm run lint` pass without errors.

---

## Verification & Test Steps
1. Run `npm run typecheck` to verify no TypeScript compilation errors.
2. Run `npm run dev`.
3. Open `http://localhost:3000/sign-in` -> verify exact visual alignment with Sign In image mockup.
4. Open `http://localhost:3000/sign-up` -> verify exact visual alignment with Sign Up image mockup.
5. Test sign in and sign up form submissions and Google OAuth button.
