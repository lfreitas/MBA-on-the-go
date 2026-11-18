import { useState } from 'react';
import { getLesson } from '../content';
import { Icon } from '../components/Icon';
import { RichText } from '../components/RichText';
import { Case, Concept, Flashcard, Match, MultipleChoice, Numeric, Order, TrueFalse, type StepResult } from '../components/steps';
import type { SessionItem, SessionSpec } from '../lib/session';
import type { AnswerResult } from '../lib/progress';

export interface SessionSummary {
  answers: AnswerResult[];
  /** First-try accuracy on the lesson's own exercises (not reviews), 0–1. */
  lessonAccuracy: number;
  reviewed: number;
}

interface Props {
  spec: SessionSpec;
  onExit: () => void;
  onFinish: (summary: SessionSummary) => void;
}

export function Player({ spec, onExit, onFinish }: Props) {
  const [queue, setQueue] = useState<SessionItem[]>(spec.items);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<StepResult | null>(null);
  // First-try outcome per card; retries don't overwrite it.
  const [firstTry, setFirstTry] = useState<Map<string, boolean>>(new Map());
  const [retried, setRetried] = useState<Set<string>>(new Set());

  const item = queue[index];
  const progress = index / queue.length;

  const finish = (results: Map<string, boolean>) => {
    const answers = [...results].map(([cardId, correct]) => ({ cardId, correct }));
    const lessonCards = spec.items.filter((i) => i.type === 'step' && !i.review && i.cardId).map((i) => i.cardId!);
    const correct = lessonCards.filter((id) => results.get(id)).length;
    onFinish({
      answers,
      lessonAccuracy: lessonCards.length ? correct / lessonCards.length : 1,
      reviewed: spec.items.filter((i) => i.type === 'term' || (i.type === 'step' && i.review)).length,
    });
  };

  const advance = (results: Map<string, boolean>, extra: SessionItem[] = []) => {
    const nextQueue = extra.length ? [...queue, ...extra] : queue;
    if (extra.length) setQueue(nextQueue);
    setResult(null);
    if (index + 1 >= nextQueue.length) finish(results);
    else {
      setIndex(index + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleResult = (r: StepResult) => {
    let results = firstTry;
    if (item.cardId && !firstTry.has(item.cardId)) {
      results = new Map(firstTry).set(item.cardId, r.correct);
      setFirstTry(results);
    }
    if (r.advance) advance(results);
    else setResult(r);
  };

  const handleContinue = () => {
    // A missed graded exercise comes back once at the end of the session.
    const baseKey = item.key.replace(/#retry$/, '');
    const missed = result && !result.correct && !result.neutral && !retried.has(baseKey);
    if (missed) setRetried(new Set(retried).add(baseKey));
    advance(firstTry, missed ? [{ ...item, key: `${item.key}#retry` } as SessionItem] : []);
  };

  const confirmExit = () => {
    if (index === 0 || window.confirm('Leave this session? Your answers so far won’t be saved.')) onExit();
  };

  const reviewLabel = () => {
    const ref = getLesson(item.lessonId);
    return ref ? `Review · ${ref.lesson.title}` : 'Review';
  };

  return (
    <div className="player">
      <div className="player-top">
        <button className="icon-btn" onClick={confirmExit} aria-label="Leave session">
          <Icon name="close" />
        </button>
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Session progress">
          <span style={{ width: `${Math.max(progress * 100, 3)}%` }} />
        </div>
      </div>

      {item.type === 'step' && item.review && <div className="eyebrow is-review">{reviewLabel()}</div>}
      {item.key.endsWith('#retry') && <div className="eyebrow is-review">Try this one again</div>}

      <StepView key={item.key} item={item} answered={!!result} onResult={handleResult} />

      {result && (
        <div className="player-bar" aria-live="polite">
          {!result.neutral && (
            <div className={`feedback ${result.correct ? 'is-good' : 'is-bad'}`}>
              <div className="feedback-head">
                <Icon name={result.correct ? 'check' : 'x'} />
                {result.correct ? 'Correct' : 'Not quite'}
              </div>
              <div className="feedback-body">
                {!result.correct && result.answer && (
                  <div className="feedback-answer">
                    {typeof result.answer === 'string' ? `Answer: ${result.answer}` : result.answer}
                  </div>
                )}
                {result.explanation && <RichText text={result.explanation} />}
              </div>
            </div>
          )}
          <button className={`btn btn-block ${result.neutral ? 'btn-primary' : result.correct ? 'btn-good' : 'btn-bad'}`} onClick={handleContinue} autoFocus>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

function StepView({ item, answered, onResult }: { item: SessionItem; answered: boolean; onResult: (r: StepResult) => void }) {
  if (item.type === 'term') return <Flashcard term={item.term} onResult={onResult} />;
  const props = { answered, onResult };
  const s = item.step;
  switch (s.kind) {
    case 'concept':
      return <Concept step={s} {...props} />;
    case 'mcq':
      return <MultipleChoice step={s} {...props} />;
    case 'tf':
      return <TrueFalse step={s} {...props} />;
    case 'numeric':
      return <Numeric step={s} {...props} />;
    case 'match':
      return <Match step={s} {...props} />;
    case 'order':
      return <Order step={s} {...props} />;
    case 'case':
      return <Case step={s} {...props} />;
  }
}
