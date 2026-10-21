import { describe, expect, it } from 'vitest';
import { emptyState, exportJson, loadState, normalizeState, parseImport, saveState, STORAGE_KEY } from '../lib/storage';

describe('storage', () => {
  it('returns an empty state when nothing is saved or data is corrupt', () => {
    expect(loadState()).toEqual(emptyState());
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadState()).toEqual(emptyState());
  });

  it('round-trips state through localStorage', () => {
    const s = emptyState();
    s.completed['lesson-a'] = '2026-01-01T00:00:00.000Z';
    s.bookmarks.push('lesson-b');
    s.notes['lesson-a'] = { text: 'hello', updated: '2026-01-01' };
    expect(saveState(s)).toBe(true);
    expect(loadState()).toEqual(s);
  });

  it('normalises malformed data defensively', () => {
    const n = normalizeState({
      completed: { a: '2026', b: 5 },
      bookmarks: ['x', 'x', 3],
      answers: { q1: { attempts: 2, correct: 9, lastCorrect: 1 }, q2: 'bad' },
      cards: { c1: { box: 99, due: 'x' } },
      attempts: 'nope',
    });
    expect(n.completed).toEqual({ a: '2026' });
    expect(n.bookmarks).toEqual(['x']);
    expect(n.answers.q1.correct).toBe(2); // clamped to attempts
    expect(n.answers.q2).toBeUndefined();
    expect(n.cards.c1.box).toBe(5);
    expect(n.attempts).toEqual([]);
  });

  it('exports and imports progress, rejecting foreign files', () => {
    const s = emptyState();
    s.completed['lesson-a'] = 'now';
    const res = parseImport(exportJson(s));
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.state.completed).toEqual({ 'lesson-a': 'now' });
    expect(parseImport('not json').ok).toBe(false);
    expect(parseImport(JSON.stringify({ hello: 'world' })).ok).toBe(false);
  });
});
