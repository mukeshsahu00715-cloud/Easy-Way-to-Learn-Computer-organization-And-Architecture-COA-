import React, { useState } from 'react';
import { CHEATSHEET_DATA } from '../data/coaData';
import { BookOpen, Copy, Check, Table } from 'lucide-react';

export const CheatsheetView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 mb-1">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>LAST-MINUTE EXAM CRAM CHEATSHEET</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Formulas & Quick Comparison Cards
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Essential rules, address formulas, pipeline speedup, and addressing mode reference tables.
        </p>
      </div>

      {/* Grid of formula cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {CHEATSHEET_DATA.map((item, idx) => (
          <div key={idx} className="bg-[#080d1a] border border-blue-900/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-blue-500/60 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  {item.category}
                </span>
                <button
                  onClick={() => handleCopy(item.formula, idx)}
                  className="text-slate-400 hover:text-blue-400 p-1"
                  title="Copy formula"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">{item.topic}</h3>
              <p className="text-xs text-slate-400 mb-3">{item.summary}</p>

              <div className="bg-[#04060d] text-blue-300 border border-blue-900/50 font-mono text-xs p-3 rounded-xl mb-3 break-all">
                {item.formula}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <strong className="text-blue-300">Application:</strong> {item.application}
            </p>
          </div>
        ))}
      </div>

      {/* Master Addressing Modes Comparison Table */}
      <div className="bg-[#070b16] border border-blue-900/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Table className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">
            Master Comparison: All 8 Common Addressing Modes
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0a1020] text-blue-300 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Addressing Mode</th>
                <th className="p-3">Effective Address (EA) Formula</th>
                <th className="p-3">Memory Accesses</th>
                <th className="p-3">Primary Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              <tr className="hover:bg-[#0c1426]">
                <td className="p-3 font-bold text-white">Immediate</td>
                <td className="p-3 font-mono text-blue-300">Operand = Value in instruction</td>
                <td className="p-3 text-emerald-400 font-bold">0 Memory refs</td>
                <td className="p-3 text-slate-300">Loading constants (e.g. MOV R1, #5)</td>
              </tr>
              <tr className="hover:bg-[#0c1426]">
                <td className="p-3 font-bold text-white">Direct (Absolute)</td>
                <td className="p-3 font-mono text-blue-300">EA = Address field A</td>
                <td className="p-3 text-amber-400 font-bold">1 Memory ref</td>
                <td className="p-3 text-slate-300">Accessing global variables</td>
              </tr>
              <tr className="hover:bg-[#0c1426]">
                <td className="p-3 font-bold text-white">Indirect</td>
                <td className="p-3 font-mono text-blue-300">EA = M[A]</td>
                <td className="p-3 text-rose-400 font-bold">2 Memory refs</td>
                <td className="p-3 text-slate-300">Pointer dereferencing (*ptr)</td>
              </tr>
              <tr className="hover:bg-[#0c1426]">
                <td className="p-3 font-bold text-white">Register Direct</td>
                <td className="p-3 font-mono text-blue-300">EA = Register R</td>
                <td className="p-3 text-emerald-400 font-bold">0 Memory refs</td>
                <td className="p-3 text-slate-300">High-speed register operations</td>
              </tr>
              <tr className="hover:bg-[#0c1426]">
                <td className="p-3 font-bold text-white">Register Indirect</td>
                <td className="p-3 font-mono text-blue-300">EA = [R]</td>
                <td className="p-3 text-amber-400 font-bold">1 Memory ref</td>
                <td className="p-3 text-slate-300">Pointer stored inside register</td>
              </tr>
              <tr className="hover:bg-[#0c1426]">
                <td className="p-3 font-bold text-white">Relative (PC-Relative)</td>
                <td className="p-3 font-mono text-blue-300">EA = PC + Offset</td>
                <td className="p-3 text-amber-400 font-bold">1 Memory ref</td>
                <td className="p-3 text-slate-300">Branching & position-independent code</td>
              </tr>
              <tr className="hover:bg-[#0c1426]">
                <td className="p-3 font-bold text-white">Indexed</td>
                <td className="p-3 font-mono text-blue-300">EA = Base + Index Reg</td>
                <td className="p-3 text-amber-400 font-bold">1 Memory ref</td>
                <td className="p-3 text-slate-300">Array traversals (arr[i])</td>
              </tr>
              <tr className="hover:bg-[#0c1426]">
                <td className="p-3 font-bold text-white">Base-Register</td>
                <td className="p-3 font-mono text-blue-300">EA = Base Reg + Displacement</td>
                <td className="p-3 text-amber-400 font-bold">1 Memory ref</td>
                <td className="p-3 text-slate-300">Relocatable code & struct field offsets</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
