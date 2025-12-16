
import React, { useEffect, useState } from 'react';
import { AIModel, Language, UIText } from '../types';
import { COMPANY_COLORS } from '../constants';

interface DetailPanelProps {
  model: AIModel | null;
  onClose: () => void;
  lang: Language;
  ui: UIText;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ model, onClose, lang, ui }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (model) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }
    return () => {
        document.body.style.overflow = '';
    };
  }, [model]);

  if (!model && !isVisible) return null;

  const borderColor = model ? COMPANY_COLORS[model.company] || '#94A3B8' : '#94A3B8';

  return (
    <>
        {/* Backdrop */}
        <div 
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${model ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        ></div>

        {/* Slide-over Panel */}
        <div 
            className={`
                fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-cyber-900 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col
                ${model ? 'translate-x-0' : 'translate-x-full'}
            `}
        >
            {model && (
                <div className="h-full flex flex-col bg-paper-50 dark:bg-cyber-900 relative">
                    
                    {/* Header */}
                    <div className="flex-none p-6 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                             <div className="flex items-center gap-2 mb-2">
                                <span 
                                    className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-sm border bg-opacity-10 tracking-wider uppercase"
                                    style={{ borderColor: borderColor, color: borderColor, backgroundColor: `${borderColor}15` }}
                                >
                                    {model.company}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                    {model.releaseDate}
                                </span>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                            {model.name}
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {model.source && (
                                <a 
                                    href={model.source} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-md shadow-sm shadow-cyan-500/20 transition-all hover:-translate-y-0.5"
                                >
                                    <span>{ui.source}</span>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8">
                        
                        {/* Description */}
                        <div>
                             <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{ui.description}</h3>
                             <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                                {model.description}
                             </p>
                        </div>

                        {/* Specs */}
                        <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
                                <h4 className="text-[10px] uppercase text-cyan-600 dark:text-cyan-500 font-bold mb-1">{ui.coreTech}</h4>
                                <p className="font-semibold text-slate-800 dark:text-white">{model.coreTech}</p>
                             </div>
                             <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
                                <h4 className="text-[10px] uppercase text-cyan-600 dark:text-cyan-500 font-bold mb-1">{ui.params}</h4>
                                <p className="font-mono text-slate-800 dark:text-white">{model.params || ui.undisclosed}</p>
                             </div>
                        </div>

                        {/* Features List */}
                        <div>
                             <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{ui.features}</h3>
                             <ul className="space-y-2">
                                {model.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-cyan-500 flex-shrink-0"></span>
                                        <span>{f}</span>
                                    </li>
                                ))}
                             </ul>
                        </div>

                         {/* Use Cases List */}
                         <div>
                             <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{ui.useCases}</h3>
                             <div className="flex flex-wrap gap-2">
                                {model.useCases.map((uc, i) => (
                                    <span key={i} className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                                        {uc}
                                    </span>
                                ))}
                             </div>
                        </div>
                    </div>

                    {/* Footer decoration */}
                    <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
                </div>
            )}
        </div>
    </>
  );
};
