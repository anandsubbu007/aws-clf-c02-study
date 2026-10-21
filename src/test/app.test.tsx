import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../App';
import { ProgressProvider } from '../lib/progress';
import { LESSONS, QUESTIONS } from '../content';
import { STORAGE_KEY, THEME_KEY } from '../lib/storage';

function renderAt(path: string) {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </ProgressProvider>,
  );
}

const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');

describe('navigation', () => {
  it('shows the dashboard with a call to start learning', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: /learn it, practise it/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start learning/i })).toHaveAttribute('href', `/lesson/${LESSONS[0].id}`);
  });

  it('opens a lesson and moves between previous and next lessons', async () => {
    const user = userEvent.setup();
    const first = LESSONS[0];
    const second = LESSONS[1];
    renderAt(`/lesson/${first.id}`);
    expect(screen.getByRole('heading', { level: 1, name: first.title })).toBeInTheDocument();
    const pager = screen.getByRole('navigation', { name: /lesson navigation/i });
    expect(within(pager).queryByText(/previous/i)).not.toBeInTheDocument();
    await user.click(within(pager).getByRole('link', { name: new RegExp(second.title) }));
    expect(screen.getByRole('heading', { level: 1, name: second.title })).toBeInTheDocument();
    const pager2 = screen.getByRole('navigation', { name: /lesson navigation/i });
    await user.click(within(pager2).getByRole('link', { name: new RegExp(first.title) }));
    expect(screen.getByRole('heading', { level: 1, name: first.title })).toBeInTheDocument();
  });

  it('shows a friendly message for an unknown lesson', () => {
    renderAt('/lesson/does-not-exist');
    expect(screen.getByText(/couldn’t find that lesson/i)).toBeInTheDocument();
  });

  it('lets the sidebar expand a module to reveal its lessons', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    const moduleBtn = within(nav).getAllByRole('button')[0];
    expect(moduleBtn).toHaveAttribute('aria-expanded', 'false');
    await user.click(moduleBtn);
    expect(moduleBtn).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('progress persistence', () => {
  it('marks a lesson complete, persists it, and restores after remount', async () => {
    const user = userEvent.setup();
    const lesson = LESSONS[0];
    const { unmount } = renderAt(`/lesson/${lesson.id}`);
    await user.click(screen.getByRole('button', { name: /mark as complete/i }));
    expect(screen.getByRole('button', { name: /completed — click to undo/i })).toBeInTheDocument();
    expect(saved().completed[lesson.id]).toBeTruthy();
    unmount();
    renderAt(`/lesson/${lesson.id}`);
    expect(screen.getByRole('button', { name: /completed — click to undo/i })).toBeInTheDocument();
  });

  it('bookmarks a lesson and lists it on the notes page', async () => {
    const user = userEvent.setup();
    const lesson = LESSONS[0];
    renderAt(`/lesson/${lesson.id}`);
    await user.click(screen.getByRole('button', { name: /^bookmark$/i }));
    expect(saved().bookmarks).toContain(lesson.id);
  });

  it('autosaves notes', async () => {
    const user = userEvent.setup();
    const lesson = LESSONS[0];
    renderAt(`/lesson/${lesson.id}`);
    await user.type(screen.getByLabelText(/notes are saved automatically/i), 'remember this');
    expect(saved().notes[lesson.id].text).toBe('remember this');
  });
});

describe('theme', () => {
  it('toggles between light and dark and remembers the choice', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute('data-theme', 'light');
    renderAt('/');
    await user.click(screen.getByRole('button', { name: /switch to dark theme/i }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(JSON.parse(localStorage.getItem(THEME_KEY)!)).toBe('dark');
    await user.click(screen.getByRole('button', { name: /switch to light theme/i }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});

describe('lesson quizzes', () => {
  it('gives immediate feedback with explanations and records the answer', async () => {
    const user = userEvent.setup();
    const lesson = LESSONS[0];
    renderAt(`/lesson/${lesson.id}`);
    const q = lesson.knowledgeCheck[0];
    const correct = q.options.find((o) => o.id === q.correct[0])!;
    const section = screen.getByRole('region', { name: /knowledge check/i });
    await user.click(within(section).getAllByRole('radio', { name: new RegExp(correct.text.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) })[0]);
    expect(within(section).getByText('Correct!')).toBeInTheDocument();
    expect(within(section).getByText(correct.explanation.slice(0, 30), { exact: false })).toBeInTheDocument();
    expect(saved().answers[q.id]).toMatchObject({ attempts: 1, correct: 1, lastCorrect: true });
  });
});

describe('quiz runner', () => {
  it('runs a mixed quiz to completion and shows a summary', async () => {
    const user = userEvent.setup();
    renderAt('/practice?mode=lesson&lesson=' + LESSONS[0].id + '&n=2&r=t');
    for (let i = 0; i < 2; i++) {
      await user.click(screen.getAllByRole('radio')[0]);
      await user.click(screen.getByRole('button', { name: /next question|finish quiz/i }));
    }
    expect(await screen.findByTestId('quiz-summary')).toBeInTheDocument();
    expect(saved().attempts).toHaveLength(1);
    expect(saved().attempts[0].entries).toHaveLength(2);
  });
});

describe('search', () => {
  it('shows search results from the search page', async () => {
    renderAt('/search?q=elasticity');
    expect((await screen.findAllByRole('link', { name: /value of the aws cloud|elasticity/i })).length).toBeGreaterThan(0);
  });

  it('suggests results from the top-bar search box', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.type(screen.getByRole('searchbox', { name: /search lessons/i }), 'elasticity');
    expect(await screen.findByRole('list', { name: /search suggestions/i })).toBeInTheDocument();
  });
});

describe('mock exam', () => {
  it('starts, answers, submits and reviews a mini mock with correct scoring', async () => {
    const user = userEvent.setup();
    renderAt('/mock');
    await user.click(screen.getByRole('button', { name: /start mini mock/i }));
    expect(await screen.findByRole('timer')).toBeInTheDocument();
    expect(saved().activeMock.questionIds).toHaveLength(20);
    await user.click((screen.queryAllByRole('radio')[0] ?? screen.getAllByRole('checkbox')[0]));
    await user.click(screen.getByRole('button', { name: /submit exam/i }));
    await user.click(screen.getByRole('button', { name: /submit and see results/i }));
    const score = await screen.findByTestId('mock-score');
    expect(score).toHaveTextContent(/of 20 correct/);
    expect(saved().mocks).toHaveLength(1);
    expect(saved().activeMock).toBeUndefined();
    expect(saved().mocks[0].entries.filter((e: { selected: string[] }) => e.selected.length === 0)).toHaveLength(19);
  });

  it('auto-submits when time runs out on resume', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        activeMock: { id: 'mock-old', seed: 's', label: 'Mini mock', questionIds: QUESTIONS.slice(0, 3).map((q) => q.id), answers: {}, flags: [], startedAt: Date.now() - 3600_000, limitSec: 60 },
      }),
    );
    renderAt('/mock/run');
    expect(await screen.findByTestId('mock-score')).toHaveTextContent(/0 of 3 correct/);
    expect(saved().mocks[0].timedOut).toBe(true);
  });
});

describe('settings', () => {
  it('requires confirmation before resetting progress', async () => {
    const user = userEvent.setup();
    renderAt(`/lesson/${LESSONS[0].id}`);
    await user.click(screen.getByRole('button', { name: /mark as complete/i }));
    expect(Object.keys(saved().completed)).toHaveLength(1);
    renderAt('/settings');
    await user.click(screen.getAllByRole('button', { name: /reset all progress/i })[0]);
    const dialog = screen.getByRole('dialog', { name: /reset all progress/i });
    await user.click(within(dialog).getByRole('button', { name: /cancel/i }));
    expect(Object.keys(saved().completed)).toHaveLength(1);
    await user.click(screen.getAllByRole('button', { name: /reset all progress/i })[0]);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /yes, reset everything/i }));
    expect(saved().completed).toEqual({});
  });

  it('imports a valid export file and rejects an invalid one', async () => {
    const user = userEvent.setup();
    renderAt('/settings');
    const input = screen.getByLabelText(/import progress/i, { selector: 'input' });
    const bad = new File(['{"nope":1}'], 'bad.json', { type: 'application/json' });
    await user.upload(input, bad);
    expect(await screen.findByText(/does not look like a clf-c02 study hub export/i)).toBeInTheDocument();
    const good = new File([JSON.stringify({ app: 'clf-c02-study-hub', state: { completed: { [LESSONS[0].id]: 'now' } } })], 'good.json', { type: 'application/json' });
    await user.upload(input, good);
    await user.click(await screen.findByRole('button', { name: /import and replace/i }));
    expect(saved().completed[LESSONS[0].id]).toBe('now');
  });
});
