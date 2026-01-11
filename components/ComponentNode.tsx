import React from 'react';
import { NodeState } from '../types';
import { GATE_CONFIG } from '../constants';
import { Power, Lightbulb, Zap } from 'lucide-react';

interface ComponentNodeProps {
  node: NodeState;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onPinPointerDown: (e: React.PointerEvent, nodeId: string, isInput: boolean, index: number) => void;
  onPinPointerUp: (e: React.PointerEvent, nodeId: string, isInput: boolean, index: number) => void;
  onToggleSource?: (nodeId: string) => void;
}

export const ComponentNode: React.FC<ComponentNodeProps> = ({ 
  node, 
  onPointerDown, 
  onPinPointerDown, 
  onPinPointerUp,
  onToggleSource 
}) => {
  const config = GATE_CONFIG[node.type];
  
  // Render metallic pins
  const renderPin = (isInput: boolean, index: number) => {
    const yOffset = isInput 
        ? ((index + 1) * config.h) / (config.inputs + 1)
        : config.h / 2;
        
    return (
      <div
        key={`${isInput ? 'in' : 'out'}-${index}`}
        className={`absolute w-6 h-3 z-0 ${isInput ? '-left-4' : '-right-4'} flex items-center justify-center`}
        style={{ top: yOffset - 6 }}
      >
        {/* Metal Pin Visual */}
        <div className={`w-full h-1.5 bg-gray-400 border border-gray-600 ${isInput ? 'rounded-l-sm' : 'rounded-r-sm'}`}></div>
        
        {/* Interaction Hitbox (Larger) */}
        <div 
            className="absolute w-10 h-10 -top-3.5 flex items-center justify-center cursor-crosshair z-20 group/pin"
            onPointerDown={(e) => {
                e.stopPropagation();
                onPinPointerDown(e, node.id, isInput, index);
            }}
            onPointerUp={(e) => {
                e.stopPropagation();
                onPinPointerUp(e, node.id, isInput, index);
            }}
            title={isInput ? `Input ${index === 0 ? 'A' : 'B'}` : "Output"}
        >
             <div className="w-3 h-3 rounded-full bg-yellow-500/0 group-hover/pin:bg-yellow-500/50 transition-colors"></div>
        </div>
      </div>
    );
  };

  const inputPins = Array.from({ length: config.inputs }).map((_, i) => renderPin(true, i));
  const outputPin = node.type !== 'OUTPUT' ? renderPin(false, 0) : null;

  // Render Content based on type
  const renderContent = () => {
    if (node.type === 'SOURCE') {
        return (
            <div 
                className={`flex flex-col items-center justify-center w-full h-full rounded cursor-pointer transition-all duration-300 relative overflow-hidden
                    ${node.output ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)]' : 'bg-slate-800 border-2 border-slate-600'}`}
                onPointerDown={(e) => {
                     e.stopPropagation();
                     onToggleSource?.(node.id);
                }}
            >
                <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20`}></div>
                <Power size={24} className={`z-10 ${node.output ? "text-slate-900" : "text-gray-400"}`} />
                <span className={`z-10 text-[10px] font-bold mt-1 font-mono-tech ${node.output ? "text-slate-900" : "text-gray-400"}`}>{node.output ? "ON" : "OFF"}</span>
                {node.label && <span className="absolute -top-7 text-yellow-500 font-mono-tech whitespace-nowrap text-xs bg-slate-900/80 px-1 rounded border border-yellow-500/30">{node.label}</span>}
            </div>
        )
    }
    if (node.type === 'OUTPUT') {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full pointer-events-none relative">
                 <div className={`w-10 h-10 rounded-full border-4 transition-all duration-300 flex items-center justify-center
                    ${node.output ? 'bg-yellow-100 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.9)]' : 'bg-slate-900 border-slate-700'}`}>
                    <Lightbulb size={20} className={node.output ? "text-yellow-600 fill-yellow-600" : "text-slate-700"} />
                 </div>
                 {node.label && <span className="absolute -top-7 text-cyan-400 font-mono-tech whitespace-nowrap text-xs bg-slate-900/80 px-1 rounded border border-cyan-500/30">{node.label}</span>}
            </div>
        )
    }

    // IC CHIP LOOK for Logic Gates
    return (
        <div className="flex flex-col items-center justify-center w-full h-full pointer-events-none relative overflow-hidden">
             {/* Chip Notch */}
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-[#111] rounded-r-full opacity-50"></div>
             
             {/* Label */}
             <div className="flex flex-col items-center z-10">
                 <span className="font-mono-tech font-bold text-xs text-slate-400 tracking-wider mb-1">{config.label.split(' ')[0]}</span>
                 <span className="font-mono-tech font-bold text-lg text-slate-200">{config.label.split(' ')[1]}</span>
             </div>

             {/* Power LED on Chip */}
             <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${node.output ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-red-900'}`}></div>
             
             {/* Metallic Texture overlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/20 pointer-events-none"></div>
        </div>
    );
  };

  // Determine container styles
  const isChip = !['SOURCE', 'OUTPUT'].includes(node.type);
  const containerClass = isChip 
    ? "bg-[#1a1a1a] rounded-sm shadow-xl border border-gray-700 shadow-black/50" // IC Chip style
    : ""; // Source/Output handle their own styles

  return (
    <div
      className={`absolute select-none group touch-action-none transition-transform active:scale-95 ${containerClass}`}
      style={{
        left: node.x,
        top: node.y,
        width: config.w,
        height: config.h,
        touchAction: 'none' 
      }}
      onPointerDown={(e) => onPointerDown(e, node.id)}
    >
      {inputPins}
      {renderContent()}
      {outputPin}
    </div>
  );
};