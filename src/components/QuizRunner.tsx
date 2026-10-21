import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '../content/types';
import { formatDuration, gradeEntries, newSeed, percent } from '../lib/quiz';
import { useProgress } from '../lib/progress';
import type { QuizAttempt } from '../lib/storage';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ui';
import { Icon } from './Icon';

export interface QuizRunnerProps {
  questions: Question[];
  kind: QuizAttempt['kind'];
  label: string;
  onExit?: () => void;
}

export function QuizRunner({ questions, kind, label, onExit }: QuizRunnerProps) {
  const { recordAttempt } = useProgress();
  const seed = useMemo(() => newSeed(), []);
  const startedAt = useRef(Date.now());
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState<QuizAttempt | null>(null);

  if (questions.length === 0) return null;

  const finish = (finalAnswers: Record<string, string[]>) => {
    const attempt: QuizAttempt = {
      id: `quiz-${seed}`,
      kind,
      label,
      at: new Date().toISOString(),
      seed,
      durationSec: Math.round((Date.now() - startedAt.current) / 1000),
      entries: gradeEntries(questions, finalAnswers),
    };
    recordAttempt(attempt);
    setDone(attempt);
  };

  const next = (a = answers) => {
    if (idx + 1 >= questions.length) finish(a);
    else {
      setIdx(idx + 1);
      setAnswered(false);
    }
  };

  if (done) return <QuizSummary attempt={done} questions={questions} onExit={onExit} />;

  const q = questions[idx];
  return (
    <div className="stack">
      <div className="quiz-top">
        <div className="small muted">{label}</div>
        <ProgressBar value={(idx / questions.length) * 100} label="Quiz progress" size="sm" />
      </div>
      <QuestionCard
        key={q.id}
        q={q}
        seed={seed}
        index={idx}
        total={questions.length}
        onSubmit={(sel) => {
          setAnswers((a) => ({ ...a, [q.id]: sel }));
          setAnswered(true);
        }}
      />
      <div className="row between">
        <button type="button" className="btn btn-ghost" onClick={() => next()} disabled={answered}>
          Skip question
        </button>
        <button type="button" className="btn btn-primary" onClick={() => next()} disabled={!answered}>
          {idx + 1 >= questions.length ? 'Finish quiz' : 'Next question'} <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}

export function QuizSummary({ attempt, questions, onExit }: { attempt: QuizAttempt; questions: Question[]; onExit?: () => void }) {
  const total = attempt.entries.length;
  const right = attempt.entries.filter((e) => e.correct).length;
  const pct = percent(right, total);
  const [showAll, setShowAll] = useState(false);
  const byId = new Map(questions.map((q) => [q.id, q]));
  const wrong = attempt.entries.filter((e) => !e.correct);
  const list = showAll ? attempt.entries : wrong;
  return (
    <div className="stack" data-testid="quiz-summary">
      <div className="card score-card">
        <div className="score-ring" aria-hidden="true">
          <span>{Math.round(pct)}%</span>
        </div>
        <div>
          <h2>
            {right} of {total} correct
          </h2>
          <p className="muted">
            Practice score (not an official exam score) · {formatDuration(attempt.durationSec)} · {pct >= 80 ? 'Solid result — keep refreshing the details.' : pct >= 60 ? 'Good start — review the explanations below.' : 'Review the lessons linked below and try again.'}
          </p>
        </div>
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => setShowAll(false)} aria-pressed={!showAll}>
          Incorrect ({wrong.length})
        </button>
        <button type="button" className="btn" onClick={() => setShowAll(true)} aria-pressed={showAll}>
          All questions ({total})
        </button>
        {onExit && (
          <button type="button" className="btn btn-primary" onClick={onExit}>
            New quiz
          </button>
        )}
      </div>
      {list.length === 0 && <p className="good">Perfect — no incorrect answers in this quiz.</p>}
      {list.map((e) => {
        const q = byId.get(e.id);
        if (!q) return null;
        return (
          <div key={e.id} className="stack-sm">
            <QuestionCard q={q} seed={attempt.seed} review reviewSelected={e.selected} />
            {q.lessonId && (
              <Link className="small" to={`/lesson/${q.lessonId}`}>
                Revisit the lesson for this question →
              </Link>
            )}
            {e.selected.length === 0 && <p className="small muted">You skipped this question.</p>}
          </div>
        );
      })}
    </div>
  );
}
