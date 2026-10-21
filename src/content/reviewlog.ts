export type Verification = 'verified' | 'partly' | 'unverified';

export interface ReviewEntry {
  area: string;
  claim: string;
  status: Verification;
  source: string;
  note: string;
}

/**
 * Content review log: what was checked, against which source, and what remains uncertain.
 * Dates are the verification dates; AWS changes names, plans and prices regularly.
 */
export const REVIEW_LOG: ReviewEntry[] = [
  { area: 'Exam', claim: '90 minutes, 65 questions (50 scored + 15 unscored), multiple choice and multiple response', status: 'verified', source: 'Exam guide + certification page (2026-10-21)', note: 'Unscored questions are not identified on the exam.' },
  { area: 'Exam', claim: 'Scaled score 100–1,000, passing score 700, compensatory scoring, no penalty for guessing', status: 'verified', source: 'Exam guide (2026-10-21)', note: 'AWS does not publish a percent-correct pass mark; this site never converts practice % to a scaled score.' },
  { area: 'Exam', claim: 'Domain weights 24 / 30 / 34 / 12%', status: 'verified', source: 'Exam guide content outline', note: 'Only domain-level weights are official. Topic-level percentages are not published, so none are shown.' },
  { area: 'Exam', claim: 'Cost USD 100; valid 3 years; Pearson VUE test centre or online proctored', status: 'verified', source: 'Certification page (2026-10-21)', note: 'Prices vary by currency and may change; the site tells learners to confirm before booking.' },
  { area: 'Syllabus', claim: '19 task statements and 111 in-scope service names', status: 'verified', source: 'Exam guide domain pages and in-scope list', note: 'AWS says both lists are non-exhaustive and subject to change. A test checks that every listed service has a directory entry.' },
  { area: 'Support', claim: 'Current plans: Basic, Business Support+, Enterprise Support, Unified Operations', status: 'verified', source: 'Exam guide task 4.3 + AWS Support plan comparison page (2026-10-21)', note: 'Supplied books describe the older Developer / Business / Enterprise On-Ramp plans; legacy names are mentioned for recognition only. No prices are quoted.' },
  { area: 'Free Tier', claim: 'New accounts use a Free plan / Paid plan credit model (up to $200 over 6 months)', status: 'verified', source: 'AWS Free Tier page (2026-10-21)', note: 'The supplied books describe a 12-month Free Tier. Verify current terms before relying on either.' },
  { area: 'Snow Family', claim: 'Not in scope; AWS Snowball support ends 2026-12-31 in commercial Regions', status: 'verified', source: 'AWS Snowball page and exam in-scope list', note: 'The supplied books teach Snow Family as exam content. It is included only as awareness.' },
  { area: 'Frameworks', claim: 'Six Well-Architected pillars; six CAF perspectives; seven migration Rs', status: 'verified', source: 'Well-Architected docs, AWS CAF page, Prescriptive Guidance', note: 'Older books list five CAF perspectives or six Rs.' },
  { area: 'Naming', claim: 'IAM Identity Center, Amazon SageMaker AI, Amazon Quick Sight, AWS Health Dashboard', status: 'verified', source: 'Exam guide service names', note: 'Old names are added as search keywords where useful.' },
  { area: 'AI/ML', claim: 'Amazon Q product naming (Q Developer, Q Business, Quick)', status: 'partly', source: 'AWS product pages', note: 'AWS is renaming and consolidating the Amazon Q family; the lesson teaches the concept and flags the changes. Re-check before your exam.' },
  { area: 'Practice questions', claim: 'All 4-option and multi-response questions are original and have an explanation for every option', status: 'verified', source: 'Automated content tests', note: 'Questions were written for this site and checked against AWS documentation by the content authors; they are not real exam questions.' },
  { area: 'Migration', claim: 'AWS Application Migration Service is now documented as AWS Transform MGN; AWS Migration Hub and Application Discovery Service closed to new customers on 2025-11-07', status: 'partly', source: 'AWS documentation pages for each service', note: 'The lessons keep the exam-guide names (still the names on the in-scope list) and note the changes. Re-check before your exam.' },
  { area: 'Security', claim: 'Root-user-only task list', status: 'verified', source: 'IAM User Guide: tasks that require root user credentials', note: 'Older books list tasks (for example changing the support plan) that are no longer on the current list.' },
  { area: 'Security', claim: 'Amazon Simple AD closed to new customers; AWS Security Hub documented as “Security Hub CSPM”', status: 'verified', source: 'AWS documentation', note: 'Exam names are kept; the lessons note the changes.' },
  { area: 'Compute', claim: 'Lambda timeout 900 seconds and memory 128–10,240 MB for standard functions', status: 'verified', source: 'Lambda quotas page', note: 'AWS Lambda keeps adding invocation modes with different limits; the lesson teaches classic event-driven functions and says so.' },
  { area: 'Compute', claim: 'AWS Auto Scaling scaling plans', status: 'partly', source: 'AWS Auto Scaling docs', note: 'Docs now include migration guidance to EC2 Auto Scaling / Application Auto Scaling; the lesson teaches the concept (elasticity) and notes this.' },
  { area: 'Storage', claim: 'S3 storage classes, durability, availability and minimum storage durations', status: 'verified', source: 'Amazon S3 storage classes page', note: 'An independent review pass re-checked these figures; numbers can change, so confirm on the page before quoting them.' },
  { area: 'Storage', claim: 'FSx File Gateway no longer available to new customers', status: 'verified', source: 'Storage Gateway docs', note: 'Still taught for recognition and labelled.' },
  { area: 'End-user computing', claim: 'AppStream 2.0 now documented as Amazon WorkSpaces Applications; WorkSpaces Secure Browser stops accepting new customers 2026-10-29', status: 'partly', source: 'AWS product documentation', note: 'The exam guide still lists AppStream 2.0 and WorkSpaces Secure Browser, so those names are used. Re-check availability notes.' },
  { area: 'Partners', claim: 'Partner volume discounts', status: 'unverified', source: 'Exam guide skill list', note: 'Listed because the exam guide lists it as a partner benefit; no official page with terms was found, so no detail is given.' },
  { area: 'Billing', claim: 'Savings Plans / Reserved Instance “up to” discount percentages', status: 'partly', source: 'AWS pricing pages', note: 'Quoted only as AWS-stated maximums, never as guaranteed savings. No prices are quoted anywhere.' },
  { area: 'Tooling', claim: 'Trusted Advisor core vs full check sets by Support plan', status: 'verified', source: 'Trusted Advisor product page (2026-10-21)', note: 'Check counts change and are not quoted.' },
  { area: 'AI/ML', claim: 'Generative-AI statements (Bedrock data handling, Amazon Q family naming, Redshift Spectrum)', status: 'partly', source: 'AWS documentation; independent review pass', note: 'Claims that could not be tied to an official page were softened or removed during review.' },
];

export const LIMITATIONS: string[] = [
  'The content was written for this site from official AWS documentation and the two supplied study guides; AWS changes service names, plans, limits and quotas often. Treat the review log as a snapshot dated 2026-10-21 and re-verify volatile facts (support plans, Free Tier, service availability) before your exam.',
  'Practice questions are original and are not real exam questions. Their difficulty and wording will differ from the real exam, and practice percentages cannot be converted to the official 100–1,000 scaled score.',
  'AWS does not publish topic-level weightings, so none are claimed. The “suggested focus” and readiness thresholds are this site’s own recommendations.',
  'Some in-scope services are taught at awareness depth only (for example Amazon Neptune or AWS IoT Core) because the exam guide expects recognition, not configuration skills.',
  'Progress is stored in this browser’s localStorage only. Clearing site data or switching browsers loses it unless you export a backup. No data is sent anywhere.',
  'Automated tests verify structure, answer validity, coverage and behaviour; they cannot prove every factual statement is current. Link checking needs internet access and some AWS pages may rate-limit automated checks.',
];
