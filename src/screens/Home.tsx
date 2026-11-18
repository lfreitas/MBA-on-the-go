import { useState } from 'react';
import { areas, getLesson, trackHasContent, trackLessons, tracks } from '../content';
import { Icon } from '../components/Icon';
import { addDays, type DayString } from '../lib/dates';
import type { AppState } from '../lib/progress';
import { displayStreak } from '../lib/streak';
import { focusTrack, type TodayPlan } from '../lib/session';

interface Props {
  state: AppState;
  today: DayString;
  plan: TodayPlan;
  onStartToday: () => void;
  onPractice: () => void;
  onOpenTrack: (id: string) => void;
  onOpenSettings: () => void;
}

const INSTALL_KEY = 'mba-otg:install-hint-dismissed';

function isStandalone(): boolean {
  return window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
}

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function Home({ state, today, plan, onStartToday, onPractice, onOpenTrack, onOpenSettings }: Props) {
  const streak = displayStreak(state.streak, today);
  const doneToday = (state.activity[today] ?? 0) > 0;
  const focus = focusTrack(state);
  const [showInstall, setShowInstall] = useState(() => !isStandalone() && !readFlag(INSTALL_KEY));
  const lessonRef = plan.lesson ? getLesson(plan.lesson.id) : undefined;
  const hasCards = Object.keys(state.cards).length > 0;

  const dismissInstall = () => {
    setShowInstall(false);
    try {
      localStorage.setItem(INSTALL_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));

  return (
    <main className="screen">
      <header className="topbar">
        <div className="brand">
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" />
          MBA On The Go
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className={`streak-pill ${streak ? '' : 'is-zero'}`} aria-label={`${streak} day streak`}>
            <Icon name="flame" size={18} /> {streak}
          </span>
          <button className="icon-btn" onClick={onOpenSettings} aria-label="Settings">
            <Icon name="gear" />
          </button>
        </div>
      </header>

      {showInstall && (
        <div className="banner" role="note">
          <p>
            <strong>Tip:</strong> add this app to your home screen for one-tap access. On iPhone tap Share → <em>Add to Home Screen</em>; on Android tap ⋮ → <em>Install app</em>.
          </p>
          <button className="icon-btn" onClick={dismissInstall} aria-label="Dismiss tip">
            <Icon name="close" size={18} />
          </button>
        </div>
      )}

      <section className="card today-card" aria-labelledby="today-title">
        <div className="eyebrow">{doneToday ? 'Done for today' : 'Today'}</div>
        {plan.lesson || plan.reviews.length ? (
          <>
            <h2 id="today-title">{doneToday ? 'Keep going?' : 'Your daily session'}</h2>
            <p className="today-meta">About {Math.max(2, Math.round(plan.reviews.length * 0.4 + (plan.lesson ? 3.5 : 0)))} minutes</p>
            <ul className="today-list">
              {plan.reviews.length > 0 && (
                <li>
                  <span className="dot"><Icon name="repeat" size={16} /></span>
                  <span>
                    {plan.reviews.length} review{plan.reviews.length > 1 ? 's' : ''}
                    {plan.totalDue > plan.reviews.length && <span className="muted"> ({plan.totalDue} due)</span>}
                  </span>
                </li>
              )}
              {lessonRef && (
                <li>
                  <span className="dot"><Icon name="book" size={16} /></span>
                  <span>
                    {lessonRef.lesson.title} <span className="muted">· {lessonRef.track.title}</span>
                  </span>
                </li>
              )}
            </ul>
            <button className="btn btn-primary btn-block" onClick={onStartToday}>
              <Icon name="play" size={18} /> {doneToday ? 'Continue' : 'Start'}
            </button>
          </>
        ) : (
          <>
            <h2 id="today-title">All caught up</h2>
            <p className="today-meta">
              No reviews are due and you’ve finished every lesson written so far. New units are on the way.
            </p>
            {hasCards && (
              <button className="btn btn-secondary btn-block" onClick={onPractice}>
                Practice anyway
              </button>
            )}
          </>
        )}
        <div className="week" aria-label="Last 7 days">
          {week.map((d) => {
            const done = (state.activity[d] ?? 0) > 0;
            const label = new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { weekday: 'narrow' });
            return (
              <div key={d} className={`week-day ${done ? 'is-done' : ''} ${d === today ? 'is-today' : ''}`}>
                <span className="mark">{done && <Icon name="check" size={14} />}</span>
                <span aria-hidden>{label}</span>
                <span className="visually-hidden">{`${d}: ${done ? 'practiced' : 'no session'}`}</span>
              </div>
            );
          })}
        </div>
      </section>

      {areas.map((area) => (
        <section key={area.id} aria-labelledby={`area-${area.id}`}>
          <h2 className="section-title" id={`area-${area.id}`}>{area.title}</h2>
          <div className="track-list">
            {tracks
              .filter((t) => t.area === area.id)
              .map((track) => {
                const lessons = trackLessons(track);
                const done = lessons.filter((l) => state.lessons[l.id]).length;
                const available = trackHasContent(track);
                const isCurrent = focus?.id === track.id;
                return (
                  <button key={track.id} className={`track-row ${isCurrent ? 'is-current' : ''}`} onClick={() => onOpenTrack(track.id)}>
                    <div className="track-row-head">
                      <span className="track-row-title">{track.title}</span>
                      {isCurrent ? <span className="tag tag-current">Current</span> : !available && <span className="tag">Coming soon</span>}
                    </div>
                    <span className="track-row-sub">{track.tagline}</span>
                    {available && (
                      <>
                        <div className="progress" aria-hidden>
                          <span style={{ width: `${(done / lessons.length) * 100}%` }} />
                        </div>
                        <span className="track-row-sub">
                          {done} of {lessons.length} lessons
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
          </div>
        </section>
      ))}
    </main>
  );
}
