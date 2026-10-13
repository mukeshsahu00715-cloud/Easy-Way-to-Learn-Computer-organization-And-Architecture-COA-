import { GoogleGenAI } from '@google/genai';

/**
 * AI Pedagogical Tutor Service
 * Generates clear, friendly conversational line-by-line explanations for students.
 */

interface ExplanationResult {
  simpleExplanation: string;
  realWorldAnalogy: string;
  examMemoryTip: string;
}

export async function explainLineWithAI(
  lineText: string,
  topicTitle: string
): Promise<ExplanationResult> {
  // Check if API key is provided
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a friendly, encouraging Computer Organization & Architecture (COA) professor.
A student is listening to a line-by-line lecture on "${topicTitle}" and paused on this specific line:
"${lineText}"

Please explain this concept clearly and concisely.
Format your answer in exactly 3 brief sections:
1. SIMPLE BREAKDOWN: (1-2 sentences explaining what this line means in plain English)
2. REAL-WORLD ANALOGY: (A 1-sentence analogy e.g. post office, library, kitchen, factory)
3. EXAM MEMORY HINT: (1 quick mnemonic or key rule for exams)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text || '';
      
      // Parse structured sections
      const breakdownMatch = text.match(/SIMPLE BREAKDOWN:\s*([\s\S]*?)(?=REAL-WORLD ANALOGY:|$)/i);
      const analogyMatch = text.match(/REAL-WORLD ANALOGY:\s*([\s\S]*?)(?=EXAM MEMORY HINT:|$)/i);
      const examTipMatch = text.match(/EXAM MEMORY HINT:\s*([\s\S]*?)$/i);

      return {
        simpleExplanation: breakdownMatch ? breakdownMatch[1].trim() : text.slice(0, 200),
        realWorldAnalogy: analogyMatch ? analogyMatch[1].trim() : 'Think of this as a specialized hardware pipeline routing instructions like an assembly line.',
        examMemoryTip: examTipMatch ? examTipMatch[1].trim() : 'Remember this key formula and truth table definition for 5-mark theory questions.'
      };
    } catch (err) {
      console.warn('Gemini API call fell back to local pedagogical tutor:', err);
    }
  }

  // High-fidelity pedagogical fallback engine (instant & offline-ready)
  return generateLocalSmartExplanation(lineText, topicTitle);
}

function generateLocalSmartExplanation(lineText: string, topicTitle: string): ExplanationResult {
  const lower = lineText.toLowerCase();

  if (lower.includes('2\'s complement') || lower.includes('two\'s complement')) {
    return {
      simpleExplanation: "2's complement is how processors store negative numbers so that addition and subtraction can use the exact same digital adder circuitry without needing a separate subtractor.",
      realWorldAnalogy: "Like an odometer in a car turning backward from 000000 to 999999, negative numbers wrap around smoothly.",
      examMemoryTip: "To negate X: Invert all bits (1's complement) and add 1. Always remember range is -2^(n-1) to +(2^(n-1)-1)."
    };
  }

  if (lower.includes('cache') || lower.includes('amat') || lower.includes('hit')) {
    return {
      simpleExplanation: "Cache memory is a tiny, super-fast scratchpad right next to the CPU cores that holds frequently accessed data to avoid the slow trek to RAM.",
      realWorldAnalogy: "Like keeping your current textbook on your desk rather than walking to the library book stacks every time you turn a page.",
      examMemoryTip: "AMAT = Cache Hit Time + (Miss Rate × Miss Penalty). Always check whether hit time is included in miss penalty!"
    };
  }

  if (lower.includes('pipeline') || lower.includes('hazard') || lower.includes('raw')) {
    return {
      simpleExplanation: "Pipelining overlaps the execution of multiple instructions like an assembly line. Hazards are bottlenecks where an instruction needs data from a previous instruction that hasn't finished yet.",
      realWorldAnalogy: "Like a laundromat where person B loads the washer while person A moves their clean clothes into the dryer.",
      examMemoryTip: "RAW (Read After Write) is resolved by operand forwarding; structural hazards are solved by separate Harvard memory buses."
    };
  }

  if (lower.includes('instruction cycle') || lower.includes('fetch') || lower.includes('decode')) {
    return {
      simpleExplanation: "The CPU constantly repeats three fundamental steps: Fetch the binary opcode from memory using PC, Decode what it means, and Execute it through the ALU.",
      realWorldAnalogy: "Like a chef reading a recipe step from a cookbook, understanding what knife to use, and cutting the vegetable.",
      examMemoryTip: "Program Counter (PC) increments during fetch; Instruction Register (IR) holds the opcode during decode."
    };
  }

  if (lower.includes('booth') || lower.includes('multiplier')) {
    return {
      simpleExplanation: "Booth's algorithm speeds up binary multiplication by replacing long runs of consecutive 1s with a single subtraction and addition.",
      realWorldAnalogy: "Multiplying by 99 is easier as (100 - 1) than doing 99 individual additions.",
      examMemoryTip: "Inspect (Q0, Q-1): 1 0 means subtract M then shift; 0 1 means add M then shift; 0 0 or 1 1 just shifts right!"
    };
  }

  return {
    simpleExplanation: `In ${topicTitle}, this principle ensures hardware components coordinate clock cycles, register buses, and signal logic without corruption.`,
    realWorldAnalogy: "Like a well-timed traffic intersection where green and red signals keep high-speed lanes flowing safely.",
    examMemoryTip: `Focus on the exact definition and draw the block diagram clearly for full marks in semester exams.`
  };
}
