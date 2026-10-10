# Feature Specification: Doit Goal Tracker — Initial Page Setup

**Feature Branch**: `[001-doit-goal-tracker]`

**Created**: 2026-10-09

**Status**: Draft

**Input**: User description: "initial page setup- this application should be goal tracking web app called 'doit'. there should be two clumns - a left one where current goals are shown, along with how many days left the user has to achieve the goal , and a right one where completed goals are. each goal can be 'checked' using a checkbox, and then either moved to the completed column or permanently deleted. to add new goals a user can click on a button to open a new goal form in a model( title and end dtae fields). goals reching their end date (within 3 days ) are highlighted . Lets user a modern light theme with fun pastel colurs."

## Clarifications

### Session 2026-10-09

- Q: Where should goals be stored so they persist across a page reload? → A: Browser-only storage (localStorage), no accounts, no server, no cross-device sync
- Q: In what order should goals be displayed within each column? → A: Soonest deadline first (active); most recently completed first (completed)
- Q: Should users be able to edit a goal's title or end date after it's created? → A: No editing — delete and re-add to change a goal

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View active and completed goals at a glance (Priority: P1)

A user opens "doit" and sees their goals organized into two columns: active goals on the
left (each showing how many days remain until its deadline, with goals due soon visually
highlighted) and completed goals on the right.

**Why this priority**: This is the core value of the app — without a clear, at-a-glance view
of what's active, what's urgent, and what's done, the rest of the app has nothing to display.
This alone is a viable read-only MVP.

**Independent Test**: Can be fully tested by loading the page with a mix of active and
completed goals (including one due within 3 days) and confirming the correct column
placement, day counts, and highlighting without using any other feature.

**Acceptance Scenarios**:

1. **Given** an active goal with an end date 10 days away, **When** the page loads, **Then** it
   appears in the left column showing "10 days left" and is not highlighted.
2. **Given** an active goal with an end date 2 days away, **When** the page loads, **Then** it
   appears in the left column and is visually highlighted as due soon.
3. **Given** a goal marked complete, **When** the page loads, **Then** it appears in the right
   column and does not show a days-remaining count.
4. **Given** no goals exist in a column, **When** the page loads, **Then** that column shows an
   empty-state message instead of appearing broken or blank.

---

### User Story 2 - Add a new goal (Priority: P2)

A user clicks an "Add Goal" button, a modal opens with a form containing a title field and an
end date field, and submitting valid data adds the goal to the active column.

**Why this priority**: Without the ability to add goals, the board can never grow past
whatever initial data it ships with — this is the primary way users create value in the app.

**Independent Test**: Can be fully tested by clicking the add button, filling in a title and
end date, submitting, and confirming the new goal appears in the active column with the
correct days-left count.

**Acceptance Scenarios**:

1. **Given** the user clicks "Add Goal", **When** the modal opens, **Then** it shows a title
   field and an end date field and no other required fields.
2. **Given** the modal is open with a title and a future end date entered, **When** the user
   submits, **Then** the modal closes and the new goal appears in the active column.
3. **Given** the modal is open with the title left empty or the end date left empty, **When**
   the user attempts to submit, **Then** the system shows a validation message and does not
   create the goal.

---

### User Story 3 - Mark a goal complete (Priority: P3)

A user checks the checkbox on an active goal, and it moves from the active column to the
completed column.

**Why this priority**: Marking progress is the second core loop of a goal tracker, but it
depends on goals already existing (P1/P2), so it is ordered after them.

**Independent Test**: Can be fully tested by checking the checkbox on an existing active goal
and confirming it now appears in the completed column and no longer in the active column.

**Acceptance Scenarios**:

1. **Given** an active goal, **When** the user checks its checkbox, **Then** the goal
   immediately moves to the completed column.
2. **Given** a goal has just moved to the completed column, **When** the user reloads the
   page, **Then** the goal still appears in the completed column.

---

### User Story 4 - Permanently delete a goal (Priority: P4)

A user removes a goal they no longer want to track — whether active or completed — using an
explicit delete control, independent of the completion checkbox.

**Why this priority**: Cleanup is valuable but not required for the app to deliver its core
tracking value, so it is the lowest priority of the four.

**Independent Test**: Can be fully tested by triggering delete on a goal in either column,
confirming the deletion, and verifying the goal no longer appears anywhere on the board.

**Acceptance Scenarios**:

1. **Given** a goal in either column, **When** the user triggers its delete control, **Then**
   the system asks for confirmation before removing anything.
2. **Given** the user confirms deletion, **When** the confirmation is accepted, **Then** the
   goal is permanently removed from the board and does not reappear after a page reload.
3. **Given** the user is asked to confirm deletion, **When** the user cancels, **Then** the
   goal remains unchanged in its current column.

---

### Edge Cases

- What happens when a goal's end date has already passed without being checked complete? It
  remains visible in the active column (not auto-completed or auto-deleted) and is treated as
  due-soon/highlighted, since it is at least as urgent as a goal with 3 or fewer days left.
- How does the system handle a goal whose end date is today? It is treated as within the
  3-day highlight window and displays a "due today" style days-left indicator.
- How does the system handle an empty board (no goals at all)? Both columns show an
  empty-state message.
- How does the system handle very long goal titles? Titles wrap or truncate within the goal
  card rather than breaking the column layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display active (not completed) goals in a left column and completed
  goals in a right column.
- **FR-002**: For each active goal, system MUST display its title and the number of days
  remaining until its end date.
- **FR-003**: System MUST visually highlight any active goal whose end date is within 3 days
  of the current date, including goals whose end date has already passed.
- **FR-004**: Users MUST be able to open an "Add Goal" modal via a dedicated button.
- **FR-005**: The "Add Goal" modal MUST contain exactly a title field and an end date field.
- **FR-006**: System MUST require a non-empty title and a valid end date before a new goal can
  be saved, and MUST show a validation message when either is missing or invalid.
- **FR-007**: Each goal MUST display a checkbox that, when checked, marks the goal complete and
  moves it from the active column to the completed column.
- **FR-008**: Users MUST be able to permanently delete any goal, in either column, via a
  delete control that is independent of the completion checkbox.
- **FR-009**: System MUST require explicit user confirmation before permanently deleting a
  goal.
- **FR-010**: System MUST persist all goals (title, end date, and completion status) entirely
  within the user's browser (e.g., local storage), with no backend service or user account
  required, so they remain available after the page is reloaded.
- **FR-011**: System MUST show an empty-state message in a column that currently has no goals.
- **FR-012**: The interface MUST use a light color theme with pastel accent colors.
- **FR-013**: Active goals MUST be ordered soonest-end-date-first; completed goals MUST be
  ordered most-recently-completed-first.
- **FR-014**: System MUST NOT provide a control for editing an existing goal's title or end
  date; changing a goal requires deleting it and creating a new one.

### Key Entities

- **Goal**: Represents a single objective the user is tracking. Attributes: title, end date,
  completion status (active or completed), and a created timestamp used for ordering goals
  within a column.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a new goal and see it appear on the board in under 10 seconds,
  with no full-page reload.
- **SC-002**: A user can identify every goal due within 3 days within 2 seconds of viewing the
  page, through visual highlighting alone, without reading each individual date.
- **SC-003**: A user can mark a goal complete and see it move to the completed column in a
  single interaction (one click/tap).
- **SC-004**: 100% of goals (active or completed) remain present and correctly placed after a
  browser refresh in the same session on the same device.
- **SC-005**: The goal board remains fully readable and operable, with no horizontal page
  scrolling, at both a mobile viewport (375px wide) and a desktop viewport (1440px wide).

## Assumptions

- This is a single-user application for this initial version; no login or authentication is
  required.
- Goals are persisted in the user's browser for this phase (no backend/database); syncing
  goals across multiple devices is out of scope.
- "Days left" is the whole number of days between today and the goal's end date. A goal whose
  end date has passed is not auto-completed or auto-deleted — it stays active and highlighted
  until the user checks it complete or deletes it.
- Checking a goal's checkbox is the only way to mark it complete; unchecking a completed goal
  to move it back to active is out of scope for this version.
- There is no limit on the number of goals a user can track.
- Deleting a goal is always a permanent, confirmed action with no undo.
