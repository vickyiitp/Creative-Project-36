import React, { useState, useRef, useEffect } from 'react';
import { NodeState, Connection, NodeType, PinPosition, Level } from '../types';
import { GATE_CONFIG } from '../constants';
import { ComponentNode } from './ComponentNode';
import { Wire } from './Wire';
import { solveCircuit } from '../services/circuitSolver';

interface CircuitBoardProps {
  level: Level;
  onSolve: (nodes: NodeState[]) => void;
  resetTrigger: number; 
}

export const CircuitBoard: React.FC<CircuitBoardProps> = ({ level, onSolve, resetTrigger }) => {
  const [nodes, setNodes] = useState<NodeState[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  
  // Dragging State
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Wiring State
  const [wiringStart, setWiringStart] = useState<{ nodeId: string, isInput: boolean, index: number } | null>(null);
  const [pointerPos, setPointerPos] = useState<PinPosition>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Level
  useEffect(() => {
    const initialNodes: NodeState[] = [
      ...level.inputs.map(def => ({
        id: def.id, type: 'SOURCE' as NodeType, x: def.x, y: def.y, label: def.label, inputs: [], output: false
      })),
      ...level.outputs.map(def => ({
        id: def.id, type: 'OUTPUT' as NodeType, x: def.x, y: def.y, label: def.label, inputs: [false], output: false
      }))
    ];
    setNodes(initialNodes);
    setConnections([]);
  }, [level, resetTrigger]);

  // Circuit Simulation Loop
  useEffect(() => {
    const simulatedNodes = solveCircuit(nodes, connections);
    const hasChanged = simulatedNodes.some((n, i) => n.output !== nodes[i]?.output);
    if (hasChanged) {
        setNodes(simulatedNodes);
        onSolve(simulatedNodes);
    }
  }, [connections]); 

  const updateCircuit = (currentNodes: NodeState[], currentConnections: Connection[]) => {
      const solved = solveCircuit(currentNodes, currentConnections);
      setNodes(solved);
      onSolve(solved);
  };

  // --- Pointer Handlers (Unified Mouse/Touch) ---

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    if (draggedNodeId || wiringStart) {
        e.preventDefault(); 
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPointerPos({ x, y });

    if (draggedNodeId) {
       const newX = Math.max(0, Math.min(x - dragOffset.x, rect.width - 50));
       const newY = Math.max(0, Math.min(y - dragOffset.y, rect.height - 50));

      setNodes(prev => prev.map(n => {
        if (n.id === draggedNodeId) {
          return { ...n, x: newX, y: newY };
        }
        return n;
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDraggedNodeId(null);
    setWiringStart(null);
    if (containerRef.current) {
        containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
    if (!containerRef.current) return;
    const isFixed = level.inputs.some(i => i.id === nodeId) || level.outputs.some(o => o.id === nodeId);
    if (isFixed) return;

    const rect = containerRef.current.getBoundingClientRect();
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      containerRef.current.setPointerCapture(e.pointerId);
      setDragOffset({
        x: (e.clientX - rect.left) - node.x,
        y: (e.clientY - rect.top) - node.y
      });
      setDraggedNodeId(nodeId);
    }
  };

  const handlePinPointerDown = (e: React.PointerEvent, nodeId: string, isInput: boolean, index: number) => {
    if (containerRef.current) {
         containerRef.current.setPointerCapture(e.pointerId);
    }
    setWiringStart({ nodeId, isInput, index });
    const rect = containerRef.current!.getBoundingClientRect();
    setPointerPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handlePinPointerUp = (e: React.PointerEvent, nodeId: string, isInput: boolean, index: number) => {
    if (!wiringStart) return;

    if (wiringStart.isInput === isInput) return; 
    if (wiringStart.nodeId === nodeId) return; 

    let sourceId, targetId, targetIdx;

    if (!wiringStart.isInput && isInput) {
        sourceId = wiringStart.nodeId;
        targetId = nodeId;
        targetIdx = index;
    } else if (wiringStart.isInput && !isInput) {
        sourceId = nodeId;
        targetId = wiringStart.nodeId;
        targetIdx = wiringStart.index;
    } else {
        return;
    }

    const isOccupied = connections.some(c => c.toNodeId === targetId && c.toInputIndex === targetIdx);
    if (isOccupied) {
        setConnections(prev => {
            const newConns = prev.filter(c => !(c.toNodeId === targetId && c.toInputIndex === targetIdx));
            const newConn = { id: crypto.randomUUID(), fromNodeId: sourceId!, toNodeId: targetId!, toInputIndex: targetIdx! };
            const updatedConns = [...newConns, newConn];
            updateCircuit(nodes, updatedConns);
            return updatedConns;
        });
    } else {
        const newConn = { id: crypto.randomUUID(), fromNodeId: sourceId!, toNodeId: targetId!, toInputIndex: targetIdx! };
        const newConns = [...connections, newConn];
        setConnections(newConns);
        updateCircuit(nodes, newConns);
    }
    
    setWiringStart(null);
  };

  const toggleSource = (nodeId: string) => {
      const updatedNodes = nodes.map(n => {
          if (n.id === nodeId) return { ...n, output: !n.output };
          return n;
      });
      setNodes(updatedNodes);
      updateCircuit(updatedNodes, connections);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('nodeType') as NodeType;
      if (!type) return;

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - (GATE_CONFIG[type].w / 2);
      const y = e.clientY - rect.top - (GATE_CONFIG[type].h / 2);

      const newNode: NodeState = {
          id: `gate-${Date.now()}`,
          type,
          x, 
          y,
          inputs: new Array(GATE_CONFIG[type].inputs).fill(false),
          output: false
      };
      
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      updateCircuit(newNodes, connections);
  };

  const getPinPos = (nodeId: string, isInput: boolean, index: number): PinPosition => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return { x: 0, y: 0 };
      const config = GATE_CONFIG[node.type];
      
      if (isInput) {
          const yOffset = ((index + 1) * config.h) / (config.inputs + 1);
          return { x: node.x, y: node.y + yOffset };
      } else {
          return { x: node.x + config.w, y: node.y + (config.h / 2) };
      }
  };

  return (
    <div 
        ref={containerRef}
        className="w-full h-full relative overflow-hidden touch-none pcb-trace-bg"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDragOver={handleDragOver}
        onDragEnter={(e) => e.preventDefault()}
        onDrop={handleDrop}
    >
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30" 
           style={{ 
               backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
           }}>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        {connections.map(conn => {
            const start = getPinPos(conn.fromNodeId, false, 0);
            const end = getPinPos(conn.toNodeId, true, conn.toInputIndex);
            const sourceNode = nodes.find(n => n.id === conn.fromNodeId);
            return <Wire key={conn.id} start={start} end={end} active={sourceNode?.output || false} />;
        })}
        {wiringStart && (
            <Wire 
                start={wiringStart.isInput ? getPinPos(wiringStart.nodeId, true, wiringStart.index) : getPinPos(wiringStart.nodeId, false, 0)} 
                end={pointerPos} 
                active={true} 
                isPreview 
            />
        )}
      </svg>

      <div className="z-20 relative w-full h-full">
        {nodes.map(node => (
            <ComponentNode 
                key={node.id} 
                node={node}
                onPointerDown={handleNodePointerDown}
                onPinPointerDown={handlePinPointerDown}
                onPinPointerUp={handlePinPointerUp}
                onToggleSource={toggleSource}
            />
        ))}
      </div>
    </div>
  );
};