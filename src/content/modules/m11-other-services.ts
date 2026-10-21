import type { Module } from '../types';
import { lesson as applicationIntegration } from './m11/m11-application-integration';
import { lesson as businessAndEndUserComputing } from './m11/m11-business-and-end-user-computing';
import { lesson as developerTools } from './m11/m11-developer-tools';
import { lesson as frontendAndIot } from './m11/m11-frontend-and-iot';
import { bank } from './m11/bank';
import { services } from './m11/services';

const module11: Module = {
  id: 'm11-other-services',
  order: 11,
  title: 'Other In-Scope Services',
  icon: '🧩',
  summary:
    'Choose the right service for messaging and workflows (SQS, SNS, EventBridge, Step Functions), business applications (Amazon Connect, SES), end-user computing (WorkSpaces, AppStream 2.0, WorkSpaces Secure Browser), developer tools (CodeBuild, CodePipeline, X-Ray), frontend and mobile (Amplify) and IoT (AWS IoT Core).',
  domains: [3],
  lessons: [applicationIntegration, businessAndEndUserComputing, developerTools, frontendAndIot],
  bank,
  services,
};

export default module11;
