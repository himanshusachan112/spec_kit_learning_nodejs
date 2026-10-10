# Phase 0 Research: Doit Goal Tracker — Initial Page Setup

All Technical Context items were specified by the project owner or the constitution;
no `NEEDS CLARIFICATION` markers remain. This document records the resulting decisions.

## Decision: Tailwind CSS v4 `@theme` for the pastel light palette

- **Decision**: Declare the color palette as CSS custom properties inside an `@theme`
  block in `app/globals.css` (e.g., `--color-background`, `--color-surface`,
  `--color-primary`, `--color-accent-pink`, `--color-accent-mint`,
  `--color-accent-peach`, `--color-highlight`, `--color-foreground`,
  `--color-muted-foreground`), rather than a `tailwind.config.js` theme object.
- **Rationale**: Tailwind CSS v4 (installed per `package.json`) is CSS-first — themes
  are authored directly in CSS via `@theme`, which generates matching utility classes
  (e.g., `bg-accent-mint`) automatically. This repo already uses the v4 single-line
  `@import "tailwindcss";` in `app/globals.css` with no `tailwind.config.js` present,
  confirming the CSS-first setup. Defining tokens here also lets shadcn/ui components
  (which read `--background`, `--foreground`, `--primary`, etc.) inherit the same
  pastel palette for free.
- **Alternatives considered**: A `tailwind.config.js` `theme.extend.colors` object —
  rejected because it fights the v4 CSS-first convention already in place and would
  require adding a config file the project doesn't currently have.

## Decision: shadcn/ui for Dialog, Checkbox, Button, Input, Label, AlertDialog

- **Decision**: Use the shadcn/ui CLI to generate owned component source under
  `components/ui/` for: `button`, `input`, `label`, `checkbox`, `dialog` (Add Goal
  form), and `alert-dialog` (delete confirmation). Configure shadcn via its Tailwind
  v4 support, pointing its CSS variables at the `@theme` tokens above.
- **Rationale**: These are exactly the primitives the spec requires (FR-004/005 modal
  form, FR-007 checkbox, FR-008/009 confirmed delete), and shadcn/ui ships them as
  Radix UI-backed, accessible-by-default, copy-into-repo source rather than an opaque
  npm dependency — keeping them reviewable and consistent with Constitution Principle
  I (Clean Code).
- **Alternatives considered**: Hand-rolled `<dialog>`/custom checkbox markup — rejected
  because correct focus-trapping, ESC-to-close, and ARIA roles are easy to get subtly
  wrong and shadcn/ui already solves this; a heavier full component library (e.g., MUI)
  — rejected as excessive for 5 primitives and in tension with Principle IV.

## Decision: `date-fns` for days-left calculation and date formatting

- **Decision**: Use `date-fns`'s `differenceInCalendarDays` to compute days remaining
  between "today" and a goal's `endDate`, and `format`/`parseISO` for rendering and
  parsing the end-date value.
- **Rationale**: `differenceInCalendarDays` compares calendar dates (not 24-hour
  periods), which avoids off-by-one errors from time-of-day or DST when a goal is due
  "today" or "in 3 days" (FR-002, FR-003). `date-fns` is tree-shakeable — only the
  functions imported are bundled.
- **Alternatives considered**: Raw `Date` subtraction divided by `86400000` — rejected
  because it is sensitive to DST transitions and local time-of-day, which could show
  an incorrect day count right at the 3-day highlight boundary (directly affecting
  SC-002).

## Decision: `localStorage` persistence shape

- **Decision**: Persist all goals as a single JSON array under one versioned key
  (`doit.goals.v1`) via a small `lib/goals.ts` read/write helper; read once on mount
  inside a `"use client"` component (per Next.js's Client Component guidance, since
  `localStorage` is a browser-only API) and write on every mutation.
- **Rationale**: A single key keeps the schema simple (Principle I) and the `v1` suffix
  gives a future migration seam without adding a migration framework now (Principle
  IV). Reading only in a Client Component avoids any server/client mismatch, since
  `localStorage` does not exist during server rendering.
- **Alternatives considered**: One `localStorage` key per goal — rejected as harder to
  keep ordered/sorted and more code for no benefit at this scale (tens to hundreds of
  goals, per spec Assumptions).

## Decision: No automated tests

- **Decision**: No unit, integration, or e2e tests, and no test runner configuration,
  are added anywhere in this feature's plan or tasks.
- **Rationale**: Constitution Principle V is explicit and NON-NEGOTIABLE. Verification
  is via TypeScript compilation, `eslint`, and the manual scenarios in `quickstart.md`.
- **Alternatives considered**: N/A — this is a hard constraint, not a tradeoff.
