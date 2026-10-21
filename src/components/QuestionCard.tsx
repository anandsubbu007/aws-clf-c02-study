import { useMemo, useState } from 'react';
import type { Question } from '../content/types';
import { displayOptions, isCorrect } from '../lib/quiz';
import { renderInline } from '../lib/text';
import { Icon } from './Icon';

export interface QuestionCardProps {
  q: Question;
  seed: string;
  index?: number;
  total?: number;
  /** Reveal answer + explanations after submitting. If false, the card only collects a selection (mock exam). */
  feedback?: boolean;
  /** Controlled selection (mock exam). */
  selected?: string[];
  onSelect?: (ids: string[]) => void;
  /** Called once when the learner checks their answer (feedback mode). */
  onSubmit?: (selected: string[], correct: boolean) => void;
  /** Show correct/incorrect state without interaction (results review). */
  review?: boolean;
  reviewSelected?: string[];
}

const LETTERS = 'ABCDEF';

export function QuestionCard({ q, seed, index, total, feedback = true, selected, onSelect, onSubmit, review, reviewSelected }: QuestionCardProps) {
  const opts = useMemo(() => displayOptions(q, seed), [q, seed]);
  const [local, setLocal] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const sel = review ? reviewSelected ?? [] : selected ?? local;
  const revealed = review || (feedback && checked);
  const isMulti = q.type === 'multi';

  const pick = (id: string) => {
    if (revealed) return;
    let next: string[];
    if (isMulti) next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id];
    else next = [id];
    if (onSelect) onSelect(next);
    else setLocal(next);
    if (!isMulti && feedback && !onSelect) {
      // single-choice: check immediately
      setChecked(true);
      onSubmit?.(next, isCorrect(q, next));
    }
  };

  const check = () => {
    setChecked(true);
    onSubmit?.(sel, isCorrect(q, sel));
  };

  const correct = revealed && isCorrect(q, sel);
  const groupId = `q-${q.id}`;

  return (
    <article className="qcard" aria-labelledby={`${groupId}-stem`}>
      <div className="qmeta">
        {index !== undefined && total !== undefined && <span className="chip">Question {index + 1} of {total}</span>}
        <span className="chip chip-muted">Domain {q.domain} · {q.taskStatement}</span>
        <span className="chip chip-muted">{isMulti ? 'Multiple response' : 'Multiple choice'}</span>
      </div>
      <p id={`${groupId}-stem`} className="qstem">
        {renderInline(q.stem)}
      </p>
      {isMulti && !review && <p className="muted small">Select all that apply — all correct options are required for credit.</p>}
      <div role={isMulti ? 'group' : 'radiogroup'} aria-labelledby={`${groupId}-stem`} className="qopts">
        {opts.map((o, i) => {
          const isSel = sel.includes(o.id);
          const isRight = q.correct.includes(o.id);
          const cls = ['qopt', isSel ? 'is-selected' : '', revealed && isRight ? 'is-right' : '', revealed && isSel && !isRight ? 'is-wrong' : ''].join(' ');
          return (
            <div key={o.id} className={cls}>
              <button
                type="button"
                role={isMulti ? 'checkbox' : 'radio'}
                aria-checked={isSel}
                disabled={revealed}
                onClick={() => pick(o.id)}
                className="qopt-btn"
              >
                <span className="qletter" aria-hidden="true">{LETTERS[i]}</span>
                <span className="qtext">{renderInline(o.text)}</span>
                {revealed && isRight && <span className="qflag good"><Icon name="check" size={16} /> Correct</span>}
                {revealed && isSel && !isRight && <span className="qflag bad"><Icon name="x" size={16} /> Your choice</span>}
              </button>
              {revealed && <p className="qexp">{renderInline(o.explanation)}</p>}
            </div>
          );
        })}
      </div>
      {!review && feedback && isMulti && !checked && (
        <button type="button" className="btn btn-primary" onClick={check} disabled={sel.length === 0}>
          Check answer
        </button>
      )}
      {revealed && !review && (
        <p className={`qresult ${correct ? 'good' : 'bad'}`} role="status">
          {correct ? 'Correct!' : 'Not quite — read the explanations above.'}
        </p>
      )}
    </article>
  );
}
