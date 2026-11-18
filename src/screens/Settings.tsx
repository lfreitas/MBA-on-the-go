import { useRef } from 'react';
import { Icon } from '../components/Icon';
import { exportState, importState, initialState, type AppState } from '../lib/progress';
import { toDay } from '../lib/dates';

interface Props {
  state: AppState;
  setState: (s: AppState) => void;
  onBack: () => void;
  notify: (msg: string) => void;
}

export function Settings({ state, setState, onBack, notify }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([exportState(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mba-on-the-go-backup-${toDay()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Backup downloaded');
  };

  const restore = async (file: File | undefined) => {
    if (!file) return;
    const next = importState(await file.text());
    if (!next) {
      notify('That file isn’t a valid backup');
      return;
    }
    if (window.confirm('Replace your current progress with this backup?')) {
      setState(next);
      notify('Progress restored');
    }
  };

  const reset = () => {
    if (window.confirm('Erase all progress, reviews and your streak? This can’t be undone.')) {
      setState(initialState());
      notify('Progress reset');
    }
  };

  const completed = Object.keys(state.lessons).length;

  return (
    <main className="screen">
      <header className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="back" />
        </button>
        <h1 style={{ fontSize: 22, flex: 1 }}>Settings</h1>
      </header>

      <section className="settings-group">
        <h2 className="section-title">Daily session</h2>
        <div className="card">
          <div>Reviews per session</div>
          <div className="segmented" role="group" aria-label="Reviews per session">
            {[3, 5, 10].map((n) => (
              <button
                key={n}
                aria-pressed={state.settings.reviewsPerSession === n}
                onClick={() => setState({ ...state, settings: { ...state.settings, reviewsPerSession: n } })}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="muted">More reviews make things stick better but lengthen the session.</p>
        </div>
      </section>

      <section className="settings-group">
        <h2 className="section-title">Your progress</h2>
        <div className="card">
          <p className="muted">
            Progress is saved on this device only: {completed} lesson{completed === 1 ? '' : 's'} done, longest streak{' '}
            {state.streak.longest} day{state.streak.longest === 1 ? '' : 's'}. Download a backup before switching phones or clearing browser data.
          </p>
          <button className="btn btn-secondary btn-block" onClick={download}>
            Download backup
          </button>
          <button className="btn btn-secondary btn-block" onClick={() => fileRef.current?.click()}>
            Restore from backup
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => restore(e.target.files?.[0])} />
          <button className="btn btn-block" style={{ color: 'var(--bad)', background: 'transparent' }} onClick={reset}>
            Reset all progress
          </button>
        </div>
      </section>

      <section className="settings-group">
        <h2 className="section-title">About</h2>
        <div className="card">
          <p className="muted">
            The curriculum follows the structure of the core MBA courses at Harvard Business School and MIT Sloan. All lessons and cases are original and written for this app; it isn’t affiliated with either school.
          </p>
        </div>
      </section>
    </main>
  );
}
