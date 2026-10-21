import type { Module } from '../types';
import { lesson as globalInfrastructure } from './m05/m05-global-infrastructure';
import { lesson as highAvailability } from './m05/m05-high-availability-multi-region-edge';
import { bank } from './m05/bank';
import { services } from './m05/services';

const module05: Module = {
  id: 'm05-global-infrastructure',
  order: 5,
  title: 'AWS Global Infrastructure',
  icon: '🌍',
  summary:
    'How AWS is built around the world: Regions, Availability Zones, edge locations, Local Zones and Outposts, how to choose a Region, and how to design for high availability, multi-Region resilience and low-latency delivery.',
  domains: [3],
  lessons: [globalInfrastructure, highAvailability],
  bank,
  services,
};

export default module05;
