# Contract: `localStorage` Goal Storage Schema

This app has no backend API; its only persistence "contract" is the `localStorage`
JSON shape read and written by `lib/goals.ts`. This document is the source of truth
for that shape so the storage logic and UI components agree on it.

## Key

```text
doit.goals.v1
```

The `v1` suffix is a schema-version seam: a future breaking change to this shape
should introduce `doit.goals.v2` and a one-time migration, rather than mutating `v1`
in place.

## Value shape

A JSON-encoded array of `Goal` objects (see [data-model.md](../data-model.md)):

```json
[
  {
    "id": "b3b2a9c0-...-uuid",
    "title": "Run a 5k",
    "endDate": "2026-10-20",
    "status": "active",
    "createdAt": "2026-10-10T09:15:00.000Z",
    "completedAt": null
  },
  {
    "id": "9f1e2d3c-...-uuid",
    "title": "Read 'Atomic Habits'",
    "endDate": "2026-09-30",
    "status": "completed",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "completedAt": "2026-09-28T18:42:11.000Z"
  }
]
```

## Read/write contract

- **Read**: On mount (Client Component only), read the key; if missing, treat as `[]`.
  If present but not valid JSON or not an array, treat as `[]` (fail safe rather than
  crash the board) and log a console warning — do not throw.
- **Write**: After every mutation (add, complete, delete), serialize the full updated
  array back to the same key. Writes are whole-array replacements, not partial patches.
- **No cross-tab sync requirement**: Reacting to `storage` events from other tabs is
  out of scope for this feature (single-device, single-tab usage assumed per spec
  Assumptions).

## Consumers

- `components/goal-board.tsx` — owns the in-memory `Goal[]` state, calls the read
  helper once on mount and the write helper after every mutation.
- `components/goal-column.tsx`, `components/goal-card.tsx` — read-only consumers of
  the already-loaded, already-sorted `Goal[]` passed down as props.
- `components/add-goal-dialog.tsx` — produces a new `Goal` object (via the creation
  helper in `lib/goals.ts`) that `goal-board.tsx` appends and persists.
