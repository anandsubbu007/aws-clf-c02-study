import { Link } from 'react-router-dom';
import { DOMAINS, LESSONS, MODULES, QUESTIONS } from '../content';
import { useProgress } from '../lib/progress';
import { domainAccuracy, incorrectQuestionIds, lessonsProgress, moduleProgress, nextLesson, overallAccuracy, questionsAttempted, recommendations, studyPriorities, weakAreas } from '../lib/stats';
import { ProgressBar } from '../components/ui';
import { Icon } from '../components/Icon';
import { mockPercent } from '../lib/stats';

function Stat({ label, value, sub, to }: { label: string; value: string; sub?: string; to?: string }) {
  const body = (
    <>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </>
  );
  return to ? (
    <Link to={to} className="card stat">
      {body}
    </Link>
  ) : (
    <div className="card stat">{body}</div>
  );
}

export function Dashboard() {
  const { state } = useProgress();
  const lp = lessonsProgress(state);
  const qa = questionsAttempted(state);
  const acc = overallAccuracy(state);
  const wrong = incorrectQuestionIds(state);
  const weak = weakAreas(state);
  const recs = recommendations(state);
  const next = nextLesson(state);
  const pri = studyPriorities(state);
  const lastMock = state.mocks[0];

  return (
    <div className="stack-lg">
      <section className="hero">
        <div>
          <p className="eyebrow">AWS Certified Cloud Practitioner · CLF-C02</p>
          <h1>Learn it, practise it, track it.</h1>
          <p className="lead">
            {LESSONS.length} lessons across {MODULES.length} modules, {QUESTIONS.length} original practice questions, flashcards, a searchable glossary and timed mock exams — all saved in your browser.
          </p>
          <div className="row wrap">
            {next && (
              <Link className="btn btn-primary" to={`/lesson/${next.id}`}>
                <Icon name="play" size={16} /> {lp.done === 0 ? 'Start learning' : 'Continue: ' + next.title}
              </Link>
            )}
            <Link className="btn" to="/exam">
              <Icon name="target" size={16} /> Exam guide
            </Link>
            <Link className="btn" to="/mock">
              <Icon name="clock" size={16} /> Mock exam
            </Link>
          </div>
        </div>
        <div className="hero-ring" aria-label={`Overall lesson completion ${lp.pct}%`}>
          <svg viewBox="0 0 120 120" role="img" aria-hidden="true">
            <circle cx="60" cy="60" r="52" className="ring-bg" />
            <circle cx="60" cy="60" r="52" className="ring-fg" strokeDasharray={`${(lp.pct / 100) * 326.7} 326.7`} transform="rotate(-90 60 60)" />
          </svg>
          <div>
            <strong>{lp.pct}%</strong>
            <span>lessons complete</span>
          </div>
        </div>
      </section>

      <section aria-label="Progress summary" className="grid4">
        <Stat label="Lessons completed" value={`${lp.done} / ${lp.total}`} sub={`${lp.pct}% of the course`} to="/learn" />
        <Stat label="Questions attempted" value={`${qa.done} / ${qa.total}`} sub={`${qa.pct}% of the question bank`} to="/practice" />
        <Stat label="Quiz accuracy" value={acc.pct === null ? '–' : `${acc.pct}%`} sub={acc.attempts ? `${acc.correct} of ${acc.attempts} answers (practice score)` : 'Answer a question to start tracking'} />
        <Stat label="To review" value={String(wrong.length)} sub={wrong.length ? 'incorrect answers waiting' : 'nothing to review'} to="/review" />
      </section>

      <div className="grid2">
        <section className="card" aria-labelledby="rec-h">
          <h2 id="rec-h">Recommended next steps</h2>
          <ul className="reclist">
            {recs.map((r) => (
              <li key={r.title}>
                <Link to={r.to}>
                  <strong>{r.title}</strong>
                  <span className="muted">{r.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="weak-h">
          <h2 id="weak-h">Weak topics</h2>
          {weak.length === 0 ? (
            <p className="muted">No weak areas detected yet. Weak topics appear after you answer at least 3 questions in a topic and score below 70%.</p>
          ) : (
            <ul className="reclist">
              {weak.slice(0, 6).map((w) => (
                <li key={`${w.kind}-${w.id}`}>
                  <Link to={w.to}>
                    <strong>{w.label}</strong>
                    <span className="bad">
                      {w.accuracy}% · {w.attempts} answers
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card" aria-labelledby="dom-h">
        <h2 id="dom-h">Exam domains</h2>
        <p className="muted small">Weights are the official share of scored exam content. Accuracy is your practice accuracy in that domain.</p>
        <div className="domrows">
          {DOMAINS.map((d) => {
            const lessons = LESSONS.filter((l) => l.taskStatements.some((t) => t.startsWith(`${d.id}.`)));
            const lpD = lessonsProgress(state, lessons);
            const a = domainAccuracy(state, d.id);
            return (
              <div key={d.id} className="domrow">
                <div>
                  <strong>
                    Domain {d.id}: {d.title}
                  </strong>{' '}
                  <span className={`chip dom-${d.id}`}>{d.weight}% of exam</span>
                  <div className="small muted">
                    Lessons {lpD.done}/{lpD.total} · Accuracy {a.pct === null ? '–' : `${a.pct}%`}
                  </div>
                </div>
                <div className="domrow-bars">
                  <ProgressBar value={lpD.pct} label={`Domain ${d.id} lessons completed`} tone="good" />
                  <Link className="btn btn-sm" to={`/practice?mode=domain&domain=${d.id}&n=15`}>
                    Quiz
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card" aria-labelledby="mod-h">
        <h2 id="mod-h">Module progress</h2>
        <div className="modgrid">
          {MODULES.map((m) => {
            const p = moduleProgress(state, m);
            return (
              <Link key={m.id} to={`/lesson/${m.lessons[0].id}`} className="modcard">
                <span className="modicon" aria-hidden="true">{m.icon}</span>
                <span>
                  <strong>
                    {m.order}. {m.title}
                  </strong>
                  <span className="small muted">
                    {p.done}/{p.total} lessons
                  </span>
                </span>
                <ProgressBar value={p.pct} label={`${m.title} progress`} size="sm" tone="good" />
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid2">
        <section className="card" aria-labelledby="pri-h">
          <h2 id="pri-h">Suggested study focus (estimate)</h2>
          <p className="muted small">Our own estimate combining official domain weight with your practice results — a planning aid, not an exam prediction.</p>
          <ul className="prilist">
            {pri.map((r) => (
              <li key={r.domain.id}>
                <span>
                  D{r.domain.id} {r.domain.title}
                </span>
                <ProgressBar value={r.share} label={`Suggested focus for domain ${r.domain.id}`} size="sm" tone="warn" />
                <span className="small">{r.share}%</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card" aria-labelledby="hist-h">
          <h2 id="hist-h">Recent activity</h2>
          {state.attempts.length === 0 && state.mocks.length === 0 ? (
            <p className="muted">No quizzes yet. Try a short domain quiz from the Quizzes page.</p>
          ) : (
            <ul className="reclist">
              {lastMock && (
                <li>
                  <Link to={`/mock/results/${lastMock.id}`}>
                    <strong>Mock exam · {mockPercent(lastMock)}%</strong>
                    <span className="muted">{new Date(lastMock.at).toLocaleString()}</span>
                  </Link>
                </li>
              )}
              {state.attempts.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <Link to="/review">
                    <strong>
                      {a.label} · {Math.round((a.entries.filter((e) => e.correct).length / Math.max(1, a.entries.length)) * 100)}%
                    </strong>
                    <span className="muted">{new Date(a.at).toLocaleString()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
