// Builds the queue of items for a session: a lesson, a review set, or the
// daily "Today" mix of due reviews followed by the next lesson.

import type { KeyTerm, Lesson, LessonStep } from '../content/types';
import { getLesson, getReviewItem, getTrack, isExercise, nextLesson, trackHasContent, tracks, type ReviewItem } from '../content';
import { exerciseCardId, type AppState } from './progress';
import { dueCards } from './srs';
import type { DayString } from './dates';

export type SessionItem =
  | { type: 'step'; key: string; step: LessonStep; lessonId: string; cardId?: string; review: boolean }
  | { type: 'term'; key: string; term: KeyTerm; lessonId: string; cardId: string };

export interface SessionSpec {
  title: string;
  items: SessionItem[];
  /** When set, finishing the session completes this lesson. */
  lessonId?: string;
}

export function lessonItems(lesson: Lesson): SessionItem[] {
  return lesson.steps.map((step) => ({
    type: 'step',
    key: `${lesson.id}/${step.id}`,
    step,
    lessonId: lesson.id,
    cardId: isExercise(step) ? exerciseCardId(lesson.id, step.id) : undefined,
    review: false,
  }));
}

function reviewItem(item: ReviewItem): SessionItem {
  return item.kind === 'term'
    ? { type: 'term', key: `review/${item.cardId}`, term: item.term, lessonId: item.lessonId, cardId: item.cardId }
    : { type: 'step', key: `review/${item.cardId}`, step: item.step, lessonId: item.lessonId, cardId: item.cardId, review: true };
}

/** Reviews due today (capped), skipping cards whose content no longer exists. */
export function dueReviewItems(state: AppState, today: DayString, limit: number): SessionItem[] {
  return dueCards(Object.values(state.cards), today)
    .map((c) => getReviewItem(c.id))
    .filter((x): x is ReviewItem => !!x)
    .slice(0, limit)
    .map(reviewItem);
}

export function dueCount(state: AppState, today: DayString): number {
  return dueCards(Object.values(state.cards), today).filter((c) => getReviewItem(c.id)).length;
}

/** Extra practice when nothing is due: the cards coming up soonest. */
export function practiceItems(state: AppState, limit: number): SessionItem[] {
  return Object.values(state.cards)
    .sort((a, b) => (a.due === b.due ? b.lapses - a.lapses : a.due < b.due ? -1 : 1))
    .map((c) => getReviewItem(c.id))
    .filter((x): x is ReviewItem => !!x)
    .slice(0, limit)
    .map(reviewItem);
}

/** The track "Today" pulls the next lesson from. */
export function focusTrack(state: AppState) {
  const current = getTrack(state.currentTrackId);
  if (current && nextLesson(current, state.lessons)) return current;
  return tracks.find((t) => trackHasContent(t) && nextLesson(t, state.lessons)) ?? current;
}

export interface TodayPlan {
  reviews: SessionItem[];
  totalDue: number;
  lesson?: Lesson;
}

export function todayPlan(state: AppState, today: DayString): TodayPlan {
  const track = focusTrack(state);
  return {
    reviews: dueReviewItems(state, today, state.settings.reviewsPerSession),
    totalDue: dueCount(state, today),
    lesson: track ? nextLesson(track, state.lessons) : undefined,
  };
}

export function todaySession(plan: TodayPlan): SessionSpec | null {
  if (!plan.reviews.length && !plan.lesson) return null;
  return {
    title: plan.lesson ? plan.lesson.title : 'Review',
    items: [...plan.reviews, ...(plan.lesson ? lessonItems(plan.lesson) : [])],
    lessonId: plan.lesson?.id,
  };
}

export function lessonSession(lessonId: string): SessionSpec | null {
  const ref = getLesson(lessonId);
  return ref ? { title: ref.lesson.title, items: lessonItems(ref.lesson), lessonId } : null;
}
