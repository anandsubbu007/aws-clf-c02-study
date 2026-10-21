import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DOMAINS, EXAM_FACTS, QUESTIONS, QUESTION_BY_ID } from '../content';
import { useProgress } from '../lib/progress';
import { buildWeightedSet, formatDuration, gradeEntries, newSeed, percent } from '../lib/quiz';
import type { ActiveMock, MockResult } from '../lib/storage';
import { mockPercent } from '../lib/stats';
import { QuestionCard } from '../components/QuestionCard';
import { Callout, ConfirmDialog, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import { Icon } from '../components/Icon';

export const MOCK_SIZES = [
  { id: 'full', label: 'Full mock exam', n: EXAM_FACTS.totalQuestions, minutes: EXAM_FACTS.durationMinutes, note: 'Same length and time limit as the real exam (65 questions, 90 minutes).' },
  { id: 'half', label: 'Half mock', n: 33, minutes: 45, note: 'About half the length, with a proportional time limit.' },
  { id: 'mini', label: 'Mini mock', n: 20, minutes: 28, note: 'A 20-question sprint with a proportional time limit.' },
] as const;

const WEIGHTS: Record<number, number> = Object.fromEntries(DOMAINS.map((d) => [d.id, d.weight]));

export function MockIntro() {
  const { state, setActiveMock } = useProgress();
  const nav = useNavigate();
  const active = state.activeMock;
  const startMock = (sizeId: (typeof MOCK_SIZES)[number]['id']) => {
    const size = MOCK_SIZES.find((s) => s.id === sizeId)!;
    const seed = newSeed();
    const qs = buildWeightedSet(QUESTIONS, size.n, WEIGHTS, seed, state);
    const m: ActiveMock = {
      id: `mock-${seed}`,
      seed,
      label: size.label,
      questionIds: qs.map((q) => q.id),
      answers: {},
      flags: [],
      startedAt: Date.now(),
      limitSec: size.minutes * 60,
    };
    setActiveMock(m);
    nav('/mock/run');
  };

  return (
    <div className="stack-lg">
      <PageHeader title="Mock exam" subtitle="Timed practice with no feedback until you submit, then a full review." />
      <Callout kind="info" title="How this differs from the real exam" icon="info">
        <ul>
          <li>The official exam has {EXAM_FACTS.totalQuestions} questions ({EXAM_FACTS.scoredQuestions} scored, {EXAM_FACTS.unscoredQuestions} unscored) in {EXAM_FACTS.durationMinutes} minutes. Here <strong>every</strong> question is scored, and questions are drawn proportionally to the official domain weights (24 / 30 / 34 / 12%).</li>
          <li>Your result is a <strong>practice percentage</strong>. AWS reports a scaled score from 100 to 1,000 (pass = 700), which cannot be reproduced here. Do not read a percentage here as a predicted exam score.</li>
          <li>Multi-response questions are graded all-or-nothing. Unanswered questions count as incorrect.</li>
        </ul>
      </Callout>
      {active && (
        <div className="card row between">
          <div>
            <strong>You have a mock exam in progress.</strong>
            <div className="muted small">{active.label} · {Object.keys(active.answers).length} of {active.questionIds.length} answered</div>
          </div>
          <div className="row">
            <Link className="btn btn-primary" to="/mock/run">Resume</Link>
          </div>
        </div>
      )}
      <div className="grid3">
        {MOCK_SIZES.map((s) => (
          <section key={s.id} className="card stack-sm">
            <h2>{s.label}</h2>
            <p className="big">{s.n} questions · {s.minutes} min</p>
            <p className="muted">{s.note}</p>
            <button type="button" className="btn btn-primary" onClick={() => startMock(s.id)} disabled={!!active} title={active ? 'Finish or abandon your current mock first' : undefined}>
              <Icon name="play" size={16} /> Start {s.id === 'full' ? 'full mock' : s.label.toLowerCase()}
            </button>
          </section>
        ))}
      </div>
      <section className="card" aria-labelledby="mh">
        <h2 id="mh">Previous mock exams</h2>
        {state.mocks.length === 0 ? (
          <p className="muted">No mock exams completed yet.</p>
        ) : (
          <table>
            <thead><tr><th scope="col">Date</th><th scope="col">Type</th><th scope="col">Practice score</th><th scope="col">Time used</th><th scope="col"><span className="sr-only">Review</span></th></tr></thead>
            <tbody>
              {state.mocks.map((m) => (
                <tr key={m.id}>
                  <td>{new Date(m.at).toLocaleString()}</td>
                  <td>{m.label}</td>
                  <td>{mockPercent(m)}% ({m.entries.filter((e) => e.correct).length}/{m.entries.length})</td>
                  <td>{formatDuration(m.durationSec)}{m.timedOut ? ' (time up)' : ''}</td>
                  <td><Link to={`/mock/results/${m.id}`}>Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export function MockRun() {
  const { state, setActiveMock, recordMock } = useProgress();
  const nav = useNavigate();
  const mock = state.activeMock;
  const [idx, setIdx] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState<null | 'submit' | 'abandon'>(null);
  const submitted = useRef(false);

  const questions = useMemo(() => (mock ? mock.questionIds.map((id) => QUESTION_BY_ID.get(id)).filter((q): q is NonNullable<typeof q> => !!q) : []), [mock?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const remaining = mock ? Math.max(0, mock.limitSec - Math.floor((now - mock.startedAt) / 1000)) : 0;

  const submit = useCallback(
    (timedOut: boolean) => {
      if (!mock || submitted.current) return;
      submitted.current = true;
      const elapsed = Math.min(mock.limitSec, Math.round((Date.now() - mock.startedAt) / 1000));
      const flags = new Set(mock.flags);
      const entries = gradeEntries(questions, mock.answers).map((e) => ({ ...e, flagged: flags.has(e.id) || undefined }));
      const result: MockResult = { id: mock.id, at: new Date().toISOString(), seed: mock.seed, label: mock.label, limitSec: mock.limitSec, durationSec: elapsed, timedOut, entries };
      recordMock(result);
      nav(`/mock/results/${result.id}`, { replace: true });
    },
    [mock, questions, recordMock, nav],
  );

  useEffect(() => {
    if (!mock) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [mock]);

  useEffect(() => {
    if (mock && remaining <= 0) submit(true);
  }, [mock, remaining, submit]);

  if (!mock) {
    return (
      <EmptyState title="No mock exam in progress">
        <Link className="btn btn-primary" to="/mock">Start a mock exam</Link>
      </EmptyState>
    );
  }

  const q = questions[idx];
  const answered = Object.values(mock.answers).filter((a) => a.length > 0).length;
  const flagged = new Set(mock.flags);
  const low = remaining <= 300;

  return (
    <div className="mock-layout">
      <div className="mock-bar" role="region" aria-label="Exam status">
        <div>
          <strong>{mock.label}</strong>
          <div className="small muted">{answered} of {questions.length} answered</div>
        </div>
        <div className={`timer${low ? ' timer-low' : ''}`} role="timer" aria-live={remaining % 60 === 0 || remaining <= 10 ? 'polite' : 'off'} aria-label={`Time remaining ${formatDuration(remaining)}`}>
          <Icon name="clock" size={18} /> {formatDuration(remaining)}
        </div>
        <div className="row">
          <button type="button" className="btn btn-ghost" onClick={() => setConfirm('abandon')}>Abandon</button>
          <button type="button" className="btn btn-primary" onClick={() => setConfirm('submit')}>Submit exam</button>
        </div>
      </div>
      <ProgressBar value={(answered / questions.length) * 100} label="Answered questions" size="sm" />
      <div className="mock-body">
        <div className="stack">
          {q && (
            <QuestionCard
              key={q.id}
              q={q}
              seed={mock.seed}
              index={idx}
              total={questions.length}
              feedback={false}
              selected={mock.answers[q.id] ?? []}
              onSelect={(ids) => setActiveMock({ ...mock, answers: { ...mock.answers, [q.id]: ids } })}
            />
          )}
          <div className="row between">
            <button type="button" className="btn" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>
              <Icon name="arrowLeft" size={16} /> Previous
            </button>
            <button
              type="button"
              className="btn"
              aria-pressed={flagged.has(q.id)}
              onClick={() => setActiveMock({ ...mock, flags: flagged.has(q.id) ? mock.flags.filter((f) => f !== q.id) : [...mock.flags, q.id] })}
            >
              <Icon name="flag" size={16} /> {flagged.has(q.id) ? 'Flagged for review' : 'Flag for review'}
            </button>
            <button type="button" className="btn" onClick={() => setIdx(Math.min(questions.length - 1, idx + 1))} disabled={idx >= questions.length - 1}>
              Next <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
        <nav className="palette" aria-label="Question navigator">
          <h2 className="small">Questions</h2>
          <div className="palette-grid">
            {questions.map((qq, i) => {
              const has = (mock.answers[qq.id] ?? []).length > 0;
              return (
                <button
                  key={qq.id}
                  type="button"
                  className={`pal${i === idx ? ' current' : ''}${has ? ' answered' : ''}${flagged.has(qq.id) ? ' flagged' : ''}`}
                  aria-label={`Question ${i + 1}${has ? ', answered' : ', unanswered'}${flagged.has(qq.id) ? ', flagged' : ''}`}
                  aria-current={i === idx ? 'step' : undefined}
                  onClick={() => setIdx(i)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <p className="small muted">Filled = answered · Outlined = unanswered · Corner mark = flagged</p>
        </nav>
      </div>
      {confirm === 'submit' && (
        <ConfirmDialog
          title="Submit your exam?"
          confirmLabel="Submit and see results"
          message={
            <p>
              You have answered {answered} of {questions.length} questions.{' '}
              {questions.length - answered > 0 && <strong>{questions.length - answered} unanswered questions will be scored as incorrect. </strong>}
              {flagged.size > 0 && <>{flagged.size} flagged. </>}
              Time remaining: {formatDuration(remaining)}.
            </p>
          }
          onConfirm={() => submit(false)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm === 'abandon' && (
        <ConfirmDialog
          title="Abandon this mock exam?"
          confirmLabel="Abandon exam"
          message={<p>Your answers for this attempt will be discarded and it will not be recorded in your history.</p>}
          onConfirm={() => {
            setActiveMock(undefined);
            nav('/mock');
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

export function MockResults() {
  const { resultId } = useParams();
  const { state } = useProgress();
  const result = state.mocks.find((m) => m.id === resultId);
  const [filter, setFilter] = useState<'wrong' | 'flagged' | 'all'>('wrong');
  if (!result) return <EmptyState title="Result not found"><Link className="btn" to="/mock">Back to mock exams</Link></EmptyState>;

  const total = result.entries.length;
  const right = result.entries.filter((e) => e.correct).length;
  const unanswered = result.entries.filter((e) => e.selected.length === 0).length;
  const pct = percent(right, total);
  const byDomain = DOMAINS.map((d) => {
    const es = result.entries.filter((e) => QUESTION_BY_ID.get(e.id)?.domain === d.id);
    const c = es.filter((e) => e.correct).length;
    return { d, total: es.length, correct: c, pct: percent(c, es.length) };
  });
  const list = result.entries.filter((e) => (filter === 'all' ? true : filter === 'wrong' ? !e.correct : e.flagged));

  return (
    <div className="stack-lg">
      <PageHeader title="Mock exam results" subtitle={`${result.label} · ${new Date(result.at).toLocaleString()}`} actions={<Link className="btn" to="/mock">Back to mock exams</Link>} />
      <section className="card score-card" data-testid="mock-score">
        <div className="score-ring" aria-hidden="true"><span>{Math.round(pct)}%</span></div>
        <div>
          <h2>{right} of {total} correct (practice score)</h2>
          <p className="muted">
            Time used {formatDuration(result.durationSec)} of {formatDuration(result.limitSec)}{result.timedOut ? ' (time ran out and the exam was submitted automatically)' : ''} · {unanswered} unanswered.
          </p>
          <p className="small muted">This is a practice percentage, not an official scaled score (100–1,000; passing 700). It does not predict your exam result.</p>
        </div>
      </section>
      <section className="card" aria-labelledby="bd">
        <h2 id="bd">By domain</h2>
        <div className="domrows">
          {byDomain.map((x) => (
            <div key={x.d.id} className="domrow">
              <div><strong>Domain {x.d.id}: {x.d.title}</strong><div className="small muted">{x.correct}/{x.total} correct · official weight {x.d.weight}%</div></div>
              <div className="domrow-bars"><ProgressBar value={x.pct} label={`Domain ${x.d.id} score`} tone={x.pct >= 70 ? 'good' : 'warn'} /><span className="small">{x.pct}%</span></div>
            </div>
          ))}
        </div>
      </section>
      <section className="stack" aria-labelledby="rv">
        <h2 id="rv">Review questions</h2>
        <div className="row wrap" role="group" aria-label="Filter questions">
          <button className="btn btn-sm" aria-pressed={filter === 'wrong'} onClick={() => setFilter('wrong')}>Incorrect or unanswered ({result.entries.filter((e) => !e.correct).length})</button>
          <button className="btn btn-sm" aria-pressed={filter === 'flagged'} onClick={() => setFilter('flagged')}>Flagged ({result.entries.filter((e) => e.flagged).length})</button>
          <button className="btn btn-sm" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All ({total})</button>
        </div>
        {list.length === 0 && <p className="muted">Nothing to show for this filter.</p>}
        {list.map((e) => {
          const q = QUESTION_BY_ID.get(e.id);
          if (!q) return null;
          return (
            <div key={e.id} className="stack-sm">
              <QuestionCard q={q} seed={result.seed} review reviewSelected={e.selected} index={result.entries.findIndex((x) => x.id === e.id)} total={total} />
              {e.selected.length === 0 && <p className="small bad">Unanswered — scored as incorrect.</p>}
              {q.lessonId && <Link className="small" to={`/lesson/${q.lessonId}`}>Revisit the lesson →</Link>}
            </div>
          );
        })}
      </section>
    </div>
  );
}
