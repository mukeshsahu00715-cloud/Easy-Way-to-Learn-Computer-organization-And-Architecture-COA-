import React from 'react';
import { Search, Cpu, BookOpen, Layers, CheckCircle2, ArrowRight, Bot, Sparkles } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExploreChapters: () => void;
  onLaunchSimulator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onExploreChapters,
  onLaunchSimulator
}) => {
  return (
    <section className="bg-gradient-to-b from-[#050811] via-[#080d1c] to-[#050811] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Pitch, Search */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-blue-400 uppercase mb-4 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Smart AI Study Partner for Computer Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Learn COA the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-200">Easy Way.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Simplified chapter notes with <strong className="text-blue-300 font-semibold">AI Voice Teacher reading line by line</strong>, step-by-step CPU datapath simulators, curated video lectures, and high-yield MCQs built to ace your university & GATE exams.
            </p>

            {/* Quick Search */}
            <div className="relative max-w-xl mb-6">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-blue-400" />
              <input
                type="text"
                placeholder="Search chapters, formulas, cache, 2's complement, pipeline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#0b1222] border border-blue-900/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-blue-300 hover:text-white bg-blue-950 border border-blue-800 px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreChapters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/30 border border-blue-400/30"
              >
                <span>Read Chapter Notes & AI Audio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLaunchSimulator}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d1527] hover:bg-[#131f38] text-white border border-blue-500/40 font-bold text-sm rounded-xl transition-all"
              >
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Launch CPU Simulator</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Architectural Board */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-[#080e1d] border border-blue-500/30 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Von Neumann Architecture</h3>
                    <p className="text-xs text-blue-300/70">Stored Program Hardware Concept</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
                  Ready to Study
                </span>
              </div>

              {/* 4 Foundation Pillars */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 bg-[#0c1426] border border-slate-800 rounded-xl hover:border-blue-500/50 transition-colors">
                  <span className="text-[10px] font-mono text-blue-400 block mb-0.5">01 · PROCESSING</span>
                  <strong className="text-sm text-white block">CPU & ALU Datapath</strong>
                  <span className="text-[11px] text-slate-400">Registers, CU, Flags</span>
                </div>

                <div className="p-3 bg-[#0c1426] border border-slate-800 rounded-xl hover:border-blue-500/50 transition-colors">
                  <span className="text-[10px] font-mono text-blue-400 block mb-0.5">02 · STORAGE</span>
                  <strong className="text-sm text-white block">Memory Hierarchy</strong>
                  <span className="text-[11px] text-slate-400">Cache, RAM, AMAT</span>
                </div>

                <div className="p-3 bg-[#0c1426] border border-slate-800 rounded-xl hover:border-blue-500/50 transition-colors">
                  <span className="text-[10px] font-mono text-blue-400 block mb-0.5">03 · LOGIC</span>
                  <strong className="text-sm text-white block">Boolean Circuits</strong>
                  <span className="text-[11px] text-slate-400">Gates, Adders, MUX</span>
                </div>

                <div className="p-3 bg-[#0c1426] border border-slate-800 rounded-xl hover:border-blue-500/50 transition-colors">
                  <span className="text-[10px] font-mono text-blue-400 block mb-0.5">04 · EXECUTION</span>
                  <strong className="text-sm text-white block">Instruction Cycle</strong>
                  <span className="text-[11px] text-slate-400">Fetch, Decode, Execute</span>
                </div>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span>AI Voice Assistant Enabled</span>
                </span>
                <span className="font-semibold text-blue-300">Line-by-Line</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
