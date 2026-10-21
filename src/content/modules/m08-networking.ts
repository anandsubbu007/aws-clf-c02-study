import type { Module } from '../types';
import { lesson as vpcFundamentals } from './m08/m08-vpc-fundamentals';
import { lesson as vpcSecurity } from './m08/m08-vpc-security';
import { lesson as dnsAndContentDelivery } from './m08/m08-dns-and-content-delivery';
import { lesson as connectivityOptions } from './m08/m08-connectivity-options';
import { bank } from './m08/bank';
import { services } from './m08/services';

const module08: Module = {
  id: 'm08-networking',
  order: 8,
  title: 'Networking and Content Delivery',
  icon: '🌐',
  summary:
    'Build and secure virtual networks with Amazon VPC, route users with Route 53, CloudFront and Global Accelerator, publish APIs with API Gateway, and connect on-premises networks with VPN, Direct Connect and Transit Gateway.',
  domains: [3],
  lessons: [vpcFundamentals, vpcSecurity, dnsAndContentDelivery, connectivityOptions],
  bank,
  services,
};

export default module08;
