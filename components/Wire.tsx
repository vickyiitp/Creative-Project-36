import React from 'react';
import { PinPosition } from '../types';

interface WireProps {
  start: PinPosition;
  end: PinPosition;
  active: boolean;
  isPreview?: boolean;
}

export const Wire: React.FC<WireProps> = ({ start, end, active, isPreview }) => {
  // Enhanced Bezier curve for smoother wire look
  const dx = Math.abs(end.x - start.x);
  const controlPointOffset = Math.max(dx * 0.6, 60); // Wider curves for PCB feel
  
  const p1 = `${start.x},${start.y}`;
  const p2 = `${start.x + controlPointOffset},${start.y}`;
  const p3 = `${end.x - controlPointOffset},${end.y}`;
  const p4 = `${end.x},${end.y}`;

  const pathData = `M ${p1} C ${p2} ${p3} ${p4}`;

  return (
    <g className="pointer-events-none">
      {/* Base Dark Trace (Background) */}
      <path
        d={pathData}
        fill="none"
        stroke="#022c22" 
        strokeWidth={active ? "8" : "6"}
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* Copper Trace (Inactive) or Gold Glow (Active) */}
      <path
        d={pathData}
        fill="none"
        stroke={active ? "#fbbf24" : "#78350f"} // Active: Amber-400, Inactive: Brown-900 (Copper)
        strokeWidth={isPreview ? "2" : active ? "4" : "3"}
        strokeDasharray={isPreview ? "5,5" : "none"}
        className={`transition-all duration-300 ${active ? 'filter drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]' : ''}`}
      />

      {/* Inner Core for active wires (Hot white center) */}
      {active && (
        <path
          d={pathData}
          fill="none"
          stroke="#fffbeb" // Amber-50
          strokeWidth="1.5"
          className="opacity-80"
        />
      )}

      {/* Solder Joints */}
      <circle cx={start.x} cy={start.y} r={active ? "4" : "3"} fill={active ? "#fbbf24" : "#a3a3a3"} className="transition-colors duration-300" />
      <circle cx={end.x} cy={end.y} r={active ? "4" : "3"} fill={active ? "#fbbf24" : "#a3a3a3"} className="transition-colors duration-300" />
    </g>
  );
};