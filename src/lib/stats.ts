import { DOMAINS, LESSONS, MODULES, QUESTIONS, taskStatementById } from '../content';
import type { Lesson, Module } from '../content';
import type { ProgressState } from './storage';
import { percent } from './quiz';

export interface Fraction {
  done: number;
  total: number;
  pct: number;
}

const frac = (done: number, total: number): Fraction => ({ done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) });

export function lessonsProgress(state: ProgressState, lessons: Lesson[] = LESSONS): Fraction {
  return frac(lessons.filter((l) => state.completed[l.id]).length, lessons.length);
}

export function moduleProgress(state: ProgressState, m: Module): Fraction {
  return lessonsProgress(state, m.lessons);
}

export function questionsAttempted(state: ProgressState, ids?: string[]): Fraction {
  const pool = ids ?? QUESTIONS.map((q) => q.id);
  return frac(pool.filter((id) => state.answers[id]?.attempts).length, pool.length);
}

export interface Accuracy {
  attempts: number;
  correct: number;
  pct: number | null;
}

export function accuracyOf(state: ProgressState, ids: string[]): Accuracy {
  let attempts = 0;
  let correct = 0;
  for (const id of ids) {
    const a = state.answers[id];
    if (a) {
      attempts += a.attempts;
      correct += a.correct;
    }
  }
  return { attempts, correct, pct: attempts ? percent(correct, attempts) : null };
}

export const overallAccuracy = (state: ProgressState): Accuracy => accuracyOf(state, QUESTIONS.map((q) => q.id));

export function domainAccuracy(state: ProgressState, domain: number): Accuracy {
  return accuracyOf(state, QUESTIONS.filter((q) => q.domain === domain).map((q) => q.id));
}

export function incorrectQuestionIds(state: ProgressState): string[] {
  return QUESTIONS.filter((q) => state.answers[q.id] && !state.answers[q.id].lastCorrect).map((q) => q.id);
}

export interface WeakArea {
  kind: 'task' | 'lesson';
  id: string;
  label: string;
  to: string;
  accuracy: number;
  attempts: number;
}

/** Areas with at least `minAttempts` answers and accuracy below `threshold` percent, weakest first. */
export function weakAreas(state: ProgressState, threshold = 70, minAttempts = 3): WeakArea[] {
  const out: WeakArea[] = [];
  for (const d of DOMAINS) {
    for (const t of d.taskStatements) {
      const ids = QUESTIONS.filter((q) => q.taskStatement === t.id).map((q) => q.id);
      const acc = accuracyOf(state, ids);
      if (acc.pct !== null && acc.attempts >= minAttempts && acc.pct < threshold) {
        out.push({ kind: 'task', id: t.id, label: `${t.id} ${t.title}`, to: `/practice?mode=task&task=${t.id}`, accuracy: acc.pct, attempts: acc.attempts });
      }
    }
  }
  for (const l of LESSONS) {
    const ids = QUESTIONS.filter((q) => q.lessonId === l.id).map((q) => q.id);
    const acc = accuracyOf(state, ids);
    if (acc.pct !== null && acc.attempts >= minAttempts && acc.pct < threshold) {
      out.push({ kind: 'lesson', id: l.id, label: l.title, to: `/lesson/${l.id}`, accuracy: acc.pct, attempts: acc.attempts });
    }
  }
  return out.sort((a, b) => a.accuracy - b.accuracy);
}

export interface Recommendation {
  title: string;
  detail: string;
  to: string;
}

export function nextLesson(state: ProgressState): Lesson | undefined {
  const startIdx = state.lastLesson ? LESSONS.findIndex((l) => l.id === state.lastLesson) : -1;
  const ordered = [...LESSONS.slice(startIdx + 1), ...LESSONS.slice(0, Math.max(0, startIdx + 1))];
  return ordered.find((l) => !state.completed[l.id]);
}

export function recommendations(state: ProgressState): Recommendation[] {
  const recs: Recommendation[] = [];
  const next = nextLesson(state);
  const lp = lessonsProgress(state);
  if (next) {
    recs.push({
      title: lp.done === 0 ? 'Start with the first lesson' : 'Continue learning',
      detail: `Next up: “${next.title}”.`,
      to: `/lesson/${next.id}`,
    });
  }
  const wrong = incorrectQuestionIds(state);
  if (wrong.length) {
    recs.push({ title: 'Review your incorrect answers', detail: `${wrong.length} question${wrong.length === 1 ? '' : 's'} you last answered incorrectly.`, to: '/practice?mode=review' });
  }
  const weak = weakAreas(state);
  if (weak[0]) {
    recs.push({ title: 'Revisit a weak area', detail: `${weak[0].label} — ${weak[0].accuracy}% over ${weak[0].attempts} answers.`, to: weak[0].to });
  }
  const unattempted = DOMAINS.map((d) => ({
    d,
    f: questionsAttempted(state, QUESTIONS.filter((q) => q.domain === d.id).map((q) => q.id)),
  })).sort((a, b) => a.f.pct - b.f.pct)[0];
  if (unattempted && unattempted.f.pct < 100) {
    recs.push({
      title: `Practise Domain ${unattempted.d.id}: ${unattempted.d.title}`,
      detail: `You have attempted ${unattempted.f.pct}% of its questions.`,
      to: `/practice?mode=domain&domain=${unattempted.d.id}`,
    });
  }
  if (lp.pct >= 70 && state.mocks.length === 0) {
    recs.push({ title: 'Try a timed mock exam', detail: 'Practise under exam-like conditions (65 questions, 90 minutes).', to: '/mock' });
  }
  if (recs.length === 0) recs.push({ title: 'Explore the course', detail: 'Pick any module to begin.', to: '/learn' });
  return recs.slice(0, 5);
}

export function mockPercent(m: { entries: { correct: boolean }[] }): number {
  return percent(m.entries.filter((e) => e.correct).length, m.entries.length);
}

export interface ReadinessCheck {
  id: string;
  label: string;
  met: boolean;
  detail: string;
}

export interface Readiness {
  checks: ReadinessCheck[];
  metCount: number;
  level: 'insufficient' | 'early' | 'developing' | 'strong';
  headline: string;
}

/** Study-readiness indicator. Thresholds are this site's recommendations, NOT official AWS criteria. */
export function readiness(state: ProgressState): Readiness {
  const lp = lessonsProgress(state);
  const qa = questionsAttempted(state);
  const acc = overallAccuracy(state);
  const lastMocks = state.mocks.slice(0, 2);
  const domainOk = DOMAINS.map((d) => ({ d, a: domainAccuracy(state, d.id) }));
  const checks: ReadinessCheck[] = [
    { id: 'lessons', label: 'At least 90% of lessons completed', met: lp.pct >= 90, detail: `${lp.done}/${lp.total} lessons (${lp.pct}%)` },
    { id: 'coverage', label: 'At least 80% of practice questions attempted', met: qa.pct >= 80, detail: `${qa.done}/${qa.total} questions (${qa.pct}%)` },
    { id: 'accuracy', label: 'Overall practice accuracy of at least 80%', met: (acc.pct ?? 0) >= 80 && acc.attempts >= 50, detail: acc.pct === null ? 'No answers yet' : `${acc.pct}% over ${acc.attempts} answers` },
    {
      id: 'domains',
      label: 'Every domain at 75% accuracy or better (min. 10 answers each)',
      met: domainOk.every((x) => x.a.attempts >= 10 && (x.a.pct ?? 0) >= 75),
      detail: domainOk.map((x) => `D${x.d.id}: ${x.a.pct === null ? '–' : x.a.pct + '%'}`).join(' · '),
    },
    {
      id: 'mocks',
      label: 'Two most recent full mock exams both at 80% or better',
      met: lastMocks.length === 2 && lastMocks.every((m) => mockPercent(m) >= 80),
      detail: state.mocks.length ? `Recent: ${lastMocks.map((m) => mockPercent(m) + '%').join(', ')}` : 'No mock exams taken yet',
    },
  ];
  const metCount = checks.filter((c) => c.met).length;
  let level: Readiness['level'] = 'strong';
  let headline = 'Strong practice performance';
  if (acc.attempts < 20 && lp.pct < 20) {
    level = 'insufficient';
    headline = 'Not enough data yet';
  } else if (metCount <= 1) {
    level = 'early';
    headline = 'Early in your preparation';
  } else if (metCount < 5) {
    level = 'developing';
    headline = 'Getting there — keep practising';
  }
  return { checks, metCount, level, headline };
}

/** Estimated study priority (domain weight × error rate). An estimate for planning, not an exam prediction. */
export function studyPriorities(state: ProgressState) {
  const rows = DOMAINS.map((d) => {
    const a = domainAccuracy(state, d.id);
    const gap = a.pct === null ? 1 : Math.max(0, 1 - a.pct / 100);
    return { domain: d, accuracy: a.pct, score: d.weight * (0.25 + gap) };
  });
  const sum = rows.reduce((x, r) => x + r.score, 0);
  return rows.map((r) => ({ ...r, share: Math.round((r.score / sum) * 100) })).sort((a, b) => b.score - a.score);
}

export function taskLabel(id: string): string {
  const t = taskStatementById(id);
  return t ? `${t.id} ${t.title}` : id;
}

export function moduleById(id: string) {
  return MODULES.find((m) => m.id === id);
}
