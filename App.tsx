import React, { useState, useEffect } from 'react';
import { CircuitBoard } from './components/CircuitBoard';
import { LandingPage } from './components/LandingPage';
import { LEVELS, GATE_CONFIG } from './constants';
import { NodeState, NodeType } from './types';
import { getAIHint } from './services/geminiService';
import { Cpu, CheckCircle, RotateCcw, ArrowRight, BrainCircuit, Loader2, Home, Menu, X, Grip, Zap } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'game'>('landing');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentNodes, setCurrentNodes] = useState<NodeState[]>([]);
  
  // UI State
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

  const currentLevel = LEVELS[currentLevelIdx];

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setResetTrigger(prev => prev + 1);
      setIsSuccess(false);
      setHint(null);
    }
  };

  const handleReset = () => {
    setResetTrigger(prev => prev + 1);
    setIsSuccess(false);
    setHint(null);
  };

  const runVerification = () => {
    const inputs = currentLevel.inputs;
    const outputs = currentLevel.outputs;
    
    // Verify current state
    const allOutputsCorrect = outputs.every(outDef => {
        const node = currentNodes.find(n => n.id === outDef.id);
        if (!node) return false;
        
        const currentInputValues = inputs.map(inDef => {
            const inNode = currentNodes.find(n => n.id === inDef.id);
            return inNode?.output || false;
        });
        
        try {
            return node.output === outDef.expected(currentInputValues);
        } catch (e) {
            return false;
        }
    });

    setIsSuccess(allOutputsCorrect);
  };

  useEffect(() => {
      if (currentNodes.length > 0) {
          runVerification();
      }
  }, [currentNodes]);

  const requestHint = async () => {
      setLoadingHint(true);
      setHint(null);
      
      const inputMap: Record<string, boolean> = {};
      currentLevel.inputs.forEach(i => {
          const n = currentNodes.find(cn => cn.id === i.id);
          if (n) inputMap[i.label] = n.output;
      });
      
      const response = await getAIHint(currentLevel, currentNodes, [], inputMap);
      setHint(response);
      setLoadingHint(false);
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('game')} />;
  }

  return (
    <div className="flex h-screen w-screen bg-[#022c22] text-gray-200 font-sans overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#011c16]/90 backdrop-blur border-b border-emerald-800 flex items-center justify-between px-4 z-50 shadow-lg">
          <div className="flex items-center gap-2 font-mono-tech text-yellow-500 font-bold text-lg">
               <Cpu size={20} /> NAND_ARCH
          </div>
          <div className="flex gap-4">
               <button onClick={handleReset} className="text-emerald-400 hover:text-white"><RotateCcw size={20} /></button>
               <button onClick={() => setIsSidebarOpen(true)} className="text-yellow-500"><Menu size={24} /></button>
          </div>
      </div>

      {/* Sidebar (Desktop: Fixed, Mobile: Drawer) */}
      <div className={`
          fixed md:relative inset-y-0 left-0 w-72 bg-[#011812] border-r border-emerald-900/50 flex flex-col shadow-2xl z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-emerald-900/50 flex justify-between items-center bg-[#00100d]">
          <div className="flex items-center gap-3">
             <div className="p-1.5 bg-yellow-500/10 rounded border border-yellow-500/30">
                 <Cpu className="text-yellow-500" size={20} />
             </div>
             <h1 className="text-lg font-mono-tech text-white font-bold tracking-wider">
                NAND<br/><span className="text-emerald-500 text-xs">ARCHITECT</span>
             </h1>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setView('landing')} className="p-2 hover:bg-emerald-900/50 rounded text-emerald-400 hover:text-white transition-colors" title="Return to Menu">
                <Home size={18} />
            </button>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-red-900/30 rounded text-red-400">
                <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="px-6 py-2 bg-[#022c22] border-b border-emerald-900/50 flex justify-between items-center text-[10px] font-mono text-emerald-500/60 uppercase">
             <span>SYS: ONLINE</span>
             <span>V 1.0.4</span>
        </div>

        {/* Components Palette */}
        <div className="p-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-900">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-emerald-900/30 pb-2">
              <Grip size={14}/> Component_Lib
          </h2>
          
          <div className="space-y-4">
            {currentLevel.availableGates.map(type => (
              <div 
                key={type}
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData('nodeType', type);
                    e.dataTransfer.effectAllowed = 'copy';
                    setIsSidebarOpen(false); 
                }}
                className="group flex items-center gap-4 p-3 bg-[#022c22] rounded border border-emerald-800 hover:border-yellow-500 cursor-grab active:cursor-grabbing transition-all hover:shadow-[0_0_15px_rgba(234,179,8,0.15)] select-none relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-10 transition-opacity">
                    <Cpu size={40} />
                </div>
                <div className="w-10 h-10 bg-black/40 rounded flex items-center justify-center text-emerald-100 font-bold font-mono-tech border border-emerald-500/20 shadow-inner">
                    <span className="text-xs">{GATE_CONFIG[type].label.split(' ')[0]}</span>
                </div>
                <div>
                    <div className="font-bold text-sm text-white font-mono-tech">{type}</div>
                    <div className="text-[10px] text-emerald-500/60 font-mono">Input Pins: {GATE_CONFIG[type].inputs}</div>
                </div>
              </div>
            ))}
            {currentLevel.availableGates.length === 0 && (
                <div className="text-xs text-emerald-500/50 italic text-center py-6 border border-dashed border-emerald-900 rounded bg-[#011c16]">
                    NO_COMPONENTS_REQUIRED<br/> Direct connection authorized.
                </div>
            )}
          </div>

          {/* AI Assistant */}
          <div className="mt-8 pt-6 border-t border-emerald-900/50">
             <div className="bg-[#022c22]/50 p-4 rounded border border-emerald-500/20 shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
                <h3 className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-2 font-mono">
                    <BrainCircuit size={14} /> AI_ARCHITECT
                </h3>
                <p className="text-[10px] text-emerald-400/60 mb-4 leading-relaxed">
                    Neural network analysis of current circuit topology.
                </p>
                <button 
                    onClick={requestHint}
                    disabled={loadingHint}
                    className="w-full py-2 bg-blue-900/30 hover:bg-blue-800/50 text-blue-200 text-xs rounded border border-blue-500/30 transition-all flex justify-center items-center gap-2 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] disabled:opacity-50 font-mono"
                >
                    {loadingHint ? <Loader2 size={12} className="animate-spin"/> : "RUN_DIAGNOSTICS"}
                </button>
                {hint && (
                    <div className="mt-3 text-xs text-blue-100 bg-blue-950/80 p-3 rounded border-l-2 border-blue-500 animate-in fade-in slide-in-from-top-2 font-mono leading-relaxed">
                        > {hint}
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col relative w-full pt-16 md:pt-0 bg-[#022c22]">
        
        {/* HUD / Level Info */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 pointer-events-none z-20 flex flex-col md:flex-row justify-between items-start gap-4">
            
            {/* Level Card */}
            <div className="bg-[#011812]/90 backdrop-blur-xl border border-emerald-500/30 p-5 rounded shadow-2xl max-w-md pointer-events-auto transition-all animate-in slide-in-from-top-4 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-500 font-mono-tech text-xs font-bold tracking-widest">LEVEL_0{currentLevel.id}</span>
                    <button onClick={handleReset} className="hidden md:block text-emerald-500 hover:text-white transition-colors p-1" title="Reset Level">
                        <RotateCcw size={16} />
                    </button>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2 font-mono-tech uppercase">{currentLevel.title}</h2>
                <p className="text-xs md:text-sm text-emerald-300/70 leading-relaxed font-mono">{currentLevel.description}</p>
            </div>

            {/* Success Message */}
            <div className={`pointer-events-auto transition-all duration-500 transform ${isSuccess ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'} `}>
                <div className="bg-[#064e3b]/95 backdrop-blur-xl border border-emerald-400 p-1 rounded shadow-[0_0_50px_rgba(16,185,129,0.4)] flex items-center">
                    <div className="bg-[#022c22] p-6 rounded flex items-center gap-6">
                        <div className="relative">
                             <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-40 animate-pulse"></div>
                             <CheckCircle size={32} className="text-emerald-400 relative z-10" />
                        </div>
                        <div>
                            <div className="font-bold text-white text-xl font-mono-tech tracking-wider">LOGIC VERIFIED</div>
                            <div className="text-xs text-emerald-400 font-mono">Efficiency: 100%</div>
                        </div>
                        {currentLevelIdx < LEVELS.length - 1 ? (
                            <button 
                                onClick={handleNextLevel}
                                className="ml-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-sm shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95 font-mono-tech"
                            >
                                NEXT_LEVEL <ArrowRight size={16} />
                            </button>
                        ) : (
                            <div className="text-yellow-400 font-bold text-sm px-6 font-mono-tech animate-pulse">ALL SYSTEMS GO!</div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 w-full h-full relative touch-none">
            <CircuitBoard 
                level={currentLevel} 
                onSolve={setCurrentNodes} 
                resetTrigger={resetTrigger}
            />
        </div>

      </div>
    </div>
  );
}