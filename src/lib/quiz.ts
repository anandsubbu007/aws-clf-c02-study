import type { Question } from '../content/types';
import type { AttemptEntry, ProgressState } from './storage';

/** Small deterministic PRNG so shuffles are reproducible for review screens. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], seed: string): T[] {
  const rnd = mulberry32(hashString(seed));
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function newSeed(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Options in display order for a given attempt seed. */
export function displayOptions(q: Question, seed: string) {
  return shuffle(q.options, `${seed}:${q.id}`);
}

/** Multi-response questions are graded all-or-nothing (no partial credit). */
export function isCorrect(q: Pick<Question, 'correct'>, selected: readonly string[]): boolean {
  if (selected.length !== q.correct.length) return false;
  const set = new Set(selected);
  return q.correct.every((c) => set.has(c));
}

export function gradeEntries(questions: Question[], answers: Record<string, string[]>): AttemptEntry[] {
  return questions.map((q) => {
    const selected = answers[q.id] ?? [];
    return { id: q.id, selected, correct: selected.length > 0 && isCorrect(q, selected) };
  });
}

export function percent(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 1000) / 10;
}

/** Largest-remainder allocation so the parts always sum to `total`. */
export function allocateByWeight(total: number, weights: Record<number, number>): Record<number, number> {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  const raw = Object.entries(weights).map(([k, w]) => ({ k: Number(k), exact: (w / sum) * total }));
  const out: Record<number, number> = {};
  let used = 0;
  for (const r of raw) {
    out[r.k] = Math.floor(r.exact);
    used += out[r.k];
  }
  const order = [...raw].sort((a, b) => b.exact - Math.floor(b.exact) - (a.exact - Math.floor(a.exact)));
  for (let i = 0; used < total; i = (i + 1) % order.length) {
    out[order[i].k]++;
    used++;
  }
  return out;
}

/** Draws a domain-weighted question set, preferring unseen questions. Falls back to fewer if the bank is short. */
export function buildWeightedSet<T extends Question>(
  pool: readonly T[],
  total: number,
  weights: Record<number, number>,
  seed: string,
  state?: Pick<ProgressState, 'answers'>,
): T[] {
  const alloc = allocateByWeight(total, weights);
  const picked: T[] = [];
  for (const d of Object.keys(weights).map(Number)) {
    const inDomain = shuffle(
      pool.filter((q) => q.domain === d),
      `${seed}:d${d}`,
    );
    const unseen = inDomain.filter((q) => !state?.answers[q.id]);
    const seen = inDomain.filter((q) => state?.answers[q.id]);
    picked.push(...[...unseen, ...seen].slice(0, alloc[d]));
  }
  return shuffle(picked, `${seed}:final`);
}

export function formatDuration(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}
