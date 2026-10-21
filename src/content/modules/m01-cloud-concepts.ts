import type { Module } from '../types';
import { lesson as valueOfAwsCloud } from './m01/m01-value-of-aws-cloud';
import { lesson as cloudModels } from './m01/m01-cloud-models';
import { lesson as wellArchitected } from './m01/m01-well-architected-framework';
import { lesson as adoptionAndMigration } from './m01/m01-adoption-and-migration';
import { lesson as cloudEconomics } from './m01/m01-cloud-economics';
import { bank } from './m01/bank';
import { services } from './m01/services';

const module01: Module = {
  id: 'm01-cloud-concepts',
  order: 1,
  title: 'Cloud Concepts',
  icon: '☁️',
  summary:
    'Why organisations move to the AWS Cloud: the value proposition, service and deployment models, the Well-Architected design principles, migration strategies, and cloud economics.',
  domains: [1],
  lessons: [valueOfAwsCloud, cloudModels, wellArchitected, adoptionAndMigration, cloudEconomics],
  bank,
  services,
};

export default module01;
