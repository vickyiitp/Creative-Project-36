export type NodeType = 'SOURCE' | 'OUTPUT' | 'AND' | 'OR' | 'NOT' | 'NAND' | 'XOR';

export interface PinPosition {
  x: number;
  y: number;
}

export interface NodeState {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  label?: string;
  inputs: boolean[];
  output: boolean;
}

export interface Connection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  toInputIndex: number; // 0 for A, 1 for B (usually)
}

export interface Level {
  id: number;
  title: string;
  description: string;
  availableGates: NodeType[];
  inputs: { id: string; label: string; x: number; y: number }[];
  outputs: { id: string; label: string; x: number; y: number; expected: (inputs: boolean[]) => boolean }[];
}

export interface GameState {
  nodes: NodeState[];
  connections: Connection[];
}

export interface DragItem {
  type: 'NODE' | 'WIRE_CREATE';
  id?: string; // For existing nodes
  nodeType?: NodeType; // For new nodes from sidebar
  fromNodeId?: string; // For wiring
  startPos?: { x: number; y: number };
}
