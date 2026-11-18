// One component per step type. Each renders the step body and, until it has
// been answered, its own action bar. The Player renders the feedback bar.

import { useMemo, useRef, useState, type ReactNode } from 'react';
import type {
  CaseStep,
  ConceptStep,
  KeyTerm,
  MatchStep,
  McqStep,
  NumericStep,
  OrderStep,
  TrueFalseStep,
} from '../content/types';
import { checkNumeric, checkOrder, parseNumber } from '../lib/grading';
import { shuffle } from '../lib/shuffle';
import { RichText } from './RichText';

export interface StepResult {
  correct: boolean;
  /** Not graded (concept, case, self-rated flashcard): no right/wrong styling. */
  neutral?: boolean;
  /** Skip the feedback bar and move straight on. */
  advance?: boolean;
  /** The correct answer, shown when wrong. */
  answer?: ReactNode;
  explanation?: string;
}

interface StepProps<T> {
  step: T;
  answered: boolean;
  onResult: (r: StepResult) => void;
}

function Bar({ children }: { children: ReactNode }) {
  return <div className="player-bar">{children}</div>;
}

function CheckBar({ disabled, onCheck, label = 'Check' }: { disabled: boolean; onCheck: () => void; label?: string }) {
  return (
    <Bar>
      <button className="btn btn-primary btn-block" disabled={disabled} onClick={onCheck}>
        {label}
      </button>
    </Bar>
  );
}

// ---- Concept -----------------------------------------------------------

export function Concept({ step, onResult }: StepProps<ConceptStep>) {
  return (
    <>
      <div className="player-body">
        <div className="eyebrow">Concept</div>
        <h1 className="step-title">{step.title}</h1>
        <RichText text={step.body} />
        {step.example && (
          <div className="example">
            <div className="example-label">Example</div>
            <RichText text={step.example} />
          </div>
        )}
      </div>
      <CheckBar disabled={false} label="Continue" onCheck={() => onResult({ correct: true, neutral: true, advance: true })} />
    </>
  );
}

// ---- Multiple choice ---------------------------------------------------

export function MultipleChoice({ step, answered, onResult }: StepProps<McqStep>) {
  // Shuffle display order so reviews test the idea, not the position.
  const order = useMemo(() => shuffle(step.choices.map((_, i) => i)), [step]);
  const [picked, setPicked] = useState<number | null>(null);

  const check = () => {
    if (picked === null) return;
    onResult({ correct: picked === step.answer, answer: step.choices[step.answer], explanation: step.explanation });
  };

  return (
    <>
      <div className="player-body">
        <RichText className="prompt" text={step.prompt} />
        <div className="choices" role="group" aria-label="Choices">
          {order.map((i) => {
            const state = answered ? (i === step.answer ? 'is-correct' : i === picked ? 'is-wrong' : '') : '';
            return (
              <button
                key={i}
                className={`choice ${state}`}
                aria-pressed={picked === i}
                disabled={answered}
                onClick={() => setPicked(i)}
              >
                {step.choices[i]}
              </button>
            );
          })}
        </div>
      </div>
      {!answered && <CheckBar disabled={picked === null} onCheck={check} />}
    </>
  );
}

// ---- True / false ------------------------------------------------------

export function TrueFalse({ step, answered, onResult }: StepProps<TrueFalseStep>) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const check = () => {
    if (picked === null) return;
    onResult({ correct: picked === step.answer, answer: step.answer ? 'True' : 'False', explanation: step.explanation });
  };
  const cls = (v: boolean) => (answered ? (v === step.answer ? 'is-correct' : v === picked ? 'is-wrong' : '') : '');
  return (
    <>
      <div className="player-body">
        <div className="eyebrow">True or false?</div>
        <RichText className="prompt" text={step.statement} />
        <div className="tf-row" role="group" aria-label="True or false">
          {[true, false].map((v) => (
            <button key={String(v)} className={`choice ${cls(v)}`} aria-pressed={picked === v} disabled={answered} onClick={() => setPicked(v)}>
              {v ? 'True' : 'False'}
            </button>
          ))}
        </div>
      </div>
      {!answered && <CheckBar disabled={picked === null} onCheck={check} />}
    </>
  );
}

// ---- Numeric -----------------------------------------------------------

/** "$k" → prefix "$", suffix "k"; "%" → suffix "%". */
function splitUnit(unit = ''): { prefix: string; suffix: string } {
  return unit.startsWith('$') ? { prefix: '$', suffix: unit.slice(1) } : { prefix: '', suffix: unit };
}

export function formatAnswer(value: number, unit?: string): string {
  const { prefix, suffix } = splitUnit(unit);
  const n = value.toLocaleString('en-US', { maximumFractionDigits: 4 });
  return `${prefix}${n}${suffix}`;
}

export function Numeric({ step, answered, onResult }: StepProps<NumericStep>) {
  const [value, setValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const { prefix, suffix } = splitUnit(step.unit);
  const valid = parseNumber(value) !== null;

  const check = () => {
    if (!valid) return;
    onResult({ correct: checkNumeric(step, value), answer: formatAnswer(step.answer, step.unit), explanation: step.explanation });
  };

  return (
    <>
      <div className="player-body">
        <div className="eyebrow">Quick calculation</div>
        <RichText className="prompt" text={step.prompt} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            check();
          }}
        >
          <label className="numeric-field">
            <span className="visually-hidden">Your answer</span>
            {prefix && <span className="affix">{prefix}</span>}
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              enterKeyHint="done"
              placeholder="0"
              value={value}
              disabled={answered}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
            {suffix && <span className="affix">{suffix}</span>}
          </label>
        </form>
        {step.hint && !answered && (
          showHint ? (
            <RichText className="hint" text={`Hint: ${step.hint}`} />
          ) : (
            <button className="hint-btn" onClick={() => setShowHint(true)}>
              Show a hint
            </button>
          )
        )}
      </div>
      {!answered && <CheckBar disabled={!valid} onCheck={check} />}
    </>
  );
}

// ---- Match -------------------------------------------------------------

export function Match({ step, answered, onResult }: StepProps<MatchStep>) {
  const lefts = useMemo(() => shuffle(step.pairs.map((p) => p[0])), [step]);
  const rights = useMemo(() => shuffle(step.pairs.map((p) => p[1])), [step]);
  const partner = useMemo(() => new Map(step.pairs), [step]);
  const [left, setLeft] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [miss, setMiss] = useState<string[]>([]);
  const mistakes = useRef(0);

  const attempt = (l: string | null, r: string | null) => {
    if (!l || !r) return;
    if (partner.get(l) === r) {
      const next = new Set(matched).add(l).add(r);
      setMatched(next);
      if (next.size === step.pairs.length * 2) {
        onResult({
          correct: mistakes.current === 0,
          answer: mistakes.current === 0 ? undefined : `${mistakes.current} mismatch${mistakes.current > 1 ? 'es' : ''} along the way`,
          explanation: step.explanation,
        });
      }
    } else {
      mistakes.current += 1;
      setMiss([l, r]);
      setTimeout(() => setMiss([]), 350);
    }
    setLeft(null);
    setRight(null);
  };

  const item = (text: string, side: 'l' | 'r') => {
    const isMatched = matched.has(text);
    const selected = side === 'l' ? left === text : right === text;
    return (
      <button
        key={text}
        className={`match-item ${isMatched ? 'is-matched' : ''} ${miss.includes(text) ? 'is-miss' : ''}`}
        aria-pressed={selected}
        disabled={isMatched || answered}
        onClick={() => {
          if (side === 'l') {
            setLeft(text);
            attempt(text, right);
          } else {
            setRight(text);
            attempt(left, text);
          }
        }}
      >
        {text}
      </button>
    );
  };

  return (
    <div className="player-body">
      <div className="eyebrow">Match the pairs</div>
      <RichText className="prompt" text={step.prompt} />
      <div className="match-grid">
        <div className="match-col">{lefts.map((t) => item(t, 'l'))}</div>
        <div className="match-col">{rights.map((t) => item(t, 'r'))}</div>
      </div>
    </div>
  );
}

// ---- Order -------------------------------------------------------------

export function Order({ step, answered, onResult }: StepProps<OrderStep>) {
  const initial = useMemo(() => shuffle(step.items), [step]);
  const [placed, setPlaced] = useState<string[]>([]);
  const pool = initial.filter((i) => !placed.includes(i));

  const check = () =>
    onResult({
      correct: checkOrder(step.items, placed),
      answer: (
        <ol style={{ margin: 0, paddingLeft: '1.2em' }}>
          {step.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      ),
      explanation: step.explanation,
    });

  return (
    <>
      <div className="player-body">
        <div className="eyebrow">Put in order</div>
        <RichText className="prompt" text={step.prompt} />
        <div className="order-answer" aria-label="Your order">
          {placed.map((i) => (
            <button key={i} className="order-chip" disabled={answered} onClick={() => setPlaced(placed.filter((p) => p !== i))}>
              {i}
            </button>
          ))}
        </div>
        <div className="order-pool">
          {pool.map((i) => (
            <button key={i} className="order-chip" disabled={answered} onClick={() => setPlaced([...placed, i])}>
              {i}
            </button>
          ))}
        </div>
      </div>
      {!answered && <CheckBar disabled={pool.length > 0} onCheck={check} />}
    </>
  );
}

// ---- Mini case ---------------------------------------------------------

const qualityLabel = { best: 'Strongest call', ok: 'Defensible', poor: 'Risky' } as const;

export function Case({ step, answered, onResult }: StepProps<CaseStep>) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <>
      <div className="player-body">
        <div className="eyebrow">Mini case</div>
        <h1 className="step-title">{step.title}</h1>
        <p className="case-role">{step.role}</p>
        <RichText className="case-scenario" text={step.scenario} />
        <p className="case-question">{step.question}</p>
        <div className="choices" role="group" aria-label="Options">
          {step.options.map((o, i) => (
            <button
              key={i}
              className={`choice ${!answered ? '' : o.quality === 'best' ? 'is-correct' : i !== picked ? '' : o.quality === 'ok' ? 'is-ok' : 'is-wrong'}`}
              aria-pressed={picked === i}
              disabled={answered}
              onClick={() => setPicked(i)}
            >
              {o.text}
              {answered && (
                <div className="case-option-feedback">
                  <span className={`quality quality-${o.quality}`}>{qualityLabel[o.quality]}</span>
                  <RichText text={o.feedback} />
                </div>
              )}
            </button>
          ))}
        </div>
        {answered && (
          <div className="debrief">
            <h3>Debrief</h3>
            <RichText text={step.debrief} />
          </div>
        )}
      </div>
      {!answered && (
        <CheckBar
          disabled={picked === null}
          label="Decide"
          onCheck={() => picked !== null && onResult({ correct: step.options[picked].quality === 'best', neutral: true })}
        />
      )}
    </>
  );
}

// ---- Key-term flashcard (reviews only) ---------------------------------

export function Flashcard({ term, onResult }: { term: KeyTerm; onResult: (r: StepResult) => void }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <>
      <div className="player-body">
        <div className="eyebrow is-review">Review · Key term</div>
        <div className="card flashcard">
          <div className="term">{term.term}</div>
          {revealed ? <div className="definition">{term.definition}</div> : <div className="muted">Can you explain it in your own words?</div>}
        </div>
      </div>
      <Bar>
        {revealed ? (
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={() => onResult({ correct: false, neutral: true, advance: true })}>
              Not yet
            </button>
            <button className="btn btn-good" onClick={() => onResult({ correct: true, neutral: true, advance: true })}>
              I knew it
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-block" onClick={() => setRevealed(true)}>
            Show definition
          </button>
        )}
      </Bar>
    </>
  );
}
