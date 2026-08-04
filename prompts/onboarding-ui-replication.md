# Implementation Prompt: Replicate Onboarding UI Design Exactly

## Goal
Replicate the exact UI styling, layout, typography, colors, CTA button positioning, and Bento grid design of the Onboarding screen from the reference file `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\onboarding\code.html` into `components/home/hero-section.tsx` (and `unauthenticated-welcome.tsx`).

## Skills Read
- `.agents/skills/ui-design` (Clarkson structure + NovaTrend visual language)

## Code Inspected
- `c:\Users\acer\Desktop\Fetchistore ui\stitch_fetchistore_proximity_marketplace\onboarding\code.html`
- `components/home/hero-section.tsx`
- `components/home/unauthenticated-welcome.tsx`
- `app/globals.css`

## Key Design Decisions & Changes to Replicate

1. **Layout & Flex Direction (`components/home/hero-section.tsx`)**:
   - Change main flex wrapper from `flex-col-reverse md:flex-row` to `flex-col md:flex-row items-center gap-6 lg:gap-12 z-10`.
   - On mobile, the Bento grid appears on top and Content & Actions appear below, matching `code.html`.

2. **Bento Grid Imagery Collage**:
   - Clean up Bento items to match `code.html`:
     - Bento Item 1: High quality living room image (`https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop`), `rounded-2xl md:rounded-3xl`, clean image zoom hover without extra intrusive overlay cards.
     - Bento Item 2: Sustainable linen image (`https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop`), `rounded-2xl md:rounded-3xl`.
     - Bento Item 3: Handmade ceramic ceramics image (`https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop`), `rounded-2xl md:rounded-3xl`.
   - Smooth `group-hover:scale-105 transition-transform duration-700` micro-animations on all bento tiles.

3. **Typography & Heading**:
   - Title: `Modern Craftsmanship, Near You.`
   - Font classes: `text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1B1C1C]`
   - Body subtitle: `Discover and sell premium new and second-hand goods with local delivery and live tracking.` (`text-[#46483C] text-base md:text-lg max-w-lg`)

4. **Call To Action (CTA) Buttons Positioning & Styling**:
   - Stack CTA buttons vertically: `w-full flex flex-col items-center md:items-start space-y-3 pt-3`
   - **Primary Action Button ("Get Started")**:
     - Class: `w-full max-w-xs md:max-w-sm bg-[#8A9A5B] text-[#253000] font-semibold text-sm py-4 px-8 rounded-full hover:bg-[#929677] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer`
     - Wrapped in Clerk `<SignUpButton mode="modal">`.
     - Features `ArrowRight` icon.
   - **Secondary Action Button ("Already have an account? Sign In")**:
     - Class: `w-full max-w-xs md:max-w-sm text-[#46483C] font-semibold text-sm py-3 px-8 rounded-full hover:bg-[#F6F3F2] transition-colors duration-200 cursor-pointer`
     - Wrapped in Clerk `<SignInButton mode="modal">`.

5. **Ambient Background & Container Spacing**:
   - Ambient gradient blur spots: `bg-[#8A9A5B]/10 blur-[100px]` and `bg-[#929677]/15 blur-[100px]`.
   - Max container width: `max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10`.

## Implementation Files
- `components/home/hero-section.tsx`
- `app/globals.css` (if any bento tweaks are needed)

## Acceptance Criteria
- Onboarding hero visually matches `code.html` exactly.
- CTA buttons are stacked vertically (`Get Started` on top, `Already have an account? Sign In` below).
- Layout flow on mobile places Bento grid first, then Content & Actions below.
- Smooth animations and responsive layout.

## Verification Steps
1. Run `npm run typecheck`
2. Run `npm run lint`
3. Inspect `http://localhost:3000` on mobile and desktop viewports.
