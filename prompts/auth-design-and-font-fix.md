# Implementation Prompt — Auth UI Typography, Character Proportions & Spacing Fix

Restore exact design proportions, typography, and spacing for Sign-In and Sign-Up screens (`components/auth/clerk-auth-form.tsx`) to match the user's reference designs.

---

## 1. Executive Summary & Design Restoration

1. **Character Illustration Proportions**:
   - Remove unnatural squishing/stretching (`h-[140px]`).
   - Restore natural 3D character aspect ratio (`h-[220px] sm:h-[260px] w-full relative mb-3`).

2. **Typography & Brand Font**:
   - Restore "Fetchistore" brand heading to `font-serif` (`text-3xl sm:text-4xl font-extrabold text-[#56642B] tracking-tight font-serif`).
   - "Create Your Account" / "Welcome Back" in `font-sans text-2xl sm:text-3xl font-extrabold text-[#2C302E] mt-1.5`.

3. **Input & Button Spacing**:
   - Restore comfortable padding and smooth `rounded-2xl` corners on inputs (`py-3.5 px-4 bg-white border border-[#E3DEC3]`).
   - Restore primary CTA button (`bg-[#56642B] py-3.5 text-sm sm:text-base font-bold rounded-2xl`).
   - Restore clean Google SSO button (`bg-white py-3 border border-[#E3DEC3] rounded-2xl`).
   - Restore `#A65B32` highlighted links for "Sign In", "Create an account", and "Terms & Privacy".

---

## 2. File Changes

### `components/auth/clerk-auth-form.tsx`
- Revert forced container squishing (`h-[100dvh]` hard clamp).
- Restore character image proportions (`h-[220px] sm:h-[260px]`).
- Restore `font-serif` for "Fetchistore".
- Increase input field padding to `py-3.5 px-4 rounded-2xl`.

---

## 3. Verification Criteria

1. On `/sign-in` and `/sign-up`:
   - "Fetchistore" displays in serif typography (`font-serif text-[#56642B]`).
   - Character illustration renders without stretching or squishing.
   - Spacing between fields, buttons, and text is balanced and matches `media_1787470012633.png`.
2. `npm run typecheck` and `npm run lint` pass with 0 errors.
