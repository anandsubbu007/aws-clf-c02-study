export const STORAGE_KEY = 'clf-c02-study-hub:progress';
export const THEME_KEY = 'clf-c02-theme';
export const SCHEMA_VERSION = 1;

export interface AnswerStat {
  attempts: number;
  correct: number;
  lastCorrect: boolean;
  lastAt: string;
}

export interface AttemptEntry {
  id: string; // question id
  selected: string[];
  correct: boolean;
}

export interface QuizAttempt {
  id: string;
  kind: 'topic' | 'module' | 'domain' | 'mixed' | 'review';
  label: string;
  at: string;
  seed: string;
  durationSec: number;
  entries: AttemptEntry[];
}

export interface MockEntry extends AttemptEntry {
  flagged?: boolean;
}

export interface MockResult {
  id: string;
  at: string;
  seed: string;
  label: string;
  limitSec: number;
  durationSec: number;
  timedOut: boolean;
  entries: MockEntry[]; // unanswered entries have selected: []
}

export interface ActiveMock {
  id: string;
  seed: string;
  label: string;
  questionIds: string[];
  answers: Record<string, string[]>;
  flags: string[];
  startedAt: number; // epoch ms
  limitSec: number;
}

export interface CardState {
  box: number; // Leitner box 1..5
  due: string; // ISO date
  seen: number;
}

export interface CustomCard {
  id: string;
  front: string;
  back: string;
}

export interface ProgressState {
  version: number;
  completed: Record<string, string>;
  bookmarks: string[];
  notes: Record<string, { text: string; updated: string }>;
  answers: Record<string, AnswerStat>;
  attempts: QuizAttempt[];
  mocks: MockResult[];
  activeMock?: ActiveMock;
  cards: Record<string, CardState>;
  customCards: CustomCard[];
  checklist: Record<string, boolean>;
  lastLesson?: string;
}

export function emptyState(): ProgressState {
  return {
    version: SCHEMA_VERSION,
    completed: {},
    bookmarks: [],
    notes: {},
    answers: {},
    attempts: [],
    mocks: [],
    cards: {},
    customCards: [],
    checklist: {},
  };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Defensively normalises unknown JSON (from localStorage or an import file) into a valid state. */
export function normalizeState(raw: unknown): ProgressState {
  const s = emptyState();
  if (!isObj(raw)) return s;
  if (isObj(raw.completed)) {
    for (const [k, v] of Object.entries(raw.completed)) if (typeof v === 'string') s.completed[k] = v;
  }
  if (Array.isArray(raw.bookmarks)) s.bookmarks = [...new Set(raw.bookmarks.filter((x): x is string => typeof x === 'string'))];
  if (isObj(raw.notes)) {
    for (const [k, v] of Object.entries(raw.notes)) {
      if (isObj(v) && typeof v.text === 'string') s.notes[k] = { text: v.text, updated: typeof v.updated === 'string' ? v.updated : '' };
    }
  }
  if (isObj(raw.answers)) {
    for (const [k, v] of Object.entries(raw.answers)) {
      if (isObj(v) && typeof v.attempts === 'number' && typeof v.correct === 'number') {
        s.answers[k] = {
          attempts: Math.max(0, v.attempts),
          correct: Math.max(0, Math.min(v.correct, v.attempts)),
          lastCorrect: Boolean(v.lastCorrect),
          lastAt: typeof v.lastAt === 'string' ? v.lastAt : '',
        };
      }
    }
  }
  const entries = (v: unknown): AttemptEntry[] =>
    Array.isArray(v)
      ? v.filter(isObj).map((e) => ({
          id: String(e.id),
          selected: Array.isArray(e.selected) ? e.selected.map(String) : [],
          correct: Boolean(e.correct),
        }))
      : [];
  if (Array.isArray(raw.attempts)) {
    s.attempts = raw.attempts.filter(isObj).map((a) => ({
      id: String(a.id),
      kind: (['topic', 'module', 'domain', 'mixed', 'review'] as const).includes(a.kind as never) ? (a.kind as QuizAttempt['kind']) : 'mixed',
      label: String(a.label ?? 'Quiz'),
      at: String(a.at ?? ''),
      seed: String(a.seed ?? a.id),
      durationSec: Number(a.durationSec) || 0,
      entries: entries(a.entries),
    }));
  }
  if (Array.isArray(raw.mocks)) {
    s.mocks = raw.mocks.filter(isObj).map((m) => ({
      id: String(m.id),
      at: String(m.at ?? ''),
      seed: String(m.seed ?? m.id),
      label: String(m.label ?? 'Mock exam'),
      limitSec: Number(m.limitSec) || 0,
      durationSec: Number(m.durationSec) || 0,
      timedOut: Boolean(m.timedOut),
      entries: entries(m.entries),
    }));
  }
  if (isObj(raw.activeMock) && Array.isArray(raw.activeMock.questionIds)) {
    const a = raw.activeMock;
    s.activeMock = {
      id: String(a.id),
      seed: String(a.seed ?? a.id),
      label: String(a.label ?? 'Mock exam'),
      questionIds: (a.questionIds as unknown[]).map(String),
      answers: isObj(a.answers)
        ? Object.fromEntries(Object.entries(a.answers).map(([k, v]) => [k, Array.isArray(v) ? v.map(String) : []]))
        : {},
      flags: Array.isArray(a.flags) ? a.flags.map(String) : [],
      startedAt: Number(a.startedAt) || Date.now(),
      limitSec: Number(a.limitSec) || 0,
    };
  }
  if (isObj(raw.cards)) {
    for (const [k, v] of Object.entries(raw.cards)) {
      if (isObj(v) && typeof v.box === 'number') {
        s.cards[k] = { box: Math.min(5, Math.max(1, Math.round(v.box))), due: String(v.due ?? ''), seen: Number(v.seen) || 0 };
      }
    }
  }
  if (Array.isArray(raw.customCards)) {
    s.customCards = raw.customCards
      .filter(isObj)
      .filter((c) => typeof c.front === 'string' && typeof c.back === 'string')
      .map((c) => ({ id: String(c.id), front: String(c.front), back: String(c.back) }));
  }
  if (isObj(raw.checklist)) {
    for (const [k, v] of Object.entries(raw.checklist)) s.checklist[k] = Boolean(v);
  }
  if (typeof raw.lastLesson === 'string') s.lastLesson = raw.lastLesson;
  return s;
}

export function loadState(storage: Storage = localStorage): ProgressState {
  try {
    const txt = storage.getItem(STORAGE_KEY);
    return txt ? normalizeState(JSON.parse(txt)) : emptyState();
  } catch {
    return emptyState();
  }
}

export function saveState(state: ProgressState, storage: Storage = localStorage): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export interface ExportFile {
  app: 'clf-c02-study-hub';
  exportedAt: string;
  state: ProgressState;
}

export function exportJson(state: ProgressState): string {
  const f: ExportFile = { app: 'clf-c02-study-hub', exportedAt: new Date().toISOString(), state };
  return JSON.stringify(f, null, 2);
}

export function parseImport(text: string): { ok: true; state: ProgressState } | { ok: false; error: string } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'The file is not valid JSON.' };
  }
  if (!isObj(data) || data.app !== 'clf-c02-study-hub' || !isObj(data.state)) {
    return { ok: false, error: 'This does not look like a CLF-C02 Study Hub export file.' };
  }
  return { ok: true, state: normalizeState(data.state) };
}
