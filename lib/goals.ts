export type GoalStatus = "active" | "completed";

export interface Goal {
  id: string;
  title: string;
  /** ISO date string (YYYY-MM-DD), no time-of-day component. */
  endDate: string;
  status: GoalStatus;
  /** ISO datetime string, set once at creation. */
  createdAt: string;
  /** ISO datetime string, set when status becomes "completed"; null while active. */
  completedAt: string | null;
}

const STORAGE_KEY = "doit.goals.v1";

/** Reads goals from localStorage; fails safe to [] rather than throwing. */
export function loadGoals(): Goal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Goal[]) : [];
  } catch (error) {
    console.warn("doit: failed to read goals from localStorage", error);
    return [];
  }
}

/** Persists the full goals array, replacing whatever was previously stored. */
export function saveGoals(goals: Goal[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

// --- External store wrapper (for React's useSyncExternalStore) ---
//
// Reading localStorage directly in a useEffect would mean calling setState
// synchronously inside an effect body, which both reacts and this project's
// lint config discourage. useSyncExternalStore is the React-supported way to
// read a browser-only store like localStorage without that pattern, and its
// getServerSnapshot handles the server/client divergence safely.

let cachedGoals: Goal[] | null = null;
const listeners = new Set<() => void>();
// Must be a stable reference, not a new [] each call, or useSyncExternalStore
// treats every render as a change and warns of a potential infinite loop.
const EMPTY_GOALS: Goal[] = [];

export function getGoalsSnapshot(): Goal[] {
  if (cachedGoals === null) {
    cachedGoals = loadGoals();
  }
  return cachedGoals;
}

export function getGoalsServerSnapshot(): Goal[] {
  return EMPTY_GOALS;
}

export function subscribeToGoals(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Updates the cache, persists to localStorage, and notifies subscribers. */
export function commitGoals(goals: Goal[]): void {
  cachedGoals = goals;
  saveGoals(goals);
  listeners.forEach((listener) => listener());
}

/** Soonest end date first; ties broken by earliest created first (FR-013). */
export function sortActiveGoals(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) => {
    const byEndDate = a.endDate.localeCompare(b.endDate);
    if (byEndDate !== 0) return byEndDate;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

/** Most recently completed first (FR-013). */
export function sortCompletedGoals(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) =>
    (b.completedAt ?? "").localeCompare(a.completedAt ?? "")
  );
}

/** Trims/validates title and endDate (FR-006); throws if either is invalid. */
export function createGoal(title: string, endDate: string): Goal {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error("Title is required");
  }
  if (!endDate || Number.isNaN(new Date(endDate).getTime())) {
    throw new Error("A valid end date is required");
  }
  return {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    endDate,
    status: "active",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

/** Marks the matching goal completed, stamping completedAt (FR-007). */
export function completeGoal(goals: Goal[], id: string): Goal[] {
  const completedAt = new Date().toISOString();
  return goals.map((goal) =>
    goal.id === id ? { ...goal, status: "completed", completedAt } : goal
  );
}

/** Permanently removes the matching goal (FR-008). */
export function deleteGoal(goals: Goal[], id: string): Goal[] {
  return goals.filter((goal) => goal.id !== id);
}
