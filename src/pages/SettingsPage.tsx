import { useRef, useState } from 'react';
import { LESSONS, QUESTIONS } from '../content';
import { useProgress } from '../lib/progress';
import { exportJson, parseImport } from '../lib/storage';
import { lessonsProgress, overallAccuracy } from '../lib/stats';
import { Callout, ConfirmDialog, PageHeader } from '../components/ui';
import { Icon } from '../components/Icon';

export function SettingsPage() {
  const { state, theme, setTheme, replaceState, reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, setPending] = useState<ReturnType<typeof parseImport> | null>(null);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lp = lessonsProgress(state);
  const acc = overallAccuracy(state);

  const download = () => {
    const blob = new Blob([exportJson(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clf-c02-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ kind: 'ok', text: 'Progress exported.' });
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    const text = await f.text();
    const parsed = parseImport(text);
    if (!parsed.ok) setMsg({ kind: 'err', text: parsed.error });
    else setPending(parsed);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="stack-lg">
      <PageHeader title="Progress and settings" subtitle="Everything is stored in this browser (localStorage). Nothing is sent anywhere." />

      <section className="card stack" aria-labelledby="th">
        <h2 id="th">Theme</h2>
        <div className="row wrap" role="radiogroup" aria-label="Theme">
          {(['light', 'dark'] as const).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={theme === t} className={`btn${theme === t ? ' btn-primary' : ''}`} onClick={() => setTheme(t)}>
              <Icon name={t === 'light' ? 'sun' : 'moon'} size={16} /> {t === 'light' ? 'Light' : 'Dark'}
            </button>
          ))}
        </div>
      </section>

      <section className="card stack" aria-labelledby="sm">
        <h2 id="sm">Saved progress</h2>
        <ul>
          <li>{lp.done} of {LESSONS.length} lessons completed</li>
          <li>{Object.keys(state.answers).length} of {QUESTIONS.length} questions attempted; accuracy {acc.pct === null ? '–' : `${acc.pct}%`}</li>
          <li>{state.bookmarks.length} bookmarks · {Object.keys(state.notes).length} notes · {state.customCards.length} custom flashcards · {state.mocks.length} mock exams</li>
        </ul>
      </section>

      <section className="card stack" aria-labelledby="ex">
        <h2 id="ex">Export and import</h2>
        <p className="muted">Export a JSON backup to move progress between browsers or devices. Importing <strong>replaces</strong> the progress currently saved here.</p>
        <div className="row wrap">
          <button type="button" className="btn btn-primary" onClick={download}><Icon name="download" size={16} /> Export progress</button>
          <label className="btn" htmlFor="import-file"><Icon name="upload" size={16} /> Import progress…</label>
          <input id="import-file" ref={fileRef} className="sr-only-input" type="file" accept="application/json,.json" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
        {msg && <p role="status" className={msg.kind === 'ok' ? 'good' : 'bad'}>{msg.text}</p>}
      </section>

      <section className="card stack" aria-labelledby="rs">
        <h2 id="rs">Reset</h2>
        <Callout kind="warn" title="This cannot be undone" icon="warn">
          <p>Resetting deletes completed lessons, quiz history, notes, bookmarks, flashcard progress, custom cards and mock exam history from this browser. Export a backup first if you might want it back.</p>
        </Callout>
        <div><button type="button" className="btn btn-danger" onClick={() => setConfirmReset(true)}><Icon name="trash" size={16} /> Reset all progress…</button></div>
      </section>

      {confirmReset && (
        <ConfirmDialog
          title="Reset all progress?"
          confirmLabel="Yes, reset everything"
          message={<p>All saved progress in this browser will be permanently deleted.</p>}
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            reset();
            setConfirmReset(false);
            setMsg({ kind: 'ok', text: 'All progress was reset.' });
          }}
        />
      )}
      {pending && pending.ok && (
        <ConfirmDialog
          title="Replace your progress with this file?"
          confirmLabel="Import and replace"
          message={
            <p>
              The file contains {Object.keys(pending.state.completed).length} completed lessons, {Object.keys(pending.state.answers).length} answered questions and {pending.state.mocks.length} mock exams. Your current progress will be replaced.
            </p>
          }
          onCancel={() => setPending(null)}
          onConfirm={() => {
            replaceState(pending.state);
            setPending(null);
            setMsg({ kind: 'ok', text: 'Progress imported.' });
          }}
        />
      )}
    </div>
  );
}
