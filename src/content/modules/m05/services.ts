import type { ServiceEntry } from '../../types';

export const services: ServiceEntry[] = [
  {
    name: 'AWS Outposts',
    category: 'Compute',
    summary: 'Fully managed AWS infrastructure installed in your own facility so you can run AWS services and APIs on premises for low latency or local data processing.',
    lessonId: 'm05-global-infrastructure',
    inScope: true,
    url: 'https://docs.aws.amazon.com/outposts/latest/userguide/what-is-outposts.html',
  },
  {
    name: 'AWS Local Zones',
    category: 'Compute',
    summary: 'Extension of an AWS Region in a metro area that places selected services close to users for latency-sensitive applications.',
    lessonId: 'm05-global-infrastructure',
    inScope: false,
    url: 'https://docs.aws.amazon.com/local-zones/latest/ug/what-is-aws-local-zones.html',
  },
];
