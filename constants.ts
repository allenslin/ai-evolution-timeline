
import { AIModel, Company, Language, UIText } from './types';
import rawData from './ai_data.json';

// Type assertion for the imported data to match our internal types
const RAW_DATA = rawData as Array<{
  id: string;
  company: string; // Will be cast to Company
  releaseDate: string;
  params: string;
  highlight: boolean;
  capabilities: string[];
  source?: string;
  en: {
    name: string;
    description: string;
    coreTech: string;
    features: string[];
    useCases: string[];
  };
  zh: {
    name: string;
    description: string;
    coreTech: string;
    features: string[];
    useCases: string[];
  };
}>;

export const getAIModels = (lang: Language): AIModel[] => {
  return RAW_DATA.map(item => ({
    id: item.id,
    company: item.company as Company,
    releaseDate: item.releaseDate,
    params: item.params,
    highlight: item.highlight,
    importance: 3, // Default importance value since it's not in JSON
    capabilities: item.capabilities as any,
    source: item.source,
    // Localized fields
    name: item[lang].name,
    description: item[lang].description,
    coreTech: item[lang].coreTech,
    features: item[lang].features,
    useCases: item[lang].useCases,
  }));
};

export const UI_LABELS: Record<Language, UIText> = {
  en: {
    appTitle: 'AI CHRONOS',
    appSubtitle: 'Timeline Visualization',
    systemOnline: 'SYSTEM ONLINE',
    nodesActive: 'NODES ACTIVE',
    searchPlaceholder: 'Search model or company...',
    filterCompany: 'Company',
    filterCap: 'Cap',
    filterYear: 'Year',
    resetFilters: 'RESET FILTERS',
    noData: 'NO DATA FOUND',
    noDataDesc: 'Adjust search parameters to locate nodes.',
    dragHint: 'DRAG OR SCROLL TO NAVIGATE',
    systemIdle: 'SYSTEM IDLE',
    selectNodeHint: 'Select a neural node to initialize dossier',
    released: 'REL',
    source: 'SOURCE',
    description: 'System Description',
    coreTech: 'Core Technology',
    params: 'Parameter Count',
    undisclosed: 'UNDISCLOSED',
    features: 'Key Features',
    useCases: 'Use Cases',
    geminiAnalysis: 'Gemini Analysis',
    impactAnalysis: 'Industry Impact',
    archNote: 'Architecture Note',
    trivia: 'Trivia',
    analysisUnavailable: 'Analysis Unavailable',
    loading: 'Processing...'
  },
  zh: {
    appTitle: 'AI 时序',
    appSubtitle: '演化时间轴可视化',
    systemOnline: '系统在线',
    nodesActive: '活跃节点',
    searchPlaceholder: '搜索模型或公司...',
    filterCompany: '公司',
    filterCap: '能力',
    filterYear: '年份',
    resetFilters: '重置筛选',
    noData: '未找到数据',
    noDataDesc: '请调整搜索参数以定位节点。',
    dragHint: '拖动或滚动以导航',
    systemIdle: '系统待机',
    selectNodeHint: '选择神经节点以初始化档案',
    released: '发布',
    source: '来源',
    description: '系统描述',
    coreTech: '核心技术',
    params: '参数量',
    undisclosed: '未公开',
    features: '主要特点',
    useCases: '应用案例',
    geminiAnalysis: 'Gemini 分析',
    impactAnalysis: '行业影响',
    archNote: '架构说明',
    trivia: '冷知识',
    analysisUnavailable: '分析不可用',
    loading: '处理中...'
  }
};

export const COMPANY_COLORS: Record<Company, string> = {
  [Company.Google]: '#4285F4',
  [Company.OpenAI]: '#10A37F',
  [Company.Anthropic]: '#D97757',
  [Company.Meta]: '#0668E1',
  [Company.Mistral]: '#F59E0B',
  [Company.DeepMind]: '#00ACC1',
  [Company.Other]: '#94A3B8',
};
