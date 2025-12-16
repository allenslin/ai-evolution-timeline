
import React, { useState, useMemo, useEffect } from 'react';
import { Timeline } from './components/Timeline';
import { DetailPanel } from './components/DetailPanel';
import { getAIModels, UI_LABELS } from './constants';
import { AIModel, Company, Capability, Language } from './types';

const App: React.FC = () => {
  // Global State
  const [lang, setLang] = useState<Language>('zh'); // Default to Chinese as requested
  const [isDark, setIsDark] = useState(true);
  
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | 'All'>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedCapability, setSelectedCapability] = useState<Capability | 'All'>('All');

  const models = useMemo(() => getAIModels(lang), [lang]);
  const ui = UI_LABELS[lang];

  // Theme Toggle Effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Derived Data for Filters
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(models.map(m => m.releaseDate.split('-')[0]))).sort().reverse(); // Recent years first
    return ['All', ...uniqueYears];
  }, [models]);

  const capabilities = useMemo(() => {
    const allCaps = new Set<Capability>();
    models.forEach(m => m.capabilities.forEach(c => allCaps.add(c)));
    return ['All', ...Array.from(allCaps).sort()];
  }, [models]);

  const companies = ['All', ...Object.values(Company)];

  // Filtering Logic
  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          model.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCompany = selectedCompany === 'All' || model.company === selectedCompany;
      const matchYear = selectedYear === 'All' || model.releaseDate.startsWith(selectedYear);
      const matchCapability = selectedCapability === 'All' || (model.capabilities && model.capabilities.includes(selectedCapability as Capability));

      return matchSearch && matchCompany && matchYear && matchCapability;
    }).sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()); // Reverse Chronological
  }, [models, searchQuery, selectedCompany, selectedYear, selectedCapability]);

  const activeFilters = selectedCompany !== 'All' || selectedYear !== 'All' || selectedCapability !== 'All' || searchQuery !== '';

  return (
    <div className="h-screen w-screen flex flex-col bg-paper-50 dark:bg-cyber-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-500 overflow-hidden relative">
      
      {/* Background Grid Layer - Moved out of scrolling content to prevent masking content */}
      <div className="absolute inset-0 pointer-events-none z-0 tech-grid"></div>

      {/* Header */}
      <header className="flex-none h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-cyber-900/80 backdrop-blur z-30 shadow-sm dark:shadow-lg relative transition-colors duration-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">{ui.appTitle}</h1>
            <p className="text-[9px] text-cyan-600 dark:text-cyan-500 font-mono tracking-[0.2em] uppercase mt-1">{ui.appSubtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
                    className="p-1.5 rounded-md text-xs font-bold font-mono border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-9 text-center"
                >
                    {lang.toUpperCase()}
                </button>
                <button 
                    onClick={() => setIsDark(!isDark)}
                    className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    {isDark ? (
                        <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    ) : (
                        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    )}
                </button>
            </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex-none bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800/60 backdrop-blur-md z-20 p-3 transition-colors duration-500">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center w-full">
                 {/* Search */}
                <div className="relative group flex-grow md:flex-grow-0 md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400 dark:text-slate-600 group-focus-within:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder={ui.searchPlaceholder} 
                        className="block w-full pl-10 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters Row */}
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                    <select 
                        className="appearance-none block w-28 pl-3 pr-8 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value as Company | 'All')}
                    >
                        <option value="All">{ui.filterCompany}</option>
                        {companies.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select 
                        className="appearance-none block w-28 pl-3 pr-8 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        value={selectedCapability}
                        onChange={(e) => setSelectedCapability(e.target.value as Capability | 'All')}
                    >
                        <option value="All">{ui.filterCap}</option>
                        {capabilities.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select 
                        className="appearance-none block w-24 pl-3 pr-8 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="All">{ui.filterYear}</option>
                        {years.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                
                 {activeFilters && (
                    <button 
                        onClick={() => { setSearchQuery(''); setSelectedCompany('All'); setSelectedCapability('All'); setSelectedYear('All'); }}
                        className="ml-auto md:ml-0 px-3 py-1.5 text-[10px] font-mono tracking-wider text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500/10 transition-all flex items-center gap-2"
                     >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        {ui.resetFilters}
                     </button>
                )}
            </div>
        </div>
      </div>

      {/* Main Content Area - Full Page Scroll */}
      <main className="flex-grow relative overflow-y-auto custom-scrollbar scroll-smooth z-10">
        <div className="min-h-full">
            {filteredModels.length > 0 ? (
                 <Timeline 
                    models={filteredModels} 
                    selectedModelId={selectedModel?.id || null} 
                    onSelectModel={setSelectedModel} 
                    ui={ui}
                />
            ) : (
                <div className="h-96 flex flex-col items-center justify-center text-slate-500 dark:text-slate-600 font-mono">
                     <div className="mb-4 p-4 border border-slate-200 dark:border-slate-800 rounded-full bg-slate-100 dark:bg-slate-900/50">
                        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     </div>
                     <p className="mb-1 text-lg tracking-widest uppercase">{ui.noData}</p>
                     <p className="text-xs text-slate-400 dark:text-slate-500">{ui.noDataDesc}</p>
                </div>
            )}
        </div>
      </main>

      {/* Detail Overlay */}
      <DetailPanel model={selectedModel} onClose={() => setSelectedModel(null)} lang={lang} ui={ui} />
    </div>
  );
};

export default App;
