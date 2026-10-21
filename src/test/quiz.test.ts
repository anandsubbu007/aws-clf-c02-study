import { describe, expect, it } from 'vitest';
import { allocateByWeight, buildWeightedSet, displayOptions, formatDuration, gradeEntries, isCorrect, percent, shuffle } from '../lib/quiz';
import type { Question } from '../content/types';

const mk = (id: string, domain: 1 | 2 | 3 | 4, type: 'single' | 'multi' = 'single', correct = ['a']): Question => ({
  id,
  type,
  domain,
  taskStatement: `${domain}.1`,
  stem: 'A sufficiently long question stem for testing',
  options: ['a', 'b', 'c', 'd', 'e'].map((o) => ({ id: o, text: o, explanation: `Explanation for ${o} option here.` })),
  correct,
});

describe('grading', () => {
  it('grades single-answer questions', () => {
    const q = mk('q', 1);
    expect(isCorrect(q, ['a'])).toBe(true);
    expect(isCorrect(q, ['b'])).toBe(false);
    expect(isCorrect(q, [])).toBe(false);
  });

  it('grades multi-response all-or-nothing regardless of order', () => {
    const q = mk('q', 1, 'multi', ['a', 'c']);
    expect(isCorrect(q, ['c', 'a'])).toBe(true);
    expect(isCorrect(q, ['a'])).toBe(false);
    expect(isCorrect(q, ['a', 'b', 'c'])).toBe(false);
    expect(isCorrect(q, ['a', 'b'])).toBe(false);
  });

  it('treats unanswered as incorrect', () => {
    const qs = [mk('q1', 1), mk('q2', 2)];
    const e = gradeEntries(qs, { q1: ['a'] });
    expect(e).toEqual([
      { id: 'q1', selected: ['a'], correct: true },
      { id: 'q2', selected: [], correct: false },
    ]);
  });

  it('computes percentages and durations', () => {
    expect(percent(0, 0)).toBe(0);
    expect(percent(1, 3)).toBe(33.3);
    expect(percent(50, 65)).toBe(76.9);
    expect(formatDuration(5400)).toBe('1:30:00');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(-5)).toBe('0:00');
  });
});

describe('shuffling', () => {
  it('is deterministic per seed and preserves members', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(shuffle(items, 'x')).toEqual(shuffle(items, 'x'));
    expect([...shuffle(items, 'y')].sort()).toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('shuffles options without losing any', () => {
    const q = mk('q', 1);
    const o = displayOptions(q, 'seed');
    expect(o.map((x) => x.id).sort()).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});

describe('mock exam allocation', () => {
  const W = { 1: 24, 2: 30, 3: 34, 4: 12 };
  it('splits 65 questions by official weights using largest remainder', () => {
    expect(allocateByWeight(65, W)).toEqual({ 1: 16, 2: 19, 3: 22, 4: 8 });
  });
  it('splits the 50 scored questions as 12/15/17/6', () => {
    expect(allocateByWeight(50, W)).toEqual({ 1: 12, 2: 15, 3: 17, 4: 6 });
  });
  it('always sums to the requested total', () => {
    for (const n of [10, 20, 33, 65, 100]) {
      const a = allocateByWeight(n, W);
      expect(Object.values(a).reduce((x, y) => x + y, 0)).toBe(n);
    }
  });
  it('builds a weighted set, preferring unseen questions', () => {
    const pool: Question[] = [];
    for (const d of [1, 2, 3, 4] as const) for (let i = 0; i < 30; i++) pool.push(mk(`d${d}-${i}`, d));
    const answers = Object.fromEntries(pool.slice(0, 20).map((q) => [q.id, { attempts: 1, correct: 1, lastCorrect: true, lastAt: '' }]));
    const set = buildWeightedSet(pool, 20, W, 'seed', { answers });
    expect(set).toHaveLength(20);
    expect(new Set(set.map((q) => q.id)).size).toBe(20);
    expect(set.filter((q) => q.domain === 3)).toHaveLength(7);
    expect(set.filter((q) => answers[q.id]).length).toBe(0);
  });
});
