import { differenceInCalendarDays, format, parseISO } from "date-fns";

/** Active goals at or below this many days remaining are treated as due-soon (FR-003). */
export const DUE_SOON_THRESHOLD_DAYS = 3;

/** Whole calendar days between today and endDate; negative when endDate has passed. */
export function getDaysLeft(endDate: string): number {
  return differenceInCalendarDays(parseISO(endDate), new Date());
}

export function isDueSoon(daysLeft: number): boolean {
  return daysLeft <= DUE_SOON_THRESHOLD_DAYS;
}

/** Human-readable days-left label, including the overdue/due-today cases. */
export function formatDaysLeft(daysLeft: number): string {
  if (daysLeft === 0) return "Due today";
  if (daysLeft < 0) return `${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"} overdue`;
  return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
}

export function formatEndDate(endDate: string): string {
  return format(parseISO(endDate), "MMM d, yyyy");
}
