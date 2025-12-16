
import React, { useRef, useEffect } from 'react';
import { AIModel, UIText } from '../types';
import { COMPANY_COLORS } from '../constants';

interface TimelineProps {
  models: AIModel[];
  selectedModelId: string | null;
  onSelectModel: (model: AIModel) => void;
  ui: UIText;
}

export const Timeline: React.FC<TimelineProps> = ({ models, selectedModelId, onSelectModel, ui }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected model if needed, or initial animation
  useEffect(() => {
    // Optional: Add intersection observer for fade-in effects here
  }, []);

  return (
    <div className="w-full relative min-h-full py-12 md:py-24 px-4 md:px-8 max-w-5xl mx-auto">
        
        {/* Central Spine Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent z-0 transform md:-translate-x-1/2"></div>

        <div className="space-y-12 md:space-y-24 relative z-10">
            {models.map((model, index) => {
                const isSelected = selectedModelId === model.id;
                const isLatest = index === 0;
                const color = COMPANY_COLORS[model.company] || '#64748b';
                const isLeft = index % 2 === 0; // Alternating layout for desktop

                return (
                    <div 
                        key={model.id} 
                        className={`relative flex flex-col md:flex-row items-start md:items-center w-full group ${isLeft ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Mobile Node (Left Aligned) */}
                        <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 md:translate-x-[-50%] z-20 flex items-center justify-center">
                            {/* Ping effect for latest node */}
                             {isLatest && (
                                <div className="absolute w-full h-full rounded-full bg-cyan-500 opacity-75 animate-ping"></div>
                             )}
                             <div 
                                className={`w-3 h-3 rounded-full transition-all duration-300 border-2 relative z-10 ${isSelected || isLatest ? 'bg-cyan-500 border-white dark:border-cyber-900 scale-150 shadow-[0_0_15px_rgba(6,182,212,0.8)]' : 'bg-white dark:bg-cyber-900 border-slate-400 dark:border-slate-600 group-hover:border-cyan-500 group-hover:scale-125'}`}
                             ></div>
                        </div>

                        {/* Spacer for center alignment on desktop */}
                        <div className="hidden md:block w-1/2"></div>

                        {/* Content Card */}
                        <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                            <div 
                                onClick={() => onSelectModel(model)}
                                className={`
                                    relative p-5 rounded-xl border transition-all duration-300 cursor-pointer overflow-visible
                                    ${isSelected 
                                        ? 'bg-white dark:bg-slate-800 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-500/10 scale-[1.02]' 
                                        : isLatest
                                            ? 'bg-white/90 dark:bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                                            : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-md hover:-translate-y-1'
                                    }
                                `}
                            >
                                {/* Decorative color accent */}
                                <div className="absolute top-0 left-0 w-1 h-full opacity-80 rounded-l-xl" style={{ backgroundColor: color }}></div>

                                {/* Latest Badge */}
                                {isLatest && (
                                    <div className="absolute -top-3 -right-2 md:-right-3 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold rounded-full shadow-lg z-20 tracking-widest flex items-center gap-1 animate-pulse-fast border border-white/20">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                        </span>
                                        LATEST
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase mb-1" style={{ color: color }}>
                                            {model.company}
                                        </span>
                                        <h3 className={`text-lg md:text-xl font-bold leading-tight ${isSelected || isLatest ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {model.name}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                         <span className={`inline-block px-2 py-1 text-[10px] font-mono rounded border ${isLatest ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/50' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                            {model.releaseDate.split('-')[0]}
                                         </span>
                                    </div>
                                </div>

                                <p className={`text-sm line-clamp-2 mb-3 leading-relaxed ${isLatest ? 'text-slate-700 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {model.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {model.capabilities.slice(0, 3).map(cap => (
                                        <span key={cap} className="px-1.5 py-0.5 text-[9px] uppercase font-semibold rounded bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700/50">
                                            {cap}
                                        </span>
                                    ))}
                                    {model.source && (
                                        <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${isLatest ? 'text-cyan-600 dark:text-cyan-400' : 'text-cyan-600 dark:text-cyan-500'}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        
        {/* End Spacer */}
        <div className="h-24"></div>
    </div>
  );
};
