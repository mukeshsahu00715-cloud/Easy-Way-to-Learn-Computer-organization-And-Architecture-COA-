import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Cpu, ArrowRight, Info } from 'lucide-react';

interface InstructionPreset {
  name: string;
  code: string;
  steps: {
    stage: string;
    stageName: 'Fetch' | 'Decode' | 'Execute' | 'Store';
    microOp: string;
    activeBus: 'addr' | 'data' | 'control' | 'alu' | 'none';
    highlightReg: 'pc' | 'mar' | 'mdr' | 'ir' | 'ac' | 'ram';
    registers: { pc: string; mar: string; mdr: string; ir: string; ac: string; r1: string; r2: string };
    memoryState: { addr: string; val: string };
    explanation: string;
  }[];
}

const PRESETS: InstructionPreset[] = [
  {
    name: "LOAD R1, [100]",
    code: "Load value from RAM address 100 into Register R1",
    steps: [
      {
        stage: "T0: Address to Bus",
        stageName: "Fetch",
        microOp: "MAR ← PC",
        activeBus: "addr",
        highlightReg: "mar",
        registers: { pc: "0x004", mar: "0x004", mdr: "--", ir: "--", ac: "0", r1: "0", r2: "15" },
        memoryState: { addr: "0x004", val: "LOAD R1, [100]" },
        explanation: "The Program Counter (PC = 0x004) points to the next instruction in memory. Its value is copied to the Memory Address Register (MAR) via the internal address bus."
      },
      {
        stage: "T1: Memory Read & Increment",
        stageName: "Fetch",
        microOp: "MDR ← M[MAR], PC ← PC + 1",
        activeBus: "data",
        highlightReg: "mdr",
        registers: { pc: "0x005", mar: "0x004", mdr: "LOAD R1, [100]", ir: "--", ac: "0", r1: "0", r2: "15" },
        memoryState: { addr: "0x004", val: "LOAD R1, [100]" },
        explanation: "Control Unit asserts Memory Read. The instruction word is pulled over the data bus into MDR. Simultaneously, PC increments to 0x005 to prepare for the next instruction."
      },
      {
        stage: "T2: Instruction to IR",
        stageName: "Fetch",
        microOp: "IR ← MDR",
        activeBus: "control",
        highlightReg: "ir",
        registers: { pc: "0x005", mar: "0x004", mdr: "LOAD R1, [100]", ir: "LOAD R1, [100]", ac: "0", r1: "0", r2: "15" },
        memoryState: { addr: "0x004", val: "LOAD R1, [100]" },
        explanation: "The instruction moves from MDR into the Instruction Register (IR). Fetch phase is complete!"
      },
      {
        stage: "T3: Decode Opcode",
        stageName: "Decode",
        microOp: "Decode IR[15..12], EA = 100",
        activeBus: "control",
        highlightReg: "ir",
        registers: { pc: "0x005", mar: "0x004", mdr: "LOAD R1, [100]", ir: "LOAD R1, [100]", ac: "0", r1: "0", r2: "15" },
        memoryState: { addr: "100", val: "42" },
        explanation: "The Control Unit decodes the opcode (LOAD). It identifies target register R1 and operand memory address 100."
      },
      {
        stage: "T4: Operand Memory Access",
        stageName: "Execute",
        microOp: "MAR ← 100, MDR ← M[MAR]",
        activeBus: "data",
        highlightReg: "ram",
        registers: { pc: "0x005", mar: "100", mdr: "42", ir: "LOAD R1, [100]", ac: "0", r1: "0", r2: "15" },
        memoryState: { addr: "100", val: "42" },
        explanation: "MAR receives effective address 100. Memory read retrieves data value 42 into the MDR over the data bus."
      },
      {
        stage: "T5: Store to Register R1",
        stageName: "Store",
        microOp: "R1 ← MDR",
        activeBus: "alu",
        highlightReg: "ac",
        registers: { pc: "0x005", mar: "100", mdr: "42", ir: "LOAD R1, [100]", ac: "0", r1: "42", r2: "15" },
        memoryState: { addr: "100", val: "42" },
        explanation: "The data value 42 is latched into general-purpose register R1. Instruction execution is finished!"
      }
    ]
  },
  {
    name: "ADD R1, R2",
    code: "Add Register R2 to Register R1 (ALU addition)",
    steps: [
      {
        stage: "T0: Address to Bus",
        stageName: "Fetch",
        microOp: "MAR ← PC",
        activeBus: "addr",
        highlightReg: "mar",
        registers: { pc: "0x010", mar: "0x010", mdr: "--", ir: "--", ac: "0", r1: "18", r2: "24" },
        memoryState: { addr: "0x010", val: "ADD R1, R2" },
        explanation: "PC holds 0x010. MAR is loaded with 0x010 onto the address bus."
      },
      {
        stage: "T1: Memory Read & Increment",
        stageName: "Fetch",
        microOp: "MDR ← M[MAR], PC ← PC + 1",
        activeBus: "data",
        highlightReg: "mdr",
        registers: { pc: "0x011", mar: "0x010", mdr: "ADD R1, R2", ir: "--", ac: "0", r1: "18", r2: "24" },
        memoryState: { addr: "0x010", val: "ADD R1, R2" },
        explanation: "MDR reads 'ADD R1, R2' from RAM. PC increments to 0x011."
      },
      {
        stage: "T2: Instruction to IR",
        stageName: "Fetch",
        microOp: "IR ← MDR",
        activeBus: "control",
        highlightReg: "ir",
        registers: { pc: "0x011", mar: "0x010", mdr: "ADD R1, R2", ir: "ADD R1, R2", ac: "0", r1: "18", r2: "24" },
        memoryState: { addr: "0x010", val: "ADD R1, R2" },
        explanation: "Instruction moves into IR. Control Unit decodes arithmetic ADD instruction."
      },
      {
        stage: "T3: ALU Arithmetic Execute",
        stageName: "Execute",
        microOp: "ALU_OUT ← R1 + R2 (18 + 24)",
        activeBus: "alu",
        highlightReg: "ac",
        registers: { pc: "0x011", mar: "0x010", mdr: "ADD R1, R2", ir: "ADD R1, R2", ac: "42", r1: "18", r2: "24" },
        memoryState: { addr: "0x010", val: "ADD R1, R2" },
        explanation: "The ALU receives operands R1 (18) and R2 (24). 2's complement adder computes 18 + 24 = 42. Zero and Carry flags evaluated."
      },
      {
        stage: "T4: Writeback Result to R1",
        stageName: "Store",
        microOp: "R1 ← ALU_OUT (42)",
        activeBus: "alu",
        highlightReg: "ac",
        registers: { pc: "0x011", mar: "0x010", mdr: "ADD R1, R2", ir: "ADD R1, R2", ac: "42", r1: "42", r2: "24" },
        memoryState: { addr: "0x010", val: "ADD R1, R2" },
        explanation: "Sum 42 is written back into destination register R1. Operation successfully complete in 0 memory operands accesses!"
      }
    ]
  }
];

export const InstructionCycleSim: React.FC = () => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentPreset = PRESETS[selectedPresetIndex];
  const step = currentPreset.steps[currentStepIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= currentPreset.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentPreset.steps.length]);

  const handleNext = () => {
    if (currentStepIndex < currentPreset.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Fetch': return 'text-sky-600 bg-sky-50 border-sky-200';
      case 'Decode': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Execute': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'Store': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-[#070b16] border border-blue-900/50 rounded-2xl overflow-hidden shadow-2xl text-white">
      {/* Simulation Header */}
      <div className="p-5 border-b border-slate-800 bg-[#0a1020] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Cpu className="w-4 h-4" />
            <span>INTERACTIVE CPU DATAPATH SIMULATOR</span>
          </div>
          <h3 className="text-xl font-bold text-white">{currentPreset.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{currentPreset.code}</p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Program:</span>
          <div className="flex bg-[#0f172a] border border-slate-800 p-0.5 rounded-xl">
            {PRESETS.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => handleSelectPreset(idx)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  selectedPresetIndex === idx
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sandbox Controls */}
      <div className="px-5 py-3 border-b border-slate-800 bg-[#080d1a] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors shadow-xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 bg-[#0f172a] border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            ← Prev
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === currentPreset.steps.length - 1}
            className="px-3 py-1.5 bg-[#0f172a] border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            Next Step →
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Phase Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono">
            Step {currentStepIndex + 1} of {currentPreset.steps.length}
          </span>
          <span className={`px-2.5 py-1 rounded-md font-semibold border ${getStageColor(step.stageName)}`}>
            {step.stageName} Phase
          </span>
        </div>
      </div>

      {/* Interactive Datapath Visualizer */}
      <div className="p-6 bg-slate-900 text-white">
        {/* Active Micro-operation banner */}
        <div className="flex items-center justify-between mb-6 p-3 bg-slate-800/90 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              {step.stage}
            </span>
            <span className="font-mono text-sm font-bold text-amber-300 tracking-wide">
              {step.microOp}
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Bus: {step.activeBus.toUpperCase()}</span>
          </div>
        </div>

        {/* Architectural Register Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {/* PC */}
          <div className={`p-3 rounded-lg border transition-all ${
            step.highlightReg === 'pc'
              ? 'bg-sky-950/80 border-sky-400 shadow-md shadow-sky-500/20'
              : 'bg-slate-800/60 border-slate-700'
          }`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">PC (Program Counter)</span>
            <span className="font-mono text-base font-bold text-sky-300 block">{step.registers.pc}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Next instruction address</span>
          </div>

          {/* MAR */}
          <div className={`p-3 rounded-lg border transition-all ${
            step.highlightReg === 'mar'
              ? 'bg-amber-950/80 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-slate-800/60 border-slate-700'
          }`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">MAR (Address Reg)</span>
            <span className="font-mono text-base font-bold text-amber-300 block">{step.registers.mar}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Address bus link</span>
          </div>

          {/* MDR */}
          <div className={`p-3 rounded-lg border transition-all ${
            step.highlightReg === 'mdr'
              ? 'bg-indigo-950/80 border-indigo-400 shadow-md shadow-indigo-500/20'
              : 'bg-slate-800/60 border-slate-700'
          }`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">MDR / MBR (Data Reg)</span>
            <span className="font-mono text-sm font-bold text-indigo-300 block truncate">{step.registers.mdr}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Data bus link</span>
          </div>

          {/* IR */}
          <div className={`p-3 rounded-lg border transition-all ${
            step.highlightReg === 'ir'
              ? 'bg-purple-950/80 border-purple-400 shadow-md shadow-purple-500/20'
              : 'bg-slate-800/60 border-slate-700'
          }`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">IR (Instruction)</span>
            <span className="font-mono text-xs font-bold text-purple-300 block truncate">{step.registers.ir}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Feeds Control Unit</span>
          </div>

          {/* R1 */}
          <div className={`p-3 rounded-lg border transition-all ${
            step.highlightReg === 'ac'
              ? 'bg-emerald-950/80 border-emerald-400 shadow-md shadow-emerald-500/20'
              : 'bg-slate-800/60 border-slate-700'
          }`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Register R1</span>
            <span className="font-mono text-base font-bold text-emerald-300 block">{step.registers.r1}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">General Register</span>
          </div>

          {/* R2 */}
          <div className="p-3 rounded-lg border bg-slate-800/60 border-slate-700">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Register R2</span>
            <span className="font-mono text-base font-bold text-slate-300 block">{step.registers.r2}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">General Register</span>
          </div>
        </div>

        {/* Memory & Bus Visual Representation */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-300">
              RAM
            </div>
            <div>
              <span className="text-xs font-mono text-slate-400 block">System Memory Cell</span>
              <span className="font-mono text-xs text-white">
                Addr: <strong className="text-amber-400">{step.memoryState.addr}</strong> → Value: <strong className="text-emerald-400">{step.memoryState.val}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-2 rounded-md border border-slate-800">
            <span>Control Lines:</span>
            <span className="text-emerald-400 font-semibold">{step.stageName === 'Fetch' || step.stageName === 'Execute' ? 'READ_ENABLE' : 'IDLE'}</span>
            <span>·</span>
            <span>ALU Mode:</span>
            <span className="text-indigo-400 font-semibold">{currentPreset.name.startsWith('ADD') && step.stageName === 'Execute' ? 'ADD_2s_COMP' : 'PASS'}</span>
          </div>
        </div>
      </div>

      {/* Step Explanation Callout */}
      <div className="p-5 bg-white border-t border-slate-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Step Details & Micro-operation Action</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{step.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
