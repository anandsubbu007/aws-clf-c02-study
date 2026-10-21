export interface Source {
  title: string;
  /** Omitted for local files supplied by the learner */
  url?: string;
  kind: 'official-exam' | 'official-docs' | 'official-product' | 'learning' | 'book';
  supports: string;
}

/** Primary sources used for the exam facts and structure. Lesson-level references are listed per lesson and aggregated on the Sources page. */
export const PRIMARY_SOURCES: Source[] = [
  {
    title: 'AWS Certified Cloud Practitioner (CLF-C02) exam guide',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/',
    kind: 'official-exam',
    supports: 'Exam guide landing page: introduction, target candidate, question types, scoring model, results.',
  },
  {
    title: 'CLF-C02 content outline: domains and task statements',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html',
    kind: 'official-exam',
    supports: 'Domain weightings (24/30/34/12), all 19 task statements, scored vs unscored questions, scaled score 100–1,000 and passing score 700.',
  },
  {
    title: 'CLF-C02 domain pages (1–4)',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain1.html',
    kind: 'official-exam',
    supports: 'Knowledge and skills lists for each task statement (domains 2, 3 and 4 are on sibling pages cloud-practitioner-02-domain2/3/4.html).',
  },
  {
    title: 'CLF-C02 in-scope AWS services',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html',
    kind: 'official-exam',
    supports: 'The 111 in-scope services listed used for the Services directory and coverage checks.',
  },
  {
    title: 'CLF-C02 out-of-scope AWS services',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-out-of-scope-services.html',
    kind: 'official-exam',
    supports: 'Services explicitly out of scope (for example AWS Wavelength, AWS Transfer Family, Amazon MemoryDB) — taught only as awareness.',
  },
  {
    title: 'CLF-C02 technologies and concepts',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-technologies-concepts.html',
    kind: 'official-exam',
    supports: 'Non-exhaustive list of technologies and concepts that might appear (APIs, IaC, SDKs, AWS Partner Network, Pricing Calculator, re:Post, …).',
  },
  {
    title: 'AWS Certified Cloud Practitioner certification page',
    url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    kind: 'official-exam',
    supports: 'Exam duration (90 minutes), format (65 questions), cost (USD 100), delivery options, languages and 3-year validity.',
  },
  {
    title: 'AWS Support plan comparison',
    url: 'https://aws.amazon.com/premiumsupport/plans/',
    kind: 'official-product',
    supports: 'Current plans: Basic Support, Business Support+, Enterprise Support, Unified Operations; response-time targets; Trusted Advisor access by plan.',
  },
  {
    title: 'AWS Free Tier',
    url: 'https://aws.amazon.com/free/',
    kind: 'official-product',
    supports: 'Current Free plan / Paid plan model and credit amounts for new accounts.',
  },
  {
    title: 'AWS Snowball (end-of-support notice)',
    url: 'https://aws.amazon.com/snowball/',
    kind: 'official-product',
    supports: 'Snow devices are not in the in-scope list; end-of-support date for AWS Snowball devices in commercial Regions.',
  },
  {
    title: 'AWS Trusted Advisor',
    url: 'https://aws.amazon.com/premiumsupport/technology/trusted-advisor/',
    kind: 'official-product',
    supports: 'Trusted Advisor check categories and which plans unlock the full set of checks.',
  },
  {
    title: 'AWS Well-Architected Framework: the pillars',
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html',
    kind: 'official-docs',
    supports: 'The six pillars: operational excellence, security, reliability, performance efficiency, cost optimization, sustainability.',
  },
  {
    title: 'AWS Cloud Adoption Framework',
    url: 'https://aws.amazon.com/professional-services/CAF/',
    kind: 'official-product',
    supports: 'The six CAF perspectives: Business, People, Governance, Platform, Security, Operations.',
  },
  {
    title: 'AWS Prescriptive Guidance: migration strategies (the 7 Rs)',
    url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html',
    kind: 'official-docs',
    supports: 'Retire, Retain, Rehost, Relocate, Repurchase, Replatform, Refactor/re-architect.',
  },
  {
    title: 'Overview of Amazon Web Services: six advantages of cloud computing',
    url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html',
    kind: 'official-docs',
    supports: 'The six advantages of cloud computing used in Module 1.',
  },
  { title: 'AWS documentation home', url: 'https://docs.aws.amazon.com/', kind: 'official-docs', supports: 'Authoritative technical documentation for every service referenced in lessons.' },
  { title: 'AWS Skill Builder', url: 'https://skillbuilder.aws/', kind: 'learning', supports: 'Official digital training, including free exam preparation and official practice material (account required there, not here).' },
  {
    title: 'Supplied study guide: AWS Certified Cloud Practitioner (CLF-C02) Study Guide (O’Reilly) — Markdown copy',
    kind: 'book',
    supports: 'Used as a starting point for topic coverage and sequencing only. Content was re-written, cross-checked and updated against official sources; some book content is outdated (see the content review log).',
  },
  {
    title: 'Supplied study guide: AWS Certified Cloud Practitioner Foundational (CLF-C02) Exam Study Guide (Piper & Clinton) — Markdown copy',
    kind: 'book',
    supports: 'Used as a starting point for topic coverage only. Support plan names, Free Tier details and Snow Family content are outdated relative to current official pages.',
  },
];
