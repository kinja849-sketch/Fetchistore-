# Implementation Prompt: Install Clerk Auth Skill and Update AGENTS.md

## Goal
1. Create a dedicated skill file `.agents/skills/clerk/SKILL.md` documenting Clerk Auth (`@clerk/nextjs`) architecture, middleware, Server/Client components usage, authentication hooks, and Supabase user synchronization.
2. Update `AGENTS.md` to:
   - Include `.agents/skills/clerk` under Section 3 ("Skills the AI must have").
   - Explicitly enforce the mandatory rule: **Never push anything to GitHub unless reviewed and approved by the human user**.
   - Explicitly enforce the mandatory rule: **Before finalizing code changes, make sure to run CodeRabbit and/or quality checks (typecheck & lint) to verify there are no issues with the code**.

## Skills Read
- `.agents/skills/ui-design/SKILL.md`
- `AGENTS.md`

## Files to Create / Modify
- `[NEW]` `.agents/skills/clerk/SKILL.md`
- `[MODIFY]` `AGENTS.md`

## Implementation Requirements

### 1. `.agents/skills/clerk/SKILL.md`
Create `.agents/skills/clerk/SKILL.md` with:
- Standard YAML frontmatter (`name: clerk`, `description`).
- Overview of `@clerk/nextjs` usage in Next.js App Router.
- Setup instructions (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`).
- Middleware configuration using `clerkMiddleware()` and route protection.
- Server & Client Auth helpers (`auth()`, `currentUser()`, `useUser()`, `useAuth()`).
- Syncing Clerk user identities with Supabase Postgres `profiles` table.
- Guidance on GitHub push restrictions and CodeRabbit quality check process.

### 2. `AGENTS.md`
- Add `.agents/skills/clerk` into the Section 3 table:
  `| .agents/skills/clerk | Clerk Auth integration (@clerk/nextjs), middleware, user sessions, Supabase sync |`
- Add explicit section/rule:
  - **GitHub Push Policy:** Never push code to GitHub without explicit review and approval from the user.
  - **CodeRabbit & Code Verification:** Run CodeRabbit / typecheck / lint checks before completing code changes to ensure high quality and zero defects.

## Acceptance Criteria
- `.agents/skills/clerk/SKILL.md` exists and is structured properly.
- `AGENTS.md` reflects `.agents/skills/clerk` in section 3.
- `AGENTS.md` reflects GitHub push restriction and CodeRabbit verification requirement.
- `npm run typecheck` passes without errors.

## Test Steps
1. Verify `.agents/skills/clerk/SKILL.md` is present.
2. Verify `AGENTS.md` contains the Clerk skill and updated safety rules.
3. Run `npm run typecheck` and `npm run lint`.
