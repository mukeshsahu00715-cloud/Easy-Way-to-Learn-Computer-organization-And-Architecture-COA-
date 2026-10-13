import React, { useState } from 'react';
import { Binary, Calculator, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const NumberSystemSim: React.FC = () => {
  const [decInput, setDecInput] = useState<number>(-13);
  const [addA, setAddA] = useState<number>(75);
  const [addB, setAddB] = useState<number>(65);

  // Conversions for 8-bit signed range [-128, 127]
  const clampedVal = Math.max(-128, Math.min(127, isNaN(decInput) ? 0 : decInput));
  
  // 8-bit 2's complement binary representation
  const to8BitBinary = (val: number): string => {
    let unsigned = val < 0 ? (256 + val) : val;
    return (unsigned >>> 0).toString(2).padStart(8, '0');
  };

  const binaryStr = to8BitBinary(clampedVal);
  const hexStr = (clampedVal < 0 ? (256 + clampedVal) : clampedVal).toString(16).toUpperCase().padStart(2, '0');
  const octalStr = (clampedVal < 0 ? (256 + clampedVal) : clampedVal).toString(8).padStart(3, '0');

  // Positive magnitude bits (for complement explanation)
  const absVal = Math.abs(clampedVal);
  const absBinary = (absVal >>> 0).toString(2).padStart(8, '0');
  const onesComp = absBinary.split('').map(b => b === '0' ? '1' : '0').join('');

  // Addition & Overflow Simulation
  const sum = addA + addB;
  const isOverflow = (addA > 0 && addB > 0 && sum > 127) || (addA < 0 && addB < 0 && sum < -128);
  const binA = to8BitBinary(Math.max(-128, Math.min(127, addA)));
  const binB = to8BitBinary(Math.max(-128, Math.min(127, addB)));
  const binSum = to8BitBinary(sum & 0xFF);

  return (
    <div className="bg-[#070b16] border border-blue-900/50 rounded-2xl overflow-hidden shadow-2xl text-white">
      <div className="p-5 border-b border-slate-800 bg-[#0a1020]">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
          <Binary className="w-4 h-4" />
          <span>RADIX & 2'S COMPLEMENT CONVERTER</span>
        </div>
        <h3 className="text-xl font-bold text-white">Signed Binary & Overflow Explorer</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Type any decimal integer to see instant 8-bit 2's complement breakdown, bit flags, and ALU overflow detection.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Converter Section */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
            Decimal Input (-128 to +127)
          </label>
          <div className="flex items-center gap-3 mb-6">
            <input
              type="number"
              min={-128}
              max={127}
              value={decInput}
              onChange={(e) => setDecInput(parseInt(e.target.value) || 0)}
              className="px-4 py-2 text-base font-mono font-bold bg-[#0c1426] border border-blue-900/60 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
            />
            <div className="flex flex-wrap gap-1.5">
              {[-128, -42, -13, 0, 13, 64, 127].map((num) => (
                <button
                  key={num}
                  onClick={() => setDecInput(num)}
                  className="px-2 py-1 text-[11px] font-mono bg-[#0f172a] hover:bg-blue-600 hover:text-white text-slate-300 rounded-lg transition-colors border border-slate-800"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Radix Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 bg-[#0a1020] border border-blue-900/40 rounded-xl text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Decimal</span>
              <span className="font-mono text-base font-bold text-white">{clampedVal}</span>
            </div>
            <div className="p-3 bg-blue-950/60 border border-blue-500/50 rounded-xl text-center">
              <span className="text-[10px] font-mono uppercase text-blue-300 block mb-1">2's Comp Binary</span>
              <span className="font-mono text-sm font-bold text-blue-300">{binaryStr}</span>
            </div>
            <div className="p-3 bg-[#0a1020] border border-blue-900/40 rounded-xl text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Hexadecimal</span>
              <span className="font-mono text-base font-bold text-white">0x{hexStr}</span>
            </div>
            <div className="p-3 bg-[#0a1020] border border-blue-900/40 rounded-xl text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Octal</span>
              <span className="font-mono text-base font-bold text-white">{octalStr}₈</span>
            </div>
          </div>

          {/* Bit-by-bit breakdown */}
          <div className="p-4 bg-[#050811] text-white rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
              <span>8-Bit Register Cells</span>
              <span>MSB (Sign) → LSB</span>
            </div>
            <div className="grid grid-cols-8 gap-1 text-center font-mono text-sm mb-3">
              {binaryStr.split('').map((bit, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[9px] text-slate-500 mb-1">b{7 - idx}</span>
                  <div className={`w-full py-2 rounded font-bold ${
                    idx === 0
                      ? bit === '1' ? 'bg-rose-950 text-rose-300 border border-rose-600' : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                      : 'bg-[#0a1020] text-slate-200 border border-slate-800'
                  }`}>
                    {bit}
                  </div>
                  <span className="text-[8px] text-slate-500 mt-1">
                    {idx === 0 ? '-128' : Math.pow(2, 7 - idx)}
                  </span>
                </div>
              ))}
            </div>

            {/* Explanation steps */}
            {clampedVal < 0 ? (
              <div className="text-[11px] font-mono text-slate-300 space-y-1 pt-2 border-t border-slate-800">
                <p>1. Positive magnitude (+{absVal}): <span className="text-amber-300">{absBinary}</span></p>
                <p>2. Flip bits (1's complement): <span className="text-amber-300">{onesComp}</span></p>
                <p>3. Add 1 (2's complement): <span className="text-emerald-300">{onesComp} + 1 = {binaryStr}</span></p>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800">
                Positive number: MSB is 0 (Sign bit). Direct binary representation.
              </div>
            )}
          </div>
        </div>

        {/* ALU Signed Overflow Detector Sandbox */}
        <div className="border-t lg:border-t-0 lg:border-l lg:pl-8 border-slate-800">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
            ALU 8-bit Addition & Overflow Detector
          </label>
          <p className="text-xs text-slate-400 mb-4">
            Try adding two large positive numbers (e.g. 70 + 60 = 130) to see signed integer overflow happen in real time!
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Operand A (-128 to 127)</span>
              <input
                type="number"
                value={addA}
                onChange={(e) => setAddA(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-sm font-mono bg-[#0c1426] border border-blue-900/60 text-white rounded-lg"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Operand B (-128 to 127)</span>
              <input
                type="number"
                value={addB}
                onChange={(e) => setAddB(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-sm font-mono bg-[#0c1426] border border-blue-900/60 text-white rounded-lg"
              />
            </div>
          </div>

          <div className="p-4 bg-[#0a1020] border border-blue-900/40 rounded-xl space-y-2 font-mono text-xs mb-4">
            <div className="flex justify-between text-slate-300">
              <span>Operand A ({addA}):</span>
              <span>{binA}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Operand B ({addB}):</span>
              <span>+ {binB}</span>
            </div>
            <div className="border-t border-slate-700 pt-1 flex justify-between font-bold text-white">
              <span>ALU Register Result ({((addA + addB) << 24) >> 24}):</span>
              <span className="text-blue-300">{binSum}</span>
            </div>
          </div>

          {/* Overflow Status Card */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isOverflow
              ? 'bg-rose-950/70 border-rose-500/60 text-rose-200'
              : 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
          }`}>
            {isOverflow ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-xs uppercase tracking-wider">
                {isOverflow ? 'ALU Overflow Detected (V = 1)' : 'No Overflow (V = 0) - Valid Result'}
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {isOverflow
                  ? `Mathematical sum ${sum} exceeds 8-bit signed range [-128, +127]. Notice the MSB flipped sign unexpectedly! The CPU sets Overflow Flag V=1.`
                  : `Mathematical sum ${sum} is within safe range [-128, +127]. The result in the accumulator is mathematically correct.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
