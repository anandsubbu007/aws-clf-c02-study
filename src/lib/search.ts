import { GLOSSARY, LESSONS, MODULE_OF_LESSON, SERVICES } from '../content';
import { stripInline } from './text';

export type ResultKind = 'lesson' | 'term' | 'service';

export interface SearchDoc {
  kind: ResultKind;
  id: string;
  title: string;
  subtitle: string;
  to: string;
  /** weighted fields: higher weight = more important */
  fields: { text: string; weight: number }[];
  snippetSource: string;
}

export interface SearchResult {
  doc: SearchDoc;
  score: number;
  snippet: string;
}

const norm = (s: string) => stripInline(s).toLowerCase();

export function buildDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const l of LESSONS) {
    const m = MODULE_OF_LESSON.get(l.id);
    const body = [
      ...l.explanation,
      l.analogy,
      l.example,
      ...l.howItWorks,
      ...l.whenToUse,
      ...l.limitations,
      ...l.mistakes,
      ...l.examTips,
      ...l.revision,
      ...l.memoryAids,
      ...(l.deepDives ?? []).flatMap((d) => [d.title, ...d.body]),
      ...l.comparisons.flatMap((c) => [c.title, ...c.rows.map((r) => r.join(' '))]),
    ].join(' ');
    docs.push({
      kind: 'lesson',
      id: l.id,
      title: l.title,
      subtitle: `${m?.title ?? ''} › ${l.topic}`,
      to: `/lesson/${l.id}`,
      fields: [
        { text: l.title, weight: 10 },
        { text: (l.keywords ?? []).join(' '), weight: 8 },
        { text: `${l.topic} ${l.subtopic}`, weight: 5 },
        { text: l.keyTerms.map((t) => t.term).join(' '), weight: 6 },
        { text: l.objectives.join(' '), weight: 3 },
        { text: body, weight: 1 },
      ],
      snippetSource: [...l.objectives, ...l.explanation, body].join(' '),
    });
  }
  for (const t of GLOSSARY) {
    docs.push({
      kind: 'term',
      id: `term:${t.term}`,
      title: t.term,
      subtitle: 'Glossary',
      to: `/glossary?q=${encodeURIComponent(t.term)}`,
      fields: [
        { text: t.term, weight: 9 },
        { text: t.definition, weight: 2 },
      ],
      snippetSource: t.definition,
    });
  }
  for (const s of SERVICES) {
    docs.push({
      kind: 'service',
      id: `svc:${s.name}`,
      title: s.name,
      subtitle: `Service · ${s.category}`,
      to: `/services?q=${encodeURIComponent(s.name)}`,
      fields: [
        { text: s.name, weight: 10 },
        { text: s.category, weight: 3 },
        { text: s.summary, weight: 2 },
      ],
      snippetSource: s.summary,
    });
  }
  return docs;
}

let cached: SearchDoc[] | null = null;
const docs = () => (cached ??= buildDocs());

export function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[^a-z0-9.+#]+/)
    .filter((t) => t.length > 0);
}

function snippetFor(source: string, tokens: string[]): string {
  const clean = stripInline(source);
  const low = clean.toLowerCase();
  let idx = -1;
  for (const t of tokens) {
    idx = low.indexOf(t);
    if (idx >= 0) break;
  }
  if (idx < 0) return clean.slice(0, 140) + (clean.length > 140 ? '…' : '');
  const start = Math.max(0, idx - 50);
  const end = Math.min(clean.length, idx + 110);
  return (start > 0 ? '…' : '') + clean.slice(start, end) + (end < clean.length ? '…' : '');
}

/** All query tokens must match (prefix match) somewhere in the document. */
export function search(query: string, limit = 40, source: SearchDoc[] = docs()): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const phrase = query.trim().toLowerCase();
  const results: SearchResult[] = [];
  for (const doc of source) {
    let score = 0;
    let ok = true;
    const fields = doc.fields.map((f) => ({ ...f, text: norm(f.text) }));
    for (const tok of tokens) {
      let best = 0;
      for (const f of fields) {
        const i = f.text.indexOf(tok);
        if (i < 0) continue;
        const wordStart = i === 0 || /[^a-z0-9]/.test(f.text[i - 1]);
        best = Math.max(best, f.weight * (wordStart ? 1.5 : 1));
      }
      if (best === 0) {
        ok = false;
        break;
      }
      score += best;
    }
    if (!ok) continue;
    if (norm(doc.title) === phrase) score += 40;
    else if (norm(doc.title).includes(phrase)) score += 15;
    if (doc.kind === 'lesson') score += 2;
    results.push({ doc, score, snippet: snippetFor(doc.snippetSource, tokens) });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
