import { describe, expect, it } from 'vitest';
import { addDays, daysBetween } from './dates';
import { dueCards, newCard, review, MIN_EASE } from './srs';
import { displayStreak, emptyStreak, recordActivity } from './streak';
import { checkNumeric, checkOrder, parseNumber } from './grading';
import { applySession, exportState, importState, initialState, termCardId } from './progress';
import { shuffle } from './shuffle';
import { getLesson } from '../content';

const today = '2026-11-18';

describe('dates', () => {
  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(daysBetween('2026-11-18', '2026-11-25')).toBe(7);
  });
});

describe('srs', () => {
  it('grows the interval on correct answers', () => {
    let c = newCard('a', today);
    c = review(c, true, today);
    expect(c.interval).toBe(1);
    c = review(c, true, c.due);
    expect(c.interval).toBe(3);
    c = review(c, true, c.due);
    expect(c.interval).toBeGreaterThanOrEqual(7);
  });

  it('resets on a wrong answer and never drops ease below the floor', () => {
    let c = { ...newCard('a', today), reps: 4, interval: 20, ease: MIN_EASE };
    c = review(c, false, today);
    expect(c).toMatchObject({ reps: 0, interval: 1, ease: MIN_EASE, lapses: 1, due: addDays(today, 1) });
  });

  it('orders due cards most-overdue first', () => {
    const cards = [
      { ...newCard('later', today), due: '2026-11-17' },
      { ...newCard('future', today), due: '2026-11-19' },
      { ...newCard('oldest', today), due: '2026-11-10' },
    ];
    expect(dueCards(cards, today).map((c) => c.id)).toEqual(['oldest', 'later']);
  });
});

describe('streak', () => {
  it('counts consecutive days and resets after a gap', () => {
    let s = recordActivity(emptyStreak, '2026-11-16');
    s = recordActivity(s, '2026-11-17');
    s = recordActivity(s, '2026-11-17');
    expect(s.current).toBe(2);
    expect(displayStreak(s, '2026-11-18')).toBe(2);
    expect(displayStreak(s, '2026-11-19')).toBe(0);
    s = recordActivity(s, '2026-11-20');
    expect(s).toMatchObject({ current: 1, longest: 2 });
  });
});

describe('grading', () => {
  it('parses phone-typed numbers', () => {
    expect(parseNumber('1,200')).toBe(1200);
    expect(parseNumber('$0.4')).toBe(0.4);
    expect(parseNumber('40%')).toBe(40);
    expect(parseNumber('−7.5')).toBe(-7.5);
    expect(parseNumber('1.5x')).toBe(1.5);
    expect(parseNumber('.5')).toBe(0.5);
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('1.2.3')).toBeNull();
  });

  it('checks numeric answers within tolerance', () => {
    expect(checkNumeric({ answer: 40 }, '40.1')).toBe(true);
    expect(checkNumeric({ answer: 40 }, '41')).toBe(false);
    expect(checkNumeric({ answer: 0.4, tolerance: 0.001 }, '.4')).toBe(true);
    expect(checkNumeric({ answer: 1.5, tolerance: 0.01 }, '1.6')).toBe(false);
  });

  it('checks order exactly', () => {
    expect(checkOrder(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(checkOrder(['a', 'b'], ['b', 'a'])).toBe(false);
  });
});

describe('shuffle', () => {
  it('keeps all items and avoids the original order', () => {
    const items = ['a', 'b', 'c', 'd'];
    const out = shuffle(items);
    expect([...out].sort()).toEqual(items);
    expect(out).not.toEqual(items);
  });
});

describe('progress', () => {
  it('records a lesson, schedules its exercises and key terms, and bumps the streak', () => {
    const ref = getLesson('fa-1-1')!;
    const state = applySession(
      initialState(),
      {
        answers: [
          { cardId: 'fa-1-1/q1', correct: true },
          { cardId: 'fa-1-1/q2', correct: false },
        ],
        lesson: { lesson: ref.lesson, accuracy: 0.5 },
      },
      today,
    );
    expect(state.lessons['fa-1-1']).toMatchObject({ completions: 1, accuracy: 0.5, firstCompletedDay: today });
    expect(state.cards['fa-1-1/q1'].due).toBe(addDays(today, 1));
    expect(state.cards['fa-1-1/q2'].lapses).toBe(1);
    expect(state.cards[termCardId('fa-1-1', 0)].due).toBe(addDays(today, 1));
    expect(state.streak.current).toBe(1);
    expect(state.activity[today]).toBe(1);
  });

  it('round-trips a backup and rejects garbage', () => {
    const state = { ...initialState(), currentTrackId: 'fin-acct' };
    expect(importState(exportState(state))).toEqual(state);
    expect(importState('not json')).toBeNull();
    expect(importState('{"version": 99}')).toBeNull();
  });
});
