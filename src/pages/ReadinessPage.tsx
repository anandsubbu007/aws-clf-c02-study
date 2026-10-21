import { Link } from 'react-router-dom';
import { LESSON_BY_ID } from '../content';
import { CHECKLIST } from '../content/checklist';
import { useProgress } from '../lib/progress';
import { mockPercent, readiness, studyPriorities } from '../lib/stats';
import { Callout, PageHeader, ProgressBar } from '../components/ui';
import { Icon } from '../components/Icon';

export function ReadinessPage() {
  const { state, toggleChecklist } = useProgress();
  const r = readiness(state);
  const pri = studyPriorities(state);
  const total = CHECKLIST.reduce((s, g) => s + g.items.length, 0);
  const done = CHECKLIST.reduce((s, g) => s + g.items.filter((i) => state.checklist[i.id]).length, 0);

  return (
    <div className="stack-lg">
      <PageHeader title="Readiness and final revision" subtitle="A self-check built from your own practice data plus a final revision checklist." />
      <Callout kind="warn" title="Read this first" icon="warn">
        <p>This indicator uses thresholds chosen by this site (for example 80% practice accuracy). They are <strong>recommendations, not official AWS criteria</strong>. AWS scores the real exam on a scaled basis (100–1,000, pass at 700) and nothing here can guarantee or predict a pass.</p>
      </Callout>

      <section className="card" aria-labelledby="rd">
        <h2 id="rd">Practice readiness: {r.headline}</h2>
        <p className="muted">{r.metCount} of {r.checks.length} indicators met.</p>
        <ul className="checks">
          {r.checks.map((c) => (
            <li key={c.id} className={c.met ? 'met' : ''}>
              <Icon name={c.met ? 'check' : 'x'} size={16} />
              <span><strong>{c.label}</strong><span className="small muted"> — {c.detail}</span></span>
              <span className="sr-only">{c.met ? 'Met' : 'Not met'}</span>
            </li>
          ))}
        </ul>
        <div className="row wrap">
          <Link className="btn btn-primary" to="/mock">Take a mock exam</Link>
          <Link className="btn" to="/review">Review mistakes</Link>
        </div>
      </section>

      <section className="card" aria-labelledby="pr">
        <h2 id="pr">Where to focus (estimate)</h2>
        <p className="muted small">Estimate = official domain weight, adjusted upward where your practice accuracy is lower. It is a planning aid, not an exam prediction.</p>
        <ul className="prilist">
          {pri.map((x) => (
            <li key={x.domain.id}>
              <span>D{x.domain.id} {x.domain.title} ({x.domain.weight}% of exam)</span>
              <ProgressBar value={x.share} label={`Suggested focus domain ${x.domain.id}`} size="sm" tone="warn" />
              <span className="small">{x.share}%</span>
            </li>
          ))}
        </ul>
        {state.mocks.length > 0 && (
          <p className="small muted">Recent mock scores (practice %): {state.mocks.slice(0, 5).map((m) => `${mockPercent(m)}%`).join(', ')}</p>
        )}
      </section>

      <section className="card" aria-labelledby="cl">
        <h2 id="cl">Final revision checklist ({done}/{total})</h2>
        <ProgressBar value={(done / total) * 100} label="Checklist progress" tone="good" />
        {CHECKLIST.map((g) => (
          <fieldset key={g.title} className="checkgroup">
            <legend>{g.title}</legend>
            {g.items.map((i) => (
              <label key={i.id} className="checkitem">
                <input type="checkbox" checked={!!state.checklist[i.id]} onChange={() => toggleChecklist(i.id)} />
                <span>
                  {i.text}
                  {i.lessonId && LESSON_BY_ID.has(i.lessonId) && (
                    <> <Link className="small" to={`/lesson/${i.lessonId}`}>Review lesson</Link></>
                  )}
                </span>
              </label>
            ))}
          </fieldset>
        ))}
      </section>
    </div>
  );
}
