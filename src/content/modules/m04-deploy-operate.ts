import type { Module } from '../types';
import { lesson as waysToAccess } from './m04/m04-ways-to-access-aws';
import { lesson as iacAndTools } from './m04/m04-infrastructure-as-code-and-management-tools';
import { bank } from './m04/bank';
import { services } from './m04/services';

const module04: Module = {
  id: 'm04-deploy-operate',
  order: 4,
  title: 'Deploying and Operating in the AWS Cloud',
  icon: '🛠️',
  summary:
    'How you reach and run AWS: the Management Console, CLI, SDKs and APIs, infrastructure as code with CloudFormation, operations and governance tools such as Systems Manager, Service Catalog, Service Quotas and Control Tower, and the cloud, hybrid and on-premises deployment models.',
  domains: [3],
  lessons: [waysToAccess, iacAndTools],
  bank,
  services,
};

export default module04;
