import { getTrack, isUnlocked, nextLesson, trackLessons } from '../content';
import { Icon } from '../components/Icon';
import type { AppState } from '../lib/progress';

interface Props {
  trackId: string;
  state: AppState;
  onBack: () => void;
  onStartLesson: (lessonId: string) => void;
}

export function TrackScreen({ trackId, state, onBack, onStartLesson }: Props) {
  const track = getTrack(trackId);
  if (!track) {
    return (
      <main className="screen">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
        <p>That track doesn’t exist.</p>
      </main>
    );
  }
  const lessons = trackLessons(track);
  const done = lessons.filter((l) => state.lessons[l.id]).length;
  const next = nextLesson(track, state.lessons);

  return (
    <main className="screen">
      <header className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="back" />
        </button>
      </header>
      <div className="track-header">
        <h1>{track.title}</h1>
        <p>{track.tagline}</p>
        <p className="inspired">Modeled on {track.inspiredBy}</p>
        {lessons.length > 0 && (
          <>
            <div className="progress" aria-hidden>
              <span style={{ width: `${(done / lessons.length) * 100}%` }} />
            </div>
            <p className="muted" style={{ marginTop: 6 }}>
              {done} of {lessons.length} lessons done
            </p>
          </>
        )}
      </div>

      {track.units.map((unit, ui) => {
        const soon = unit.lessons.length === 0;
        const unitDone = unit.lessons.filter((l) => state.lessons[l.id]).length;
        return (
          <section key={unit.id} className={`unit ${soon ? 'is-soon' : ''}`} aria-labelledby={unit.id}>
            <div className="unit-head">
              <h2 id={unit.id}>
                {ui + 1}. {unit.title}
              </h2>
              {soon ? <span className="tag">Coming soon</span> : <span className="tag">{unitDone}/{unit.lessons.length}</span>}
            </div>
            <p className="unit-desc">{unit.description}</p>
            {!soon && (
              <div className="lesson-list">
                {unit.lessons.map((lesson) => {
                  const isDone = !!state.lessons[lesson.id];
                  const isNext = next?.id === lesson.id;
                  const unlocked = isUnlocked(track, lesson.id, state.lessons);
                  return (
                    <button
                      key={lesson.id}
                      className={`lesson-row ${isDone ? 'is-done' : ''} ${isNext ? 'is-next' : ''}`}
                      disabled={!unlocked}
                      onClick={() => onStartLesson(lesson.id)}
                      aria-label={`${lesson.title}${isDone ? ', completed' : unlocked ? '' : ', locked'}`}
                    >
                      <span className="status">
                        <Icon name={isDone ? 'check' : unlocked ? 'play' : 'lock'} size={16} />
                      </span>
                      <span>
                        <span className="lesson-title">{lesson.title}</span>
                        <br />
                        <span className="lesson-summary">{lesson.summary}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </main>
  );
}
