import type { Area, ExerciseStep, KeyTerm, Lesson, LessonStep, Track, Unit } from './types';
import { financialAccounting } from './tracks/financial-accounting';
import {
  corporateFinance,
  dataDecisions,
  leadingPeople,
  marketing,
  negotiation,
  operations,
  strategy,
} from './tracks/outline';
import { exerciseCardId, termCardId } from '../lib/progress';

export const areas: Area[] = [
  { id: 'finance', title: 'Finance & Accounting' },
  { id: 'strategy', title: 'Strategy & Marketing' },
  { id: 'leadership', title: 'Leadership & Negotiation' },
  { id: 'operations', title: 'Operations & Data' },
];

export const tracks: Track[] = [
  financialAccounting,
  corporateFinance,
  strategy,
  marketing,
  leadingPeople,
  negotiation,
  operations,
  dataDecisions,
];

export interface LessonRef {
  lesson: Lesson;
  unit: Unit;
  track: Track;
}

export type ReviewItem =
  | { kind: 'exercise'; cardId: string; lessonId: string; step: ExerciseStep }
  | { kind: 'term'; cardId: string; lessonId: string; term: KeyTerm };

export function isExercise(step: LessonStep): step is ExerciseStep {
  return step.kind !== 'concept' && step.kind !== 'case';
}

const lessonIndex = new Map<string, LessonRef>();
const reviewIndex = new Map<string, ReviewItem>();

for (const track of tracks) {
  for (const unit of track.units) {
    for (const lesson of unit.lessons) {
      lessonIndex.set(lesson.id, { lesson, unit, track });
      for (const step of lesson.steps) {
        if (isExercise(step)) {
          const cardId = exerciseCardId(lesson.id, step.id);
          reviewIndex.set(cardId, { kind: 'exercise', cardId, lessonId: lesson.id, step });
        }
      }
      lesson.keyTerms.forEach((term, i) => {
        const cardId = termCardId(lesson.id, i);
        reviewIndex.set(cardId, { kind: 'term', cardId, lessonId: lesson.id, term });
      });
    }
  }
}

export function getTrack(id: string | null | undefined): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getLesson(id: string): LessonRef | undefined {
  return lessonIndex.get(id);
}

export function getReviewItem(cardId: string): ReviewItem | undefined {
  return reviewIndex.get(cardId);
}

/** Every written lesson in a track, in path order. */
export function trackLessons(track: Track): Lesson[] {
  return track.units.flatMap((unit) => unit.lessons);
}

export function trackHasContent(track: Track): boolean {
  return trackLessons(track).length > 0;
}

/** First lesson in the track not yet completed, or undefined if none is left. */
export function nextLesson(track: Track, completed: Record<string, unknown>): Lesson | undefined {
  return trackLessons(track).find((lesson) => !completed[lesson.id]);
}

/** Lessons unlock in order: the first one, then each after its predecessor is done. */
export function isUnlocked(track: Track, lessonId: string, completed: Record<string, unknown>): boolean {
  const lessons = trackLessons(track);
  const i = lessons.findIndex((l) => l.id === lessonId);
  if (i <= 0) return i === 0;
  return !!completed[lessons[i - 1].id] || !!completed[lessonId];
}
