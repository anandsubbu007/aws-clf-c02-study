import type { Module } from '../types';
import { lesson as s3 } from './m09/m09-s3-and-storage-classes';
import { lesson as block } from './m09/m09-block-storage';
import { lesson as file } from './m09/m09-file-and-hybrid-storage';
import { lesson as backup } from './m09/m09-backup-and-disaster-recovery';
import { bank } from './m09/bank';
import { services } from './m09/services';

const module09: Module = {
  id: 'm09-storage',
  order: 9,
  title: 'Storage',
  icon: '🗄️',
  summary:
    'AWS storage services: Amazon S3 and its storage classes, block storage with EBS and instance store, file and hybrid storage with EFS, FSx and Storage Gateway, and backup and disaster recovery with AWS Backup and AWS Elastic Disaster Recovery.',
  domains: [3],
  lessons: [s3, block, file, backup],
  bank,
  services,
};

export default module09;
