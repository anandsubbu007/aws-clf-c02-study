import { describe, expect, it } from 'vitest';
import { MODULES, LESSONS, QUESTIONS, SERVICES } from '../content';
import { DOMAINS, IN_SCOPE_SERVICES, taskStatementById } from '../content/exam';
import type { Question } from '../content/types';

const BANNED = /\b(TODO|TBD|lorem ipsum|placeholder|FIXME)\b/i;
const ALLOWED_HOST = /(^|\.)(amazon\.com|aws|amazonaws\.com|aws\.dev|awsstatic\.com)$/i;

function allStrings(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => allStrings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => allStrings(x, out));
  return out;
}

function checkQuestion(q: Question) {
  const ctx = `question ${q.id}`;
  expect(q.stem.trim().length, `${ctx} stem`).toBeGreaterThan(15);
  const ids = q.options.map((o) => o.id);
  expect(new Set(ids).size, `${ctx} unique option ids`).toBe(ids.length);
  expect(q.correct.length, `${ctx} has correct`).toBeGreaterThan(0);
  for (const c of q.correct) expect(ids, `${ctx} correct id ${c} exists`).toContain(c);
  if (q.type === 'single') {
    expect(q.options.length, `${ctx} single has 4 options`).toBe(4);
    expect(q.correct.length, `${ctx} single has 1 correct`).toBe(1);
  } else {
    expect(q.options.length, `${ctx} multi has >=5 options`).toBeGreaterThanOrEqual(5);
    expect(q.correct.length, `${ctx} multi has >=2 correct`).toBeGreaterThanOrEqual(2);
    expect(q.correct.length, `${ctx} multi leaves a distractor`).toBeLessThan(q.options.length);
  }
  for (const o of q.options) {
    expect(o.text.trim().length, `${ctx} option ${o.id} text`).toBeGreaterThan(0);
    expect(o.explanation.trim().length, `${ctx} option ${o.id} explanation`).toBeGreaterThan(25);
    expect(o.explanation, `${ctx} option ${o.id} must not reference option letters`).not.toMatch(/\b(option|answer|choice)\s+\(?[A-F]\)?\b/);
  }
  const ts = taskStatementById(q.taskStatement);
  expect(ts, `${ctx} task statement ${q.taskStatement}`).toBeTruthy();
  expect(ts!.domain, `${ctx} domain matches task statement`).toBe(q.domain);
}

describe('content integrity', () => {
  it('has modules and lessons', () => {
    expect(MODULES.length).toBeGreaterThanOrEqual(1);
    expect(LESSONS.length).toBeGreaterThanOrEqual(1);
  });

  it('uses unique module, lesson and question ids with correct prefixes', () => {
    expect(new Set(MODULES.map((m) => m.id)).size).toBe(MODULES.length);
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    for (const m of MODULES) {
      expect(m.id).toMatch(/^m\d\d-[a-z0-9-]+$/);
      for (const l of m.lessons) expect(l.id.startsWith(m.id.slice(0, 3)), `${l.id} prefix`).toBe(true);
    }
  });

  for (const m of MODULES) {
    describe(`module ${m.id}`, () => {
      it('has required module fields', () => {
        expect(m.title).toBeTruthy();
        expect(m.icon).toBeTruthy();
        expect(m.summary.length).toBeGreaterThan(30);
        expect(m.domains.length).toBeGreaterThan(0);
        expect(m.lessons.length).toBeGreaterThan(0);
        expect(m.bank.length, 'bank questions').toBeGreaterThanOrEqual(6);
      });

      for (const l of m.lessons) {
        it(`lesson ${l.id} is complete`, () => {
          expect(l.title && l.topic && l.subtopic).toBeTruthy();
          expect(l.taskStatements.length).toBeGreaterThan(0);
          for (const t of l.taskStatements) expect(taskStatementById(t), `${l.id} task ${t}`).toBeTruthy();
          expect(l.minutes).toBeGreaterThan(2);
          expect(l.objectives.length).toBeGreaterThanOrEqual(3);
          expect(l.explanation.length).toBeGreaterThanOrEqual(3);
          expect(l.analogy.length).toBeGreaterThan(40);
          expect(l.example.length).toBeGreaterThan(40);
          expect(l.howItWorks.length).toBeGreaterThanOrEqual(3);
          expect(l.whenToUse.length).toBeGreaterThanOrEqual(2);
          expect(l.limitations.length).toBeGreaterThanOrEqual(2);
          expect(l.keyTerms.length).toBeGreaterThanOrEqual(4);
          expect(l.mistakes.length).toBeGreaterThanOrEqual(2);
          expect(l.examTips.length).toBeGreaterThanOrEqual(2);
          expect(l.comparisons.length).toBeGreaterThanOrEqual(1);
          for (const c of l.comparisons) {
            expect(c.rows.length).toBeGreaterThanOrEqual(2);
            for (const r of c.rows) expect(r.length, `${l.id} table ${c.title}`).toBe(c.headers.length);
          }
          expect(l.memoryAids.length).toBeGreaterThanOrEqual(1);
          expect(l.revision.length).toBeGreaterThanOrEqual(4);
          expect(l.diagrams.length).toBeGreaterThanOrEqual(1);
          expect(new Set(l.diagrams.map((d) => d.id)).size).toBe(l.diagrams.length);
          for (const d of l.diagrams) {
            if (d.type === 'mindmap') expect(d.branches.length).toBeGreaterThanOrEqual(3);
            if (d.type === 'flow') expect(d.steps.length).toBeGreaterThanOrEqual(3);
            if (d.type === 'layers') expect(d.layers.length).toBeGreaterThanOrEqual(2);
            if (d.type === 'columns') expect(d.columns.length).toBeGreaterThanOrEqual(2);
          }
          expect(l.references.length).toBeGreaterThanOrEqual(2);
          for (const r of l.references) {
            const u = new URL(r.url);
            expect(u.protocol, `${l.id} ref ${r.url}`).toBe('https:');
            expect(ALLOWED_HOST.test(u.hostname), `${l.id} ref host ${u.hostname}`).toBe(true);
          }
          expect(l.knowledgeCheck.length).toBe(2);
          expect(l.practice.length).toBe(3);
          l.knowledgeCheck.concat(l.practice).forEach((q) => {
            expect(q.id.startsWith(l.id), `${q.id} should start with lesson id`).toBe(true);
            checkQuestion(q);
          });
          expect(l.related.length).toBeGreaterThanOrEqual(1);
          for (const r of l.related) {
            expect(LESSONS.some((x) => x.id === r.lessonId), `${l.id} related ${r.lessonId}`).toBe(true);
          }
          expect(allStrings(l).filter((s) => BANNED.test(s))).toEqual([]);
        });
      }

      it('bank questions are valid', () => {
        for (const q of m.bank) {
          expect(q.id.startsWith(`${m.id}-b`), `${q.id} should start with ${m.id}-b`).toBe(true);
          checkQuestion(q);
        }
      });

      it('services are valid and link to lessons in this module', () => {
        for (const s of m.services) {
          expect(s.name && s.category && s.summary.length > 20, `service ${s.name}`).toBeTruthy();
          expect(m.lessons.some((l) => l.id === s.lessonId), `service ${s.name} lesson ${s.lessonId}`).toBe(true);
        }
      });
    });
  }
});

describe('syllabus coverage (whole-site, enforced when all modules are present)', () => {
  const full = MODULES.length >= 10;
  it.runIf(full)('every task statement has lessons and at least 3 questions', () => {
    for (const d of DOMAINS) {
      for (const t of d.taskStatements) {
        expect(LESSONS.some((l) => l.taskStatements.includes(t.id)), `lesson for ${t.id}`).toBe(true);
        expect(QUESTIONS.filter((q) => q.taskStatement === t.id).length, `questions for ${t.id}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it.runIf(full)('every official in-scope service has a directory entry', () => {
    const names = new Set(SERVICES.map((s) => s.name));
    const missing = Object.values(IN_SCOPE_SERVICES).flat().filter((n) => !names.has(n));
    expect(missing).toEqual([]);
  });

  it.runIf(full)('question bank is large enough for a 65-question domain-weighted mock', () => {
    const per = [1, 2, 3, 4].map((d) => QUESTIONS.filter((q) => q.domain === d).length);
    expect(per[0]).toBeGreaterThanOrEqual(16);
    expect(per[1]).toBeGreaterThanOrEqual(19);
    expect(per[2]).toBeGreaterThanOrEqual(22);
    expect(per[3]).toBeGreaterThanOrEqual(8);
  });

  it.runIf(full)('correct answers are not dominated by one option position', () => {
    const singles = QUESTIONS.filter((q) => q.type === 'single');
    const counts: Record<string, number> = {};
    singles.forEach((q) => (counts[q.correct[0]] = (counts[q.correct[0]] ?? 0) + 1));
    for (const c of Object.values(counts)) expect(c / singles.length).toBeLessThan(0.4);
  });
});
