import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  emptyState,
  loadState,
  saveState,
  THEME_KEY,
} from './storage';
import type { ActiveMock, AttemptEntry, MockResult, ProgressState, QuizAttempt } from './storage';

export type Theme = 'light' | 'dark';

export interface ProgressApi {
  state: ProgressState;
  saveFailed: boolean;
  toggleComplete(lessonId: string): void;
  setLastLesson(lessonId: string): void;
  toggleBookmark(lessonId: string): void;
  setNote(lessonId: string, text: string): void;
  recordAnswer(questionId: string, correct: boolean): void;
  recordAttempt(attempt: QuizAttempt): void;
  recordMock(result: MockResult): void;
  setActiveMock(m: ActiveMock | undefined): void;
  reviewCard(cardId: string, knew: boolean): void;
  addCard(front: string, back: string): void;
  removeCard(id: string): void;
  toggleChecklist(id: string): void;
  replaceState(s: ProgressState): void;
  reset(): void;
  theme: Theme;
  setTheme(t: Theme): void;
}

const Ctx = createContext<ProgressApi | null>(null);

const addDays = (d: number) => new Date(Date.now() + d * 86400000).toISOString();
/** Leitner intervals in days for boxes 1..5 */
export const CARD_INTERVALS = [0, 1, 3, 7, 14];

export function applyAnswer(state: ProgressState, id: string, correct: boolean): ProgressState {
  const prev = state.answers[id] ?? { attempts: 0, correct: 0, lastCorrect: false, lastAt: '' };
  return {
    ...state,
    answers: {
      ...state.answers,
      [id]: { attempts: prev.attempts + 1, correct: prev.correct + (correct ? 1 : 0), lastCorrect: correct, lastAt: new Date().toISOString() },
    },
  };
}

export function applyEntries(state: ProgressState, entries: AttemptEntry[]): ProgressState {
  return entries.filter((e) => e.selected.length > 0).reduce((s, e) => applyAnswer(s, e.id, e.correct), state);
}

export function applyCardReview(state: ProgressState, cardId: string, knew: boolean): ProgressState {
  const prev = state.cards[cardId] ?? { box: 1, due: '', seen: 0 };
  const box = knew ? Math.min(5, prev.box + 1) : 1;
  return { ...state, cards: { ...state.cards, [cardId]: { box, seen: prev.seen + 1, due: addDays(CARD_INTERVALS[box - 1]) } } };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadState());
  const [saveFailed, setSaveFailed] = useState(false);
  const [theme, setThemeState] = useState<Theme>(() => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'));
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSaveFailed(!saveState(state));
  }, [state]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(t));
    } catch {
      /* ignore */
    }
  }, []);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      saveFailed,
      theme,
      setTheme,
      toggleComplete: (id) =>
        setState((s) => {
          const completed = { ...s.completed };
          if (completed[id]) delete completed[id];
          else completed[id] = new Date().toISOString();
          return { ...s, completed };
        }),
      setLastLesson: (id) => setState((s) => (s.lastLesson === id ? s : { ...s, lastLesson: id })),
      toggleBookmark: (id) =>
        setState((s) => ({ ...s, bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((b) => b !== id) : [...s.bookmarks, id] })),
      setNote: (id, text) =>
        setState((s) => {
          const notes = { ...s.notes };
          if (text.trim() === '') delete notes[id];
          else notes[id] = { text, updated: new Date().toISOString() };
          return { ...s, notes };
        }),
      recordAnswer: (id, correct) => setState((s) => applyAnswer(s, id, correct)),
      recordAttempt: (attempt) =>
        setState((s) => ({ ...applyEntries(s, attempt.entries), attempts: [attempt, ...s.attempts].slice(0, 200) })),
      recordMock: (result) =>
        setState((s) => ({ ...applyEntries(s, result.entries), mocks: [result, ...s.mocks].slice(0, 50), activeMock: undefined })),
      setActiveMock: (m) => setState((s) => ({ ...s, activeMock: m })),
      reviewCard: (id, knew) => setState((s) => applyCardReview(s, id, knew)),
      addCard: (front, back) =>
        setState((s) => ({ ...s, customCards: [...s.customCards, { id: `custom-${Date.now().toString(36)}-${s.customCards.length}`, front, back }] })),
      removeCard: (id) =>
        setState((s) => {
          const cards = { ...s.cards };
          delete cards[id];
          return { ...s, customCards: s.customCards.filter((c) => c.id !== id), cards };
        }),
      toggleChecklist: (id) => setState((s) => ({ ...s, checklist: { ...s.checklist, [id]: !s.checklist[id] } })),
      replaceState: (s) => setState(s),
      reset: () => setState(emptyState()),
    }),
    [state, saveFailed, theme, setTheme],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProgress must be used inside ProgressProvider');
  return v;
}
