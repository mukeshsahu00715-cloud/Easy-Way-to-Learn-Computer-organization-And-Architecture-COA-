import React, { useState } from 'react';
import { Layers, HelpCircle, ArrowRight, Gauge } from 'lucide-react';

export const CacheCalcSim: React.FC = () => {
  const [addrBits, setAddrBits] = useState<number>(32);
  const [cacheSizeKB, setCacheSizeKB] = useState<number>(64);
  const [blockSizeB, setBlockSizeB] = useState<number>(32);
  const [associativity, setAssociativity] = useState<number>(4); // 1 = direct, 2, 4, 8, 0 = fully

  // AMAT state
  const [hitTimeNs, setHitTimeNs] = useState<number>(1.5);
  const [hitRatePct, setHitRatePct] = useState<number>(94);
  const [missPenaltyNs, setMissPenaltyNs] = useState<number>(50);

  // Calculations
  const totalCacheBytes = cacheSizeKB * 1024;
  const offsetBits = Math.log2(blockSizeB);
  const totalLines = totalCacheBytes / blockSizeB;

  let numSets = 1;
  let indexBits = 0;
  let tagBits = 0;

  if (associativity === 0) {
    // Fully associative
    indexBits = 0;
    tagBits = addrBits - offsetBits;
  } else {
    numSets = totalLines / associativity;
    indexBits = Math.log2(numSets);
    tagBits = addrBits - (indexBits + offsetBits);
  }

  // AMAT calculation
  const missRate = (100 - hitRatePct) / 100;
  const amat = hitTimeNs + (missRate * missPenaltyNs);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Layers className="w-4 h-4" />
          <span>CACHE ARCHITECTURE & AMAT CALCULATOR</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Tag, Index & Offset Bit Calculator</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Calculate address bit allocations across Direct, Associative, and Set-Associative mapping, plus average memory latency.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Parameters Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
            Cache Hardware Parameters
          </h4>

          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span>Physical Address Width:</span>
                <span className="font-mono font-bold text-indigo-600">{addrBits} bits</span>
              </div>
              <div className="flex gap-2">
                {[16, 24, 32, 64].map(b => (
                  <button
                    key={b}
                    onClick={() => setAddrBits(b)}
                    className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded border transition-colors ${
                      addrBits === b
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {b}-bit
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span>Total Cache Size:</span>
                <span className="font-mono font-bold text-indigo-600">{cacheSizeKB} KB</span>
              </div>
              <div className="flex gap-2">
                {[8, 16, 32, 64, 256].map(sz => (
                  <button
                    key={sz}
                    onClick={() => setCacheSizeKB(sz)}
                    className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded border transition-colors ${
                      cacheSizeKB === sz
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {sz} KB
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span>Cache Block / Line Size:</span>
                <span className="font-mono font-bold text-indigo-600">{blockSizeB} Bytes</span>
              </div>
              <div className="flex gap-2">
                {[16, 32, 64, 128].map(bl => (
                  <button
                    key={bl}
                    onClick={() => setBlockSizeB(bl)}
                    className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded border transition-colors ${
                      blockSizeB === bl
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {bl} B
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span>Associativity Policy:</span>
                <span className="font-mono font-bold text-indigo-600">
                  {associativity === 1 ? 'Direct Mapped' : associativity === 0 ? 'Fully Associative' : `${associativity}-Way Set-Associative`}
                </span>
              </div>
              <div className="flex gap-2">
                {[
                  { label: 'Direct', val: 1 },
                  { label: '2-Way', val: 2 },
                  { label: '4-Way', val: 4 },
                  { label: '8-Way', val: 8 },
                  { label: 'Fully', val: 0 }
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => setAssociativity(item.val)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors ${
                      associativity === item.val
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Computed Address Division Bar */}
          <div className="p-4 bg-slate-900 text-white rounded-lg">
            <span className="text-xs font-mono text-slate-400 block mb-2">
              Physical Address Breakdown ({addrBits}-bit total)
            </span>

            {/* Visual strip */}
            <div className="flex h-10 rounded overflow-hidden font-mono text-xs font-bold text-center mb-2">
              <div
                style={{ flex: tagBits }}
                className="bg-amber-500 text-amber-950 flex flex-col justify-center items-center px-1"
                title={`Tag: ${tagBits} bits`}
              >
                <span>TAG</span>
                <span className="text-[10px]">{tagBits}b</span>
              </div>

              {indexBits > 0 && (
                <div
                  style={{ flex: indexBits }}
                  className="bg-sky-500 text-sky-950 flex flex-col justify-center items-center px-1 border-l border-r border-slate-900"
                  title={`Set Index: ${indexBits} bits`}
                >
                  <span>SET INDEX</span>
                  <span className="text-[10px]">{indexBits}b</span>
                </div>
              )}

              <div
                style={{ flex: offsetBits }}
                className="bg-emerald-500 text-emerald-950 flex flex-col justify-center items-center px-1"
                title={`Word Offset: ${offsetBits} bits`}
              >
                <span>OFFSET</span>
                <span className="text-[10px]">{offsetBits}b</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-300 space-y-1">
              <p>• Total Cache Lines: <span className="text-indigo-400">{totalLines} lines</span></p>
              {associativity > 0 ? (
                <p>• Number of Sets: <span className="text-sky-400">{numSets} sets</span> (2^{indexBits})</p>
              ) : (
                <p>• Fully associative: 1 set of {totalLines} lines (no index bits)</p>
              )}
              <p>• Comparators required: <span className="text-amber-400">{associativity === 0 ? totalLines : associativity} comparators</span> of {tagBits}-bit width</p>
            </div>
          </div>
        </div>

        {/* AMAT Performance Analyzer */}
        <div className="border-t lg:border-t-0 lg:border-l lg:pl-8 border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-indigo-600" />
            <span>Average Memory Access Time (AMAT)</span>
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            AMAT = Hit Time + (Miss Rate × Miss Penalty). See how small improvements in hit rate drastically accelerate CPU memory access.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span>Cache Hit Time (T_cache):</span>
                <span className="font-mono font-bold text-indigo-600">{hitTimeNs} ns</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5.0}
                step={0.1}
                value={hitTimeNs}
                onChange={(e) => setHitTimeNs(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span>Cache Hit Ratio:</span>
                <span className="font-mono font-bold text-emerald-600">{hitRatePct}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={99}
                step={1}
                value={hitRatePct}
                onChange={(e) => setHitRatePct(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[11px] text-slate-400">Miss Rate = {(100 - hitRatePct)}%</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span>Main Memory Miss Penalty:</span>
                <span className="font-mono font-bold text-rose-600">{missPenaltyNs} ns</span>
              </div>
              <input
                type="range"
                min={20}
                max={150}
                step={5}
                value={missPenaltyNs}
                onChange={(e) => setMissPenaltyNs(parseInt(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>
          </div>

          {/* AMAT Result Card */}
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 rounded-xl text-center">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
              Computed System AMAT
            </span>
            <div className="text-3xl font-extrabold text-indigo-700 font-mono mb-1">
              {amat.toFixed(2)} ns
            </div>
            <p className="text-xs text-slate-600 font-mono">
              = {hitTimeNs} + ({(missRate).toFixed(2)} × {missPenaltyNs})
            </p>

            <div className="mt-4 pt-3 border-t border-indigo-100/80 text-[11px] text-slate-500 text-left">
              <strong>Key takeaway:</strong> Without cache, every access would take <span className="font-semibold text-rose-600">{missPenaltyNs} ns</span>. The cache accelerates memory access by <span className="font-semibold text-emerald-600">{(missPenaltyNs / amat).toFixed(1)}x speedup</span>!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
