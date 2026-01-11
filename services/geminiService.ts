import { GoogleGenAI } from "@google/genai";
import { NodeState, Connection, Level } from "../types";

const SYSTEM_PROMPT = `
You are the "NAND Architect", a senior digital logic engineer. 
Your goal is to help a junior engineer (the user) debug their boolean logic circuits.
You speak in a technical but encouraging tone, using printed circuit board analogies.
Keep hints concise (under 3 sentences). 
Focus on *why* the circuit is behaving differently than expected, rather than just giving the solution.
`;

export const getAIHint = async (
  level: Level,
  nodes: NodeState[],
  connections: Connection[],
  inputStates: Record<string, boolean> // Map of Source ID -> On/Off
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "DEBUG MODE: API Key not found. Please set process.env.API_KEY to use the AI Architect.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Serialize the circuit state for the LLM
  const circuitDescription = `
    Level Goal: ${level.title} - ${level.description}
    
    Current Components:
    ${nodes.map(n => `- [${n.id}] Type: ${n.type}, Output currently: ${n.output ? 'HIGH' : 'LOW'}, Inputs: ${JSON.stringify(n.inputs)}`).join('\n')}
    
    Connections:
    ${connections.map(c => `- From ${c.fromNodeId} to ${c.toNodeId} (Input ${c.toInputIndex})`).join('\n')}
    
    Active Inputs:
    ${Object.entries(inputStates).map(([id, state]) => `- ${id}: ${state ? 'HIGH' : 'LOW'}`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user is stuck on this level. Analyze the circuit and provide a hint.\n\nCircuit Data:\n${circuitDescription}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      }
    });

    return response.text || "Communication interference. Try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. The AI Architect is currently offline.";
  }
};
