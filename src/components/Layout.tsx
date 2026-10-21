import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MODULES } from '../content';
import type { Lesson } from '../content';
import { useProgress } from '../lib/progress';
import { moduleProgress } from '../lib/stats';
import { search } from '../lib/search';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { ProgressBar } from './ui';

const NAV: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Dashboard', icon: 'home', end: true },
  { to: '/exam', label: 'Exam guide', icon: 'target' },
  { to: '/learn', label: 'Course', icon: 'book' },
];
const NAV2: { to: string; label: string; icon: IconName }[] = [
  { to: '/practice', label: 'Quizzes', icon: 'list' },
  { to: '/mock', label: 'Mock exam', icon: 'clock' },
  { to: '/flashcards', label: 'Flashcards', icon: 'cards' },
  { to: '/review', label: 'Review mistakes', icon: 'refresh' },
  { to: '/readiness', label: 'Readiness & checklist', icon: 'check' },
];
const NAV3: { to: string; label: string; icon: IconName }[] = [
  { to: '/services', label: 'Services directory', icon: 'grid' },
  { to: '/glossary', label: 'Glossary', icon: 'note' },
  { to: '/map', label: 'Course mind map', icon: 'map' },
  { to: '/notes', label: 'Bookmarks & notes', icon: 'bookmark' },
  { to: '/sources', label: 'Sources & coverage', icon: 'link' },
  { to: '/settings', label: 'Progress & settings', icon: 'gear' },
];

function groupLessons(lessons: Lesson[]) {
  const topics: { topic: string; subtopics: { subtopic: string; lessons: Lesson[] }[] }[] = [];
  for (const l of lessons) {
    let t = topics.find((x) => x.topic === l.topic);
    if (!t) topics.push((t = { topic: l.topic, subtopics: [] }));
    let s = t.subtopics.find((x) => x.subtopic === l.subtopic);
    if (!s) t.subtopics.push((s = { subtopic: l.subtopic, lessons: [] }));
    s.lessons.push(l);
  }
  return topics;
}

function CourseTree({ onNavigate }: { onNavigate: () => void }) {
  const { state } = useProgress();
  const loc = useLocation();
  const activeId = loc.pathname.startsWith('/lesson/') ? loc.pathname.split('/')[2] : undefined;
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const isOpen = (key: string, containsActive: boolean) => open[key] ?? containsActive;
  const toggle = (key: string, current: boolean) => setOpen((o) => ({ ...o, [key]: !current }));

  return (
    <ul className="ctree" aria-label="Course modules">
      {MODULES.map((m) => {
        const containsActive = m.lessons.some((l) => l.id === activeId);
        const mOpen = isOpen(m.id, containsActive);
        const p = moduleProgress(state, m);
        const topics = groupLessons(m.lessons);
        return (
          <li key={m.id}>
            <button type="button" className="ctree-mod" aria-expanded={mOpen} onClick={() => toggle(m.id, mOpen)}>
              <span className="ctree-icon" aria-hidden="true">{m.icon}</span>
              <span className="ctree-title">
                <span>
                  {m.order}. {m.title}
                </span>
                <span className="ctree-sub">
                  {p.done}/{p.total} lessons
                </span>
              </span>
              <Icon name="chevron" size={14} className={mOpen ? 'rot' : ''} />
            </button>
            {mOpen && (
              <>
                <div className="ctree-prog">
                  <ProgressBar value={p.pct} label={`${m.title} progress`} size="sm" tone="good" />
                </div>
                <ul>
                  {topics.map((t) => {
                    const key = `${m.id}/${t.topic}`;
                    const tActive = t.subtopics.some((s) => s.lessons.some((l) => l.id === activeId));
                    const tOpen = isOpen(key, tActive);
                    return (
                      <li key={key}>
                        <button type="button" className="ctree-topic" aria-expanded={tOpen} onClick={() => toggle(key, tOpen)}>
                          <Icon name="chevron" size={12} className={tOpen ? 'rot' : ''} />
                          <span>{t.topic}</span>
                        </button>
                        {tOpen && (
                          <ul className="ctree-lessons">
                            {t.subtopics.map((s) => (
                              <li key={s.subtopic}>
                                {t.subtopics.length > 1 && <div className="ctree-subtopic">{s.subtopic}</div>}
                                <ul>
                                  {s.lessons.map((l) => (
                                    <li key={l.id}>
                                      <NavLink to={`/lesson/${l.id}`} onClick={onNavigate} className={({ isActive }) => `ctree-lesson${isActive ? ' active' : ''}`}>
                                        <span className={`tick${state.completed[l.id] ? ' done' : ''}`} aria-hidden="true">
                                          {state.completed[l.id] && <Icon name="check" size={11} strokeWidth={3} />}
                                        </span>
                                        <span>{l.title}</span>
                                        {state.completed[l.id] && <span className="sr-only"> (completed)</span>}
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function SearchBox() {
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const ref = useRef<HTMLInputElement>(null);
  // Close the suggestion list whenever the route changes.
  useEffect(() => setFocus(false), [loc.pathname, loc.search]);
  const results = useMemo(() => (q.trim().length >= 2 ? search(q, 6) : []), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const go = () => {
    if (!q.trim()) return;
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
    setFocus(false);
    ref.current?.blur();
  };

  return (
    <form
      className="searchbox"
      role="search"
      aria-label="Site search"
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false);
      }}
    >
      <Icon name="search" size={16} />
      <input
        ref={ref}
        type="search"
        value={q}
        placeholder="Search lessons, terms, services…  ( / )"
        aria-label="Search lessons, glossary terms and services"
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocus(true)}
        onKeyDown={(e) => e.key === 'Escape' && setFocus(false)}
      />
      {focus && results.length > 0 && (
        <ul className="suggest" aria-label="Search suggestions">
          {results.map((r) => (
            <li key={r.doc.id}>
              <Link
                to={r.doc.to}
                onClick={() => {
                  setFocus(false);
                  setQ('');
                }}
              >
                <strong>{r.doc.title}</strong>
                <span className="muted small">{r.doc.subtitle}</span>
              </Link>
            </li>
          ))}
          <li>
            <button type="submit" className="suggest-all">
              See all results for “{q}”
            </button>
          </li>
        </ul>
      )}
    </form>
  );
}

export function Layout() {
  const { theme, setTheme, saveFailed } = useProgress();
  const [menu, setMenu] = useState(false);
  const loc = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    setMenu(false);
    // Keep the natural tab order (skip link first) on the initial page load.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo?.(0, 0);
    // Move focus to the new page's content for screen-reader and keyboard users, unless the user is already typing.
    const el = document.activeElement;
    const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
    if (!typing) mainRef.current?.focus({ preventScroll: true });
  }, [loc.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const close = () => setMenu(false);
  const linkCls = ({ isActive }: { isActive: boolean }) => `navlink${isActive ? ' active' : ''}`;

  return (
    <div className="app">
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>
        Skip to main content
      </a>
      <header className="topbar">
        <button type="button" className="btn btn-ghost btn-icon menu-btn" aria-label="Toggle navigation menu" aria-expanded={menu} aria-controls="sidebar" onClick={() => setMenu((m) => !m)}>
          <Icon name={menu ? 'x' : 'menu'} />
        </button>
        <Link to="/" className="brand" aria-label="CLF-C02 Study Hub home">
          <span className="brand-mark" aria-hidden="true">☁</span>
          <span className="brand-text">
            <strong>CLF-C02</strong> Study Hub
          </span>
        </Link>
        <SearchBox />
        <Link to="/notes" className="btn btn-ghost btn-icon" aria-label="Bookmarks and notes">
          <Icon name="bookmark" />
        </Link>
        <button type="button" className="btn btn-ghost btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={theme === 'dark'}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
      </header>
      {saveFailed && (
        <div className="banner banner-warn" role="alert">
          Your browser blocked saving progress (storage full or disabled). Export your progress from Settings to avoid losing it.
        </div>
      )}
      <div className={`sidebar-scrim${menu ? ' show' : ''}`} onClick={close} aria-hidden="true" />
      <nav id="sidebar" className={`sidebar${menu ? ' open' : ''}`} aria-label="Main navigation">
        <ul className="navlist">
          {NAV.map((n) => (
            <li key={n.to}>
              <NavLink to={n.to} end={n.end} className={linkCls} onClick={close}>
                <Icon name={n.icon} /> {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-heading">Lessons</div>
        <CourseTree onNavigate={close} />
        <div className="nav-heading">Practise</div>
        <ul className="navlist">
          {NAV2.map((n) => (
            <li key={n.to}>
              <NavLink to={n.to} className={linkCls} onClick={close}>
                <Icon name={n.icon} /> {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-heading">Reference</div>
        <ul className="navlist">
          {NAV3.map((n) => (
            <li key={n.to}>
              <NavLink to={n.to} className={linkCls} onClick={close}>
                <Icon name={n.icon} /> {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main id="main" ref={mainRef} tabIndex={-1} className="main">
        <Outlet />
        <footer className="site-footer">
          <p>
            Independent study resource — not affiliated with or endorsed by AWS. Practice scores are not official exam scores and do not guarantee a passing result. Verify exam details on the{' '}
            <a href="https://aws.amazon.com/certification/certified-cloud-practitioner/" target="_blank" rel="noreferrer noopener">
              official AWS certification page
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}
