import { Link } from 'react-router-dom';
import { DOMAINS, EXAM_FACTS, LESSONS, QUESTIONS } from '../content';
import { TRAPS } from '../content/traps';
import { Accordion, Callout, PageHeader } from '../components/ui';
import { Icon } from '../components/Icon';
import { LESSON_BY_ID } from '../content';

const OFFICIAL = <span className="chip chip-official" title="Stated on an official AWS page">Official</span>;
const RECO = <span className="chip chip-reco" title="Recommendation by this site, not AWS">Recommendation</span>;

export function ExamPage() {
  const f = EXAM_FACTS;
  return (
    <div className="stack-lg">
      <PageHeader
        title="Exam guide: AWS Certified Cloud Practitioner (CLF-C02)"
        subtitle={
          <>
            Official facts are marked {OFFICIAL}. Study advice by this site is marked {RECO}. Verified against AWS pages on {f.verifiedOn}; AWS can change exam details, so confirm on the{' '}
            <a href={f.sources.overview} target="_blank" rel="noreferrer noopener">certification page</a> before you book.
          </>
        }
      />

      <section className="card" aria-labelledby="facts-h">
        <h2 id="facts-h">Exam at a glance {OFFICIAL}</h2>
        <dl className="facts">
          <div><dt>Level</dt><dd>{f.category}</dd></div>
          <div><dt>Duration</dt><dd>{f.durationMinutes} minutes</dd></div>
          <div><dt>Questions</dt><dd>{f.totalQuestions} in total: {f.scoredQuestions} scored + {f.unscoredQuestions} unscored (unscored questions are not identified)</dd></div>
          <div><dt>Question types</dt><dd>{f.formats.join('; ')}</dd></div>
          <div><dt>Score report</dt><dd>Scaled score {f.scaledScoreRange}; minimum passing score {f.passingScore}</dd></div>
          <div><dt>Scoring model</dt><dd>Compensatory: you do not need to pass each section, only the exam overall. Unanswered = incorrect; no penalty for guessing.</dd></div>
          <div><dt>Cost</dt><dd>USD {f.costUsd} (see AWS for other currencies and taxes)</dd></div>
          <div><dt>Delivery</dt><dd>{f.delivery}</dd></div>
          <div><dt>Validity</dt><dd>{f.validityYears} years</dd></div>
          <div><dt>Target candidate</dt><dd>Up to 6 months of exposure to AWS Cloud design, implementation and/or operations. Out-of-scope tasks: coding, designing cloud architecture, troubleshooting, implementation, load and performance testing.</dd></div>
        </dl>
        <Callout kind="warn" title="Practice scores are not exam scores" icon="warn">
          <p>The official result is a <strong>scaled score</strong> (100–1,000) that AWS equates across exam forms. A score of 700 is <strong>not</strong> “70% correct”, and AWS does not publish a percent-correct pass mark. Percentages on this site are practice percentages only, and finishing the course does not guarantee a pass.</p>
        </Callout>
      </section>

      <section className="card" aria-labelledby="dom-h">
        <h2 id="dom-h">Domains and official weightings {OFFICIAL}</h2>
        <p className="muted small">Weighting = share of <em>scored</em> content. The guide states section weights only; AWS does not publish weights for individual topics, so no topic-level percentages are shown here.</p>
        <div className="weights" role="list">
          {DOMAINS.map((d) => (
            <div key={d.id} className="weight-row" role="listitem">
              <span>D{d.id}</span>
              <div className="weight-bar" aria-hidden="true"><div className={`weight-fill dom-bg-${d.id}`} style={{ width: `${d.weight}%` }} /></div>
              <strong>{d.weight}%</strong>
              <span className="weight-title">{d.title}</span>
            </div>
          ))}
        </div>
        <p className="small muted">
          What that means for the 50 scored questions: roughly 12 / 15 / 17 / 6 questions per domain {RECO} (calculated from the percentages; actual forms may differ).
        </p>
      </section>

      <section aria-labelledby="ts-h" className="stack">
        <h2 id="ts-h">Task statements {OFFICIAL}</h2>
        <p className="muted">Open a task statement to see the official knowledge and skills, the lessons that cover it and quick practice links.</p>
        {DOMAINS.map((d) => (
          <div key={d.id} className="card">
            <h3>
              Domain {d.id}: {d.title} <span className={`chip dom-${d.id}`}>{d.weight}%</span>
            </h3>
            <p className="muted">{d.summary}</p>
            {d.taskStatements.map((t) => {
              const lessons = LESSONS.filter((l) => l.taskStatements.includes(t.id));
              const qn = QUESTIONS.filter((q) => q.taskStatement === t.id).length;
              return (
                <Accordion key={t.id} level={4} title={`Task ${t.id}: ${t.title}`}>
                  <h4>Knowledge of</h4>
                  <ul>{t.knowledge.map((k) => <li key={k}>{k}</li>)}</ul>
                  <h4>Skills in</h4>
                  <ul>{t.skills.map((k) => <li key={k}>{k}</li>)}</ul>
                  <h4>Where to study it</h4>
                  <ul>
                    {lessons.map((l) => (
                      <li key={l.id}><Link to={`/lesson/${l.id}`}>{l.title}</Link></li>
                    ))}
                  </ul>
                  <Link className="btn btn-sm" to={`/practice?mode=task&task=${t.id}&n=10`}>
                    <Icon name="list" size={14} /> Practise task {t.id} ({qn} questions)
                  </Link>
                </Accordion>
              );
            })}
          </div>
        ))}
        <p className="small muted">
          Source:{' '}
          <a href="https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html" target="_blank" rel="noreferrer noopener">CLF-C02 content outline</a>. See <Link to="/sources">Sources & coverage</Link> for how every task statement maps to lessons.
        </p>
      </section>

      <section className="card" aria-labelledby="traps-h">
        <h2 id="traps-h">Exam traps and look-alike concepts {RECO}</h2>
        <p className="muted">Distractors are “generally plausible responses that match the content area” (exam guide). These pairs are where plausible-but-wrong answers usually hide.</p>
        {TRAPS.map((t) => (
          <Accordion key={t.id} title={t.title}>
            <p><strong>Why it confuses:</strong> {t.confusion}</p>
            <p><strong>Rule of thumb:</strong> {t.rule}</p>
            <p className="small">
              Study:{' '}
              {t.lessons.map((id, i) => {
                const l = LESSON_BY_ID.get(id);
                return l ? (
                  <span key={id}>
                    {i > 0 && ', '}
                    <Link to={`/lesson/${id}`}>{l.title}</Link>
                  </span>
                ) : null;
              })}
            </p>
          </Accordion>
        ))}
      </section>

      <section className="card" aria-labelledby="strat-h">
        <h2 id="strat-h">Exam-taking strategy {RECO}</h2>
        <ul>
          <li><strong>Pace:</strong> 65 questions in 90 minutes is about 80 seconds per question. Flag hard questions and return to them; since unanswered questions score as incorrect and guessing is not penalised, answer every question.</li>
          <li><strong>Read the verb:</strong> “MOST cost-effective”, “LEAST operational overhead” and “highest availability” point to different answers for the same scenario.</li>
          <li><strong>Eliminate by category:</strong> distractors usually come from the right domain but the wrong service. Remove options that solve a different problem first.</li>
          <li><strong>Multiple response:</strong> the stem tells you how many to select; every correct option is needed.</li>
          <li><strong>Unscored questions:</strong> 15 questions are unscored and unmarked; treat every question as if it counts.</li>
          <li><strong>Use the Mock exam page</strong> for at least one full timed rehearsal, then review every wrong answer.</li>
        </ul>
        <div className="row wrap">
          <Link className="btn btn-primary" to="/mock">Take a timed mock exam</Link>
          <Link className="btn" to="/readiness">Readiness & final checklist</Link>
        </div>
      </section>
    </div>
  );
}
