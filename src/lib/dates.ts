// Dates are stored as local calendar days ("YYYY-MM-DD") so that streaks and
// review due dates follow the user's own day, not UTC.

export type DayString = string;

export function toDay(d: Date = new Date()): DayString {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDay(s: DayString): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(day: DayString, n: number): DayString {
  const d = parseDay(day);
  d.setDate(d.getDate() + n);
  return toDay(d);
}

/** Whole days from `a` to `b` (positive if b is later). */
export function daysBetween(a: DayString, b: DayString): number {
  return Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / 86_400_000);
}
