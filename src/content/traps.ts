export interface Trap {
  id: string;
  title: string;
  confusion: string;
  rule: string;
  lessons: string[];
}

/**
 * Cross-cutting look-alike pairs that exam questions like to exploit.
 * These are study aids written for this site (not official AWS content); each rule is checked against the lessons it links to.
 */
export const TRAPS: Trap[] = [
  {
    id: 'scalability-elasticity',
    title: 'Scalability vs elasticity',
    confusion: 'Both involve “more capacity”.',
    rule: 'Scalability = can grow. Elasticity = grows AND shrinks automatically to match demand (pay for what you need).',
    lessons: ['m01-value-of-aws-cloud'],
  },
  {
    id: 'ha-ft',
    title: 'High availability vs fault tolerance',
    confusion: 'Both mean “keeps working”.',
    rule: 'High availability = minimal downtime, usually via multiple Availability Zones. Fault tolerance = no interruption at all when a component fails (more redundancy, more cost).',
    lessons: ['m01-value-of-aws-cloud', 'm05-high-availability-multi-region-edge'],
  },
  {
    id: 'region-az-edge',
    title: 'Region vs Availability Zone vs edge location',
    confusion: 'All are “locations”.',
    rule: 'Region = geographic area containing multiple isolated AZs. AZ = one or more data centers inside a Region. Edge location = content-delivery/DNS point of presence, not a place to run your servers.',
    lessons: ['m05-global-infrastructure'],
  },
  {
    id: 'shared-resp',
    title: 'Who patches what?',
    confusion: 'Mixing up “security of the cloud” and “security in the cloud”.',
    rule: 'AWS secures the infrastructure (hardware, facilities, hypervisor, managed-service software). Customers secure what they put in it: data, IAM, guest OS on EC2, security groups. The more managed the service (RDS, Lambda), the more AWS handles.',
    lessons: ['m02-shared-responsibility'],
  },
  {
    id: 'ct-cw-config',
    title: 'CloudTrail vs CloudWatch vs AWS Config',
    confusion: 'All “monitor” and “log”.',
    rule: 'CloudTrail = who made which API call (audit). CloudWatch = performance metrics, logs and alarms (monitor). Config = resource configuration history and compliance against rules.',
    lessons: ['m02-logging-monitoring-auditing'],
  },
  {
    id: 'kms-hsm-acm',
    title: 'KMS vs CloudHSM vs Certificate Manager vs Secrets Manager',
    confusion: 'All handle “keys and secrets”.',
    rule: 'KMS = managed encryption keys. CloudHSM = dedicated hardware security module you control. ACM = provisions and renews TLS certificates. Secrets Manager = stores and rotates credentials and API keys.',
    lessons: ['m02-encryption-and-data-protection', 'm03-root-user-mfa-credentials'],
  },
  {
    id: 'sg-nacl',
    title: 'Security groups vs network ACLs',
    confusion: 'Both are VPC firewalls.',
    rule: 'Security group: instance-level, stateful, allow rules only. Network ACL: subnet-level, stateless, allow and deny rules.',
    lessons: ['m08-vpc-security'],
  },
  {
    id: 'detect-services',
    title: 'GuardDuty vs Inspector vs Macie vs Detective vs Security Hub',
    confusion: 'All are “security findings” services.',
    rule: 'GuardDuty = threat detection from logs. Inspector = vulnerability scanning of workloads. Macie = sensitive data discovery in S3. Detective = investigate the root cause of findings. Security Hub = aggregates findings and checks posture.',
    lessons: ['m03-detection-and-posture-services'],
  },
  {
    id: 'shield-waf-fm',
    title: 'Shield vs WAF vs Firewall Manager',
    confusion: 'All protect web applications.',
    rule: 'Shield = DDoS protection. WAF = filters web requests (SQL injection, XSS, rate limits). Firewall Manager = centrally manages WAF/Shield and other firewall rules across accounts.',
    lessons: ['m03-network-and-threat-protection'],
  },
  {
    id: 'identity',
    title: 'IAM vs IAM Identity Center vs Cognito',
    confusion: 'All “sign users in”.',
    rule: 'IAM = access control inside an account. IAM Identity Center = workforce single sign-on across accounts and apps. Cognito = sign-up/sign-in for your application’s customers.',
    lessons: ['m03-iam-fundamentals', 'm03-federation-and-identity-services'],
  },
  {
    id: 'cost-tools',
    title: 'Budgets vs Cost Explorer vs Pricing Calculator vs Cost and Usage Reports',
    confusion: 'All “show costs”.',
    rule: 'Pricing Calculator = estimate BEFORE deploying. Budgets = alerts when spend/usage crosses a threshold. Cost Explorer = visualise and forecast actual spend. Cost and Usage Reports = most detailed raw billing data.',
    lessons: ['m12-billing-and-cost-tools'],
  },
  {
    id: 'purchase',
    title: 'On-Demand vs Savings Plans vs Reserved Instances vs Spot vs Dedicated Hosts',
    confusion: 'All are ways to pay for EC2.',
    rule: 'On-Demand = flexible, no commitment. Savings Plans / Reserved Instances = discount for a 1- or 3-year commitment. Spot = deepest discount for interruptible work. Dedicated Hosts = a physical server for you, often for licence or compliance needs.',
    lessons: ['m12-compute-pricing-models'],
  },
  {
    id: 'storage-types',
    title: 'S3 vs EBS vs EFS (and instance store)',
    confusion: 'All “store data”.',
    rule: 'S3 = object storage over HTTP. EBS = block volume for one EC2 instance in one AZ. EFS = shared file system (NFS) for many Linux instances. Instance store = temporary storage that is lost when the instance stops or terminates.',
    lessons: ['m09-s3-and-storage-classes', 'm09-block-storage', 'm09-file-and-hybrid-storage'],
  },
  {
    id: 'messaging',
    title: 'SQS vs SNS vs EventBridge',
    confusion: 'All move messages/events between components.',
    rule: 'SQS = queue; consumers pull messages. SNS = pub/sub; pushes to many subscribers. EventBridge = event bus that routes events by rules from AWS services, SaaS and your apps.',
    lessons: ['m11-application-integration'],
  },
  {
    id: 'databases',
    title: 'RDS vs Aurora vs DynamoDB vs ElastiCache vs Redshift',
    confusion: 'All are “databases”.',
    rule: 'RDS/Aurora = relational (SQL). DynamoDB = NoSQL key-value/document. ElastiCache = in-memory cache. Redshift = data warehouse for analytics.',
    lessons: ['m07-database-choices', 'm07-relational-databases', 'm07-nosql-and-in-memory'],
  },
  {
    id: 'multiaz-replica',
    title: 'Multi-AZ vs read replicas',
    confusion: 'Both create a second copy of an RDS database.',
    rule: 'Multi-AZ = standby copy for availability and failover. Read replicas = extra copies to scale read traffic.',
    lessons: ['m07-relational-databases'],
  },
  {
    id: 'dms-sct',
    title: 'DMS vs SCT',
    confusion: 'Both are database migration tools.',
    rule: 'DMS moves the data (and can replicate continuously). SCT converts the schema and code when the source and target engines differ.',
    lessons: ['m07-database-migration'],
  },
  {
    id: 'vpn-dx',
    title: 'Site-to-Site VPN vs Direct Connect',
    confusion: 'Both connect on-premises to AWS.',
    rule: 'VPN = encrypted tunnel over the public internet, quick to set up. Direct Connect = dedicated private network connection with consistent performance (set up takes longer).',
    lessons: ['m08-connectivity-options'],
  },
  {
    id: 'cf-ga',
    title: 'CloudFront vs Global Accelerator',
    confusion: 'Both use the AWS edge network to improve performance.',
    rule: 'CloudFront caches content at edge locations (CDN). Global Accelerator routes traffic over the AWS global network to the nearest healthy endpoint using static IP addresses; it does not cache.',
    lessons: ['m08-dns-and-content-delivery'],
  },
  {
    id: 'compute-choice',
    title: 'EC2 vs containers vs Lambda',
    confusion: 'All run code.',
    rule: 'EC2 = you manage virtual servers. ECS/EKS = orchestrate containers (on EC2 or Fargate). Fargate = serverless compute for containers. Lambda = event-driven functions, pay per use, no servers to manage.',
    lessons: ['m06-ec2-fundamentals', 'm06-containers', 'm06-serverless-and-other-compute'],
  },
  {
    id: 'support-names',
    title: 'Current vs legacy Support plan names',
    confusion: 'Older books and practice tests list Developer, Business and Enterprise On-Ramp plans.',
    rule: 'The current CLF-C02 exam guide lists Basic Support, AWS Business Support+, AWS Enterprise Support and AWS Unified Operations. Know both sets of names, but learn the current ones.',
    lessons: ['m12-support-plans-and-resources'],
  },
];
