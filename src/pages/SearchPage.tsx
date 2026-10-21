import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { search } from '../lib/search';
import { PageHeader, EmptyState } from '../components/ui';

const LABEL = { lesson: 'Lesson', term: 'Glossary term', service: 'Service' } as const;
const PLURAL = { lesson: 'Lessons', term: 'Glossary terms', service: 'Services' } as const;

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [text, setText] = useState(q);
  const [kind, setKind] = useState<'all' | 'lesson' | 'term' | 'service'>('all');
  useEffect(() => setText(q), [q]);
  const results = useMemo(() => search(q, 60), [q]);
  const shown = results.filter((r) => kind === 'all' || r.doc.kind === kind);
  const count = (k: string) => results.filter((r) => r.doc.kind === k).length;

  return (
    <div className="stack-lg">
      <PageHeader title="Search" subtitle="Search lessons, key terms, definitions, keywords and AWS services." />
      <form
        className="row"
        role="search"
        aria-label="Search this site"
        onSubmit={(e) => {
          e.preventDefault();
          setParams(text.trim() ? { q: text.trim() } : {});
        }}
      >
        <label className="sr-only" htmlFor="search-page-input">Search query</label>
        <input id="search-page-input" className="input grow" type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. encryption at rest, NACL, Savings Plans" />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>
      {q && (
        <div className="row wrap" role="group" aria-label="Filter results">
          {(['all', 'lesson', 'term', 'service'] as const).map((k) => (
            <button key={k} type="button" className="btn btn-sm" aria-pressed={kind === k} onClick={() => setKind(k)}>
              {k === 'all' ? `All (${results.length})` : `${PLURAL[k]} (${count(k)})`}
            </button>
          ))}
        </div>
      )}
      {!q && <EmptyState title="Type something to search">Search covers every lesson, key term, comparison table, exam tip and service summary.</EmptyState>}
      {q && shown.length === 0 && <EmptyState title={`No results for “${q}”`}>Try a shorter word, an abbreviation (for example “IAM”) or the older name of a service.</EmptyState>}
      <ul className="results" aria-live="polite">
        {shown.map((r) => (
          <li key={r.doc.id} className="card">
            <div className="row between">
              <Link to={r.doc.to} className="result-title">
                {r.doc.title}
              </Link>
              <span className="chip chip-muted">{LABEL[r.doc.kind]}</span>
            </div>
            <div className="small muted">{r.doc.subtitle}</div>
            <p>{r.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
