import type { Lesson, Module, Question, ServiceEntry, KeyTerm } from './types';

const files = import.meta.glob<{ default: Module }>('./modules/*.ts', { eager: true });

export const MODULES: Module[] = Object.values(files)
  .map((f) => f.default)
  .sort((a, b) => a.order - b.order);

export const LESSONS: Lesson[] = MODULES.flatMap((m) => m.lessons);

export const LESSON_BY_ID = new Map<string, Lesson>(LESSONS.map((l) => [l.id, l]));

export const MODULE_OF_LESSON = new Map<string, Module>(
  MODULES.flatMap((m) => m.lessons.map((l) => [l.id, m] as const)),
);

export type QuestionSource = 'knowledge' | 'practice' | 'bank';

export interface BankQuestion extends Question {
  source: QuestionSource;
  moduleId: string;
}

export const QUESTIONS: BankQuestion[] = MODULES.flatMap((m) => [
  ...m.lessons.flatMap((l) => [
    ...l.knowledgeCheck.map((q) => ({ ...q, lessonId: q.lessonId ?? l.id, source: 'knowledge' as const, moduleId: m.id })),
    ...l.practice.map((q) => ({ ...q, lessonId: q.lessonId ?? l.id, source: 'practice' as const, moduleId: m.id })),
  ]),
  ...m.bank.map((q) => ({ ...q, source: 'bank' as const, moduleId: m.id })),
]);

export const QUESTION_BY_ID = new Map<string, BankQuestion>(QUESTIONS.map((q) => [q.id, q]));

export const SERVICES: ServiceEntry[] = MODULES.flatMap((m) => m.services).sort((a, b) =>
  a.name.localeCompare(b.name),
);

export interface GlossaryEntry extends KeyTerm {
  lessonId: string;
}

/** Glossary is derived from every lesson's key terms; first definition wins for duplicates. */
export const GLOSSARY: GlossaryEntry[] = (() => {
  const seen = new Map<string, GlossaryEntry>();
  for (const l of LESSONS) {
    for (const t of l.keyTerms) {
      const k = t.term.trim().toLowerCase();
      if (!seen.has(k)) seen.set(k, { ...t, lessonId: l.id });
    }
  }
  return [...seen.values()].sort((a, b) => a.term.localeCompare(b.term));
})();

export function lessonIndex(id: string): number {
  return LESSONS.findIndex((l) => l.id === id);
}

export function adjacentLessons(id: string): { prev?: Lesson; next?: Lesson } {
  const i = lessonIndex(id);
  if (i < 0) return {};
  return { prev: LESSONS[i - 1], next: LESSONS[i + 1] };
}

export function lessonDomains(l: Lesson): number[] {
  return [...new Set(l.taskStatements.map((t) => Number(t.split('.')[0])))];
}

export * from './types';
export { DOMAINS, EXAM_FACTS, IN_SCOPE_SERVICES, taskStatementById } from './exam';
