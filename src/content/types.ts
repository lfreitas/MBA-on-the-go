// Content model. Lessons are plain data so new units can be added without
// touching UI code; `content.test.ts` validates every lesson at build time.

/** Lightweight markup: blank line = new paragraph, "- " = bullet, **bold**. */
export type RichText = string;

export interface ConceptStep {
  kind: 'concept';
  id: string;
  title: string;
  body: RichText;
  /** Optional worked example shown in a highlighted box. */
  example?: RichText;
}

export interface McqStep {
  kind: 'mcq';
  id: string;
  prompt: RichText;
  choices: string[];
  /** Index into `choices`. */
  answer: number;
  explanation: RichText;
}

export interface TrueFalseStep {
  kind: 'tf';
  id: string;
  statement: RichText;
  answer: boolean;
  explanation: RichText;
}

export interface NumericStep {
  kind: 'numeric';
  id: string;
  prompt: RichText;
  answer: number;
  /** Shown next to the input, e.g. "%", "$k", "x". */
  unit?: string;
  /** Absolute tolerance. Defaults to 0.5% of the answer (min 0.01). */
  tolerance?: number;
  hint?: RichText;
  explanation: RichText;
}

export interface MatchStep {
  kind: 'match';
  id: string;
  prompt: RichText;
  /** [left, right] pairs in their correct pairing; shuffled for display. */
  pairs: [string, string][];
  explanation?: RichText;
}

export interface OrderStep {
  kind: 'order';
  id: string;
  prompt: RichText;
  /** Items in the correct order; shuffled for display. */
  items: string[];
  explanation: RichText;
}

export type CaseQuality = 'best' | 'ok' | 'poor';

export interface CaseOption {
  text: string;
  quality: CaseQuality;
  feedback: RichText;
}

export interface CaseStep {
  kind: 'case';
  id: string;
  title: string;
  /** Who you are in the scenario, e.g. "You are the CFO". */
  role: string;
  scenario: RichText;
  question: string;
  options: CaseOption[];
  debrief: RichText;
}

export type ExerciseStep = McqStep | TrueFalseStep | NumericStep | MatchStep | OrderStep;
export type LessonStep = ConceptStep | ExerciseStep | CaseStep;

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface Lesson {
  id: string;
  title: string;
  /** One-line summary shown on the path. */
  summary: string;
  steps: LessonStep[];
  /** Become spaced-repetition flashcards once the lesson is finished. */
  keyTerms: KeyTerm[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  /** Empty while the unit is still being written ("coming soon"). */
  lessons: Lesson[];
}

export type AreaId = 'finance' | 'strategy' | 'leadership' | 'operations';

export interface Track {
  id: string;
  area: AreaId;
  title: string;
  tagline: string;
  /** Which core courses the track is modeled on. */
  inspiredBy: string;
  units: Unit[];
}

export interface Area {
  id: AreaId;
  title: string;
}
