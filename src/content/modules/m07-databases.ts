import type { Module } from '../types';
import { lesson as databaseChoices } from './m07/m07-database-choices';
import { lesson as relationalDatabases } from './m07/m07-relational-databases';
import { lesson as nosqlAndInMemory } from './m07/m07-nosql-and-in-memory';
import { lesson as databaseMigration } from './m07/m07-database-migration';
import { bank } from './m07/bank';
import { services } from './m07/services';

const module07: Module = {
  id: 'm07-databases',
  order: 7,
  title: 'Databases',
  icon: '🗄️',
  summary:
    'Choose the right AWS database for the data and access pattern: relational (RDS, Aurora), NoSQL and in-memory (DynamoDB, ElastiCache, DocumentDB, Neptune), managed vs EC2-hosted, and migration with AWS DMS and AWS SCT.',
  domains: [3],
  lessons: [databaseChoices, relationalDatabases, nosqlAndInMemory, databaseMigration],
  bank,
  services,
};

export default module07;
