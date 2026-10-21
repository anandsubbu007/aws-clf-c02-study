import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DOMAINS, MODULES, QUESTIONS } from '../content';
import { useProgress } from '../lib/progress';
import { parseSpec, selectQuestions, specLabel } from '../lib/quizSets';
import { incorrectQuestionIds, questionsAttempted, accuracyOf } from '../lib/stats';
import { newSeed } from '../lib/quiz';
import { QuizRunner } from '../components/QuizRunner';
import { EmptyState, PageHeader } from '../components/ui';

export function PracticePage() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { state } = useProgress();
  const spec = parseSpec(params);
  const key = params.toString();

  // Question selection is frozen for the life of this quiz URL (progress updates must not reshuffle it).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = useMemo(() => (spec ? selectQuestions(spec, state) : []), [key]);

  if (spec) {
    const { label, kind } = specLabel(spec);
    return (
      <div className="stack-lg">
        <PageHeader title={label} subtitle="Immediate feedback with an explanation for every option." actions={<Link className="btn" to="/practice">All quizzes</Link>} />
        {questions.length === 0 ? (
          <EmptyState title="No questions available">
            {spec.mode === 'review' ? 'You have no incorrect answers to review. Great work!' : 'There are no questions for this selection yet.'}
          </EmptyState>
        ) : (
          <QuizRunner key={key} questions={questions} kind={kind} label={label} onExit={() => nav('/practice')} />
        )}
      </div>
    );
  }

  const start = (mode: string, extra: Record<string, string>, n: number) => `/practice?${new URLSearchParams({ mode, ...extra, n: String(n), r: newSeed() }).toString()}`;
  const wrong = incorrectQuestionIds(state).length;
  const qa = questionsAttempted(state);

  return (
    <div className="stack-lg">
      <PageHeader title="Quizzes" subtitle={`${QUESTIONS.length} original questions. Missed and unseen questions are served first. Multi-response questions are graded all-or-nothing.`} />

      <section className="card" aria-labelledby="q1">
        <h2 id="q1">Quick starts</h2>
        <div className="row wrap">
          <Link className="btn btn-primary" to={start('mixed', {}, 20)}>Mixed quiz · 20 questions</Link>
          <Link className="btn" to={start('mixed', {}, 10)}>Mixed · 10</Link>
          <Link className="btn" to={start('review', {}, 20)} aria-disabled={wrong === 0}>
            Review incorrect ({wrong})
          </Link>
          <Link className="btn" to="/mock">Timed mock exam</Link>
        </div>
        <p className="small muted">You have attempted {qa.done} of {qa.total} questions.</p>
      </section>

      <section className="card" aria-labelledby="q2">
        <h2 id="q2">Domain quizzes</h2>
        <div className="grid2">
          {DOMAINS.map((d) => {
            const ids = QUESTIONS.filter((q) => q.domain === d.id).map((q) => q.id);
            const acc = accuracyOf(state, ids);
            return (
              <div key={d.id} className="subcard">
                <strong>Domain {d.id}: {d.title}</strong>
                <span className="small muted">{ids.length} questions · {d.weight}% of exam · accuracy {acc.pct === null ? '–' : `${acc.pct}%`}</span>
                <div className="row wrap">
                  <Link className="btn btn-sm" to={start('domain', { domain: String(d.id) }, 10)}>10 questions</Link>
                  <Link className="btn btn-sm" to={start('domain', { domain: String(d.id) }, 25)}>25 questions</Link>
                </div>
                <div className="row wrap">
                  {d.taskStatements.map((t) => (
                    <Link key={t.id} className="chip chip-link" to={start('task', { task: t.id }, 10)} title={t.title}>
                      Task {t.id}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card" aria-labelledby="q3">
        <h2 id="q3">Module and topic quizzes</h2>
        {MODULES.map((m) => {
          const ids = QUESTIONS.filter((q) => q.moduleId === m.id).map((q) => q.id);
          const acc = accuracyOf(state, ids);
          return (
            <details key={m.id} className="qdetails">
              <summary>
                <span aria-hidden="true">{m.icon}</span> {m.order}. {m.title} <span className="small muted">· {ids.length} questions · accuracy {acc.pct === null ? '–' : `${acc.pct}%`}</span>
              </summary>
              <div className="stack-sm">
                <Link className="btn btn-sm btn-primary" to={start('module', { module: m.id }, 15)}>Whole module quiz (15)</Link>
                <ul className="lesson-list">
                  {m.lessons.map((l) => (
                    <li key={l.id}>
                      <Link to={start('lesson', { lesson: l.id }, 5)}>
                        <span><strong>{l.title}</strong> <span className="small muted">· topic quiz (5 questions)</span></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}

