---

description: "Task list template for feature implementation"
---

# Tasks: Doit Goal Tracker — Initial Page Setup

**Input**: Design documents from `/specs/001-doit-goal-tracker/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/storage-schema.md](./contracts/storage-schema.md), [quickstart.md](./quickstart.md)

**Tests**: No test tasks are included. Constitution Principle V (NON-NEGOTIABLE) prohibits
unit, integration, and e2e tests for this project; verification is via lint, type-check,
and the manual scenarios in `quickstart.md` (see Polish phase).

**Organization**: Tasks are grouped by user story (from spec.md) to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Exact file paths are included in every description

## Path Conventions

Single Next.js App Router project (no `frontend/`/`backend/` split — all state is
client-side `localStorage`, per plan.md):

- `app/` — routing/shell files only (`layout.tsx`, `page.tsx`, `globals.css`)
- `components/` — `ui/` (shadcn primitives) + feature components
- `lib/` — framework-free helpers (`goals.ts`, `date.ts`)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install and configure the dependencies this plan introduces

- [X] T001 Install the `date-fns` dependency (`npm install date-fns`) per research.md
- [X] T002 Initialize shadcn/ui for Tailwind v4 (`npx shadcn@latest init`), confirming it
      creates `components.json` and `lib/utils.ts` and wires its CSS variables into
      `app/globals.css`
- [X] T003 [P] Generate the required shadcn/ui primitives into `components/ui/`
      (`npx shadcn@latest add button input label checkbox dialog alert-dialog`)
- [X] T004 [P] Declare the pastel light theme tokens in `app/globals.css` via an
      `@theme` block (`--color-background`, `--color-surface`, `--color-foreground`,
      `--color-muted-foreground`, `--color-primary`, `--color-accent-pink`,
      `--color-accent-mint`, `--color-accent-peach`, `--color-highlight`), reusing the
      shadcn CSS variable names where they overlap (research.md Decision: Tailwind v4
      `@theme`)

**Checkpoint**: Dependencies installed, shadcn primitives available, pastel tokens defined

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared data/storage layer every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Define the `Goal` type (`id`, `title`, `endDate`, `status`, `createdAt`,
      `completedAt`) and the `loadGoals()`/`saveGoals()` localStorage helpers in
      `lib/goals.ts`, per contracts/storage-schema.md: key `doit.goals.v1`; `loadGoals()`
      MUST fail safe to `[]` (not throw) when the key is missing, not valid JSON, or not
      an array; `saveGoals()` MUST write the whole array back, not a partial patch
- [X] T006 [P] Implement a `getDaysLeft(endDate)` helper and a date formatting helper in
      `lib/date.ts` using `date-fns`'s `differenceInCalendarDays` and `parseISO`/`format`,
      per research.md Decision on date-fns
- [X] T007 Create `components/goal-board.tsx` as a `"use client"` component that calls
      `loadGoals()` once on mount and holds the result in `Goal[]` state (no column
      rendering yet — that begins in User Story 1)
- [X] T008 Render `<GoalBoard />` from `app/page.tsx`

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - View active and completed goals at a glance (Priority: P1) 🎯 MVP

**Goal**: Two columns — active goals (left, soonest-deadline-first, days-left badge,
due-soon/overdue highlight) and completed goals (right, most-recently-completed-first) —
with empty-state messages when a column has no goals.

**Independent Test**: Load the page with a mix of active and completed goals (including
one due within 3 days and one overdue) and confirm correct column placement, sort order,
day counts, and highlighting, without using any other feature.

### Implementation for User Story 1

- [X] T009 [US1] Add `sortActiveGoals` (ascending `endDate`, then ascending `createdAt`
      as tiebreaker) and `sortCompletedGoals` (descending `completedAt`) to
      `lib/goals.ts`, per data-model.md Sort key rules (FR-013)
- [X] T010 [US1] Create `components/goal-card.tsx`: render the goal `title`, and for
      active goals a days-left badge computed via `lib/date.ts`'s `getDaysLeft`, with
      highlight styling when days left is 3 or fewer (including negative/overdue values)
      per FR-003; include the checkbox and delete elements required by FR-007/FR-008 as
      non-functional placeholders (wired up in User Story 3 and User Story 4)
- [X] T011 [US1] Create `components/goal-column.tsx`: accepts a label and a pre-sorted
      `Goal[]`, renders one `GoalCard` per goal, and shows an empty-state message when the
      list is empty (FR-011)
- [X] T012 [US1] Wire `components/goal-board.tsx` to split the loaded goals by `status`,
      sort each half with the T009 helpers, and render two `<GoalColumn>`s — active on the
      left, completed on the right (FR-001, FR-002)
- [X] T013 [US1] Apply the pastel light theme tokens from `app/globals.css` across
      `goal-board.tsx`, `goal-column.tsx`, and `goal-card.tsx`, including a visually
      distinct highlight style for due-soon/overdue cards (FR-003, FR-012)
- [X] T014 [US1] Apply responsive layout classes in `components/goal-board.tsx` so the
      two columns stack vertically below the tablet breakpoint and sit side-by-side above
      it, with no horizontal page scroll (Constitution Principle III, SC-005)

**Checkpoint**: User Story 1 is fully functional and testable independently (seed
`localStorage` manually via DevTools to verify columns/sort/highlight/empty-state)

---

## Phase 4: User Story 2 - Add a new goal (Priority: P2)

**Goal**: An "Add Goal" button opens a modal with a title field and an end date field;
valid submissions create a new active goal immediately, invalid ones show a validation
message.

**Independent Test**: Click the add button, fill in a title and end date, submit, and
confirm the new goal appears in the active column with the correct days-left count.

### Implementation for User Story 2

- [X] T015 [US2] Add `createGoal(title, endDate)` to `lib/goals.ts`: trims and requires a
      non-empty `title` and a valid `endDate` (FR-006), generating `id` via
      `crypto.randomUUID()`, `status: "active"`, `createdAt` = now, `completedAt: null`
      (data-model.md Goal fields)
- [X] T016 [US2] Create `components/add-goal-dialog.tsx` using the shadcn `Dialog`,
      `Input`, `Label`, and `Button` primitives: a form with exactly a title field and an
      end date field (FR-005) that shows a validation message and blocks submit when
      either field is empty or the date is invalid (FR-006)
- [X] T017 [US2] Add an "Add Goal" trigger button and `<AddGoalDialog>` to
      `components/goal-board.tsx`; on valid submit, call `createGoal`, persist the
      updated array via `saveGoals`, and insert the new goal into state so it appears
      immediately in the active column with no full page reload (FR-004, FR-010, SC-001)

**Checkpoint**: User Stories 1 AND 2 both work independently

---

## Phase 5: User Story 3 - Mark a goal complete (Priority: P3)

**Goal**: Checking a goal's checkbox marks it complete and moves it from the active
column to the completed column.

**Independent Test**: Check the checkbox on an existing active goal and confirm it now
appears in the completed column (and no longer in the active column), including after a
page reload.

### Implementation for User Story 3

- [X] T018 [US3] Add `completeGoal(goals, id)` to `lib/goals.ts`: sets the matching
      goal's `status` to `"completed"` and `completedAt` to the current ISO timestamp
      (FR-007; data-model.md `active --> completed` transition)
- [X] T019 [US3] Wire the checkbox element in `components/goal-card.tsx` to call an
      `onComplete(id)` callback prop instead of being a static placeholder
- [X] T020 [US3] Implement `onComplete` in `components/goal-board.tsx`: call
      `completeGoal`, persist via `saveGoals`, and update state so the goal moves from
      the active column to the completed column in a single interaction (FR-007, SC-003)

**Checkpoint**: User Stories 1, 2 AND 3 all work independently

---

## Phase 6: User Story 4 - Permanently delete a goal (Priority: P4)

**Goal**: A delete control on any goal (active or completed), independent of the
completion checkbox, permanently removes it after explicit confirmation.

**Independent Test**: Trigger delete on a goal in either column; cancel confirms no
change; confirm removes it permanently (verified by reloading the page).

### Implementation for User Story 4

- [X] T021 [US4] Add `deleteGoal(goals, id)` to `lib/goals.ts`: returns the array with
      the matching goal permanently removed (FR-008)
- [X] T022 [US4] Create `components/delete-goal-dialog.tsx` using the shadcn
      `AlertDialog` primitive to confirm or cancel a pending deletion (FR-009)
- [X] T023 [US4] Wire the delete element in `components/goal-card.tsx` to open the T022
      confirmation, independent of the completion checkbox, for goals in either column
      (FR-008)
- [X] T024 [US4] Implement the confirmed-delete handler in `components/goal-board.tsx`:
      on confirm, call `deleteGoal`, persist via `saveGoals`, and remove the goal from
      state; on cancel, leave the goal unchanged (FR-008, FR-009)

**Checkpoint**: All four user stories are independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all user stories (replaces automated tests, per
Constitution Principle V)

- [X] T025 [P] Update the `title`/`description` metadata in `app/layout.tsx` to reflect
      the "doit" goal tracker branding
- [X] T026 Execute all 10 manual validation scenarios in `quickstart.md` end-to-end
      across all four user stories
- [X] T027 Run `npm run lint` and resolve any reported issues (Constitution Development
      Workflow gate)
- [X] T028 Run `npx tsc --noEmit` and resolve any type errors (Constitution Development
      Workflow gate)
- [X] T029 [P] Manually verify the full board at a 375px-wide and a 1440px-wide viewport
      per quickstart.md scenario 9 (Constitution Principle III, SC-005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (T002 before T003; T005 before T007) —
  BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational (Phase 2) completion
  - US1 has no dependency on US2/US3/US4
  - US2 depends on US1's `goal-board.tsx` column rendering (T012) existing, so the new
    goal has somewhere to appear, but adds no changes to US1's files
  - US3 depends on US1's `goal-card.tsx` checkbox element (T010) existing to wire into
  - US4 depends on US1's `goal-card.tsx` delete element (T010) existing to wire into
  - Recommended order given these soft dependencies: US1 → US2 → US3 → US4 (matches
    priority order)
- **Polish (Phase 7)**: Depends on all four user stories being complete

### Within Each User Story

- `lib/goals.ts` helper added before the component that calls it
- Static UI element (US1) before the story that wires its behavior (US3 checkbox, US4
  delete control)
- Story complete and checkpoint-verified before moving to the next priority

### Parallel Opportunities

- T003 and T004 (Setup) can run in parallel once T002 completes — different files
- T005 and T006 (Foundational) can run in parallel — different files (`lib/goals.ts` vs
  `lib/date.ts`)
- T025 and T029 (Polish) can run in parallel with each other and with T026-T028
- Within a single user story, tasks touch shared files (`goal-board.tsx`, `goal-card.tsx`,
  `goals.ts`) in sequence and are not marked `[P]`

---

## Parallel Example: Setup & Foundational

```bash
# After T002 (shadcn init) completes, run T003 and T004 together:
Task: "Generate shadcn/ui primitives into components/ui/"
Task: "Declare pastel light theme tokens in app/globals.css via @theme"

# Foundational phase, run T005 and T006 together:
Task: "Define Goal type and loadGoals()/saveGoals() in lib/goals.ts"
Task: "Implement getDaysLeft() and date formatting in lib/date.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Seed `localStorage` manually and confirm columns, sort order,
   days-left, highlighting, and empty states all match spec.md User Story 1 acceptance
   scenarios
5. Demo if ready — this alone is a viable read-only goal board

### Incremental Delivery

1. Setup + Foundational → data/storage layer ready
2. Add User Story 1 → validate independently → MVP demo-able
3. Add User Story 2 → validate independently → users can now grow the board
4. Add User Story 3 → validate independently → users can mark progress
5. Add User Story 4 → validate independently → users can clean up
6. Phase 7 Polish → run full quickstart.md pass, lint, and type-check before calling the
   feature done

---

## Notes

- `[P]` tasks = different files, no dependencies on other `[P]` tasks in the same group
- `[Story]` label maps each task to its user story for traceability
- No test tasks are included anywhere in this file — Constitution Principle V is
  NON-NEGOTIABLE for this project
- Commit after each task or logical group
