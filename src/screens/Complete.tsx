import { getLesson } from '../content';
import { Icon } from '../components/Icon';

interface Props {
  lessonId?: string;
  accuracy: number;
  reviewed: number;
  streak: number;
  onDone: () => void;
}

export function Complete({ lessonId, accuracy, reviewed, streak, onDone }: Props) {
  const ref = lessonId ? getLesson(lessonId) : undefined;
  return (
    <main className="screen complete">
      <div className="complete-badge">
        <Icon name="check" size={44} />
      </div>
      <h1>{ref ? 'Lesson complete' : 'Review complete'}</h1>
      <p className="muted">{ref ? ref.lesson.title : `${reviewed} item${reviewed === 1 ? '' : 's'} reviewed`}</p>

      <div className="stats">
        <div className="stat">
          <div className="stat-value">{ref ? `${Math.round(accuracy * 100)}%` : reviewed}</div>
          <div className="stat-label">{ref ? 'Right first time' : 'Reviewed'}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day streak</div>
        </div>
      </div>

      {ref && (
        <div className="card terms-added">
          <div className="eyebrow">Added to your reviews</div>
          <ul>
            {ref.lesson.keyTerms.map((t) => (
              <li key={t.term}>
                <strong>{t.term}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn btn-primary btn-block" onClick={onDone} autoFocus>
        Done
      </button>
    </main>
  );
}
