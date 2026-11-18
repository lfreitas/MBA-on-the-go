import { addDays, type DayString } from './dates';

export interface Streak {
  current: number;
  longest: number;
  lastActiveDay: DayString | null;
}

export const emptyStreak: Streak = { current: 0, longest: 0, lastActiveDay: null };

/** Record that the user completed a session today. */
export function recordActivity(s: Streak, today: DayString): Streak {
  if (s.lastActiveDay === today) return s;
  const continues = s.lastActiveDay === addDays(today, -1);
  const current = continues ? s.current + 1 : 1;
  return { current, longest: Math.max(s.longest, current), lastActiveDay: today };
}

/** The streak to display: it lapses once a full day has been missed. */
export function displayStreak(s: Streak, today: DayString): number {
  if (!s.lastActiveDay) return 0;
  if (s.lastActiveDay === today || s.lastActiveDay === addDays(today, -1)) return s.current;
  return 0;
}
