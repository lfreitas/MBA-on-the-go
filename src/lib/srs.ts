// A small SM-2-style scheduler. Each reviewable item (an exercise or a key
// term) has a card; answering it moves its due date out (right) or back to
// tomorrow (wrong).

import { addDays, type DayString } from './dates';

export interface SrsCard {
  id: string;
  due: DayString;
  /** Current interval in days. */
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
}

export const MIN_EASE = 1.3;
export const MAX_EASE = 3.0;
const START_EASE = 2.5;

export function newCard(id: string, today: DayString): SrsCard {
  return { id, due: today, interval: 0, ease: START_EASE, reps: 0, lapses: 0 };
}

export function review(card: SrsCard, correct: boolean, today: DayString): SrsCard {
  if (!correct) {
    return {
      ...card,
      interval: 1,
      reps: 0,
      lapses: card.lapses + 1,
      ease: Math.max(MIN_EASE, card.ease - 0.2),
      due: addDays(today, 1),
    };
  }
  const reps = card.reps + 1;
  let interval: number;
  if (reps === 1) interval = 1;
  else if (reps === 2) interval = 3;
  else interval = Math.round(Math.max(card.interval, 1) * card.ease);
  return {
    ...card,
    reps,
    interval,
    ease: Math.min(MAX_EASE, card.ease + 0.05),
    due: addDays(today, interval),
  };
}

export function isDue(card: SrsCard, today: DayString): boolean {
  return card.due <= today;
}

/** Due cards, most overdue first, then the ones you struggle with most. */
export function dueCards(cards: SrsCard[], today: DayString): SrsCard[] {
  return cards
    .filter((c) => isDue(c, today))
    .sort((a, b) => (a.due === b.due ? b.lapses - a.lapses : a.due < b.due ? -1 : 1));
}
