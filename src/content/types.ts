export type DomainId = 1 | 2 | 3 | 4;

/** e.g. "1.1" … "4.3" — official CLF-C02 task statement ids. */
export type TaskStatementId = string;

export interface Reference {
  title: string;
  url: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface ComparisonTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface RelatedLesson {
  lessonId: string;
  why: string;
}

export interface DeepDive {
  title: string;
  body: string[];
}

export interface QuestionOption {
  id: string; // 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
  text: string;
  /** Why this option is right or wrong. Required for EVERY option. */
  explanation: string;
}

export interface Question {
  id: string;
  type: 'single' | 'multi';
  domain: DomainId;
  taskStatement: TaskStatementId;
  /** Lesson the question teaches (optional for exam-bank questions). */
  lessonId?: string;
  stem: string;
  options: QuestionOption[];
  /** option ids; exactly 1 for single, 2+ for multi */
  correct: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface TreeNode {
  label: string;
  detail?: string;
  /** Internal route like "/lesson/m01-xyz" (HashRouter path) */
  to?: string;
  children?: TreeNode[];
}

interface DiagramBase {
  id: string;
  title: string;
  caption?: string;
}

export type Diagram =
  | (DiagramBase & {
      type: 'mindmap';
      center: string;
      branches: { label: string; detail?: string; items: string[] }[];
    })
  | (DiagramBase & { type: 'flow'; steps: { label: string; detail?: string }[] })
  | (DiagramBase & { type: 'layers'; layers: { label: string; detail?: string }[] })
  | (DiagramBase & { type: 'columns'; columns: { heading: string; items: string[] }[] })
  | (DiagramBase & { type: 'tree'; root: TreeNode });

export interface Lesson {
  /** kebab-case, unique, prefixed by module number: "m05-ec2-instance-types" */
  id: string;
  title: string;
  /** Topic and subtopic provide the Subject → Module → Topic → Subtopic → Lesson hierarchy */
  topic: string;
  subtopic: string;
  taskStatements: TaskStatementId[];
  minutes: number;
  /** Optional search keywords/aliases (old names, abbreviations) */
  keywords?: string[];
  objectives: string[];
  /** Beginner-friendly paragraphs. Supports **bold**, *italic*, `code`. */
  explanation: string[];
  analogy: string;
  example: string;
  /** Click-to-expand sections for deeper detail */
  deepDives?: DeepDive[];
  howItWorks: string[];
  whenToUse: string[];
  limitations: string[];
  keyTerms: KeyTerm[];
  related: RelatedLesson[];
  mistakes: string[];
  examTips: string[];
  comparisons: ComparisonTable[];
  memoryAids: string[];
  revision: string[];
  diagrams: Diagram[];
  references: Reference[];
  /** 2 quick recall questions */
  knowledgeCheck: Question[];
  /** 3 scenario/exam-style practice questions */
  practice: Question[];
}

export interface Module {
  id: string; // "m05-compute"
  order: number;
  title: string;
  icon: string; // single emoji
  summary: string;
  domains: DomainId[];
  lessons: Lesson[];
  /** Extra exam-style questions for domain/mixed quizzes and mock exams */
  bank: Question[];
  /** Service directory entries taught in this module's lessons */
  services: ServiceEntry[];
}

export interface TaskStatement {
  id: TaskStatementId;
  domain: DomainId;
  title: string;
  knowledge: string[];
  skills: string[];
}

export interface Domain {
  id: DomainId;
  title: string;
  /** Official weighting (% of scored content) */
  weight: number;
  summary: string;
  taskStatements: TaskStatement[];
}

export interface ServiceEntry {
  name: string;
  category: string;
  /** One-sentence "what it is / when to pick it" */
  summary: string;
  /** lesson that teaches this service */
  lessonId: string;
  /** Official in-scope list category from the exam guide */
  inScope: boolean;
  url?: string;
}
