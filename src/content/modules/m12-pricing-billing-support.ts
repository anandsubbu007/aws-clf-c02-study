import type { Module } from '../types';
import { lesson as computePricing } from './m12/m12-compute-pricing-models';
import { lesson as storageTransfer } from './m12/m12-storage-and-data-transfer-pricing';
import { lesson as billingTools } from './m12/m12-billing-and-cost-tools';
import { lesson as organizationsTags } from './m12/m12-organizations-and-tags';
import { lesson as supportPlans } from './m12/m12-support-plans-and-resources';
import { lesson as partnersMarketplace } from './m12/m12-partners-and-marketplace';
import { bank } from './m12/bank';
import { services } from './m12/services';

const module12: Module = {
  id: 'm12-pricing-billing-support',
  order: 12,
  title: 'Pricing, Billing and Support',
  icon: '💰',
  summary:
    'How AWS charges for compute, storage and data transfer, which tools estimate, track and analyse cost, how AWS Organizations and tags allocate spend, and which support plans, technical resources and partners can help.',
  domains: [4],
  lessons: [computePricing, storageTransfer, billingTools, organizationsTags, supportPlans, partnersMarketplace],
  bank,
  services,
};

export default module12;
