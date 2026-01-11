import { NodeState, Connection } from '../types';

export const solveCircuit = (nodes: NodeState[], connections: Connection[]): NodeState[] => {
  // Deep copy nodes to avoid mutating state directly during calculation
  let currentNodes = nodes.map(n => ({ ...n, inputs: [...n.inputs] }));
  
  // Reset non-source inputs to false before simulation iteration
  // Real circuits hold state, but for this simple puzzle game, we re-evaluate
  // However, for stability, we just need to propagate.
  
  // We will run a fixed number of propagation cycles to settle the circuit.
  // 10 cycles is usually enough for the depth of circuits in this game.
  const CYCLES = 10;

  for (let i = 0; i < CYCLES; i++) {
    // 1. Map outputs of nodes to inputs of connected nodes
    connections.forEach(conn => {
      const sourceNode = currentNodes.find(n => n.id === conn.fromNodeId);
      const targetNode = currentNodes.find(n => n.id === conn.toNodeId);
      
      if (sourceNode && targetNode) {
        targetNode.inputs[conn.toInputIndex] = sourceNode.output;
      }
    });

    // 2. Compute outputs based on inputs
    currentNodes = currentNodes.map(node => {
      let newOutput = node.output;

      switch (node.type) {
        case 'SOURCE':
          // Source output is controlled by user interaction, doesn't change during solve
          break;
        case 'AND':
          newOutput = node.inputs[0] && node.inputs[1];
          break;
        case 'OR':
          newOutput = node.inputs[0] || node.inputs[1];
          break;
        case 'NOT':
          newOutput = !node.inputs[0];
          break;
        case 'NAND':
          newOutput = !(node.inputs[0] && node.inputs[1]);
          break;
        case 'XOR':
          newOutput = (node.inputs[0] || node.inputs[1]) && !(node.inputs[0] && node.inputs[1]);
          break;
        case 'OUTPUT':
          // Output node just reflects its single input (index 0)
          newOutput = node.inputs[0];
          break;
      }

      return { ...node, output: newOutput };
    });
  }

  return currentNodes;
};
