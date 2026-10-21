import { describe, expect, it } from 'vitest';
import { DOMAINS, LESSONS, MODULES, QUESTIONS } from '../content';
import { emptyState } from '../lib/storage';
import type { ProgressState } from '../lib/storage';
import { accuracyOf, incorrectQuestionIds, lessonsProgress, moduleProgress, nextLesson, questionsAttempted, readiness, recommendations, studyPriorities, weakAreas } from '../lib/stats';
import { applyAnswer, applyCardReview, applyEntries } from '../lib/progress';
import { search } from '../lib/search';
import { parseSpec, selectQuestions } from '../lib/quizSets';

describe('progress calculations', () => {
  it('computes lesson and module completion', () => {
    const s: ProgressState = emptyState();
    expect(lessonsProgress(s).pct).toBe(0);
    s.completed[LESSONS[0].id] = 'x';
    s.completed[LESSONS[1].id] = 'x';
    const p = lessonsProgress(s);
    expect(p.done).toBe(2);
    expect(p.total).toBe(LESSONS.length);
    expect(p.pct).toBe(Math.round((2 / LESSONS.length) * 100));
    const m = MODULES[0];
    expect(moduleProgress(s, m).done).toBe(m.lessons.filter((l) => s.completed[l.id]).length);
  });

  it('records answers cumulatively and tracks the last result', () => {
    let s = emptyState();
    const id = QUESTIONS[0].id;
    s = applyAnswer(s, id, false);
    s = applyAnswer(s, id, true);
    s = applyAnswer(s, id, true);
    expect(s.answers[id]).toMatchObject({ attempts: 3, correct: 2, lastCorrect: true });
    expect(accuracyOf(s, [id]).pct).toBe(66.7);
    expect(incorrectQuestionIds(s)).toEqual([]);
    s = applyAnswer(s, id, false);
    expect(incorrectQuestionIds(s)).toEqual([id]);
  });

  it('ignores skipped questions when applying attempt entries', () => {
    const [a, b] = QUESTIONS;
    const s = applyEntries(emptyState(), [
      { id: a.id, selected: ['x'], correct: true },
      { id: b.id, selected: [], correct: false },
    ]);
    expect(Object.keys(s.answers)).toEqual([a.id]);
    expect(questionsAttempted(s).done).toBe(1);
  });

  it('detects weak areas only after enough attempts', () => {
    let s = emptyState();
    const q = QUESTIONS.find((x) => x.lessonId)!;
    s = applyAnswer(s, q.id, false);
    expect(weakAreas(s)).toEqual([]);
    s = applyAnswer(applyAnswer(s, q.id, false), q.id, false);
    const weak = weakAreas(s);
    expect(weak.length).toBeGreaterThan(0);
    expect(weak.every((w) => w.accuracy < 70)).toBe(true);
  });

  it('suggests the first lesson to a new learner and review after mistakes', () => {
    const s = emptyState();
    expect(nextLesson(s)?.id).toBe(LESSONS[0].id);
    expect(recommendations(s)[0].to).toBe(`/lesson/${LESSONS[0].id}`);
    const s2 = applyAnswer(s, QUESTIONS[0].id, false);
    expect(recommendations(s2).some((r) => r.to.includes('mode=review'))).toBe(true);
  });

  it('continues after the last visited lesson', () => {
    const s = { ...emptyState(), lastLesson: LESSONS[0].id };
    expect(nextLesson(s)?.id).toBe(LESSONS[1].id);
  });

  it('reports insufficient readiness data for a fresh profile', () => {
    const r = readiness(emptyState());
    expect(r.level).toBe('insufficient');
    expect(r.metCount).toBe(0);
  });

  it('marks readiness checks met for a strong profile', () => {
    const s = emptyState();
    LESSONS.forEach((l) => (s.completed[l.id] = 'x'));
    QUESTIONS.forEach((q) => (s.answers[q.id] = { attempts: 2, correct: 2, lastCorrect: true, lastAt: '' }));
    const entries = QUESTIONS.slice(0, 10).map((q) => ({ id: q.id, selected: ['a'], correct: true }));
    s.mocks = [1, 2].map((i) => ({ id: `m${i}`, at: '', seed: 's', label: 'Mock', limitSec: 1, durationSec: 1, timedOut: false, entries }));
    const r = readiness(s);
    expect(r.metCount).toBe(5);
    expect(r.level).toBe('strong');
  });

  it('weights study priority by domain weight and weak accuracy', () => {
    const rows = studyPriorities(emptyState());
    expect(rows.reduce((a, r) => a + r.share, 0)).toBeGreaterThanOrEqual(99);
    expect(rows[0].domain.id).toBe(3); // highest official weight when there is no data
    expect(DOMAINS.length).toBe(4);
  });

  it('advances flashcard boxes on success and resets on failure', () => {
    let s = emptyState();
    s = applyCardReview(s, 'c', true);
    s = applyCardReview(s, 'c', true);
    expect(s.cards.c.box).toBe(3);
    s = applyCardReview(s, 'c', false);
    expect(s.cards.c.box).toBe(1);
    for (let i = 0; i < 10; i++) s = applyCardReview(s, 'c', true);
    expect(s.cards.c.box).toBe(5);
  });
});

describe('quiz set selection', () => {
  it('parses quiz URLs and rejects unknown modes', () => {
    expect(parseSpec(new URLSearchParams('mode=domain&domain=2&n=15'))).toMatchObject({ mode: 'domain', id: '2', n: 15 });
    expect(parseSpec(new URLSearchParams('mode=bogus'))).toBeNull();
    expect(parseSpec(new URLSearchParams(''))).toBeNull();
  });

  it('selects only questions from the requested domain, without duplicates', () => {
    const qs = selectQuestions({ mode: 'domain', id: '3', n: 10, nonce: '1' }, emptyState());
    expect(qs.length).toBeGreaterThan(0);
    expect(qs.every((q) => q.domain === 3)).toBe(true);
    expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
  });

  it('serves previously missed questions first', () => {
    let s = emptyState();
    const missed = QUESTIONS[5];
    s = applyAnswer(s, missed.id, false);
    const qs = selectQuestions({ mode: 'mixed', n: 3, nonce: 'z' }, s);
    expect(qs.map((q) => q.id)).toContain(missed.id);
  });

  it('review mode returns only incorrect questions', () => {
    let s = emptyState();
    s = applyAnswer(s, QUESTIONS[0].id, false);
    s = applyAnswer(s, QUESTIONS[1].id, true);
    const qs = selectQuestions({ mode: 'review', n: 10, nonce: '1' }, s);
    expect(qs.map((q) => q.id)).toEqual([QUESTIONS[0].id]);
  });
});

describe('search', () => {
  it('returns nothing for blank queries', () => {
    expect(search('   ')).toEqual([]);
  });

  it('finds lessons by title words and keywords', () => {
    const r = search('elasticity');
    expect(r.length).toBeGreaterThan(0);
    expect(r.some((x) => x.doc.kind === 'lesson')).toBe(true);
  });

  it('requires all words to match and ranks title matches first', () => {
    const r = search('value aws cloud');
    expect(r[0].doc.to).toBe('/lesson/m01-value-of-aws-cloud');
    expect(search('zzzznotaword')).toEqual([]);
  });

  it('finds glossary terms and services', () => {
    expect(search('Amazon S3').some((x) => x.doc.kind === 'service')).toBe(true);
    expect(search('high availability').some((x) => x.doc.kind === 'term')).toBe(true);
  });
});
