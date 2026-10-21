import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMAINS, LESSONS, QUESTIONS, SERVICES } from '../content';
import { IN_SCOPE_SERVICES } from '../content/exam';
import { PRIMARY_SOURCES } from '../content/sources';
import { LIMITATIONS, REVIEW_LOG } from '../content/reviewlog';
import { Accordion, PageHeader } from '../components/ui';

export function SourcesPage() {
  const [tab, setTab] = useState<'coverage' | 'sources' | 'review'>('coverage');
  const refs = useMemo(() => {
    const m = new Map<string, { title: string; lessons: { id: string; title: string }[] }>();
    for (const l of LESSONS) {
      for (const r of l.references) {
        const e = m.get(r.url) ?? { title: r.title, lessons: [] };
        e.lessons.push({ id: l.id, title: l.title });
        m.set(r.url, e);
      }
    }
    return [...m.entries()].sort((a, b) => a[1].title.localeCompare(b[1].title));
  }, []);
  const have = new Set(SERVICES.map((s) => s.name));

  return (
    <div className="stack-lg">
      <PageHeader title="Sources and coverage" subtitle="How this site maps to the official syllabus, where its facts come from, and what remains uncertain." />
      <div className="row wrap" role="group" aria-label="Sections">
        {(['coverage', 'sources', 'review'] as const).map((t) => (
          <button key={t} className="btn" aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t === 'coverage' ? 'Syllabus coverage' : t === 'sources' ? 'Source register' : 'Content review log'}
          </button>
        ))}
      </div>

      {tab === 'coverage' && (
        <div className="stack-lg">
          <section className="card" aria-labelledby="cv1">
            <h2 id="cv1">Task statement coverage</h2>
            <p className="muted small">Every official task statement should map to at least one lesson and several practice questions. This table is computed from the site’s content.</p>
            <div className="tablewrap" role="region" aria-label="Task statement coverage table" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Task statement</th><th scope="col">Lessons</th><th scope="col">Questions</th><th scope="col">Covered</th></tr></thead>
                <tbody>
                  {DOMAINS.flatMap((d) => d.taskStatements).map((t) => {
                    const ls = LESSONS.filter((l) => l.taskStatements.includes(t.id));
                    const qn = QUESTIONS.filter((q) => q.taskStatement === t.id).length;
                    return (
                      <tr key={t.id}>
                        <th scope="row">{t.id} {t.title}</th>
                        <td>{ls.map((l, i) => <span key={l.id}>{i > 0 && ', '}<Link to={`/lesson/${l.id}`}>{l.title}</Link></span>)}</td>
                        <td>{qn}</td>
                        <td>{ls.length > 0 && qn >= 3 ? '✔' : '✖'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
          <section className="card" aria-labelledby="cv2">
            <h2 id="cv2">In-scope service coverage</h2>
            <p className="muted small">Official categories from the exam guide, and whether each service has a directory entry and lesson.</p>
            {Object.entries(IN_SCOPE_SERVICES).map(([cat, names]) => (
              <Accordion key={cat} level={3} title={`${cat} (${names.filter((n) => have.has(n)).length}/${names.length})`}>
                <ul>
                  {names.map((n) => {
                    const s = SERVICES.find((x) => x.name === n);
                    return <li key={n}>{s ? <>✔ <Link to={`/services?q=${encodeURIComponent(n)}`}>{n}</Link></> : <>✖ {n}</>}</li>;
                  })}
                </ul>
              </Accordion>
            ))}
          </section>
        </div>
      )}

      {tab === 'sources' && (
        <div className="stack-lg">
          <section className="card" aria-labelledby="ps">
            <h2 id="ps">Primary sources</h2>
            <ul className="refs">
              {PRIMARY_SOURCES.map((s) => (
                <li key={s.title}>
                  {s.url ? <a href={s.url} target="_blank" rel="noreferrer noopener">{s.title}</a> : <strong>{s.title}</strong>}
                  <div className="small muted">{s.supports}</div>
                </li>
              ))}
            </ul>
          </section>
          <section className="card" aria-labelledby="ls">
            <h2 id="ls">Lesson references ({refs.length} unique links)</h2>
            <p className="muted small">Every lesson lists its own official references at the bottom. This is the combined register with the lessons each source supports.</p>
            <div className="tablewrap" role="region" aria-label="Lesson references table" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Source</th><th scope="col">Supports lessons</th></tr></thead>
                <tbody>
                  {refs.map(([url, e]) => (
                    <tr key={url}>
                      <th scope="row"><a href={url} target="_blank" rel="noreferrer noopener">{e.title}</a></th>
                      <td>{e.lessons.map((l, i) => <span key={l.id}>{i > 0 && ', '}<Link to={`/lesson/${l.id}`}>{l.title}</Link></span>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {tab === 'review' && (
        <section className="card" aria-labelledby="rl">
          <h2 id="rl">Content review log</h2>
          <p className="muted small">What was verified, against what, and what is uncertain. “Partly” and “unverified” items are flagged honestly rather than hidden.</p>
          <div className="tablewrap" role="region" aria-label="Content review log table" tabIndex={0}>
            <table>
              <thead><tr><th scope="col">Area</th><th scope="col">Claim</th><th scope="col">Status</th><th scope="col">Source</th><th scope="col">Note</th></tr></thead>
              <tbody>
                {REVIEW_LOG.map((e, i) => (
                  <tr key={i}>
                    <th scope="row">{e.area}</th>
                    <td>{e.claim}</td>
                    <td><span className={`chip status-${e.status}`}>{e.status}</span></td>
                    <td>{e.source}</td>
                    <td>{e.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {tab === 'review' && (
        <section className="card" aria-labelledby="lim">
          <h2 id="lim">Limitations</h2>
          <ul>
            {LIMITATIONS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
