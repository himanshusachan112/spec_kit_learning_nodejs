<!--
Sync Impact Report
- Version change: (template, unratified) → 1.0.0
- Modified principles: n/a (initial adoption)
- Added sections:
  - Core Principles: I. Clean Code, II. Simple UX, III. Responsive Design,
    IV. Minimal Dependencies, V. No Automated Testing (NON-NEGOTIABLE)
  - Technology Stack Constraints
  - Development Workflow & Quality Gates
  - Governance
- Removed sections: none
- Templates requiring follow-up: none checked in this run (scope guard limits this
  command to the constitution file itself; downstream templates/commands read this
  constitution at runtime and are not modified here)
- Follow-up TODOs: none
-->

# Spec Kit Learning Nodejs Constitution

## Core Principles

### I. Clean Code
Code MUST be readable, consistently formatted, and free of dead code, commented-out
blocks, and unexplained magic values. Functions and components MUST stay small and
single-purpose; naming MUST clearly convey intent. Linting (`eslint`, per the
project's `eslint.config.mjs`) MUST pass with no disabled rules added to silence
real issues. Rationale: a small codebase with no test safety net depends on
clarity and discipline to stay maintainable and reviewable.

### II. Simple UX
User-facing flows MUST favor the smallest number of steps and the least amount of
on-screen complexity that accomplishes the task. New UI MUST avoid unnecessary
modals, nested navigation, or configuration options unless a real user need
requires them. Rationale: simplicity reduces support burden and implementation
risk in a project with no automated regression coverage.

### III. Responsive Design
All UI MUST render correctly and remain usable across mobile, tablet, and desktop
viewport widths using Tailwind CSS responsive utilities. Fixed pixel layouts that
break at common breakpoints (e.g., 360px, 768px, 1024px, 1440px) MUST NOT be
merged. Rationale: the app is delivered as a web experience with no control over
the visiting device.

### IV. Minimal Dependencies
New runtime or build dependencies MUST NOT be added unless the capability cannot
be reasonably achieved with the existing stack (Next.js, React, Tailwind CSS,
TypeScript) or Node/browser built-ins. Every proposed dependency addition MUST
state in the PR/commit description what it replaces or enables and why the
existing stack is insufficient. Rationale: fewer dependencies means a smaller
attack surface, fewer upgrade breakages, and faster builds.

### V. No Automated Testing (NON-NEGOTIABLE)
This project MUST NOT include unit tests, integration tests, end-to-end tests, or
any test runner/framework configuration or CI test steps. This rule supersedes any
other guidance in this constitution, in templates, or in downstream Spec Kit
commands (e.g., plan/tasks templates) that would otherwise require test-first
workflows, test tasks, or test coverage gates. Verification of changes MUST instead
rely on TypeScript type-checking, `eslint`, and manual/visual review. Rationale:
the project owner has explicitly chosen to exclude automated testing from scope.

## Technology Stack Constraints

The project MUST use exactly the stack declared in `package.json`:
Next.js 16.4.0, React 19.3.0, React DOM 19.3.0, Tailwind CSS ^4, and TypeScript
^5, with ESLint ^9 and `eslint-config-next` 16.4.0 for linting. Upgrading any of
these MUST be a deliberate `package.json` change reviewed against this
constitution (see Principle IV), not an incidental side effect of adding an
unrelated dependency. `package.json` is the single source of truth for exact
versions; if this section and `package.json` ever disagree, `package.json` wins
and this section MUST be updated to match in the same change.

## Development Workflow & Quality Gates

Before a change is considered done: `npm run lint` MUST pass, and TypeScript
MUST compile with no errors. No test suite, test file, or testing library MUST
be added to satisfy this gate (see Principle V). Manual verification in the
browser (including at least one mobile-width and one desktop-width viewport) is
the required substitute for automated test coverage on any UI change.

## Governance

This constitution supersedes conflicting guidance in templates, prior commands,
or ad-hoc practices; where a conflict exists, this document wins. Amendments are
made by editing `.specify/memory/constitution.md` directly, incrementing the
version per semantic versioning (MAJOR for incompatible principle removals or
redefinitions, MINOR for new principles/sections or materially expanded
guidance, PATCH for clarifications and non-semantic wording fixes), and updating
`Last Amended`. Every amendment MUST include a Sync Impact Report as an HTML
comment at the top of the file, documenting the version change and what moved;
that report is scratch material for review and is expected to be removed before
the amended file is committed. Any pull request or review MUST verify compliance
with all Core Principles above, especially Principle V (no tests of any kind) and
Principle IV (no unjustified new dependencies).

**Version**: 1.0.0 | **Ratified**: 2026-10-09 | **Last Amended**: 2026-10-09
