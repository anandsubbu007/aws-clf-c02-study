import type { Module } from '../types';
import { lesson as ec2Fundamentals } from './m06/m06-ec2-fundamentals';
import { lesson as ec2InstanceTypes } from './m06/m06-ec2-instance-types';
import { lesson as scalingAndLoadBalancing } from './m06/m06-scaling-and-load-balancing';
import { lesson as containers } from './m06/m06-containers';
import { lesson as serverlessAndOtherCompute } from './m06/m06-serverless-and-other-compute';
import { bank } from './m06/bank';
import { services } from './m06/services';

const module06: Module = {
  id: 'm06-compute',
  order: 6,
  title: 'Compute',
  icon: '🖥️',
  summary:
    'AWS compute services: Amazon EC2 instances and instance types, Auto Scaling and Elastic Load Balancing, containers (ECS, EKS, ECR, Fargate), serverless with AWS Lambda, and other options such as Batch, Elastic Beanstalk and Lightsail.',
  domains: [3],
  lessons: [ec2Fundamentals, ec2InstanceTypes, scalingAndLoadBalancing, containers, serverlessAndOtherCompute],
  bank,
  services,
};

export default module06;
