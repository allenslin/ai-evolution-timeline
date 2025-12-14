import React, { useRef, useState, useEffect } from 'react';
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
  
  // Canvas State
  const [viewState, setViewState] = useState({ x: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for drag calculations to avoid closure staleness
  const dragStartRef = useRef<{ x: number; viewX: number } | null>(null);

  // Constants
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 4;
  const ZOOM_SPEED = 0.001;

  // Initial center alignment
  useEffect(() => {
    // Start with a slight offset to center the beginning of the timeline visually if needed
    // or just start at 0. Since we have huge padding, 0 is fine (centered due to flex alignment).
    setViewState({ x: 0, scale: 0.8 }); // Start slightly zoomed out
  }, []);

  // --- Interaction Handlers ---

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      viewX: viewState.x
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    e.preventDefault();
    
    const dx = e.clientX - dragStartRef.current.x;
    setViewState(prev => ({
      ...prev,
      x: dragStartRef.current!.viewX + dx
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Check for Zoom (Ctrl + Wheel or Pinch on trackpad)
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomDelta = -e.deltaY * ZOOM_SPEED;
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, viewState.scale + zoomDelta));
        
        // Simple center zoom for robustness
        setViewState(prev => ({
            ...prev,
            scale: newScale
        }));
    } else {
        // Pan (Standard Wheel)
        // Adjust pan speed based on scale to keep it feeling natural
        const panDelta = -e.deltaY; // Horizontal pan typically maps deltaY to X on non-touch mice
        // If shift is held, browsers naturally swap X/Y, but we enforce X panning for this timeline
        const finalDelta = e.shiftKey ? -e.deltaX : panDelta;
        
        setViewState(prev => ({
            ...prev,
            x: prev.x + finalDelta
        }));
    }
  };

  // --- Zoom Controls ---

  const handleZoomIn = () => {
    setViewState(prev => ({ ...prev, scale: Math.min(MAX_ZOOM, prev.scale * 1.2) }));
  };

  const handleZoomOut = () => {
    setViewState(prev => ({ ...prev, scale: Math.max(MIN_ZOOM, prev.scale / 1.2) }));
  };

  const handleReset = () => {
    setViewState({ x: 0, scale: 0.8 });
  };

  return (
    <div className="w-full h-full relative bg-paper-50 dark:bg-cyber-900 tech-grid overflow-hidden transition-colors duration-500 group/canvas">
        {/* Background Decorative Line (Static) */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 dark:bg-slate-800 pointer-events-none z-0"></div>

        {/* Viewport / Interactive Area */}
        <div 
            ref={containerRef}
            className={`w-full h-full relative cursor-grab active:cursor-grabbing z-10 touch-none`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
        >
            {/* Movable Canvas Layer */}
            <div 
                className="absolute top-0 left-0 h-full flex items-center transition-transform duration-75 ease-out will-change-transform"
                style={{ 
                    transform: `translate3d(${viewState.x}px, 0, 0) scale(${viewState.scale})`,
                    transformOrigin: '50% 50%', // Zoom from center of the strip
                    width: '100%', // Ensure flex centering works relative to viewport
                    justifyContent: 'center' // Start centered
                }}
            >
                {/* Content Strip */}
                <div className="flex items-center space-x-40 px-20">
                    {models.map((model, index) => {
                        const isSelected = selectedModelId === model.id;
                        const color = COMPANY_COLORS[model.company] || '#64748b';
                        const year = model.releaseDate.split('-')[0];
                        const prevYear = index > 0 ? models[index - 1].releaseDate.split('-')[0] : null;
                        const showYear = year !== prevYear;

                        return (
                            <div 
                                key={model.id} 
                                className={`relative flex-shrink-0 flex flex-col items-center group/node ${showYear && index !== 0 ? 'ml-96' : ''}`}
                            >
                                {/* Year Marker */}
                                {showYear && (
                                    <>
                                        {index !== 0 && (
                                            <div className="absolute -left-48 top-1/2 -translate-y-1/2 h-48 w-px border-l-2 border-dashed border-slate-300 dark:border-slate-800 opacity-50 pointer-events-none"></div>
                                        )}
                                        <div className="absolute -top-48 text-8xl font-black text-slate-200 dark:text-slate-800/50 font-sans select-none pointer-events-none transition-colors tracking-tighter z-0">
                                            {year}
                                        </div>
                                    </>
                                )}

                                {/* Connection Line */}
                                <div className={`w-px h-16 mb-2 transition-all duration-300 relative z-10 ${isSelected ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-slate-300 dark:bg-slate-700 group-hover/node:bg-slate-400 dark:group-hover/node:bg-slate-500'}`}></div>
                                
                                {/* Node Point */}
                                <button
                                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag start when clicking node
                                    onClick={() => onSelectModel(model)}
                                    className={`
                                        w-6 h-6 rounded-full border-2 transition-all duration-300 relative z-20 cursor-pointer
                                        ${isSelected ? 'scale-[2.5] bg-white dark:bg-cyber-900 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]' : 'bg-white dark:bg-cyber-900 border-slate-300 dark:border-slate-600 hover:border-cyan-500 hover:scale-150'}
                                    `}
                                >
                                    {isSelected && (
                                        <span className="absolute inset-0 rounded-full animate-ping bg-cyan-400 opacity-20"></span>
                                    )}
                                </button>

                                {/* Label */}
                                <div 
                                    className={`
                                        absolute top-28 w-64 text-center transition-all duration-300 z-30 pointer-events-none
                                        ${isSelected ? 'opacity-100 scale-110 translate-y-0' : 'opacity-70 translate-y-2 group-hover/node:opacity-100 group-hover/node:translate-y-0'}
                                    `}
                                >
                                    <div 
                                        className="text-xs font-mono mb-1 uppercase tracking-wider" 
                                        style={{ color: color }}
                                    >
                                        {model.company}
                                    </div>
                                    <div className={`font-bold leading-tight mb-1 ${isSelected ? 'text-slate-900 dark:text-white text-xl' : 'text-slate-600 dark:text-slate-300 text-sm'}`}>
                                        {model.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                        {model.releaseDate}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Start/End Gradients */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-paper-50 dark:from-cyber-900 to-transparent pointer-events-none z-20 transition-colors duration-500"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-paper-50 dark:from-cyber-900 to-transparent pointer-events-none z-20 transition-colors duration-500"></div>

        {/* Floating Controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-50">
             <button 
                onClick={handleZoomIn}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-cyan-500 transition-all"
                title="Zoom In"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
             </button>
             <button 
                onClick={handleReset}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-cyan-500 transition-all"
                title="Reset View"
             >
                <span className="text-xs font-bold">{Math.round(viewState.scale * 100)}%</span>
             </button>
             <button 
                onClick={handleZoomOut}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-cyan-500 transition-all"
                title="Zoom Out"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
             </button>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 left-8 z-20 text-[10px] text-slate-400 dark:text-slate-600 font-mono bg-white/50 dark:bg-cyber-900/50 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 backdrop-blur transition-colors pointer-events-none select-none">
            DRAG TO PAN • CTRL+SCROLL TO ZOOM
        </div>
    </div>
  );
};
