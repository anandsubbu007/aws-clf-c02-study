import type { Module } from '../types';
import { lesson as aiMlServices } from './m10/m10-ai-ml-services';
import { lesson as generativeAi } from './m10/m10-generative-ai';
import { lesson as analyticsServices } from './m10/m10-analytics-services';
import { bank } from './m10/bank';
import { services } from './m10/services';

const module10: Module = {
  id: 'm10-ai-ml-analytics',
  order: 10,
  title: 'AI, Machine Learning and Analytics',
  icon: '🧠',
  summary:
    'Recognise the AWS AI/ML services and the tasks they accomplish (SageMaker AI, Rekognition, Textract, Comprehend, Transcribe, Polly, Translate, Lex, Amazon Q), understand generative AI at a Cloud Practitioner level, and choose the right analytics service (Athena, Kinesis, Glue, Quick Sight, EMR, OpenSearch Service, Redshift).',
  domains: [3],
  lessons: [aiMlServices, generativeAi, analyticsServices],
  bank,
  services,
};

export default module10;
