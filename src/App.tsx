import { useCallback, useEffect, useMemo, useState } from 'react';
import { getLesson } from './content';
import { toDay } from './lib/dates';
import { applySession, loadState, saveState, type AppState } from './lib/progress';
import { lessonSession, practiceItems, todayPlan, todaySession, type SessionSpec } from './lib/session';
import { displayStreak } from './lib/streak';
import { Complete } from './screens/Complete';
import { Home } from './screens/Home';
import { Player, type SessionSummary } from './screens/Player';
import { Settings } from './screens/Settings';
import { TrackScreen } from './screens/TrackScreen';

type Route = { name: 'home' } | { name: 'track'; id: string } | { name: 'settings' } | { name: 'session' } | { name: 'done' };

function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/');
  if (parts[0] === 'track' && parts[1]) return { name: 'track', id: decodeURIComponent(parts[1]) };
  if (parts[0] === 'settings') return { name: 'settings' };
  if (parts[0] === 'session') return { name: 'session' };
  if (parts[0] === 'done') return { name: 'done' };
  return { name: 'home' };
}

function useToday(): string {
  const [today, setToday] = useState(toDay);
  useEffect(() => {
    const refresh = () => setToday(toDay());
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  return today;
}

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));
  const [session, setSession] = useState<SessionSpec | null>(null);
  const [summary, setSummary] = useState<(SessionSummary & { lessonId?: string }) | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const today = useToday();

  useEffect(() => {
    if (!saveState(state)) setToast('Couldn’t save progress on this device');
  }, [state]);

  useEffect(() => {
    // Ask the browser not to evict our storage (helps on iOS).
    navigator.storage?.persist?.().catch(() => {});
    const onPop = () => setRoute(parseHash(location.hash));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const navigate = useCallback((hash: string, replace = false) => {
    const depth = (history.state?.depth ?? 0) + (replace ? 0 : 1);
    if (replace) history.replaceState({ depth }, '', hash);
    else history.pushState({ depth }, '', hash);
    setRoute(parseHash(hash));
    window.scrollTo(0, 0);
  }, []);

  const goBack = useCallback(() => {
    if ((history.state?.depth ?? 0) > 0) history.back();
    else navigate('#/', true);
  }, [navigate]);

  const plan = useMemo(() => todayPlan(state, today), [state, today]);

  const start = (spec: SessionSpec | null) => {
    if (!spec) return;
    if (spec.lessonId) {
      const trackId = getLesson(spec.lessonId)?.track.id;
      if (trackId && trackId !== state.currentTrackId) setState((s) => ({ ...s, currentTrackId: trackId }));
    }
    setSession(spec);
    navigate('#/session');
  };

  const finish = (s: SessionSummary) => {
    const lessonRef = session?.lessonId ? getLesson(session.lessonId) : undefined;
    setState((prev) =>
      applySession(prev, { answers: s.answers, lesson: lessonRef ? { lesson: lessonRef.lesson, accuracy: s.lessonAccuracy } : undefined }, toDay()),
    );
    setSummary({ ...s, lessonId: session?.lessonId });
    setSession(null);
    navigate('#/done', true);
  };

  let screen;
  if (route.name === 'session' && session) {
    screen = <Player key={session.title + session.items.length} spec={session} onExit={goBack} onFinish={finish} />;
  } else if (route.name === 'done' && summary) {
    screen = (
      <Complete
        lessonId={summary.lessonId}
        accuracy={summary.lessonAccuracy}
        reviewed={summary.reviewed}
        streak={displayStreak(state.streak, today)}
        onDone={() => navigate('#/', true)}
      />
    );
  } else if (route.name === 'track') {
    screen = <TrackScreen trackId={route.id} state={state} onBack={goBack} onStartLesson={(id) => start(lessonSession(id))} />;
  } else if (route.name === 'settings') {
    screen = <Settings state={state} setState={setState} onBack={goBack} notify={setToast} />;
  } else {
    screen = (
      <Home
        state={state}
        today={today}
        plan={plan}
        onStartToday={() => start(todaySession(plan))}
        onPractice={() => start({ title: 'Practice', items: practiceItems(state, state.settings.reviewsPerSession) })}
        onOpenTrack={(id) => navigate(`#/track/${encodeURIComponent(id)}`)}
        onOpenSettings={() => navigate('#/settings')}
      />
    );
  }

  return (
    <>
      {screen}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
