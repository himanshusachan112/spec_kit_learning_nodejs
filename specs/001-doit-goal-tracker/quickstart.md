# Quickstart: Doit Goal Tracker — Initial Page Setup

Manual validation guide for this feature. No automated tests exist for this project
(Constitution Principle V) — these steps are the verification gate.

## Prerequisites

- Node.js version compatible with Next.js 16.4.0 / React 19.3.0 (per `package.json`)
- Dependencies installed, including the additions from this plan: shadcn/ui-generated
  primitives under `components/ui/` and `date-fns`

## Setup

```powershell
npm install
npm run dev
```

Open the app at the URL printed by `next dev` (default `http://localhost:3000`).

## Validation scenarios

Run these in order against a fresh browser profile (or after clearing the
`doit.goals.v1` `localStorage` key via DevTools) so the board starts empty.

1. **Empty state** (FR-011)
   - Load the page with no goals.
   - Expect: both columns show an empty-state message, no layout breakage.

2. **Add a goal** (User Story 2 / FR-004, FR-005, FR-006)
   - Click "Add Goal". Expect a modal with exactly a title field and an end date field.
   - Submit with an empty title and/or empty end date. Expect a validation message and
     no goal created.
   - Submit with a title and an end date 10 days from today. Expect the modal to close
     and the goal to appear in the left (active) column showing "10 days left", not
     highlighted.

3. **Due-soon highlighting** (FR-003, SC-002)
   - Add a goal with an end date 2 days from today. Expect it highlighted in the active
     column.
   - Add a goal with an end date in the past. Expect it to remain in the active column,
     also highlighted (overdue counts as due-soon per spec Edge Cases).

4. **Sort order** (FR-013)
   - With at least two active goals at different end dates, expect the soonest end
     date listed first in the active column.

5. **Complete a goal** (User Story 3 / FR-007)
   - Check the checkbox on an active goal. Expect it to move immediately to the
     completed (right) column.
   - Reload the page. Expect the goal still listed under completed.

6. **Delete a goal** (User Story 4 / FR-008, FR-009)
   - Trigger delete on a goal in either column. Expect a confirmation step.
   - Cancel the confirmation. Expect the goal unchanged.
   - Confirm the deletion. Expect the goal removed from the board; reload the page and
     confirm it does not reappear.

7. **No edit control** (FR-014)
   - Confirm there is no UI affordance to change an existing goal's title or end date.

8. **Persistence across reload** (FR-010, SC-004)
   - With a mix of active and completed goals present, reload the page. Expect 100% of
     goals to reappear in their correct column, correctly sorted.

9. **Responsive layout** (Principle III, SC-005)
   - Resize the browser (or use DevTools device toolbar) to 375px wide: expect the two
     columns to stack vertically with no horizontal page scrolling.
   - Resize to 1440px wide: expect the two columns to sit side by side, fully usable.

10. **Theme check** (FR-012)
    - Confirm the page uses a light background with pastel accent colors (not a dark
      theme), consistent across the board, modal, and confirmation step.

## Verification gate (replaces automated tests)

- `npm run lint` passes with no errors.
- `npx tsc --noEmit` (or equivalent) compiles with no type errors.
- All 10 scenarios above pass manually at both a mobile-width and a desktop-width
  viewport.
