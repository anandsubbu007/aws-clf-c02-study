import type { Module } from '../types';
import { lesson as iamFundamentals } from './m03/m03-iam-fundamentals';
import { lesson as rootUserMfaCredentials } from './m03/m03-root-user-mfa-credentials';
import { lesson as federationAndIdentityServices } from './m03/m03-federation-and-identity-services';
import { lesson as networkAndThreatProtection } from './m03/m03-network-and-threat-protection';
import { lesson as detectionAndPostureServices } from './m03/m03-detection-and-posture-services';
import { lesson as securityResources } from './m03/m03-security-resources';
import { bank } from './m03/bank';
import { services } from './m03/services';

const module03: Module = {
  id: 'm03-identity-and-security-services',
  order: 3,
  title: 'Identity and Security Services',
  icon: '🔐',
  summary:
    'Who may do what on AWS and how to defend it: IAM users, groups, roles and policies, protecting the root user, MFA and credential storage, federation with IAM Identity Center and Cognito, DDoS and web protection, threat detection and posture services, and where to find AWS security resources.',
  domains: [2],
  lessons: [
    iamFundamentals,
    rootUserMfaCredentials,
    federationAndIdentityServices,
    networkAndThreatProtection,
    detectionAndPostureServices,
    securityResources,
  ],
  bank,
  services,
};

export default module03;
