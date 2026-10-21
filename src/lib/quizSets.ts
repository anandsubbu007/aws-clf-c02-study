import { DOMAINS, LESSON_BY_ID, MODULES, QUESTIONS } from '../content';
import type { BankQuestion } from '../content';
import { shuffle } from './quiz';
import type { ProgressState, QuizAttempt } from './storage';
import { incorrectQuestionIds } from './stats';

export interface QuizSpec {
  mode: 'lesson' | 'module' | 'domain' | 'task' | 'mixed' | 'review';
  id?: string;
  n: number;
  nonce: string;
}

export function parseSpec(params: URLSearchParams): QuizSpec | null {
  const mode = params.get('mode');
  const n = Math.max(1, Math.min(100, Number(params.get('n')) || 10));
  const nonce = params.get('r') ?? '0';
  switch (mode) {
    case 'lesson':
      return { mode, id: params.get('lesson') ?? '', n, nonce };
    case 'module':
      return { mode, id: params.get('module') ?? '', n, nonce };
    case 'domain':
      return { mode, id: params.get('domain') ?? '', n, nonce };
    case 'task':
      return { mode, id: params.get('task') ?? '', n, nonce };
    case 'mixed':
    case 'review':
      return { mode, n, nonce };
    default:
      return null;
  }
}

export function specToParams(spec: QuizSpec): string {
  const p = new URLSearchParams({ mode: spec.mode, n: String(spec.n), r: spec.nonce });
  if (spec.id) p.set(spec.mode === 'lesson' ? 'lesson' : spec.mode === 'module' ? 'module' : spec.mode === 'domain' ? 'domain' : 'task', spec.id);
  return p.toString();
}

export function specLabel(spec: QuizSpec): { label: string; kind: QuizAttempt['kind'] } {
  switch (spec.mode) {
    case 'lesson':
      return { label: `Topic quiz: ${LESSON_BY_ID.get(spec.id ?? '')?.title ?? spec.id}`, kind: 'topic' };
    case 'module':
      return { label: `Module quiz: ${MODULES.find((m) => m.id === spec.id)?.title ?? spec.id}`, kind: 'module' };
    case 'domain':
      return { label: `Domain ${spec.id} quiz: ${DOMAINS.find((d) => String(d.id) === spec.id)?.title ?? ''}`, kind: 'domain' };
    case 'task':
      return { label: `Task ${spec.id} quiz`, kind: 'domain' };
    case 'review':
      return { label: 'Review of incorrect answers', kind: 'review' };
    default:
      return { label: 'Mixed quiz', kind: 'mixed' };
  }
}

/** Picks questions for a quiz: unseen and previously-missed questions first, then the rest, shuffled deterministically by nonce. */
export function selectQuestions(spec: QuizSpec, state: Pick<ProgressState, 'answers'>): BankQuestion[] {
  let pool: BankQuestion[];
  switch (spec.mode) {
    case 'lesson':
      pool = QUESTIONS.filter((q) => q.lessonId === spec.id);
      break;
    case 'module':
      pool = QUESTIONS.filter((q) => q.moduleId === spec.id);
      break;
    case 'domain':
      pool = QUESTIONS.filter((q) => String(q.domain) === spec.id);
      break;
    case 'task':
      pool = QUESTIONS.filter((q) => q.taskStatement === spec.id);
      break;
    case 'review': {
      const wrong = new Set(incorrectQuestionIds(state as ProgressState));
      pool = QUESTIONS.filter((q) => wrong.has(q.id));
      break;
    }
    default:
      pool = [...QUESTIONS];
  }
  const rank = (q: BankQuestion) => {
    const a = state.answers[q.id];
    if (!a) return 1; // unseen
    return a.lastCorrect ? 2 : 0; // missed first, then unseen, then known
  };
  const shuffled = shuffle(pool, `${spec.mode}:${spec.id ?? ''}:${spec.nonce}`);
  const ranked = [...shuffled].sort((a, b) => rank(a) - rank(b));
  // Keep a little variety: take the top n by rank, then shuffle the final order.
  return shuffle(ranked.slice(0, spec.n), `final:${spec.nonce}:${spec.mode}:${spec.id ?? ''}`);
}
