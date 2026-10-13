import React, { useState } from 'react';
import { Sliders, CheckCircle2 } from 'lucide-react';

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

interface GateDef {
  name: GateType;
  symbol: string;
  expression: string;
  description: string;
  nandCount: number;
  compute: (a: number, b: number) => number;
  truthTable: { a: number; b?: number; out: number }[];
}

const GATES: Record<GateType, GateDef> = {
  AND: {
    name: 'AND',
    symbol: '·',
    expression: 'Y = A · B',
    description: 'Output is 1 ONLY if BOTH inputs A and B are 1.',
    nandCount: 2,
    compute: (a, b) => (a && b ? 1 : 0),
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 1 }
    ]
  },
  OR: {
    name: 'OR',
    symbol: '+',
    expression: 'Y = A + B',
    description: 'Output is 1 if AT LEAST ONE input is 1.',
    nandCount: 3,
    compute: (a, b) => (a || b ? 1 : 0),
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 1 }
    ]
  },
  NOT: {
    name: 'NOT',
    symbol: "'",
    expression: "Y = A'",
    description: 'Inverts the single input bit: 0 becomes 1, and 1 becomes 0.',
    nandCount: 1,
    compute: (a) => (a ? 0 : 1),
    truthTable: [
      { a: 0, out: 1 },
      { a: 1, out: 0 }
    ]
  },
  NAND: {
    name: 'NAND',
    symbol: '⊼',
    expression: "Y = (A · B)'",
    description: 'Universal Gate: Output is 0 ONLY if both inputs are 1. Inverted AND.',
    nandCount: 1,
    compute: (a, b) => (!(a && b) ? 1 : 0),
    truthTable: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 0 }
    ]
  },
  NOR: {
    name: 'NOR',
    symbol: '⊽',
    expression: "Y = (A + B)'",
    description: 'Universal Gate: Output is 1 ONLY if both inputs are 0. Inverted OR.',
    nandCount: 4,
    compute: (a, b) => (!(a || b) ? 1 : 0),
    truthTable: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 0 }
    ]
  },
  XOR: {
    name: 'XOR',
    symbol: '⊕',
    expression: 'Y = A ⊕ B',
    description: 'Exclusive OR (Odd Parity): Output is 1 when inputs differ. Key for binary adders.',
    nandCount: 4,
    compute: (a, b) => (a !== b ? 1 : 0),
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 0 }
    ]
  },
  XNOR: {
    name: 'XNOR',
    symbol: '⊙',
    expression: 'Y = (A ⊕ B)′ = A⊙B',
    description: 'Equivalence Gate: Output is 1 when both inputs are identical.',
    nandCount: 5,
    compute: (a, b) => (a === b ? 1 : 0),
    truthTable: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 1 }
    ]
  }
};

export const LogicGateSim: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<GateType>('XOR');
  const [inputA, setInputA] = useState<number>(1);
  const [inputB, setInputB] = useState<number>(0);

  const gate = GATES[selectedGate];
  const output = gate.compute(inputA, inputB);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Sliders className="w-4 h-4" />
          <span>DIGITAL LOGIC & TRUTH TABLE PLAYGROUND</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Logic Gate Sandbox</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Toggle input voltages (0 / 1) and inspect live gate outputs and highlighted truth table rows.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {/* Gate Type Selector */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {(Object.keys(GATES) as GateType[]).map(g => (
              <button
                key={g}
                onClick={() => setSelectedGate(g)}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${
                  selectedGate === g
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Interactive Circuit Canvas */}
          <div className="p-6 bg-slate-900 text-white rounded-xl mb-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6">
              <span>{gate.expression}</span>
              <span>Universal NAND Cost: {gate.nandCount}</span>
            </div>

            <div className="flex items-center justify-center gap-6">
              {/* Inputs */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                  className={`px-4 py-2 rounded-lg font-mono font-bold text-sm border transition-all ${
                    inputA === 1
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Input A: {inputA}
                </button>

                {selectedGate !== 'NOT' && (
                  <button
                    onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                    className={`px-4 py-2 rounded-lg font-mono font-bold text-sm border transition-all ${
                      inputB === 1
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Input B: {inputB}
                  </button>
                )}
              </div>

              {/* Gate Icon Center */}
              <div className="px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center">
                <span className="font-mono text-2xl font-black text-indigo-400">{selectedGate}</span>
                <span className="text-[10px] font-mono text-slate-400">Logic Gate</span>
              </div>

              {/* Output */}
              <div>
                <div className={`px-5 py-3 rounded-xl font-mono font-bold text-lg border transition-all ${
                  output === 1
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  Y = {output}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
              {gate.description}
            </div>
          </div>
        </div>

        {/* Live Truth Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
            {selectedGate} Truth Table
          </h4>
          <div className="border border-slate-200 rounded-lg overflow-hidden font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">Input A</th>
                  {selectedGate !== 'NOT' && <th className="p-3">Input B</th>}
                  <th className="p-3">Output Y</th>
                  <th className="p-3">Active State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gate.truthTable.map((row, idx) => {
                  const isActive = selectedGate === 'NOT'
                    ? row.a === inputA
                    : row.a === inputA && row.b === inputB;

                  return (
                    <tr
                      key={idx}
                      className={isActive ? 'bg-indigo-50/80 font-bold text-indigo-950' : 'text-slate-700'}
                    >
                      <td className="p-3">{row.a}</td>
                      {selectedGate !== 'NOT' && <td className="p-3">{row.b}</td>}
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.out === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {row.out}
                        </span>
                      </td>
                      <td className="p-3">
                        {isActive && (
                          <span className="text-[10px] font-sans font-bold text-indigo-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Current Inputs
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
