import type { Lesson } from '../../types';

export const lesson: Lesson = {
  id: 'm07-database-migration',
  title: 'Database migration: AWS DMS and AWS SCT',
  topic: 'AWS database services',
  subtopic: 'Database migration tools',
  taskStatements: ['3.4', '1.3'],
  minutes: 13,
  keywords: [
    'dms', 'sct', 'database migration service', 'schema conversion tool', 'homogeneous migration', 'heterogeneous migration',
    'cdc', 'change data capture', 'continuous replication', 'replication instance', 'oracle to postgresql', 'minimal downtime', 'lift and shift database',
  ],
  objectives: [
    'Explain what AWS Database Migration Service (AWS DMS) does and why the source database can stay operational.',
    'Distinguish homogeneous from heterogeneous migrations and say when AWS SCT is needed.',
    'Describe the typical heterogeneous flow: convert the schema with SCT, then move data with DMS.',
    'Recognise continuous replication (change data capture) as the way to keep source and target in sync and cut over with little downtime.',
  ],
  explanation: [
    '**AWS Database Migration Service (AWS DMS)** moves data between databases. You define a **source endpoint** (where the data is now) and a **target endpoint** (where you want it), and a DMS task copies the data. Conceptually, DMS is a replication engine running in the AWS Cloud (on a replication instance or, optionally, in a serverless form) that reads from the source and writes to the target. Sources and targets include on-premises databases, databases on Amazon EC2, and AWS services such as Amazon RDS, Amazon Aurora, Amazon S3, Amazon Redshift and Amazon DynamoDB. The one hard rule: **at least one of the two endpoints must be on an AWS service** — DMS cannot be used to move a database from one on-premises location to another.',
    'The feature that makes DMS popular is that the **source database remains fully operational during the migration**. DMS can perform a one-time **full load** of existing data and then continue with **ongoing replication** (often called **change data capture, CDC**), applying new changes from the source to the target as they happen. Because the target stays in sync, you can test the new database, then switch the application over during a short cutover window, which minimises downtime. This is the “database replication” migration approach that the CLF-C02 exam guide mentions under migration strategies.',
    'DMS supports two kinds of migration. A **homogeneous migration** keeps the same database engine family — for example Oracle to Amazon RDS for Oracle, or MySQL to Aurora MySQL-compatible. Because the schema and code are already compatible, DMS can usually do the work on its own. A **heterogeneous migration** changes the engine — for example Oracle or SQL Server to Amazon Aurora PostgreSQL-compatible. Here the data types, tables, stored procedures and application SQL differ, so the **schema and code must be converted first**.',
    'That conversion is the job of the **AWS Schema Conversion Tool (AWS SCT)**. SCT analyses the source database, converts the schema (and much of the database code, such as views and stored procedures) to the target engine’s format, and reports what it could not convert automatically so engineers can fix it by hand. It can also convert SQL embedded in application code. The usual sequence for a heterogeneous migration is therefore **SCT first (convert schema and code), then DMS (move the data and keep it in sync)**. Remember the division of labour: **SCT converts structure and code; DMS moves data.** The DMS console also includes a built-in schema-conversion capability, but the exam-level name for the conversion tool is AWS SCT.',
  ],
  analogy:
    'Moving house with a translator. DMS is the removal company that carries your belongings (the data) to the new home while you keep living in the old one and even forwards new post as it arrives (continuous replication). SCT is the translator and carpenter who first adapts your furniture and instructions to the new house’s different layout and language — only needed if the new house is built to a different standard (a different database engine).',
  example:
    'A logistics company runs Oracle on premises with years of stored procedures. It wants to cut licence cost by moving to Amazon Aurora PostgreSQL-compatible without extended downtime. The team runs **AWS SCT** to convert the schema and procedures and works through the items SCT flags. Then it starts an **AWS DMS** task: a full load copies the existing data to Aurora, and CDC keeps Aurora current while the Oracle system keeps taking orders. After testing, the team picks a quiet weekend, stops the writes, lets the last changes drain, and points the application at Aurora. Downtime is minutes rather than days.',
  deepDives: [
    {
      title: 'Homogeneous vs heterogeneous at a glance',
      body: [
        '**Homogeneous**: same engine family on both sides (for example PostgreSQL to RDS for PostgreSQL). Often you only need DMS, or even the engine’s own native tools, because nothing about the schema needs translating.',
        '**Heterogeneous**: different engines (for example SQL Server to Aurora MySQL-compatible, or Oracle to PostgreSQL). Use AWS SCT to convert the schema and code, then DMS for the data. Some items cannot be converted automatically and need manual rework — plan time for that.',
        'Exam shortcut: “different database engine” → SCT + DMS. “Same engine” → DMS alone.',
      ],
    },
    {
      title: 'Full load vs change data capture',
      body: [
        'A **full load** copies the existing data once. **CDC** captures changes made on the source after (or while) the full load runs and applies them to the target, so the two stay in sync. You can run full load only, CDC only, or full load plus CDC.',
        'Full load plus CDC is the pattern behind “migrate with minimal downtime”: the application keeps using the source until you are ready to cut over.',
        'The same continuous-replication ability can be used beyond one-off migrations, for example to keep a data store on AWS in sync for analytics.',
      ],
    },
    {
      title: 'Where migration tools fit in the bigger migration picture',
      body: [
        'Database migration is usually one piece of a wider move to AWS. The 7 Rs migration strategies decide *how* each workload moves: rehost (lift and shift), replatform (for example moving a self-managed database to Amazon RDS with few changes), refactor, and so on. Moving from a database on EC2 or on premises to a managed database such as RDS or Aurora is a classic **replatform**. Heterogeneous moves that rewrite the data layer lean toward **refactor**.',
        'Other AWS migration services exist for different jobs: AWS Application Migration Service rehosts servers, and AWS Application Discovery Service and AWS Migration Hub help discover and track workloads. They are covered in the cloud concepts module; DMS and SCT are the *database* tools.',
      ],
    },
    {
      title: 'What can DMS write to?',
      body: [
        'DMS targets include relational databases such as RDS and Aurora, but also Amazon S3, Amazon Redshift and Amazon DynamoDB, among others. That makes DMS useful for populating a data lake or data warehouse as well as for engine-to-engine migration. For the exam, remember the main story: DMS migrates and replicates data to AWS with the source staying online.',
      ],
    },
  ],
  howItWorks: [
    '**Assess and convert (if heterogeneous)**: connect AWS SCT to the source, review its assessment of what converts automatically, convert the schema and code, fix the remaining items, and apply the converted schema to the target database.',
    '**Configure DMS**: create a replication instance (or use serverless), define the source and target endpoints, and create a migration task that specifies full load, CDC, or both.',
    '**Run the task**: DMS performs the full load of existing data and, if CDC is enabled, keeps applying new source changes to the target while the source continues to serve the application.',
    '**Validate and cut over**: verify the target, stop writes to the source briefly, let remaining changes drain, then switch the application connection to the new database.',
  ],
  whenToUse: [
    'Use **AWS DMS** to migrate databases to AWS (or between AWS databases) with minimal downtime, including one-time moves and ongoing replication.',
    'Use **AWS SCT** together with DMS whenever the source and target use **different database engines** (heterogeneous), to convert schema and code.',
    'Use **DMS alone** for homogeneous migrations when no schema conversion is required.',
    'Use DMS continuous replication to keep a target in sync until you are ready to cut over.',
  ],
  limitations: [
    'DMS requires that at least one endpoint is on AWS; it cannot move data from one on-premises database to another on premises.',
    'DMS replication tasks move data but do not convert application code or stored procedures between engines; that is what AWS SCT (or the schema-conversion capability in the DMS console) is for, and some objects always need manual conversion.',
    'DMS moves data and basic table structures, not everything an application depends on; extra items such as users, permissions and some database objects need separate handling.',
    'Migrations still need planning, testing and a cutover plan; the tools reduce downtime but do not make the project effortless.',
  ],
  keyTerms: [
    { term: 'AWS DMS', definition: 'AWS Database Migration Service: migrates data between databases and keeps source and target in sync with ongoing replication while the source stays operational.' },
    { term: 'AWS SCT', definition: 'AWS Schema Conversion Tool: converts a database schema and much of its code from one engine to another for heterogeneous migrations.' },
    { term: 'Homogeneous migration', definition: 'A migration between the same database engine family, such as Oracle to Amazon RDS for Oracle.' },
    { term: 'Heterogeneous migration', definition: 'A migration between different database engines, such as Oracle to Amazon Aurora PostgreSQL-compatible; requires schema and code conversion.' },
    { term: 'Change data capture (CDC)', definition: 'Capturing ongoing changes on the source and applying them to the target so the two stay in sync.' },
    { term: 'Full load', definition: 'The initial one-time copy of all existing data from source to target.' },
    { term: 'Endpoint', definition: 'The connection information DMS uses for a source or target database.' },
    { term: 'Replication instance', definition: 'The AWS-managed compute resource that runs DMS migration tasks.' },
    { term: 'Cutover', definition: 'The moment the application stops using the old database and starts using the new one.' },
  ],
  related: [
    { lessonId: 'm01-adoption-and-migration', why: 'The 7 Rs and migration strategies; database replication is one of the exam-guide examples.' },
    { lessonId: 'm07-relational-databases', why: 'Common migration targets: Amazon RDS and Amazon Aurora.' },
    { lessonId: 'm07-database-choices', why: 'Deciding which target database fits the data before you migrate.' },
    { lessonId: 'm10-analytics-services', why: 'DMS can also feed analytics targets such as Amazon Redshift.' },
  ],
  mistakes: [
    'Using AWS DMS alone for a heterogeneous migration and expecting it to rewrite stored procedures. Convert the schema and code with AWS SCT first.',
    'Reversing the roles: **SCT converts schema/code, DMS moves data**. Do not pick SCT to copy the data or DMS to translate a schema.',
    'Assuming the source database must be shut down during migration. DMS keeps the source operational and replicates ongoing changes.',
    'Thinking DMS can migrate between two on-premises databases. One endpoint must be on an AWS service.',
    'Confusing DMS (databases) with AWS Application Migration Service (whole servers) or with a backup tool.',
  ],
  examTips: [
    'Keywords: “migrate database with minimal downtime”, “continuous replication”, “source remains operational” → **AWS DMS**. “Convert schema / different database engine / Oracle to PostgreSQL” → **AWS SCT** (then DMS).',
    '“Same engine” → homogeneous; “different engine” → heterogeneous (SCT needed).',
    'Order of operations for a heterogeneous migration: **SCT, then DMS**.',
    'Exam guide skill 3.4 names AWS DMS and AWS SCT explicitly as database migration tools; 1.3 mentions database replication as a migration strategy.',
  ],
  comparisons: [
    {
      title: 'AWS DMS vs AWS SCT',
      headers: ['Aspect', 'AWS DMS', 'AWS SCT'],
      rows: [
        ['Main job', 'Move and replicate data', 'Convert schema and code to another engine'],
        ['Needed for', 'Any database migration to or from AWS', 'Heterogeneous migrations (different engines)'],
        ['Keeps source running?', 'Yes, with ongoing replication (CDC)', 'Not a data-movement tool'],
        ['Output', 'Data in the target database (and continued sync)', 'Converted schema and code, plus a report of items needing manual work'],
        ['Typical order', 'Second', 'First'],
      ],
    },
    {
      title: 'Homogeneous vs heterogeneous migration',
      headers: ['Aspect', 'Homogeneous', 'Heterogeneous'],
      rows: [
        ['Engines', 'Same engine family', 'Different engines'],
        ['Example', 'Oracle → Amazon RDS for Oracle', 'Oracle → Amazon Aurora PostgreSQL-compatible'],
        ['Schema conversion', 'Usually not needed', 'Required (AWS SCT)'],
        ['Tools', 'AWS DMS (or native engine tools)', 'AWS SCT then AWS DMS'],
      ],
    },
  ],
  memoryAids: [
    '**S**CT = **S**tructure (schema and code); **D**MS = **D**ata. Structure first, data second: **S before D**.',
    'Same engine = “homo = same”; different engine = “hetero = different”.',
  ],
  revision: [
    'AWS DMS migrates data and can keep source and target in sync with ongoing replication (CDC); the source stays operational.',
    'At least one DMS endpoint must be on an AWS service.',
    'Homogeneous = same engine; heterogeneous = different engines.',
    'AWS SCT converts schema and code for heterogeneous migrations and flags what needs manual work.',
    'Typical heterogeneous flow: SCT converts, DMS moves the data, then cut over.',
    'Moving a self-managed database to RDS or Aurora is a classic replatform; see the 7 Rs.',
  ],
  diagrams: [
    {
      id: 'sct-then-dms',
      type: 'flow',
      title: 'Typical heterogeneous database migration',
      caption: 'Homogeneous migrations skip the conversion steps and go straight to DMS.',
      steps: [
        { label: 'Assess the source', detail: 'Check the engine, schema and code to be moved' },
        { label: 'Convert with AWS SCT', detail: 'Convert schema and code to the target engine; fix flagged items' },
        { label: 'Full load with AWS DMS', detail: 'Copy existing data to the target; the source stays online' },
        { label: 'Replicate changes (CDC)', detail: 'Keep the target in sync with ongoing source changes' },
        { label: 'Test and cut over', detail: 'Point the application to the new database' },
      ],
    },
    {
      id: 'migration-tools-columns',
      type: 'columns',
      title: 'Which tool does what?',
      columns: [
        { heading: 'AWS SCT (structure)', items: ['Analyses the source schema', 'Converts schema and database code', 'Reports items needing manual work', 'Needed when engines differ'] },
        { heading: 'AWS DMS (data)', items: ['Full load of existing data', 'Ongoing replication (CDC)', 'Source remains operational', 'One endpoint must be on AWS'] },
      ],
    },
  ],
  references: [
    { title: 'What is AWS Database Migration Service?', url: 'https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html' },
    { title: 'AWS DMS introduction (endpoints, homogeneous and heterogeneous)', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.html' },
    { title: 'Ongoing replication with AWS DMS (CDC)', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Task.CDC.html' },
    { title: 'What is the AWS Schema Conversion Tool?', url: 'https://docs.aws.amazon.com/SchemaConversionTool/latest/userguide/CHAP_Welcome.html' },
  ],
  knowledgeCheck: [
    {
      id: 'm07-database-migration-k1',
      type: 'single',
      domain: 3,
      taskStatement: '3.4',
      difficulty: 'easy',
      stem: 'A company wants to migrate an on-premises Oracle database to AWS while the source database keeps serving users until cutover. Which AWS service is designed for this?',
      options: [
        { id: 'a', text: 'AWS Schema Conversion Tool (AWS SCT)', explanation: 'SCT converts schemas and code between engines; it does not copy and continuously replicate the data itself.' },
        { id: 'b', text: 'AWS Application Migration Service', explanation: 'This service rehosts whole servers into AWS; it is not the database-specific migration tool for engine-level replication.' },
        { id: 'c', text: 'Amazon ElastiCache', explanation: 'ElastiCache is an in-memory cache and is not a migration service.' },
        { id: 'd', text: 'AWS Database Migration Service (AWS DMS)', explanation: 'Correct. DMS migrates databases to AWS and can replicate ongoing changes so the source stays operational until cutover.' },
      ],
      correct: ['d'],
    },
    {
      id: 'm07-database-migration-k2',
      type: 'single',
      domain: 3,
      taskStatement: '3.4',
      difficulty: 'easy',
      stem: 'What does the AWS Schema Conversion Tool (AWS SCT) do?',
      options: [
        { id: 'a', text: 'Converts a database schema and code from one database engine to another', explanation: 'Correct. SCT converts schema and database code for heterogeneous migrations and highlights items that need manual attention.' },
        { id: 'b', text: 'Replicates data continuously between databases', explanation: 'Continuous replication is the job of AWS DMS, not SCT.' },
        { id: 'c', text: 'Automatically backs up Amazon RDS instances', explanation: 'RDS automated backups are an RDS feature, unrelated to SCT.' },
        { id: 'd', text: 'Scales DynamoDB tables to meet demand', explanation: 'DynamoDB capacity is handled by DynamoDB’s own capacity modes, not by SCT.' },
      ],
      correct: ['a'],
    },
  ],
  practice: [
    {
      id: 'm07-database-migration-p1',
      type: 'single',
      domain: 3,
      taskStatement: '3.4',
      difficulty: 'medium',
      stem: 'A company is moving from Microsoft SQL Server on premises to Amazon Aurora PostgreSQL-compatible. The database contains many stored procedures. Which approach is MOST appropriate?',
      options: [
        { id: 'a', text: 'Use AWS DMS only; it will rewrite all stored procedures automatically.', explanation: 'DMS data migration tasks move and replicate data; they do not rewrite stored procedures, so schema and code conversion (AWS SCT) has to come first.' },
        { id: 'b', text: 'Use AWS SCT to convert the schema and code, then AWS DMS to migrate and replicate the data.', explanation: 'Correct. The engines differ (heterogeneous), so SCT converts the schema and code first and DMS then moves the data and keeps it in sync.' },
        { id: 'c', text: 'Use Amazon ElastiCache to cache the SQL Server data in PostgreSQL format.', explanation: 'ElastiCache is an in-memory cache and does not migrate or translate databases.' },
        { id: 'd', text: 'Create an RDS read replica of the SQL Server database inside Aurora.', explanation: 'Read replicas replicate within the same engine family; you cannot make an Aurora PostgreSQL replica of a SQL Server database.' },
      ],
      correct: ['b'],
    },
    {
      id: 'm07-database-migration-p2',
      type: 'single',
      domain: 3,
      taskStatement: '3.4',
      difficulty: 'medium',
      stem: 'A team migrating a MySQL database to Amazon RDS for MySQL must keep the application online and wants the target to stay current until the final switch. Which DMS capability provides this?',
      options: [
        { id: 'a', text: 'Schema conversion', explanation: 'Schema conversion is needed when engines differ; it does not keep the target in sync with changes.' },
        { id: 'b', text: 'Multi-AZ failover', explanation: 'Multi-AZ failover is an RDS availability feature and has nothing to do with the migration’s data synchronisation.' },
        { id: 'c', text: 'Ongoing replication (change data capture)', explanation: 'Correct. CDC applies changes from the source to the target as they happen, so the target stays current until cutover.' },
        { id: 'd', text: 'Taking a manual snapshot of the source', explanation: 'A snapshot is a one-time point-in-time copy and does not keep up with ongoing changes.' },
      ],
      correct: ['c'],
    },
    {
      id: 'm07-database-migration-p3',
      type: 'multi',
      domain: 3,
      taskStatement: '3.4',
      difficulty: 'medium',
      stem: 'Which TWO statements about AWS DMS and AWS SCT are correct? (Select TWO.)',
      options: [
        { id: 'a', text: 'AWS SCT is used to convert the schema and code in heterogeneous migrations.', explanation: 'Correct. SCT converts schema and code so they work on the different target engine.' },
        { id: 'b', text: 'AWS DMS can keep the source database operational while data is migrated.', explanation: 'Correct. DMS keeps the source operational and can apply ongoing changes to the target.' },
        { id: 'c', text: 'AWS DMS can migrate a database from one on-premises server to another on-premises server.', explanation: 'Incorrect. At least one of the DMS endpoints must be on an AWS service.' },
        { id: 'd', text: 'AWS SCT performs the continuous replication of data to the target.', explanation: 'Incorrect. Continuous replication is performed by AWS DMS, while SCT handles schema and code conversion.' },
        { id: 'e', text: 'A homogeneous migration always requires converting the schema with SCT.', explanation: 'Incorrect. Same-engine migrations usually do not need schema conversion.' },
      ],
      correct: ['a', 'b'],
    },
  ],
};
