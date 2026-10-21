export interface ChecklistGroup {
  domain: number;
  title: string;
  items: { id: string; text: string; lessonId?: string }[];
}

/** Final revision checklist. Self-assessment statements written for this site, aligned to the official task statements. */
export const CHECKLIST: ChecklistGroup[] = [
  {
    domain: 1,
    title: 'Domain 1 · Cloud Concepts (24%)',
    items: [
      { id: 'd1-six', text: 'I can list the six advantages of cloud computing and match each to a scenario.', lessonId: 'm01-value-of-aws-cloud' },
      { id: 'd1-models', text: 'I can distinguish IaaS, PaaS and SaaS and public, hybrid and on-premises deployments.', lessonId: 'm01-cloud-models' },
      { id: 'd1-wa', text: 'I can name the six Well-Architected pillars and tell them apart in a scenario.', lessonId: 'm01-well-architected-framework' },
      { id: 'd1-caf', text: 'I can name the six AWS CAF perspectives and the four business outcomes the exam guide lists.', lessonId: 'm01-adoption-and-migration' },
      { id: 'd1-7r', text: 'I can describe each of the 7 Rs of migration and pick one for a scenario.', lessonId: 'm01-adoption-and-migration' },
      { id: 'd1-econ', text: 'I can explain CapEx vs OpEx, rightsizing, BYOL vs license-included and economies of scale.', lessonId: 'm01-cloud-economics' },
    ],
  },
  {
    domain: 2,
    title: 'Domain 2 · Security and Compliance (30%)',
    items: [
      { id: 'd2-srm', text: 'I can say who is responsible for what for EC2, RDS, Lambda and S3.', lessonId: 'm02-shared-responsibility' },
      { id: 'd2-artifact', text: 'I know where to get compliance reports and agreements (AWS Artifact).', lessonId: 'm02-compliance-and-governance' },
      { id: 'd2-enc', text: 'I can explain encryption in transit vs at rest and when to use KMS, CloudHSM and ACM.', lessonId: 'm02-encryption-and-data-protection' },
      { id: 'd2-logs', text: 'I can separate CloudTrail, CloudWatch and AWS Config by purpose.', lessonId: 'm02-logging-monitoring-auditing' },
      { id: 'd2-iam', text: 'I can describe users, groups, roles, policies and the principle of least privilege.', lessonId: 'm03-iam-fundamentals' },
      { id: 'd2-root', text: 'I know how to protect the root user and what MFA, access keys and password policies do.', lessonId: 'm03-root-user-mfa-credentials' },
      { id: 'd2-fed', text: 'I can choose between IAM Identity Center, Cognito and federation.', lessonId: 'm03-federation-and-identity-services' },
      { id: 'd2-sec', text: 'I can match GuardDuty, Inspector, Macie, Detective, Security Hub, Shield, WAF and Firewall Manager to their purposes.', lessonId: 'm03-detection-and-posture-services' },
    ],
  },
  {
    domain: 3,
    title: 'Domain 3 · Cloud Technology and Services (34%)',
    items: [
      { id: 'd3-access', text: 'I can choose between console, CLI/SDK/API and infrastructure as code.', lessonId: 'm04-ways-to-access-aws' },
      { id: 'd3-global', text: 'I can explain Regions, AZs, edge locations and when to use multiple Regions.', lessonId: 'm05-global-infrastructure' },
      { id: 'd3-ec2', text: 'I can match EC2 instance families to workloads and explain Auto Scaling and load balancing.', lessonId: 'm06-ec2-instance-types' },
      { id: 'd3-containers', text: 'I can choose among ECS, EKS, Fargate and Lambda.', lessonId: 'm06-containers' },
      { id: 'd3-db', text: 'I can choose among RDS, Aurora, DynamoDB, ElastiCache and know DMS vs SCT.', lessonId: 'm07-database-choices' },
      { id: 'd3-vpc', text: 'I can describe VPC components, security groups vs NACLs, Route 53, VPN and Direct Connect.', lessonId: 'm08-vpc-fundamentals' },
      { id: 'd3-s3', text: 'I can compare S3 storage classes and explain lifecycle policies.', lessonId: 'm09-s3-and-storage-classes' },
      { id: 'd3-block', text: 'I can distinguish EBS, instance store, EFS, FSx and Storage Gateway; and know what AWS Backup does.', lessonId: 'm09-block-storage' },
      { id: 'd3-ai', text: 'I can match AI/ML services (SageMaker AI, Lex, Rekognition, Polly, …) to tasks.', lessonId: 'm10-ai-ml-services' },
      { id: 'd3-analytics', text: 'I can match analytics services (Athena, Kinesis, Glue, Quick Sight, EMR, Redshift) to tasks.', lessonId: 'm10-analytics-services' },
      { id: 'd3-integration', text: 'I can choose among SQS, SNS, EventBridge and Step Functions.', lessonId: 'm11-application-integration' },
      { id: 'd3-other', text: 'I can identify Amazon Connect, SES, WorkSpaces, AppStream 2.0, Amplify, IoT Core and the developer tools.', lessonId: 'm11-business-and-end-user-computing' },
    ],
  },
  {
    domain: 4,
    title: 'Domain 4 · Billing, Pricing, and Support (12%)',
    items: [
      { id: 'd4-compute', text: 'I can choose among On-Demand, Savings Plans, Reserved, Spot, Dedicated and Capacity Reservations.', lessonId: 'm12-compute-pricing-models' },
      { id: 'd4-transfer', text: 'I know which data transfer is free and which is charged.', lessonId: 'm12-storage-and-data-transfer-pricing' },
      { id: 'd4-tools', text: 'I can pick between Budgets, Cost Explorer, Pricing Calculator and Cost and Usage Reports.', lessonId: 'm12-billing-and-cost-tools' },
      { id: 'd4-org', text: 'I can explain consolidated billing and cost allocation tags.', lessonId: 'm12-organizations-and-tags' },
      { id: 'd4-support', text: 'I can describe the current AWS Support plans and the technical resources available.', lessonId: 'm12-support-plans-and-resources' },
      { id: 'd4-partners', text: 'I understand the roles of AWS Partners, AWS Marketplace, Professional Services and solutions architects.', lessonId: 'm12-partners-and-marketplace' },
    ],
  },
  {
    domain: 0,
    title: 'Exam readiness',
    items: [
      { id: 'x-mock1', text: 'I completed at least one full 65-question timed mock under exam conditions.', lessonId: undefined },
      { id: 'x-review', text: 'I reviewed every incorrect answer and understood why each distractor was wrong.' },
      { id: 'x-guide', text: 'I read the official exam guide and the in-scope service list.' },
      { id: 'x-logistics', text: 'I checked the current exam registration, ID and online-proctoring requirements on the official certification page.' },
    ],
  },
];
