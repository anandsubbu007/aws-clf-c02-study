# Content authoring guide

This guide is the contract for every lesson and question in the site. The automated test
`npm run check:content` enforces the mechanical parts; accuracy is enforced by following the rules below.

## 1. Accuracy rules (most important)

- **Official sources first.** Verify facts against `docs.aws.amazon.com`, `aws.amazon.com` product / pricing / FAQ pages and the
  [CLF-C02 exam guide](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html).
  You have `web_fetch` and `curl`; use them. The two study-guide books in `~/Downloads` are *starting points only* and are partly outdated.
- **Never invent** numbers, prices, SLA percentages, limits, quotas or exam predictions. If a number is not verified from an official page, leave it out
  or describe it qualitatively. Only quote numbers you have just verified (for example "Spot: 2-minute interruption notice", "RI terms: 1 or 3 years").
- **Original wording.** Do not copy sentences from the books or from AWS pages. Paraphrase and teach.
- Do not reference option letters in question explanations (“option B is…”) — options are shuffled when shown.
- Mark estimates as estimates. Only the four official domain weights (24/30/34/12) are exam facts; everything else is a study recommendation.
- Do not claim anything guarantees a pass.

## 2. Known changes since the books were written (use the CURRENT facts)

| Topic | Current fact (verified 2026-10-21) | Source |
|---|---|---|
| Support plans | Exam guide task 4.3 lists: customer service & communities, **Basic Support, AWS Business Support+, AWS Enterprise Support, AWS Unified Operations**. Older books teach Developer / Business / Enterprise On-Ramp / Enterprise – mention these as *legacy names* only. Current plan page: Basic is included for all customers (24/7 customer service, docs, whitepapers, re:Post; core Trusted Advisor checks; AWS Health). Business Support+ unlocks the full Trusted Advisor checks, Support API, 24/7 technical support by phone/web/chat, and AI-assisted troubleshooting (AWS DevOps Agent credits). Enterprise Support adds a designated Technical Account Manager etc.; Unified Operations adds designated domain specialist engineers, incident management engineers and the fastest response time for business/mission-critical system down. Response targets from the plan page: Business Support+ <30 min (business/mission-critical system down), Enterprise <15 min, Unified Operations <5 min. Do not quote prices. | https://aws.amazon.com/premiumsupport/plans/ |
| Free Tier | New accounts: AWS Free Tier offers a **Free plan** (up to $200 in credits over 6 months, $100 on sign-up + up to $100 more by exploring services; account closes after 6 months or when credits run out unless you upgrade) and a **Paid plan**. Older books describe a 12-month free tier, always-free and trials – these categories still exist for some services, but verify before asserting. | https://aws.amazon.com/free/ |
| AWS Snow Family | Not on the CLF-C02 in-scope list. AWS announced discontinuing AWS Snowball support in commercial Regions on 2026-12-31. Teach only as *awareness* (offline petabyte-scale transfer) and label it out of scope / being retired. | https://aws.amazon.com/snowball/ |
| Well-Architected | **Six** pillars: operational excellence, security, reliability, performance efficiency, cost optimization, sustainability. | https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html |
| CAF | Six perspectives: **Business, People, Governance, Platform, Security, Operations**. Exam guide business outcomes: reduced business risk; improved ESG performance; increased revenue; increased operational efficiency. | https://aws.amazon.com/professional-services/CAF/ |
| Migration | **7 Rs**: Retire, Retain, Rehost, Relocate, Repurchase, Replatform, Refactor/re-architect. | https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html |
| Trusted Advisor | Categories: cost optimization, performance, resilience (formerly fault tolerance), security, operational excellence, service limits. All accounts get a core set of checks; Business Support+ and above unlock the full set + API. Do not quote check counts. | https://aws.amazon.com/premiumsupport/technology/trusted-advisor/ |
| Name changes | AWS SSO → **AWS IAM Identity Center**; Amazon QuickSight → written **Amazon Quick Sight** in the exam guide; Amazon SageMaker → **Amazon SageMaker AI**; Personal Health Dashboard → **AWS Health Dashboard**; Amazon CodeWhisperer → Amazon Q Developer; Amazon Elasticsearch Service → Amazon OpenSearch Service. |  |
| Exam | CLF-C02: 90 minutes, 65 questions (50 scored + 15 unscored), multiple choice and multiple response, scaled score 100–1,000, passing 700, compensatory scoring, no penalty for guessing, unanswered = incorrect, USD 100, valid 3 years, delivered by Pearson VUE (test centre or online proctored). | See `src/content/exam.ts` |

## 3. Module / lesson ownership (use EXACTLY these module and lesson ids)

Every lesson id below must exist in the module that owns it, because other modules link to them via `related`.
You may add extra lessons, but never rename or drop the ones listed.

| Module file (`src/content/modules/…`) | `id` / `order` | Domain · tasks | Lessons (ids) |
|---|---|---|---|
| `m01-cloud-concepts.ts` | `m01-cloud-concepts` / 1 | D1 · 1.1–1.4 (3.1 deployment models) | `m01-value-of-aws-cloud` (exemplar – exists), `m01-cloud-models`, `m01-well-architected-framework`, `m01-adoption-and-migration`, `m01-cloud-economics` |
| `m02-shared-responsibility-governance.ts` | `m02-shared-responsibility-governance` / 2 | D2 · 2.1, 2.2 | `m02-shared-responsibility`, `m02-compliance-and-governance`, `m02-encryption-and-data-protection`, `m02-logging-monitoring-auditing` |
| `m03-identity-and-security-services.ts` | `m03-identity-and-security-services` / 3 | D2 · 2.3, 2.4 | `m03-iam-fundamentals`, `m03-root-user-mfa-credentials`, `m03-federation-and-identity-services`, `m03-network-and-threat-protection`, `m03-detection-and-posture-services`, `m03-security-resources` |
| `m04-deploy-operate.ts` | `m04-deploy-operate` / 4 | D3 · 3.1 | `m04-ways-to-access-aws`, `m04-infrastructure-as-code-and-management-tools` |
| `m05-global-infrastructure.ts` | `m05-global-infrastructure` / 5 | D3 · 3.2 | `m05-global-infrastructure`, `m05-high-availability-multi-region-edge` |
| `m06-compute.ts` | `m06-compute` / 6 | D3 · 3.3 | `m06-ec2-fundamentals`, `m06-ec2-instance-types`, `m06-scaling-and-load-balancing`, `m06-containers`, `m06-serverless-and-other-compute` |
| `m07-databases.ts` | `m07-databases` / 7 | D3 · 3.4 | `m07-database-choices`, `m07-relational-databases`, `m07-nosql-and-in-memory`, `m07-database-migration` |
| `m08-networking.ts` | `m08-networking` / 8 | D3 · 3.5 | `m08-vpc-fundamentals`, `m08-vpc-security`, `m08-dns-and-content-delivery`, `m08-connectivity-options` |
| `m09-storage.ts` | `m09-storage` / 9 | D3 · 3.6 | `m09-s3-and-storage-classes`, `m09-block-storage`, `m09-file-and-hybrid-storage`, `m09-backup-and-disaster-recovery` |
| `m10-ai-ml-analytics.ts` | `m10-ai-ml-analytics` / 10 | D3 · 3.7 | `m10-ai-ml-services`, `m10-generative-ai`, `m10-analytics-services` |
| `m11-other-services.ts` | `m11-other-services` / 11 | D3 · 3.8 | `m11-application-integration`, `m11-business-and-end-user-computing`, `m11-developer-tools`, `m11-frontend-and-iot` |
| `m12-pricing-billing-support.ts` | `m12-pricing-billing-support` / 12 | D4 · 4.1–4.3 | `m12-compute-pricing-models`, `m12-storage-and-data-transfer-pricing`, `m12-billing-and-cost-tools`, `m12-organizations-and-tags`, `m12-support-plans-and-resources`, `m12-partners-and-marketplace` |

## 4. File layout (keep files small enough to create reliably)

For module `mNN-name`:

```
src/content/modules/mNN-name.ts          # assembles the Module (default export)
src/content/modules/mNN/<lesson-id>.ts   # one file per lesson:  export const lesson: Lesson = {...}
src/content/modules/mNN/bank.ts          # export const bank: Question[]
src/content/modules/mNN/services.ts      # export const services: ServiceEntry[]
```

Only top-level files of `src/content/modules/` are auto-registered; sub-folders are just imports. Use `import type { Lesson } from '../../types';`.
See `src/content/modules/m01-cloud-concepts.ts` for the exemplar lesson (depth, tone, structure). Match or exceed its depth.

## 5. Lesson requirements (also enforced by tests)

Each lesson: `objectives` ≥3, `explanation` ≥3 paragraphs (beginner-friendly but accurate and complete — teach, do not just summarise),
`analogy`, real-world `example`, `howItWorks` ≥3, `whenToUse` ≥2, `limitations` ≥2, `keyTerms` ≥4 (aim for 6–10), `related` ≥1 (valid ids from §3),
`mistakes` ≥2, `examTips` ≥2 (include look-alike traps and keyword → service mappings), `comparisons` ≥1 table (aim 2) comparing similar services/concepts,
`memoryAids` ≥1, `revision` ≥4 bullets, `diagrams` ≥1 (types: `mindmap`, `flow`, `layers`, `columns`, `tree`; see `types.ts`; give lessons that cover several services a `mindmap` or `columns` diagram, and architectures a `flow`/`layers`/`tree`),
`references` ≥2 (official https URLs only, **each must resolve** – run `node scripts/check-links.mjs <your files>`), `knowledgeCheck` exactly 2 questions, `practice` exactly 3 questions (at least one scenario question; include one `multi` in at least half of the lessons).
Optional `deepDives` (click-to-expand detail) — use them for depth that would clutter the main explanation. Aim for 3–5 `deepDives` entries where useful.
Inline markup allowed in strings: `**bold**`, `*italic*`, `` `code` ``. No HTML, no markdown headings or links inside strings.
`minutes` = realistic reading time. `keywords` = aliases / old names / abbreviations people would search for.
Lesson `topic` / `subtopic` give the hierarchy Module → Topic → Subtopic → Lesson; group lessons sensibly.

### Services directory

`services.ts` in each module lists the services that module is responsible for (see ownership list in §6). Each entry: `name` (EXACTLY as written in the official in-scope list in
`src/content/exam.ts` → `IN_SCOPE_SERVICES`), `category` (the official category), `summary` (one sentence: what it is + when to pick it), `lessonId` (a lesson in the same module that teaches it), `inScope: true`.
Services that are helpful but *not* on the official list (for example Elastic Load Balancing, Amazon Bedrock, AWS Pricing Calculator, AWS Snow Family) may be added with `inScope: false`. Every service must also be genuinely taught in the lesson it points to.

### Questions

- Original wording; exam-style (scenario-based stems, plausible distractors from the same domain). Avoid trivial “which of these is a cloud provider” items.
- `type: 'single'`: exactly **4** options, exactly 1 correct. `type: 'multi'`: **5** (or 6) options, 2–3 correct, stem ends with “(Select TWO.)” / “(Select THREE.)”.
- **Every option needs an explanation** (≥1 full sentence): for correct options say why it is right; for distractors say why it is wrong *and ideally what it is actually for*.
- Vary the correct option’s id across questions (a/b/c/d). No more than ~35% of your single-answer questions may have the same correct id.
- `domain` must match the `taskStatement` (e.g. task `3.5` → domain `3`). Use the official task statements in `src/content/exam.ts`.
- Question ids: lesson questions `<lesson-id>-k1`, `-k2` (knowledge check) and `-p1..-p3` (practice). Bank questions: `<module-id>-b01`, `-b02`, …
- `difficulty`: easy | medium | hard. Roughly: 25% easy, 50% medium, 25% hard.
- The module `bank` needs at least **8** extra exam-style questions that span several lessons of the module (cross-lesson “which service” comparisons, 2+ multi-response). Use more for the big domains (security, compute, storage, networking: 10–14).
- Make sure the correct answers are indisputably correct per current AWS documentation.

## 6. Service ownership (each official in-scope service appears in exactly ONE module)

- **M01**: AWS Well-Architected Tool; AWS License Manager; AWS Application Discovery Service; AWS Application Migration Service; Migration Evaluator; AWS Migration Hub; (not in scope, `inScope:false`: AWS Snow Family; AWS Migration Acceleration Program is a program, not a service — mention only in prose).
- **M02**: AWS Artifact; AWS Certificate Manager (ACM); AWS CloudHSM; AWS Key Management Service (AWS KMS); AWS CloudTrail; Amazon CloudWatch; AWS Config.
- **M03**: AWS Identity and Access Management (IAM); AWS IAM Identity Center; Amazon Cognito; AWS Directory Service; AWS Secrets Manager; AWS Resource Access Manager (AWS RAM); AWS Shield; AWS WAF; AWS Firewall Manager; Amazon GuardDuty; Amazon Inspector; Amazon Macie; Amazon Detective; AWS Security Hub.
- **M04**: AWS Management Console; AWS CLI; AWS CloudFormation; AWS Systems Manager; AWS Service Catalog; Service Quotas; AWS Control Tower; also `inScope:false`: AWS CDK, AWS SDKs.
- **M05**: AWS Outposts; also `inScope:false`: AWS Local Zones (mention AWS Wavelength only in prose; it is listed as out of scope).
- **M06**: Amazon EC2; AWS Batch; AWS Elastic Beanstalk; Amazon Lightsail; Amazon Elastic Container Registry (Amazon ECR); Amazon Elastic Container Service (Amazon ECS); Amazon Elastic Kubernetes Service (Amazon EKS); AWS Fargate; AWS Lambda; AWS Auto Scaling; AWS Compute Optimizer; `inScope:false`: Elastic Load Balancing.
- **M07**: Amazon RDS; Amazon Aurora; Amazon DynamoDB; Amazon ElastiCache; Amazon DocumentDB; Amazon Neptune; AWS Database Migration Service (AWS DMS); AWS Schema Conversion Tool (AWS SCT).
- **M08**: Amazon VPC; AWS VPN; AWS Site-to-Site VPN; AWS Client VPN; AWS Direct Connect; AWS Transit Gateway; AWS PrivateLink; Amazon Route 53; Amazon CloudFront; AWS Global Accelerator; Amazon API Gateway.
- **M09**: Amazon S3; Amazon S3 Glacier; Amazon Elastic Block Store (Amazon EBS); Amazon Elastic File System (Amazon EFS); Amazon FSx; AWS Storage Gateway; AWS Backup; AWS Elastic Disaster Recovery.
- **M10**: Amazon Athena; Amazon EMR; AWS Glue; Amazon Kinesis; Amazon OpenSearch Service; Amazon Quick Sight; Amazon Redshift; Amazon Comprehend; Amazon Lex; Amazon Polly; Amazon Q; Amazon Rekognition; Amazon SageMaker AI; Amazon Textract; Amazon Transcribe; Amazon Translate; `inScope:false`: Amazon Bedrock.
- **M11**: Amazon EventBridge; Amazon Simple Notification Service (Amazon SNS); Amazon Simple Queue Service (Amazon SQS); AWS Step Functions; Amazon Connect; Amazon Simple Email Service (Amazon SES); AWS CodeBuild; AWS CodePipeline; AWS X-Ray; Amazon AppStream 2.0; Amazon WorkSpaces; Amazon WorkSpaces Secure Browser; AWS Amplify; AWS IoT Core.
- **M12**: AWS Budgets; AWS Cost and Usage Reports; AWS Cost Explorer; AWS Marketplace; AWS Support; AWS Organizations; AWS Health Dashboard; AWS Trusted Advisor; `inScope:false`: AWS Pricing Calculator, AWS Savings Plans, AWS Billing and Cost Management.

(111 official service names; the coverage test fails if any are missing.)

## 7. Done checklist per module

1. `npx vitest run src/test/content.test.ts` passes for your module’s tests (`-t "module mNN"`), ignoring failures that are only about *other* modules’ lessons not existing yet when you validate `related` links — to avoid this, only link to lesson ids listed in §3.
2. `npx tsc --noEmit` has no errors in your files.
3. `node scripts/check-links.mjs src/content/modules/<your files>` reports 0 broken.
4. Re-read your questions: is each correct answer right, and every distractor wrong, per current AWS docs?
5. Report back: files created, number of lessons/questions/services, any uncertainty or fact you could not verify (these go in the content-review checklist).
