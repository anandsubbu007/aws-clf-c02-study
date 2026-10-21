# CLF-C02 Study Hub

An interactive, fully static learning site for the **AWS Certified Cloud Practitioner (CLF-C02)** exam: lessons with diagrams and mind maps, original practice questions, flashcards, a glossary, a services directory, timed mock exams and a progress dashboard. No backend, account, API key or paid service is needed; progress is stored in your browser.

> Independent study resource — not affiliated with or endorsed by AWS. Practice scores are **not** official exam scores and nothing here guarantees a pass. Confirm exam details on the [official certification page](https://aws.amazon.com/certification/certified-cloud-practitioner/).

**Current content:** 12 modules · 49 lessons (≈13 hours of reading) · 398 original practice questions (313 single-answer, 85 multi-response) · 120 service directory entries (all 111 official in-scope names) · 99 diagrams/mind maps · 474 glossary terms.

## What is inside

| Area | Details |
|---|---|
| Course | Subject → Modules → Topics → Subtopics → Lessons (module/topic/subtopic come from lesson metadata). Every lesson has objectives, explanation, analogy, real-world example, deep dives, how it works / when to use / limitations, key terms, comparison tables, mistakes, exam tips, memory aids, revision notes, diagrams (click to expand), related lessons, knowledge check, practice questions, notes and official references. |
| Exam prep | Official domains, weights, scoring rules and task statements; exam traps; topic, module, domain, task and mixed quizzes; review of incorrect answers; timed mock exams (full 65 Q / 90 min, half, mini) with a review screen; readiness indicator and final checklist. |
| Reference | Searchable glossary, services directory (every official in-scope service), course mind map, global search. |
| Study tools | Bookmarks, notes, Leitner-box flashcards (+ your own cards), progress bars, dashboard with weak topics and recommended next steps. |
| Data | Progress saved in `localStorage`; JSON export/import; reset with confirmation; light/dark theme remembered. |
| Quality | Automated content validation (structure, answers, explanations for every option, syllabus and service coverage), unit and UI tests, link checker. |

Registers and checklists live in [`docs/`](./docs): [SOURCES.md](./docs/SOURCES.md), [COVERAGE.md](./docs/COVERAGE.md), [CONTENT_REVIEW.md](./docs/CONTENT_REVIEW.md) and the authoring contract [CONTENT_GUIDE.md](./docs/CONTENT_GUIDE.md). The same information is browsable in the app under **Sources & coverage**.

## Requirements

- Node.js 20.19+ (developed with Node 26) and npm.

## Install and develop

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build and preview

```bash
npm run build        # type-checks, then writes the static site to dist/
npm run preview      # serves dist/ locally
```

The app uses a **hash router** (`/#/lesson/...`) and relative asset paths (`base: './'`), so `dist/` works from any static host or sub-path without rewrite rules.

## Deploy

**GitHub Pages (Actions)** — the workflow in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) runs the tests, builds, and publishes `dist/`. Enable it once under **Settings → Pages → Source → GitHub Actions**, then push to `main`. Any other host (Netlify, S3 + CloudFront, Cloudflare Pages, nginx) only needs the contents of `dist/` — no redirects required.

## Tests and checks

```bash
npm test                 # all unit, content and UI tests (Vitest + Testing Library)
npm run check:content    # content integrity only (fast while authoring)
npm run typecheck        # TypeScript
npm run check:links      # HTTP-checks every https URL in src/content, docs and README (needs internet)
npm run docs             # regenerates docs/SOURCES.md, COVERAGE.md and CONTENT_REVIEW.md from the content data
```

What the tests cover: navigation (sidebar, previous/next lesson, unknown routes), lesson completion and persistence across remounts, bookmarks and notes, theme switching, inline quiz feedback and answer recording, quiz runner and summaries, mock exam start/submit/auto-submit on timeout and result scoring, search, import/export/reset with confirmation, grading rules (single and all-or-nothing multi-response), domain-weighted mock allocation (65 → 16/19/22/8), progress/accuracy/readiness maths, and content integrity (every question has a valid answer and an explanation for every option; every task statement and every in-scope service is covered; all references are HTTPS AWS URLs).

> Tip: if you add a module file and the tests do not see it, delete `node_modules/.vite` (Vitest caches the expanded `import.meta.glob`).

## Project structure

```
src/
  content/            structured learning content (typed)
    types.ts          schema for modules, lessons, questions, diagrams
    exam.ts           official domains, task statements, in-scope services, exam facts
    modules/          one file per module + a folder with its lessons, bank, services
    traps.ts checklist.ts sources.ts reviewlog.ts
  components/         Layout, QuestionCard, QuizRunner, Diagram/mind map, UI primitives
  pages/              route screens
  lib/                storage, progress context, quiz/grading, stats, search
  test/               Vitest suites
docs/                 content guide + generated registers
scripts/check-links.mjs
```

### Adding or editing content

1. Read [docs/CONTENT_GUIDE.md](./docs/CONTENT_GUIDE.md).
2. Add/edit a lesson file in `src/content/modules/mNN/`, then list it in the module file `src/content/modules/mNN-name.ts`. New module files are picked up automatically (`import.meta.glob`).
3. `npm run check:content`, then `npm run check:links`, then `npm run docs`.

## Known limitations

See the end of [docs/CONTENT_REVIEW.md](./docs/CONTENT_REVIEW.md) and the “Limitations” section in the app’s Sources page. In short: AWS changes names, plans and limits often (re-verify before your exam); practice scores cannot predict the official scaled score; progress lives only in one browser unless you export it.
