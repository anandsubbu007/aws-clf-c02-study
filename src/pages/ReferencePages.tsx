import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GLOSSARY, LESSON_BY_ID, SERVICES, DOMAINS } from '../content';
import { IN_SCOPE_SERVICES, IN_SCOPE_SERVICES_URL } from '../content/exam';
import { renderInline } from '../lib/text';
import { EmptyState, PageHeader } from '../components/ui';

export function GlossaryPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? GLOSSARY.filter((t) => t.term.toLowerCase().includes(s) || t.definition.toLowerCase().includes(s)) : GLOSSARY;
  }, [q]);
  const groups = useMemo(() => {
    const g = new Map<string, typeof list>();
    for (const t of list) {
      const k = /[a-z]/i.test(t.term[0]) ? t.term[0].toUpperCase() : '#';
      g.set(k, [...(g.get(k) ?? []), t]);
    }
    return [...g.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [list]);

  return (
    <div className="stack-lg">
      <PageHeader title="Glossary" subtitle={`${GLOSSARY.length} key terms collected from every lesson.`} />
      <div>
        <label htmlFor="gl-q" className="sr-only">Filter glossary</label>
        <input id="gl-q" type="search" className="input" value={q} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} placeholder="Filter terms and definitions…" />
      </div>
      {groups.length === 0 && <EmptyState title={`No terms match “${q}”`} />}
      <nav className="az" aria-label="Jump to letter">
        {groups.map(([k]) => (
          <button key={k} type="button" className="btn btn-sm" onClick={() => document.getElementById(`gl-${k}`)?.scrollIntoView({ behavior: 'smooth' })}>{k}</button>
        ))}
      </nav>
      {groups.map(([k, items]) => (
        <section key={k} id={`gl-${k}`} aria-label={`Terms starting with ${k}`}>
          <h2 className="letter">{k}</h2>
          <dl className="terms">
            {items.map((t) => (
              <div key={t.term}>
                <dt>{t.term}</dt>
                <dd>
                  {renderInline(t.definition)} <Link className="small" to={`/lesson/${t.lessonId}`}>{LESSON_BY_ID.get(t.lessonId)?.title} →</Link>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

export function ServicesPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cat = params.get('cat') ?? 'all';
  const cats = [...new Set(SERVICES.map((s) => s.category))].sort();
  const list = SERVICES.filter((s) => (cat === 'all' || s.category === cat) && (!q || `${s.name} ${s.summary} ${s.category}`.toLowerCase().includes(q.toLowerCase())));
  const official = Object.values(IN_SCOPE_SERVICES).flat();
  const have = new Set(SERVICES.map((s) => s.name));
  const covered = official.filter((n) => have.has(n)).length;
  const set = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) v && v !== 'all' ? next.set(k, v) : next.delete(k);
    setParams(next, { replace: true });
  };

  return (
    <div className="stack-lg">
      <PageHeader
        title="Services directory"
        subtitle={
          <>
            {covered} of {official.length} services on the{' '}
            <a href={IN_SCOPE_SERVICES_URL} target="_blank" rel="noreferrer noopener">official in-scope list</a> are covered. Services marked “not on list” are included because the exam objectives or lessons refer to them.
          </>
        }
      />
      <div className="row wrap">
        <label htmlFor="sv-q" className="sr-only">Filter services</label>
        <input id="sv-q" type="search" className="input grow" value={q} onChange={(e) => set({ q: e.target.value })} placeholder="Filter by name or description…" />
        <label htmlFor="sv-cat" className="sr-only">Category</label>
        <select id="sv-cat" className="input" value={cat} onChange={(e) => set({ cat: e.target.value })}>
          <option value="all">All categories</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <p className="small muted" aria-live="polite">{list.length} services shown</p>
      <div className="svcgrid">
        {list.map((s) => (
          <article key={s.name} className="card svc">
            <h2>{s.name}</h2>
            <div className="row wrap">
              <span className="chip chip-muted">{s.category}</span>
              {!s.inScope && <span className="chip chip-reco">not on list</span>}
            </div>
            <p>{renderInline(s.summary)}</p>
            <Link className="small" to={`/lesson/${s.lessonId}`}>Learn it: {LESSON_BY_ID.get(s.lessonId)?.title} →</Link>
          </article>
        ))}
      </div>
      <p className="small muted">Domains: {DOMAINS.map((d) => `D${d.id} ${d.title}`).join(' · ')}</p>
    </div>
  );
}
