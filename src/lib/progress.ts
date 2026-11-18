// All learner progress lives in one JSON object saved on the device.
// Functions here are pure so they can be unit-tested without a browser.

import { addDays, type DayString } from './dates';
import { newCard, review, type SrsCard } from './srs';
import { emptyStreak, recordActivity, type Streak } from './streak';
import type { Lesson } from '../content/types';

export const STATE_VERSION = 1;

export interface LessonRecord {
  firstCompletedDay: DayString;
  lastCompletedDay: DayString;
  /** Share of exercises answered correctly on the first try, 0–1 (latest run). */
  accuracy: number;
  completions: number;
}

export interface Settings {
  reviewsPerSession: number;
}

export interface AppState {
  version: number;
  lessons: Record<string, LessonRecord>;
  cards: Record<string, SrsCard>;
  streak: Streak;
  /** Sessions completed per day, for the weekly strip. */
  activity: Record<DayString, number>;
  currentTrackId: string | null;
  settings: Settings;
}

export const defaultSettings: Settings = { reviewsPerSession: 5 };

export function initialState(): AppState {
  return {
    version: STATE_VERSION,
    lessons: {},
    cards: {},
    streak: emptyStreak,
    activity: {},
    currentTrackId: null,
    settings: defaultSettings,
  };
}

export function exerciseCardId(lessonId: string, stepId: string): string {
  return `${lessonId}/${stepId}`;
}

export function termCardId(lessonId: string, index: number): string {
  return `${lessonId}/term-${index}`;
}

export interface AnswerResult {
  cardId: string;
  correct: boolean;
}

export interface SessionOutcome {
  /** First-try results for every reviewable exercise in the session. */
  answers: AnswerResult[];
  /** Set when the session included a full lesson. */
  lesson?: { lesson: Lesson; accuracy: number };
}

export function applySession(state: AppState, outcome: SessionOutcome, today: DayString): AppState {
  const cards = { ...state.cards };
  for (const { cardId, correct } of outcome.answers) {
    const card = cards[cardId] ?? newCard(cardId, today);
    cards[cardId] = review(card, correct, today);
  }

  const lessons = { ...state.lessons };
  if (outcome.lesson) {
    const { lesson, accuracy } = outcome.lesson;
    const prev = lessons[lesson.id];
    lessons[lesson.id] = {
      firstCompletedDay: prev?.firstCompletedDay ?? today,
      lastCompletedDay: today,
      accuracy,
      completions: (prev?.completions ?? 0) + 1,
    };
    // Key terms join the review deck; first review is tomorrow.
    lesson.keyTerms.forEach((_, i) => {
      const id = termCardId(lesson.id, i);
      if (!cards[id]) cards[id] = { ...newCard(id, today), due: addDays(today, 1) };
    });
  }

  return {
    ...state,
    cards,
    lessons,
    streak: recordActivity(state.streak, today),
    activity: { ...state.activity, [today]: (state.activity[today] ?? 0) + 1 },
  };
}

// ---- Persistence -----------------------------------------------------------

const STORAGE_KEY = 'mba-otg:state';

/** Merge whatever was saved with current defaults, ignoring junk. */
export function normalizeState(raw: unknown): AppState | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<AppState>;
  if (typeof r.version !== 'number' || r.version > STATE_VERSION) return null;
  const base = initialState();
  return {
    version: STATE_VERSION,
    lessons: isRecord(r.lessons) ? (r.lessons as AppState['lessons']) : base.lessons,
    cards: isRecord(r.cards) ? (r.cards as AppState['cards']) : base.cards,
    streak: isRecord(r.streak) ? { ...emptyStreak, ...(r.streak as Streak) } : base.streak,
    activity: isRecord(r.activity) ? (r.activity as AppState['activity']) : base.activity,
    currentTrackId: typeof r.currentTrackId === 'string' ? r.currentTrackId : null,
    settings: { ...defaultSettings, ...(isRecord(r.settings) ? r.settings : {}) },
  };
}

function isRecord(v: unknown): boolean {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

export function loadState(): AppState {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (text) return normalizeState(JSON.parse(text)) ?? initialState();
  } catch {
    // Private mode or blocked storage: start fresh in memory.
  }
  return initialState();
}

export function saveState(state: AppState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function exportState(state: AppState): string {
  return JSON.stringify({ app: 'mba-on-the-go', exportedAt: new Date().toISOString(), state }, null, 2);
}

export function importState(text: string): AppState | null {
  try {
    const parsed = JSON.parse(text);
    return normalizeState(parsed?.app === 'mba-on-the-go' ? parsed.state : parsed);
  } catch {
    return null;
  }
}
