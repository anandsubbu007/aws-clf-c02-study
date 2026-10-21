import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LESSON_BY_ID, QUESTION_BY_ID } from '../content';
import { useProgress } from '../lib/progress';
import { incorrectQuestionIds } from '../lib/stats';
import { formatDuration } from '../lib/quiz';
import { renderInline } from '../lib/text';
import { EmptyState, PageHeader } from '../components/ui';
import { QuestionCard } from '../components/QuestionCard';
import { Icon } from '../components/Icon';

export function NotesPage() {
  const { state, toggleBookmark, setNote } = useProgress();
  const noteIds = Object.keys(state.notes).filter((id) => LESSON_BY_ID.has(id));
  const marks = state.bookmarks.filter((id) => LESSON_BY_ID.has(id));
  return (
    <div className="stack-lg">
      <PageHeader title="Bookmarks and notes" subtitle="Lessons you bookmarked and notes you wrote. Stored only in this browser." />
      <section className="card" aria-labelledby="bm">
        <h2 id="bm">Bookmarks ({marks.length})</h2>
        {marks.length === 0 ? (
          <p className="muted">No bookmarks yet. Use the Bookmark button at the top of any lesson.</p>
        ) : (
          <ul className="lesson-list">
            {marks.map((id) => (
              <li key={id} className="row between">
                <Link to={`/lesson/${id}`}>{LESSON_BY_ID.get(id)!.title}</Link>
                <button className="btn btn-sm btn-ghost" onClick={() => toggleBookmark(id)} aria-label={`Remove bookmark: ${LESSON_BY_ID.get(id)!.title}`}><Icon name="x" size={14} /></button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="card" aria-labelledby="nt">
        <h2 id="nt">Notes ({noteIds.length})</h2>
        {noteIds.length === 0 ? (
          <p className="muted">No notes yet. Write notes at the bottom of any lesson.</p>
        ) : (
          noteIds.map((id) => (
            <div key={id} className="stack-sm note">
              <div className="row between">
                <Link to={`/lesson/${id}`}><strong>{LESSON_BY_ID.get(id)!.title}</strong></Link>
                <span className="small muted">{state.notes[id].updated && new Date(state.notes[id].updated).toLocaleString()}</span>
              </div>
              <label className="sr-only" htmlFor={`note-${id}`}>Note for {LESSON_BY_ID.get(id)!.title}</label>
              <textarea id={`note-${id}`} className="textarea" rows={3} value={state.notes[id].text} onChange={(e) => setNote(id, e.target.value)} />
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export function ReviewPage() {
  const { state } = useProgress();
  const ids = incorrectQuestionIds(state);
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="stack-lg">
      <PageHeader
        title="Review mistakes"
        subtitle="Questions whose most recent answer was incorrect. Answer them correctly in a quiz to clear them from this list."
        actions={ids.length > 0 && <Link className="btn btn-primary" to={`/practice?mode=review&n=20&r=${Date.now().toString(36)}`}>Quiz me on these ({Math.min(20, ids.length)})</Link>}
      />
      {ids.length === 0 ? (
        <EmptyState title="No incorrect answers to review">Answer some quiz questions and any you miss will appear here with full explanations.</EmptyState>
      ) : (
        <ul className="stack">
          {ids.map((id) => {
            const q = QUESTION_BY_ID.get(id)!;
            const isOpen = open === id;
            return (
              <li key={id} className="card stack-sm">
                <div className="row between">
                  <div>
                    <strong>{renderInline(q.stem.length > 160 ? q.stem.slice(0, 160) + '…' : q.stem)}</strong>
                    <div className="small muted">Domain {q.domain} · Task {q.taskStatement} · attempts {state.answers[id].attempts}, correct {state.answers[id].correct}</div>
                  </div>
                  <button className="btn btn-sm" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : id)}>{isOpen ? 'Hide' : 'Show answer'}</button>
                </div>
                {isOpen && <QuestionCard q={q} seed={id} review reviewSelected={q.correct} />}
                {q.lessonId && <Link className="small" to={`/lesson/${q.lessonId}`}>Revisit: {LESSON_BY_ID.get(q.lessonId)?.title} →</Link>}
              </li>
            );
          })}
        </ul>
      )}
      <section className="card" aria-labelledby="hist">
        <h2 id="hist">Quiz history</h2>
        {state.attempts.length === 0 ? <p className="muted">No quizzes taken yet.</p> : (
          <table>
            <thead><tr><th scope="col">Date</th><th scope="col">Quiz</th><th scope="col">Score</th><th scope="col">Time</th></tr></thead>
            <tbody>
              {state.attempts.slice(0, 20).map((a) => {
                const c = a.entries.filter((e) => e.correct).length;
                return (
                  <tr key={a.id}>
                    <td>{new Date(a.at).toLocaleString()}</td>
                    <td>{a.label}</td>
                    <td>{c}/{a.entries.length} ({Math.round((c / Math.max(1, a.entries.length)) * 100)}%)</td>
                    <td>{formatDuration(a.durationSec)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
