import type { Module } from '../types';
import { lesson as sharedResponsibility } from './m02/m02-shared-responsibility';
import { lesson as complianceAndGovernance } from './m02/m02-compliance-and-governance';
import { lesson as encryptionAndDataProtection } from './m02/m02-encryption-and-data-protection';
import { lesson as loggingMonitoringAuditing } from './m02/m02-logging-monitoring-auditing';
import { bank } from './m02/bank';
import { services } from './m02/services';

const module02: Module = {
  id: 'm02-shared-responsibility-governance',
  order: 2,
  title: 'Shared Responsibility, Governance and Compliance',
  icon: '🤝',
  summary:
    'Who secures what on AWS: the shared responsibility model, AWS compliance programs and AWS Artifact, encryption and data protection with KMS, CloudHSM and ACM, and logging, monitoring and auditing with CloudTrail, CloudWatch and AWS Config.',
  domains: [2],
  lessons: [sharedResponsibility, complianceAndGovernance, encryptionAndDataProtection, loggingMonitoringAuditing],
  bank,
  services,
};

export default module02;
