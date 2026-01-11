import { Level, NodeType } from './types';

// Dimensions tailored for the "Chip" look
export const GATE_CONFIG: Record<NodeType, { w: number; h: number; inputs: number; color: string; label: string }> = {
  SOURCE: { w: 60, h: 60, inputs: 0, color: 'bg-yellow-600', label: 'PWR' },
  OUTPUT: { w: 60, h: 60, inputs: 1, color: 'bg-blue-600', label: 'LED' },
  AND: { w: 90, h: 70, inputs: 2, color: 'bg-slate-900', label: '7408 AND' },
  OR: { w: 90, h: 70, inputs: 2, color: 'bg-slate-900', label: '7432 OR' },
  NOT: { w: 90, h: 70, inputs: 1, color: 'bg-slate-900', label: '7404 NOT' },
  NAND: { w: 90, h: 70, inputs: 2, color: 'bg-slate-900', label: '7400 NAND' },
  XOR: { w: 90, h: 70, inputs: 2, color: 'bg-slate-900', label: '7486 XOR' },
};

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Hello World",
    description: "Connect the Power Source directly to the Light Output to turn it on.",
    availableGates: [],
    inputs: [{ id: 'src-1', label: 'PWR', x: 100, y: 300 }],
    outputs: [{ id: 'out-1', label: 'LIGHT', x: 700, y: 300, expected: (inputs) => inputs[0] }]
  },
  {
    id: 2,
    title: "The Inverter",
    description: "Use a NOT gate so the light turns ON when power is OFF, and OFF when power is ON.",
    availableGates: ['NOT'],
    inputs: [{ id: 'src-1', label: 'IN', x: 100, y: 300 }],
    outputs: [{ id: 'out-1', label: 'OUT', x: 700, y: 300, expected: (inputs) => !inputs[0] }]
  },
  {
    id: 3,
    title: "Safety Lock (AND)",
    description: "The light should only turn on if BOTH switch A and switch B are on.",
    availableGates: ['AND', 'NOT'],
    inputs: [
      { id: 'src-A', label: 'A', x: 100, y: 200 },
      { id: 'src-B', label: 'B', x: 100, y: 400 }
    ],
    outputs: [{ id: 'out-1', label: 'A & B', x: 700, y: 300, expected: (inputs) => inputs[0] && inputs[1] }]
  },
  {
    id: 4,
    title: "Any Key (OR)",
    description: "The light should turn on if EITHER switch A OR switch B is on.",
    availableGates: ['AND', 'OR', 'NOT'],
    inputs: [
      { id: 'src-A', label: 'A', x: 100, y: 200 },
      { id: 'src-B', label: 'B', x: 100, y: 400 }
    ],
    outputs: [{ id: 'out-1', label: 'A | B', x: 700, y: 300, expected: (inputs) => inputs[0] || inputs[1] }]
  },
  {
    id: 5,
    title: "NAND Construction",
    description: "Build a NAND gate behavior using AND and NOT. (Output is 0 only when both inputs are 1).",
    availableGates: ['AND', 'OR', 'NOT'],
    inputs: [
      { id: 'src-A', label: 'A', x: 100, y: 200 },
      { id: 'src-B', label: 'B', x: 100, y: 400 }
    ],
    outputs: [{ id: 'out-1', label: 'NAND', x: 700, y: 300, expected: (inputs) => !(inputs[0] && inputs[1]) }]
  },
  {
    id: 10,
    title: "Half Adder",
    description: "Build a Half Adder. 'SUM' is XOR(A, B). 'CARRY' is AND(A, B). You have AND, OR, NOT.",
    availableGates: ['AND', 'OR', 'NOT'],
    inputs: [
      { id: 'src-A', label: 'A', x: 100, y: 200 },
      { id: 'src-B', label: 'B', x: 100, y: 400 }
    ],
    outputs: [
      { id: 'out-sum', label: 'SUM', x: 700, y: 200, expected: (inputs) => (inputs[0] || inputs[1]) && !(inputs[0] && inputs[1]) }, // XOR
      { id: 'out-carry', label: 'CARRY', x: 700, y: 400, expected: (inputs) => inputs[0] && inputs[1] } // AND
    ]
  }
];