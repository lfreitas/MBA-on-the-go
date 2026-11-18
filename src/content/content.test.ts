// Validates every lesson so authoring mistakes fail the build, not the learner.
import { describe, expect, it } from 'vitest';
import { tracks, areas } from '.';
import type { Lesson } from './types';

const lessons: Lesson[] = tracks.flatMap((t) => t.units.flatMap((u) => u.lessons));

describe('curriculum', () => {
  it('has unique track, unit and lesson ids', () => {
    const ids = [
      ...tracks.map((t) => t.id),
      ...tracks.flatMap((t) => t.units.map((u) => u.id)),
      ...lessons.map((l) => l.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('puts every track in a known area', () => {
    const known = new Set(areas.map((a) => a.id));
    for (const t of tracks) expect(known.has(t.area), t.id).toBe(true);
  });
});

describe.each(lessons.map((l) => [l.id, l] as const))('lesson %s', (_, lesson) => {
  it('is short enough for a 3–5 minute session', () => {
    const exercises = lesson.steps.filter((s) => s.kind !== 'concept');
    expect(exercises.length).toBeGreaterThanOrEqual(4);
    expect(exercises.length).toBeLessThanOrEqual(8);
    expect(lesson.steps[0].kind).toBe('concept');
  });

  it('has unique step ids and at least one key term', () => {
    const ids = lesson.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(lesson.keyTerms.length).toBeGreaterThan(0);
  });

  it('has a valid answer and an explanation for every exercise', () => {
    for (const step of lesson.steps) {
      const where = `${lesson.id}/${step.id}`;
      switch (step.kind) {
        case 'mcq':
          expect(step.choices.length, where).toBeGreaterThanOrEqual(2);
          expect(step.answer, where).toBeGreaterThanOrEqual(0);
          expect(step.answer, where).toBeLessThan(step.choices.length);
          expect(new Set(step.choices).size, where).toBe(step.choices.length);
          expect(step.explanation.length, where).toBeGreaterThan(10);
          break;
        case 'tf':
          expect(step.explanation.length, where).toBeGreaterThan(10);
          break;
        case 'numeric':
          expect(Number.isFinite(step.answer), where).toBe(true);
          expect(step.explanation.length, where).toBeGreaterThan(10);
          break;
        case 'match': {
          expect(step.pairs.length, where).toBeGreaterThanOrEqual(3);
          const lefts = step.pairs.map((p) => p[0]);
          const rights = step.pairs.map((p) => p[1]);
          expect(new Set(lefts).size, where).toBe(lefts.length);
          expect(new Set(rights).size, where).toBe(rights.length);
          break;
        }
        case 'order':
          expect(step.items.length, where).toBeGreaterThanOrEqual(3);
          expect(new Set(step.items).size, where).toBe(step.items.length);
          break;
        case 'case':
          expect(step.options.filter((o) => o.quality === 'best').length, where).toBe(1);
          expect(step.debrief.length, where).toBeGreaterThan(10);
          break;
        case 'concept':
          expect(step.body.length, where).toBeGreaterThan(10);
          break;
      }
    }
  });
});
