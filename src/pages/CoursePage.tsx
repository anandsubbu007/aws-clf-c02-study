import { Link } from 'react-router-dom';
import { LESSONS, MODULES } from '../content';
import { useProgress } from '../lib/progress';
import { moduleProgress } from '../lib/stats';
import { PageHeader, ProgressBar } from '../components/ui';
import { Icon } from '../components/Icon';
import { TreeView } from '../components/Diagram';
import type { TreeNode } from '../content';

export function CoursePage() {
  const { state } = useProgress();
  const total = LESSONS.reduce((s, l) => s + l.minutes, 0);
  return (
    <div className="stack-lg">
      <PageHeader
        title="Course"
        subtitle={`Subject → Modules → Topics → Subtopics → Lessons. ${LESSONS.length} lessons, about ${Math.round(total / 60)} hours of reading before practice.`}
        actions={
          <Link className="btn" to="/map">
            <Icon name="map" size={16} /> Mind map view
          </Link>
        }
      />
      {MODULES.map((m) => {
        const p = moduleProgress(state, m);
        const topics = [...new Set(m.lessons.map((l) => l.topic))];
        return (
          <section key={m.id} className="card module-card" aria-labelledby={`${m.id}-h`}>
            <div className="module-head">
              <span className="modicon big" aria-hidden="true">{m.icon}</span>
              <div>
                <h2 id={`${m.id}-h`}>
                  Module {m.order}: {m.title}
                </h2>
                <p className="muted">{m.summary}</p>
                <div className="row wrap">
                  {m.domains.map((d) => (
                    <span key={d} className={`chip dom-${d}`}>Domain {d}</span>
                  ))}
                  <span className="chip chip-muted">{p.done}/{p.total} lessons</span>
                </div>
              </div>
              <Link className="btn btn-sm" to={`/practice?mode=module&module=${m.id}&n=10`}>
                Module quiz
              </Link>
            </div>
            <ProgressBar value={p.pct} label={`${m.title} progress`} tone="good" />
            {topics.map((t) => (
              <div key={t}>
                <h3 className="topic-h">{t}</h3>
                <ul className="lesson-list">
                  {m.lessons
                    .filter((l) => l.topic === t)
                    .map((l) => (
                      <li key={l.id}>
                        <Link to={`/lesson/${l.id}`}>
                          <span className={`tick${state.completed[l.id] ? ' done' : ''}`} aria-hidden="true">
                            {state.completed[l.id] && <Icon name="check" size={11} strokeWidth={3} />}
                          </span>
                          <span>
                            <strong>{l.title}</strong>
                            <span className="small muted"> · {l.subtopic} · {l.minutes} min</span>
                          </span>
                          {state.completed[l.id] && <span className="sr-only">(completed)</span>}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

export function MapPage() {
  const root: TreeNode = {
    label: '**CLF-C02** — AWS Certified Cloud Practitioner',
    children: MODULES.map((m) => {
      const topics = [...new Set(m.lessons.map((l) => l.topic))];
      return {
        label: `${m.icon} ${m.order}. ${m.title}`,
        children: topics.map((t) => ({
          label: t,
          children: m.lessons.filter((l) => l.topic === t).map((l) => ({ label: l.title, to: `/lesson/${l.id}`, detail: l.subtopic })),
        })),
      };
    }),
  };
  return (
    <div className="stack-lg">
      <PageHeader title="Course mind map" subtitle="Expand modules and topics, then click a lesson to open it. Each lesson also has its own mind map or diagram." />
      <div className="card">
        <TreeView root={root} openDepth={2} />
      </div>
    </div>
  );
}
