import type { ServiceEntry } from '../../types';

const AI = 'm10-ai-ml-services';
const GEN = 'm10-generative-ai';
const AN = 'm10-analytics-services';

export const services: ServiceEntry[] = [
  { name: 'Amazon Athena', category: 'Analytics', lessonId: AN, inScope: true, summary: 'Serverless interactive service that runs standard SQL directly on data in Amazon S3; pick it for ad-hoc queries without managing servers.' },
  { name: 'Amazon EMR', category: 'Analytics', lessonId: AN, inScope: true, summary: 'Managed cluster platform for big-data frameworks such as Apache Hadoop and Apache Spark; pick it when you need those frameworks at scale.' },
  { name: 'AWS Glue', category: 'Analytics', lessonId: AN, inScope: true, summary: 'Serverless data-integration service for ETL jobs, schema discovery and the central Data Catalog.' },
  { name: 'Amazon Kinesis', category: 'Analytics', lessonId: AN, inScope: true, summary: 'Family of services for real-time streaming data (Data Streams, Amazon Data Firehose, Managed Service for Apache Flink); pick it to ingest and analyse continuous data.' },
  { name: 'Amazon OpenSearch Service', category: 'Analytics', lessonId: AN, inScope: true, summary: 'Managed OpenSearch clusters for full-text search, log analytics and application monitoring.' },
  { name: 'Amazon Quick Sight', category: 'Analytics', lessonId: AN, inScope: true, summary: 'Business-intelligence service for building and sharing interactive dashboards and visualisations.' },
  { name: 'Amazon Redshift', category: 'Analytics', lessonId: AN, inScope: true, summary: 'Fully managed, petabyte-scale data warehouse for complex analytical SQL queries.' },
  { name: 'Amazon Comprehend', category: 'Machine Learning', lessonId: AI, inScope: true, summary: 'Natural language processing service that finds sentiment, entities, key phrases and language in text.' },
  { name: 'Amazon Lex', category: 'Machine Learning', lessonId: AI, inScope: true, summary: 'Builds voice and text chatbots and virtual agents, powered by the same conversational engine as Alexa.' },
  { name: 'Amazon Polly', category: 'Machine Learning', lessonId: AI, inScope: true, summary: 'Text-to-speech service that turns written text into lifelike spoken audio.' },
  { name: 'Amazon Q', category: 'Machine Learning', lessonId: GEN, inScope: true, summary: 'Generative-AI assistant family: Q Developer helps build and operate on AWS; Q Business answers questions from enterprise data (AWS now closes it to new customers and points to Amazon Quick).' },
  { name: 'Amazon Rekognition', category: 'Machine Learning', lessonId: AI, inScope: true, summary: 'Image and video analysis service that detects objects, faces, text and unsafe content without ML expertise.' },
  { name: 'Amazon SageMaker AI', category: 'Machine Learning', lessonId: AI, inScope: true, summary: 'Fully managed service to build, train and deploy your own machine learning models.' },
  { name: 'Amazon Textract', category: 'Machine Learning', lessonId: AI, inScope: true, summary: 'Extracts printed and handwritten text, form fields and tables from scanned documents and images.' },
  { name: 'Amazon Transcribe', category: 'Machine Learning', lessonId: AI, inScope: true, summary: 'Automatic speech recognition service that converts audio into text.' },
  { name: 'Amazon Translate', category: 'Machine Learning', lessonId: AI, inScope: true, summary: 'Machine translation service that translates text between languages on demand.' },
  { name: 'Amazon Bedrock', category: 'Machine Learning', lessonId: GEN, inScope: false, summary: 'Fully managed access to foundation models from several providers for building generative AI applications; not on the CLF-C02 in-scope list.' },
];
