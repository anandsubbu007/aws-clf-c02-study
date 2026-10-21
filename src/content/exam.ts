import type { Domain } from './types';

export const EXAM_GUIDE_URL =
  'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html';

/** Official exam facts. Each entry cites where it was verified. */
export const EXAM_FACTS = {
  code: 'CLF-C02',
  name: 'AWS Certified Cloud Practitioner',
  category: 'Foundational',
  durationMinutes: 90,
  totalQuestions: 65,
  scoredQuestions: 50,
  unscoredQuestions: 15,
  scaledScoreRange: '100–1,000',
  passingScore: 700,
  costUsd: 100,
  validityYears: 3,
  formats: ['Multiple choice (1 correct, 3 distractors)', 'Multiple response (2+ correct out of 5+ options)'],
  delivery: 'Pearson VUE test center or online proctored exam',
  verifiedOn: '2026-10-21',
  sources: {
    guide: EXAM_GUIDE_URL,
    overview: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
  },
} as const;

export const DOMAINS: Domain[] = [
  {
    id: 1,
    title: 'Cloud Concepts',
    weight: 24,
    summary: 'Value of the AWS Cloud, Well-Architected design principles, migration strategies and cloud economics.',
    taskStatements: [
      {
        id: '1.1',
        domain: 1,
        title: 'Define the benefits of the AWS Cloud.',
        knowledge: ['Value proposition of the AWS Cloud'],
        skills: [
          'Understanding the benefits of global infrastructure (for example, speed of deployment, global reach)',
          'Understanding the advantages of high availability, elasticity, and agility',
        ],
      },
      {
        id: '1.2',
        domain: 1,
        title: 'Identify design principles of the AWS Cloud.',
        knowledge: ['AWS Well-Architected Framework'],
        skills: [
          'Understanding the pillars of the Well-Architected Framework (for example, operational excellence, security, reliability, performance efficiency, cost optimization, sustainability)',
          'Identifying differences between the pillars of the Well-Architected Framework',
        ],
      },
      {
        id: '1.3',
        domain: 1,
        title: 'Understand the benefits of and strategies for migration to the AWS Cloud.',
        knowledge: ['Cloud adoption strategies', 'Resources to support the cloud migration journey'],
        skills: [
          'Understanding the components of the AWS Cloud Adoption Framework (AWS CAF) (for example, reduced business risk; improved ESG performance; increased revenue; increased operational efficiency)',
          'Identifying appropriate migration strategies (for example, database replication)',
        ],
      },
      {
        id: '1.4',
        domain: 1,
        title: 'Understand concepts of cloud economics.',
        knowledge: ['Aspects of cloud economics', 'Cost savings of moving to the cloud'],
        skills: [
          'Understanding the role of fixed costs compared with variable costs',
          'Understanding costs that are associated with on-premises environments',
          'Understanding the differences between licensing strategies (for example, BYOL compared with included licenses)',
          'Understanding the concept of rightsizing',
          'Identifying benefits of automation',
          'Understanding the economies of scale (for example, cost savings)',
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Security and Compliance',
    weight: 30,
    summary: 'Shared responsibility, governance and compliance, access management, and AWS security services.',
    taskStatements: [
      {
        id: '2.1',
        domain: 2,
        title: 'Understand the AWS shared responsibility model.',
        knowledge: ['AWS shared responsibility model'],
        skills: [
          'Recognizing the components of the AWS shared responsibility model',
          "Describing the customer's responsibilities on AWS",
          'Describing AWS responsibilities',
          'Describing responsibilities that the customer and AWS share',
          'Describing how AWS responsibilities and customer responsibilities can shift, depending on the service used (for example, Amazon RDS, AWS Lambda, Amazon EC2)',
        ],
      },
      {
        id: '2.2',
        domain: 2,
        title: 'Understand AWS Cloud security, governance, and compliance concepts.',
        knowledge: [
          'AWS compliance and governance concepts',
          'Benefits of cloud security (for example, encryption)',
          'Where to capture and locate logs that are associated with cloud security',
        ],
        skills: [
          'Identifying where to find AWS compliance information (for example, AWS Artifact)',
          'Understanding compliance needs among geographic locations or industries (for example, AWS compliance)',
          'Describing how customers secure resources on AWS (for example, Amazon Inspector, AWS Security Hub, Amazon GuardDuty, AWS Shield)',
          'Identifying encryption options (for example, encryption in transit, encryption at rest)',
          'Recognizing services that aid in governance and compliance (for example, monitoring with Amazon CloudWatch; auditing with AWS CloudTrail and AWS Config; reporting with access reports)',
          'Recognizing compliance requirements that vary among AWS services',
        ],
      },
      {
        id: '2.3',
        domain: 2,
        title: 'Identify AWS access management capabilities.',
        knowledge: [
          'Identity and access management (for example, AWS IAM)',
          'Importance of protecting the AWS root user account',
          'Principle of least privilege',
          'AWS IAM Identity Center',
        ],
        skills: [
          'Understanding access keys, password policies, and credential storage (for example, AWS Secrets Manager, AWS Systems Manager)',
          'Identifying authentication methods in AWS (for example, MFA, IAM Identity Center, cross-account IAM roles)',
          'Defining groups, users, custom policies, and managed policies in compliance with the principle of least privilege',
          'Identifying tasks that only the account root user can perform',
          'Understanding which methods can achieve root user protection',
          'Understanding the types of identity management (for example, federated)',
        ],
      },
      {
        id: '2.4',
        domain: 2,
        title: 'Identify components and resources for security.',
        knowledge: ['Security capabilities that AWS provides', 'Security-related documentation that AWS provides'],
        skills: [
          'Describing AWS security features and services (for example, AWS WAF, AWS Firewall Manager, AWS Shield, Amazon GuardDuty)',
          'Understanding that third-party security products are available from AWS Marketplace',
          'Identifying where AWS security information is available (for example, AWS Knowledge Center, AWS Security Center, AWS Security Blog)',
          'Understanding the use of AWS services for identifying security issues (for example, AWS Trusted Advisor)',
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Cloud Technology and Services',
    weight: 34,
    summary: 'Deployment and operation methods, global infrastructure, and the core compute, database, network, storage, AI/ML, analytics and other in-scope services.',
    taskStatements: [
      {
        id: '3.1',
        domain: 3,
        title: 'Define methods of deploying and operating in the AWS Cloud.',
        knowledge: [
          'Various ways of provisioning and operating in the AWS Cloud',
          'Various ways to access AWS services',
          'Types of cloud deployment models',
        ],
        skills: [
          'Deciding between options such as programmatic access (for example, APIs, SDKs, CLI), the AWS Management Console, and infrastructure as code (IaC)',
          'Evaluating requirements to determine whether to use one-time operations or repeatable processes',
          'Identifying deployment models (for example, cloud, hybrid, on-premises)',
        ],
      },
      {
        id: '3.2',
        domain: 3,
        title: 'Define the AWS global infrastructure.',
        knowledge: [
          'AWS Regions, Availability Zones, and edge locations',
          'High availability',
          'Use of multiple Regions',
          'Benefits of edge locations',
        ],
        skills: [
          'Describing relationships among Regions, Availability Zones, and edge locations',
          'Describing how to achieve high availability by using multiple Availability Zones',
          'Recognizing that Availability Zones do not share single points of failure',
          'Describing when to use multiple Regions (for example, disaster recovery, business continuity, low latency for end users, data sovereignty)',
        ],
      },
      {
        id: '3.3',
        domain: 3,
        title: 'Identify AWS compute services.',
        knowledge: ['AWS compute services'],
        skills: [
          'Recognizing the appropriate use of various Amazon EC2 instance types (for example, compute optimized, storage optimized)',
          'Recognizing the appropriate use of various container options (for example, Amazon ECS, Amazon EKS)',
          'Recognizing the appropriate use of various serverless compute options (for example, AWS Fargate, AWS Lambda)',
          'Recognizing that auto scaling provides elasticity',
          'Identifying the purposes of load balancers',
        ],
      },
      {
        id: '3.4',
        domain: 3,
        title: 'Identify AWS database services.',
        knowledge: ['AWS database services', 'Database migration'],
        skills: [
          'Deciding when to use EC2 hosted databases or AWS managed databases',
          'Identifying relational databases (for example, Amazon RDS, Amazon Aurora)',
          'Identifying NoSQL databases (for example, Amazon DynamoDB)',
          'Identifying memory-based databases (for example, Amazon ElastiCache)',
          'Identifying database migration tools (for example, AWS DMS, AWS SCT)',
        ],
      },
      {
        id: '3.5',
        domain: 3,
        title: 'Identify AWS network services.',
        knowledge: ['AWS network services'],
        skills: [
          'Identifying the components of a VPC (for example, subnets, gateways)',
          'Understanding security in a VPC (for example, network ACLs, security groups, Amazon Inspector)',
          'Understanding the purpose of Amazon Route 53',
          'Identifying network connectivity options to AWS (for example, AWS VPN, AWS Direct Connect)',
        ],
      },
      {
        id: '3.6',
        domain: 3,
        title: 'Identify AWS storage services.',
        knowledge: ['AWS storage services'],
        skills: [
          'Identifying the uses for object storage',
          'Recognizing the differences in Amazon S3 storage classes',
          'Identifying block storage solutions (for example, Amazon EBS, instance store)',
          'Identifying file services (for example, Amazon EFS, Amazon FSx)',
          'Identifying cached file systems (for example, AWS Storage Gateway)',
          'Understanding use cases for lifecycle policies',
          'Understanding use cases for AWS Backup',
        ],
      },
      {
        id: '3.7',
        domain: 3,
        title: 'Identify AWS artificial intelligence and machine learning (AI/ML) services and analytics services.',
        knowledge: ['AWS AI/ML services', 'AWS analytics services'],
        skills: [
          'Understanding AI/ML services and the tasks that they accomplish (for example, Amazon SageMaker AI, Amazon Lex)',
          'Identifying the services for data analytics (for example, Amazon Athena, Amazon Kinesis, AWS Glue, Amazon Quick Sight)',
        ],
      },
      {
        id: '3.8',
        domain: 3,
        title: 'Identify services from other in-scope AWS service categories.',
        knowledge: [
          'Application integration services of Amazon EventBridge, Amazon SNS, and Amazon SQS',
          'Business application services of Amazon Connect and Amazon SES',
          'Customer enablement services (for example, AWS Support)',
          'Developer tool services and capabilities (for example, AWS CodeBuild, AWS CodePipeline, and AWS X-Ray)',
          'End-user computing services of Amazon AppStream 2.0, Amazon WorkSpaces, and Amazon WorkSpaces Secure Browser',
          'Frontend web and mobile services of AWS Amplify',
          'IoT services (for example, AWS IoT Core)',
        ],
        skills: [
          'Choosing the appropriate service to deliver messages and to send alerts and notifications',
          'Choosing the appropriate service to meet business application needs',
          'Choosing the appropriate option for business support assistance',
          'Identifying the tools to develop, deploy, and troubleshoot applications',
          'Identifying the services that can present the output of virtual machines (VMs) on end-user machines',
          'Identifying the services that can create and deploy frontend and mobile services',
          'Identifying the services that manage IoT devices',
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Billing, Pricing, and Support',
    weight: 12,
    summary: 'Pricing models, billing and cost management tools, support plans and technical resources.',
    taskStatements: [
      {
        id: '4.1',
        domain: 4,
        title: 'Compare AWS pricing models.',
        knowledge: [
          'Compute purchasing options (for example, On-Demand Instances, Reserved Instances, Spot Instances, AWS Savings Plans, Dedicated Hosts, Dedicated Instances, Capacity Reservations)',
          'Storage options and tiers',
        ],
        skills: [
          'Identifying when to use various compute purchasing options',
          'Describing Reserved Instance flexibility',
          'Describing Reserved Instance behavior in AWS Organizations',
          'Understanding incoming data transfer costs and outgoing data transfer costs (for example, from one AWS Region to another Region, within the same Region)',
          'Understanding pricing options for various storage options and tiers',
        ],
      },
      {
        id: '4.2',
        domain: 4,
        title: 'Understand resources for billing, budget, and cost management.',
        knowledge: [
          'Billing support and information',
          'Pricing information for AWS services',
          'AWS Organizations',
          'AWS cost allocation tags',
        ],
        skills: [
          'Understanding the appropriate uses and capabilities of AWS Budgets and AWS Cost Explorer',
          'Understanding the appropriate uses and capabilities of AWS Pricing Calculator',
          'Understanding AWS Organizations consolidated billing and allocation of costs',
          'Understanding various types of cost allocation tags and their relation to billing reports (for example, AWS Cost and Usage Report)',
        ],
      },
      {
        id: '4.3',
        domain: 4,
        title: 'Identify AWS technical resources and AWS Support options.',
        knowledge: [
          'Resources and documentation available on official AWS websites',
          'AWS Support plans',
          'Role of the AWS Partner Network, including independent software vendors and system integrators',
          'AWS Support Center',
        ],
        skills: [
          'Locating AWS whitepapers, blogs, and documentation on official AWS websites',
          'Identifying and locating AWS technical resources (for example, AWS Prescriptive Guidance, AWS Knowledge Center, AWS re:Post)',
          'Identifying AWS Support options for AWS customers (for example, customer service and communities, Basic Support, AWS Business Support+, AWS Enterprise Support, AWS Unified Operations)',
          'Identifying the role of AWS Trusted Advisor, AWS Health Dashboard, and the AWS Health API to help manage and monitor environments for cost optimization',
          'Identifying the role of the AWS Trust and Safety team to report abuse of AWS resources',
          'Understanding the role of AWS Partners (for example, AWS Marketplace, independent software vendors, system integrators)',
          'Identifying the benefits of being an AWS Partner (for example, partner training and certification, partner events, partner volume discounts)',
          'Identifying the key services that AWS Marketplace offers (for example, cost management, governance and entitlement)',
          'Identifying technical assistance options available at AWS (for example, AWS Professional Services, AWS solutions architects)',
        ],
      },
    ],
  },
];

/** Official in-scope services (exam guide). Used by the coverage test and Services page. */
export const IN_SCOPE_SERVICES: Record<string, string[]> = {
  Analytics: ['Amazon Athena', 'Amazon EMR', 'AWS Glue', 'Amazon Kinesis', 'Amazon OpenSearch Service', 'Amazon Quick Sight', 'Amazon Redshift'],
  'Application Integration': ['Amazon EventBridge', 'Amazon Simple Notification Service (Amazon SNS)', 'Amazon Simple Queue Service (Amazon SQS)', 'AWS Step Functions'],
  'Business Applications': ['Amazon Connect', 'Amazon Simple Email Service (Amazon SES)'],
  'Cloud Financial Management': ['AWS Budgets', 'AWS Cost and Usage Reports', 'AWS Cost Explorer', 'AWS Marketplace'],
  Compute: ['AWS Batch', 'Amazon EC2', 'AWS Elastic Beanstalk', 'Amazon Lightsail', 'AWS Outposts'],
  Containers: ['Amazon Elastic Container Registry (Amazon ECR)', 'Amazon Elastic Container Service (Amazon ECS)', 'Amazon Elastic Kubernetes Service (Amazon EKS)'],
  'Customer Enablement': ['AWS Support'],
  Database: ['Amazon Aurora', 'Amazon DocumentDB', 'Amazon DynamoDB', 'Amazon ElastiCache', 'Amazon Neptune', 'Amazon RDS'],
  'Developer Tools': ['AWS CLI', 'AWS CodeBuild', 'AWS CodePipeline', 'AWS X-Ray'],
  'End User Computing': ['Amazon AppStream 2.0', 'Amazon WorkSpaces', 'Amazon WorkSpaces Secure Browser'],
  'Frontend Web and Mobile': ['AWS Amplify'],
  'Internet of Things (IoT)': ['AWS IoT Core'],
  'Machine Learning': ['Amazon Comprehend', 'Amazon Lex', 'Amazon Polly', 'Amazon Q', 'Amazon Rekognition', 'Amazon SageMaker AI', 'Amazon Textract', 'Amazon Transcribe', 'Amazon Translate'],
  'Management and Governance': [
    'AWS Auto Scaling', 'AWS CloudFormation', 'AWS CloudTrail', 'Amazon CloudWatch', 'AWS Compute Optimizer', 'AWS Config',
    'AWS Control Tower', 'AWS Health Dashboard', 'AWS License Manager', 'AWS Management Console', 'AWS Organizations',
    'AWS Service Catalog', 'Service Quotas', 'AWS Systems Manager', 'AWS Trusted Advisor', 'AWS Well-Architected Tool',
  ],
  'Migration and Transfer': [
    'AWS Application Discovery Service', 'AWS Application Migration Service', 'AWS Database Migration Service (AWS DMS)',
    'Migration Evaluator', 'AWS Migration Hub', 'AWS Schema Conversion Tool (AWS SCT)',
  ],
  'Networking and Content Delivery': [
    'Amazon API Gateway', 'Amazon CloudFront', 'AWS Direct Connect', 'AWS Global Accelerator', 'AWS PrivateLink',
    'Amazon Route 53', 'AWS Transit Gateway', 'Amazon VPC', 'AWS VPN', 'AWS Site-to-Site VPN', 'AWS Client VPN',
  ],
  'Security, Identity, and Compliance': [
    'AWS Artifact', 'AWS Certificate Manager (ACM)', 'AWS CloudHSM', 'Amazon Cognito', 'Amazon Detective', 'AWS Directory Service',
    'AWS Firewall Manager', 'Amazon GuardDuty', 'AWS Identity and Access Management (IAM)', 'AWS IAM Identity Center',
    'Amazon Inspector', 'AWS Key Management Service (AWS KMS)', 'Amazon Macie', 'AWS Resource Access Manager (AWS RAM)',
    'AWS Secrets Manager', 'AWS Security Hub', 'AWS Shield', 'AWS WAF',
  ],
  Serverless: ['AWS Fargate', 'AWS Lambda'],
  Storage: [
    'AWS Backup', 'Amazon Elastic Block Store (Amazon EBS)', 'Amazon Elastic File System (Amazon EFS)',
    'AWS Elastic Disaster Recovery', 'Amazon FSx', 'Amazon S3', 'Amazon S3 Glacier', 'AWS Storage Gateway',
  ],
};

export const IN_SCOPE_SERVICES_URL =
  'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html';

export function taskStatementById(id: string) {
  for (const d of DOMAINS) {
    const t = d.taskStatements.find((x) => x.id === id);
    if (t) return t;
  }
  return undefined;
}
