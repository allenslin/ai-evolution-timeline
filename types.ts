
export enum Company {
  Google = 'Google',
  OpenAI = 'OpenAI',
  Anthropic = 'Anthropic',
  Meta = 'Meta',
  Mistral = 'Mistral',
  DeepMind = 'DeepMind', // Pre-merge
  Other = 'Other'
}

export type Capability = 'NLP' | 'CV' | 'Multimodal' | 'Video' | 'Audio' | 'Code';
export type Language = 'en' | 'zh';

export interface AIModel {
  id: string;
  name: string;
  company: Company;
  releaseDate: string; // YYYY-MM-DD
  description: string;
  params?: string; // Parameter count if known
  logo?: string; // Optional URL or icon key
  highlight: boolean; // Major milestone
  importance: number; // 1-5 scale for visualization sizing
  source?: string; // Source URL
  // Detailed Card Info
  coreTech: string;
  features: string[];
  useCases: string[];
  capabilities: Capability[];
}

export interface GeminiAnalysis {
  technicalSpecs: string;
  impact: string;
  funFact: string;
}

export interface UIText {
  appTitle: string;
  appSubtitle: string;
  systemOnline: string;
  nodesActive: string;
  searchPlaceholder: string;
  filterCompany: string;
  filterCap: string;
  filterYear: string;
  resetFilters: string;
  noData: string;
  noDataDesc: string;
  dragHint: string;
  // Detail Panel
  systemIdle: string;
  selectNodeHint: string;
  released: string;
  source: string;
  description: string;
  coreTech: string;
  params: string;
  undisclosed: string;
  features: string;
  useCases: string;
  geminiAnalysis: string;
  impactAnalysis: string;
  archNote: string;
  trivia: string;
  analysisUnavailable: string;
  loading: string;
}
