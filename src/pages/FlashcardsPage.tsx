import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GLOSSARY, MODULES, SERVICES } from '../content';
import { useProgress } from '../lib/progress';
import { shuffle } from '../lib/quiz';
import { renderInline } from '../lib/text';
import { EmptyState, PageHeader } from '../components/ui';
import { Icon } from '../components/Icon';

interface Card {
  id: string;
  front: string;
  back: string;
  source: string;
  group: 'term' | 'service' | 'custom';
  lessonId?: string;
  moduleId?: string;
}

function allCards(custom: { id: string; front: string; back: string }[]): Card[] {
  const moduleOfLesson = new Map(MODULES.flatMap((m) => m.lessons.map((l) => [l.id, m.id] as const)));
  const terms: Card[] = GLOSSARY.map((t) => ({
    id: `term:${t.term.toLowerCase()}`,
    front: t.term,
    back: t.definition,
    source: 'Key term',
    group: 'term',
    lessonId: t.lessonId,
    moduleId: moduleOfLesson.get(t.lessonId),
  }));
  const svcs: Card[] = SERVICES.map((s) => ({
    id: `svc:${s.name}`,
    front: s.name,
    back: s.summary,
    source: `Service · ${s.category}`,
    group: 'service',
    lessonId: s.lessonId,
    moduleId: moduleOfLesson.get(s.lessonId),
  }));
  const mine: Card[] = custom.map((c) => ({ id: c.id, front: c.front, back: c.back, source: 'My card', group: 'custom' }));
  return [...terms, ...svcs, ...mine];
}

export function FlashcardsPage() {
  const { state, reviewCard, addCard, removeCard } = useProgress();
  const [params, setParams] = useSearchParams();
  const deck = params.get('deck') ?? 'all';
  const [flipped, setFlipped] = useState(false);
  const [round, setRound] = useState(0);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [showAll, setShowAll] = useState(false);

  const cards = useMemo(() => allCards(state.customCards), [state.customCards]);
  const inDeck = useMemo(
    () =>
      cards.filter((c) => {
        if (deck === 'all') return true;
        if (deck === 'terms') return c.group === 'term';
        if (deck === 'services') return c.group === 'service';
        if (deck === 'custom') return c.group === 'custom';
        return c.moduleId === deck;
      }),
    [cards, deck],
  );

  const nowIso = new Date().toISOString();
  const due = useMemo(() => {
    const d = inDeck.filter((c) => !state.cards[c.id] || state.cards[c.id].due <= nowIso || showAll);
    return shuffle(d, `fc:${deck}:${round}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inDeck, deck, round, showAll]);

  const [pos, setPos] = useState(0);
  const [queue, setQueue] = useState<Card[]>([]);
  useEffect(() => {
    setQueue(due);
    setPos(0);
    setFlipped(false);
  }, [due]);

  const current = queue[pos];
  const boxes = [1, 2, 3, 4, 5].map((b) => inDeck.filter((c) => (state.cards[c.id]?.box ?? 0) === b).length);
  const newCount = inDeck.filter((c) => !state.cards[c.id]).length;

  const answer = (knew: boolean) => {
    if (!current) return;
    reviewCard(current.id, knew);
    setFlipped(false);
    setPos((p) => p + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT') return;
      if (e.key === ' ' && t.tagName !== 'BUTTON') {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="stack-lg">
      <PageHeader title="Flashcards" subtitle="Spaced repetition (Leitner boxes). Cards you miss come back sooner; cards you know return after 1, 3, 7 and 14 days." />
      <div className="row wrap">
        <label htmlFor="deck" className="small muted">Deck</label>
        <select id="deck" className="input" value={deck} onChange={(e) => setParams({ deck: e.target.value })}>
          <option value="all">All cards ({cards.length})</option>
          <option value="terms">Key terms</option>
          <option value="services">Services</option>
          <option value="custom">My cards ({state.customCards.length})</option>
          {MODULES.map((m) => (
            <option key={m.id} value={m.id}>{m.order}. {m.title}</option>
          ))}
        </select>
        <button type="button" className="btn btn-sm" aria-pressed={showAll} onClick={() => setShowAll((s) => !s)}>
          {showAll ? 'Showing all cards' : 'Showing due cards'}
        </button>
        <button type="button" className="btn btn-sm" onClick={() => setRound((r) => r + 1)}><Icon name="refresh" size={14} /> Reshuffle</button>
      </div>
      <p className="small muted" aria-live="polite">
        {inDeck.length} cards in deck · {newCount} new · Boxes 1–5: {boxes.join(' / ')} · {Math.max(0, queue.length - pos)} left in this session
      </p>

      {current ? (
        <div className="stack">
          <button type="button" className={`flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped((f) => !f)} aria-label={flipped ? 'Showing answer. Activate to show the term again.' : 'Showing term. Activate to reveal the answer.'}>
            <span className="small muted">{current.source}</span>
            <span className="fc-main">{flipped ? renderInline(current.back) : renderInline(current.front)}</span>
            <span className="small muted">{flipped ? 'Answer' : 'Click or press Space to flip'}</span>
          </button>
          {flipped ? (
            <div className="row center">
              <button type="button" className="btn btn-danger" onClick={() => answer(false)}>Again (didn’t know)</button>
              <button type="button" className="btn btn-good" onClick={() => answer(true)}>I knew it</button>
            </div>
          ) : (
            <div className="row center"><button type="button" className="btn btn-primary" onClick={() => setFlipped(true)}>Show answer</button></div>
          )}
          {current.lessonId && <p className="center small"><Link to={`/lesson/${current.lessonId}`}>Open the related lesson →</Link></p>}
        </div>
      ) : (
        <EmptyState title={inDeck.length === 0 ? 'No cards in this deck yet' : 'You’re done for now'}>
          {inDeck.length === 0 ? 'Add your own cards below.' : 'No cards are due in this deck. Choose “Showing all cards” to keep practising.'}
        </EmptyState>
      )}

      <section className="card" aria-labelledby="mycards">
        <h2 id="mycards">My cards</h2>
        <form
          className="stack-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (!front.trim() || !back.trim()) return;
            addCard(front.trim(), back.trim());
            setFront('');
            setBack('');
          }}
        >
          <label htmlFor="fc-front">Front (question or term)</label>
          <input id="fc-front" className="input" value={front} onChange={(e) => setFront(e.target.value)} />
          <label htmlFor="fc-back">Back (answer)</label>
          <textarea id="fc-back" className="textarea" rows={2} value={back} onChange={(e) => setBack(e.target.value)} />
          <div><button className="btn btn-primary" type="submit" disabled={!front.trim() || !back.trim()}>Add card</button></div>
        </form>
        {state.customCards.length > 0 && (
          <ul className="lesson-list">
            {state.customCards.map((c) => (
              <li key={c.id} className="row between">
                <span><strong>{c.front}</strong> — {c.back}</span>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => removeCard(c.id)} aria-label={`Delete card ${c.front}`}><Icon name="trash" size={14} /></button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
