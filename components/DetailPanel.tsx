import React from 'react';
import { AIModel, Language, UIText } from '../types';
import { COMPANY_COLORS } from '../constants';

interface DetailPanelProps {
  model: AIModel | null;
  onClose: () => void;
  lang: Language;
  ui: UIText;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ model, onClose, lang, ui }) => {
  // Static content display, no state needed

  if (!model) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 font-mono text-sm border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-cyber-900/95 backdrop-blur transition-colors duration-500">
        <div className="text-center">
          <div className="mb-4 w-16 h-16 mx-auto border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full animate-ping bg-cyan-500/10"></div>
            <svg className="w-6 h-6 text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="mb-1 text-slate-400 dark:text-slate-400 font-bold tracking-wider">{ui.systemIdle}</p>
          <p className="text-xs text-cyan-600/70 dark:text-cyan-500/70 font-mono">{ui.selectNodeHint}</p>
        </div>
      </div>
    );
  }

  const borderColor = COMPANY_COLORS[model.company] || '#94A3B8';

  return (
    <div className="h-full flex flex-col bg-white/95 dark:bg-cyber-900/95 border-t border-t-cyan-500/30 backdrop-blur-xl relative overflow-hidden shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] transition-colors duration-500">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        
        <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto custom-scrollbar z-10">
            {/* Header: Identity */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200 dark:border-slate-800/60 relative">
                <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-cyan-500"></div>
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span 
                            className="px-3 py-1 text-xs font-bold font-mono rounded-sm border bg-opacity-10 tracking-wider uppercase"
                            style={{ borderColor: borderColor, color: borderColor, backgroundColor: `${borderColor}15` }}
                        >
                            {model.company}
                        </span>
                        <span className="px-2 py-1 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 rounded-sm border border-slate-200 dark:border-slate-700">
                           {ui.released}: {model.releaseDate}
                        </span>
                        {model.source && (
                            <a 
                                href={model.source} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200 bg-cyan-50 dark:bg-cyan-900/20 rounded-sm border border-cyan-200 dark:border-cyan-800/50 flex items-center gap-1 transition-colors"
                            >
                                {ui.source}
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        )}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase font-sans">
                        {model.name}
                    </h2>
                    <div className="flex gap-2 mt-2">
                         {model.capabilities.map(cap => (
                            <span key={cap} className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700/50">
                                {cap}
                            </span>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 group rounded-full border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                    <svg className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Content Container - Full Width Layout */}
            <div className="space-y-8 max-w-7xl mx-auto w-full">
                {/* Description */}
                <div>
                    <h3 className="text-cyan-600 dark:text-cyan-500/70 text-[10px] font-mono uppercase tracking-[0.2em] mb-3">{ui.description}</h3>
                    <p className="text-slate-600 dark:text-slate-200 leading-relaxed text-lg font-light border-l-2 border-slate-300 dark:border-slate-700 pl-4">
                        {model.description}
                    </p>
                </div>

                {/* Technical Specs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-lg border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/30 transition-colors group">
                        <h3 className="text-slate-400 dark:text-slate-500 text-[10px] font-mono uppercase tracking-wider mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-500 transition-colors">{ui.coreTech}</h3>
                        <p className="text-slate-800 dark:text-white font-medium text-lg">{model.coreTech}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-lg border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/30 transition-colors group">
                            <h3 className="text-slate-400 dark:text-slate-500 text-[10px] font-mono uppercase tracking-wider mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-500 transition-colors">{ui.params}</h3>
                        <p className="text-slate-800 dark:text-white font-mono text-xl">{model.params || ui.undisclosed}</p>
                    </div>
                </div>

                {/* Features & Use Cases */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div>
                        <h3 className="text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-cyan-500 rotate-45"></span> {ui.features}
                        </h3>
                        <ul className="space-y-2">
                            {model.features.map((feature, i) => (
                                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 px-3 py-2 rounded border border-slate-200 dark:border-slate-800/50 flex items-start gap-2">
                                    <span className="text-cyan-500 mt-0.5">›</span> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                        <div>
                        <h3 className="text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-500 rotate-45"></span> {ui.useCases}
                        </h3>
                        <ul className="space-y-2">
                            {model.useCases.map((useCase, i) => (
                                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 px-3 py-2 rounded border border-slate-200 dark:border-slate-800/50 flex items-start gap-2">
                                    <span className="text-purple-500 mt-0.5">›</span> {useCase}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
