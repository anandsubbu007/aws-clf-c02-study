import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LESSON_BY_ID, MODULE_OF_LESSON, adjacentLessons, taskStatementById } from '../content';
import type { Question } from '../content';
import { useProgress } from '../lib/progress';
import { newSeed } from '../lib/quiz';
import { renderInline } from '../lib/text';
import { Accordion, Callout } from '../components/ui';
import { DiagramCard } from '../components/Diagram';
import { Icon } from '../components/Icon';
import { QuestionCard } from '../components/QuestionCard';
import { NotFound } from './NotFound';

const SECTIONS = [
  ['s-objectives', 'Objectives'],
  ['s-explanation', 'Explanation'],
  ['s-deep', 'Go deeper'],
  ['s-how', 'How it works · when · limits'],
  ['s-diagrams', 'Diagrams'],
  ['s-terms', 'Key terms'],
  ['s-compare', 'Comparisons'],
  ['s-pitfalls', 'Mistakes & exam tips'],
  ['s-memory', 'Memory aids & revision'],
  ['s-related', 'Related lessons'],
  ['s-check', 'Knowledge check'],
  ['s-practice', 'Practice questions'],
  ['s-notes', 'My notes'],
  ['s-refs', 'References'],
] as const;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.focus({ preventScroll: true });
}

function QuestionSet({ title, id, questions, hint }: { title: string; id: string; questions: Question[]; hint: string }) {
  const { recordAnswer } = useProgress();
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const seed = useMemo(() => newSeed(), [round]); // eslint-disable-line react-hooks/exhaustive-deps
  const answered = Object.keys(results).length;
  const right = Object.values(results).filter(Boolean).length;
  return (
    <section id={id} tabIndex={-1} className="lsec" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>{title}</h2>
      <p className="muted">{hint}</p>
      <div className="stack">
        {questions.map((q, i) => (
          <QuestionCard
            key={`${round}-${q.id}`}
            q={q}
            seed={seed}
            index={i}
            total={questions.length}
            onSubmit={(_, ok) => {
              setResults((r) => ({ ...r, [q.id]: ok }));
              recordAnswer(q.id, ok);
            }}
          />
        ))}
      </div>
      {answered === questions.length && (
        <div className="row between setdone" role="status">
          <strong>
            {right} of {questions.length} correct
          </strong>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setRound((r) => r + 1);
              setResults({});
            }}
          >
            <Icon name="refresh" size={16} /> Try again
          </button>
        </div>
      )}
    </section>
  );
}

export function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? LESSON_BY_ID.get(lessonId) : undefined;
  const { state, toggleComplete, toggleBookmark, setNote, setLastLesson } = useProgress();
  const [expandKey, setExpandKey] = useState(0);
  const [expandAll, setExpandAll] = useState(true);
  const [active, setActive] = useState<string>(SECTIONS[0][0]);
  // On narrow screens the table of contents starts collapsed so the lesson title stays visible.
  const [tocOpen, setTocOpen] = useState(() => (typeof window.matchMedia === 'function' ? window.matchMedia('(min-width: 1181px)').matches : true));

  useEffect(() => {
    if (lesson) setLastLesson(lesson.id);
  }, [lesson, setLastLesson]);

  useEffect(() => {
    if (!lesson || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: '-80px 0px -65% 0px' },
    );
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [lesson]);

  if (!lesson) return <NotFound what="lesson" />;
  const mod = MODULE_OF_LESSON.get(lesson.id)!;
  const { prev, next } = adjacentLessons(lesson.id);
  const done = !!state.completed[lesson.id];
  const marked = state.bookmarks.includes(lesson.id);
  const note = state.notes[lesson.id]?.text ?? '';
  const domains = [...new Set(lesson.taskStatements.map((t) => t.split('.')[0]))];

  return (
    <div className="lesson-layout">
      <article className="lesson" aria-labelledby="lesson-title">
        <nav aria-label="Breadcrumb" className="crumbs">
          <Link to="/learn">Course</Link> <span aria-hidden="true">›</span> <span>{mod.title}</span> <span aria-hidden="true">›</span> <span>{lesson.topic}</span> <span aria-hidden="true">›</span> <span>{lesson.subtopic}</span>
        </nav>
        <header className="lesson-head">
          <h1 id="lesson-title">{lesson.title}</h1>
          <div className="row wrap chips">
            {domains.map((d) => (
              <span key={d} className={`chip dom-${d}`}>Domain {d}</span>
            ))}
            {lesson.taskStatements.map((t) => (
              <span key={t} className="chip chip-muted" title={taskStatementById(t)?.title}>
                Task {t}
              </span>
            ))}
            <span className="chip chip-muted"><Icon name="clock" size={13} /> {lesson.minutes} min</span>
          </div>
          <div className="row wrap">
            <button type="button" className={`btn${done ? ' btn-good' : ' btn-primary'}`} onClick={() => toggleComplete(lesson.id)} aria-pressed={done}>
              <Icon name="check" size={16} /> {done ? 'Completed — click to undo' : 'Mark as complete'}
            </button>
            <button type="button" className="btn" onClick={() => toggleBookmark(lesson.id)} aria-pressed={marked}>
              <Icon name="bookmark" size={16} fill={marked ? 'currentColor' : 'none'} /> {marked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setExpandAll(!expandAll);
                setExpandKey((k) => k + 1);
              }}
            >
              {expandAll ? 'Collapse' : 'Expand'} all details
            </button>
          </div>
        </header>

        <section id="s-objectives" tabIndex={-1} className="lsec" aria-labelledby="s-objectives-h">
          <h2 id="s-objectives-h">Learning objectives</h2>
          <p className="muted">After this lesson you should be able to:</p>
          <ul className="checklist">
            {lesson.objectives.map((o, i) => (
              <li key={i}>
                <Icon name="target" size={16} /> <span>{renderInline(o)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="s-explanation" tabIndex={-1} className="lsec" aria-labelledby="s-explanation-h">
          <h2 id="s-explanation-h">Explanation</h2>
          {lesson.explanation.map((p, i) => (
            <p key={i}>{renderInline(p)}</p>
          ))}
          <Accordion title="Analogy" icon="bulb" defaultOpen syncKey={expandKey} syncOpen={expandAll}>
            <p>{renderInline(lesson.analogy)}</p>
          </Accordion>
          <Accordion title="Real-world example" icon="star" defaultOpen syncKey={expandKey} syncOpen={expandAll}>
            <p>{renderInline(lesson.example)}</p>
          </Accordion>
        </section>

        {lesson.deepDives && lesson.deepDives.length > 0 && (
          <section id="s-deep" tabIndex={-1} className="lsec" aria-labelledby="s-deep-h">
            <h2 id="s-deep-h">Go deeper</h2>
            {lesson.deepDives.map((d, i) => (
              <Accordion key={i} title={d.title} icon="layers" defaultOpen={false} syncKey={expandKey} syncOpen={expandAll}>
                {d.body.map((p, j) => (
                  <p key={j}>{renderInline(p)}</p>
                ))}
              </Accordion>
            ))}
          </section>
        )}

        <section id="s-how" tabIndex={-1} className="lsec" aria-labelledby="s-how-h">
          <h2 id="s-how-h">How it works, when to use it, and limits</h2>
          <div className="grid3">
            <div className="card">
              <h3>How it works</h3>
              <ul>{lesson.howItWorks.map((x, i) => <li key={i}>{renderInline(x)}</li>)}</ul>
            </div>
            <div className="card">
              <h3>When to use it</h3>
              <ul>{lesson.whenToUse.map((x, i) => <li key={i}>{renderInline(x)}</li>)}</ul>
            </div>
            <div className="card">
              <h3>Limitations</h3>
              <ul>{lesson.limitations.map((x, i) => <li key={i}>{renderInline(x)}</li>)}</ul>
            </div>
          </div>
        </section>

        <section id="s-diagrams" tabIndex={-1} className="lsec" aria-labelledby="s-diagrams-h">
          <h2 id="s-diagrams-h">Diagrams and mind maps</h2>
          <p className="muted">Select “Expand” on any diagram to open a larger view.</p>
          <div className="stack">
            {lesson.diagrams.map((d) => (
              <DiagramCard key={d.id} d={d} />
            ))}
          </div>
        </section>

        <section id="s-terms" tabIndex={-1} className="lsec" aria-labelledby="s-terms-h">
          <h2 id="s-terms-h">Key terms</h2>
          <dl className="terms">
            {lesson.keyTerms.map((t) => (
              <div key={t.term}>
                <dt>{t.term}</dt>
                <dd>{renderInline(t.definition)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="s-compare" tabIndex={-1} className="lsec" aria-labelledby="s-compare-h">
          <h2 id="s-compare-h">Comparison tables</h2>
          {lesson.comparisons.map((c) => (
            <div key={c.title} className="tablewrap" role="region" aria-label={c.title} tabIndex={0}>
              <table>
                <caption>{c.title}</caption>
                <thead>
                  <tr>{c.headers.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {c.rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((cell, j) => (j === 0 ? <th key={j} scope="row">{renderInline(cell)}</th> : <td key={j}>{renderInline(cell)}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>

        <section id="s-pitfalls" tabIndex={-1} className="lsec" aria-labelledby="s-pitfalls-h">
          <h2 id="s-pitfalls-h">Common mistakes and exam tips</h2>
          <Callout kind="warn" title="Common mistakes and misunderstandings" icon="warn">
            <ul>{lesson.mistakes.map((x, i) => <li key={i}>{renderInline(x)}</li>)}</ul>
          </Callout>
          <Callout kind="tip" title="Exam tips and likely confusion" icon="bulb">
            <ul>{lesson.examTips.map((x, i) => <li key={i}>{renderInline(x)}</li>)}</ul>
          </Callout>
        </section>

        <section id="s-memory" tabIndex={-1} className="lsec" aria-labelledby="s-memory-h">
          <h2 id="s-memory-h">Memory aids and quick revision</h2>
          <div className="grid2">
            <Callout kind="analogy" title="Memory aids" icon="star">
              <ul>{lesson.memoryAids.map((x, i) => <li key={i}>{renderInline(x)}</li>)}</ul>
            </Callout>
            <Callout kind="info" title="Quick revision notes" icon="note">
              <ul>{lesson.revision.map((x, i) => <li key={i}>{renderInline(x)}</li>)}</ul>
            </Callout>
          </div>
        </section>

        <section id="s-related" tabIndex={-1} className="lsec" aria-labelledby="s-related-h">
          <h2 id="s-related-h">Important related topics</h2>
          <ul className="related">
            {lesson.related.map((r) => {
              const rl = LESSON_BY_ID.get(r.lessonId);
              return (
                rl && (
                  <li key={r.lessonId}>
                    <Link to={`/lesson/${rl.id}`}>{rl.title}</Link>
                    <span className="muted"> — {renderInline(r.why)}</span>
                  </li>
                )
              );
            })}
          </ul>
        </section>

        <QuestionSet id="s-check" title="Knowledge check" questions={lesson.knowledgeCheck} hint="Quick recall questions. Answers are checked immediately." />
        <QuestionSet id="s-practice" title="Practice questions" questions={lesson.practice} hint="Exam-style questions with an explanation for every option." />

        <section id="s-notes" tabIndex={-1} className="lsec" aria-labelledby="s-notes-h">
          <h2 id="s-notes-h">My notes</h2>
          <label htmlFor="note-area" className="muted small">Notes are saved automatically in this browser.</label>
          <textarea id="note-area" className="textarea" rows={5} value={note} onChange={(e) => setNote(lesson.id, e.target.value)} placeholder="Write your own summary, mnemonics or questions…" />
        </section>

        <section id="s-refs" tabIndex={-1} className="lsec" aria-labelledby="s-refs-h">
          <h2 id="s-refs-h">Official references</h2>
          <ul className="refs">
            {lesson.references.map((r) => (
              <li key={r.url}>
                <Icon name="link" size={14} />{' '}
                <a href={r.url} target="_blank" rel="noreferrer noopener">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav className="pager" aria-label="Lesson navigation">
          {prev ? (
            <Link to={`/lesson/${prev.id}`} className="pager-link prev" rel="prev">
              <span className="small muted"><Icon name="arrowLeft" size={14} /> Previous</span>
              <strong>{prev.title}</strong>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/lesson/${next.id}`} className="pager-link next" rel="next">
              <span className="small muted">Next <Icon name="arrowRight" size={14} /></span>
              <strong>{next.title}</strong>
            </Link>
          ) : <span />}
        </nav>
      </article>

      <aside className="toc" aria-label="On this page">
        <details className="toc-details" open={tocOpen} onToggle={(e) => setTocOpen(e.currentTarget.open)}>
          <summary>On this page</summary>
          <ol>
            {SECTIONS.filter(([id]) => id !== 's-deep' || (lesson.deepDives?.length ?? 0) > 0).map(([id, label]) => (
              <li key={id}>
                <button type="button" className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => scrollToSection(id)}>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </details>
      </aside>
    </div>
  );
}
