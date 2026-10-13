import React, { useState, useEffect } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, Volume2, VolumeX,
  Sparkles, X, ChevronUp, ChevronDown, Bot, Loader2, BookOpen, Lightbulb
} from 'lucide-react';
import { aiVoiceTeacher } from '../services/aiVoiceTeacher';
import { explainLineWithAI } from '../services/geminiTutor';

interface AIVoiceTutorBarProps {
  topicTitle: string;
  onActiveLineChange?: (lineIndex: number, lineText: string) => void;
  className?: string;
}

export const AIVoiceTutorBar: React.FC<AIVoiceTutorBarProps> = ({
  topicTitle,
  onActiveLineChange,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [totalLines, setTotalLines] = useState(0);
  const [currentLineText, setCurrentLineText] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [isExpanded, setIsExpanded] = useState(true);

  // AI Explain line modal state
  const [isExplaining, setIsExplaining] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanationData, setExplanationData] = useState<{
    simpleExplanation: string;
    realWorldAnalogy: string;
    examMemoryTip: string;
  } | null>(null);

  // Available Voices
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  useEffect(() => {
    const unsubscribe = aiVoiceTeacher.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsPaused(state.isPaused);
      setCurrentLineIndex(state.currentLineIndex);
      setTotalLines(state.totalLines);
      setCurrentLineText(state.currentLineText);
      setSpeed(state.speed);
      if (onActiveLineChange) {
        onActiveLineChange(state.currentLineIndex, state.currentLineText);
      }
    });

    // Populate voices
    const timer = setTimeout(() => {
      const v = aiVoiceTeacher.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoiceName) {
        setSelectedVoiceName(v[0].name);
      }
    }, 200);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [onActiveLineChange, selectedVoiceName]);

  const handleTogglePlay = () => {
    if (isPlaying && !isPaused) {
      aiVoiceTeacher.pause();
    } else {
      aiVoiceTeacher.play();
    }
  };

  const handleNext = () => {
    aiVoiceTeacher.nextLine();
  };

  const handlePrevious = () => {
    aiVoiceTeacher.previousLine();
  };

  const handleReplay = () => {
    aiVoiceTeacher.replayCurrentLine();
  };

  const handleSpeedChange = (newSpeed: number) => {
    aiVoiceTeacher.setSpeed(newSpeed);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedVoiceName(val);
    aiVoiceTeacher.setVoice(val);
  };

  const handleExplainCurrentLine = async () => {
    if (!currentLineText) return;
    setIsExplaining(true);
    setIsLoadingExplanation(true);
    // Pause main playback while explaining
    aiVoiceTeacher.pause();

    try {
      const res = await explainLineWithAI(currentLineText, topicTitle);
      setExplanationData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleReadExplanationAloud = () => {
    if (!explanationData) return;
    const textToRead = `${explanationData.simpleExplanation}. For example: ${explanationData.realWorldAnalogy}. Exam tip: ${explanationData.examMemoryTip}`;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(textToRead);
      u.rate = speed;
      window.speechSynthesis.speak(u);
    }
  };

  if (totalLines === 0) {
    return null;
  }

  return (
    <>
      {/* Floating or Inline AI Voice Teacher Bar */}
      <div
        className={`bg-[#070b16] border border-blue-500/40 rounded-2xl shadow-2xl text-white overflow-hidden transition-all duration-300 ${className}`}
      >
        {/* Top Header Strip */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-blue-950/80 via-slate-900 to-[#070b16] border-b border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <Bot className="w-4 h-4" />
              </div>
              {isPlaying && !isPaused && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  <span>AI Voice Teacher</span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono">
                    Line-by-Line
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-blue-200/70 truncate max-w-[200px] sm:max-w-xs">
                {topicTitle}
              </p>
            </div>
          </div>

          {/* Sound Wave Indicator & Collapse Toggle */}
          <div className="flex items-center gap-3">
            {/* Animated Audio Wave Bars when playing */}
            {isPlaying && !isPaused && (
              <div className="flex items-end gap-0.5 h-4 px-2">
                <span className="w-1 bg-blue-400 rounded-full animate-pulse h-2" style={{ animationDuration: '400ms' }} />
                <span className="w-1 bg-blue-300 rounded-full animate-pulse h-4" style={{ animationDuration: '600ms' }} />
                <span className="w-1 bg-blue-500 rounded-full animate-pulse h-3" style={{ animationDuration: '300ms' }} />
                <span className="w-1 bg-blue-200 rounded-full animate-pulse h-4" style={{ animationDuration: '500ms' }} />
              </div>
            )}

            <span className="text-[11px] font-mono font-bold text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
              {currentLineIndex + 1} / {totalLines}
            </span>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isExpanded ? 'Minimize Player' : 'Expand Player'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Player Deck */}
        {isExpanded && (
          <div className="p-4 space-y-3 bg-[#070b16]">
            {/* Real-time Line Display Box with Glowing Indicator */}
            <div className="p-3.5 rounded-xl bg-[#0d1424] border border-blue-500/40 relative group">
              <div className="flex items-center justify-between text-[10px] font-mono text-blue-400 mb-1.5">
                <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Currently Teaching Line {currentLineIndex + 1}:
                </span>
                <span className="text-slate-400">
                  {isPlaying ? (isPaused ? 'Paused' : 'Speaking...') : 'Ready to speak'}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-white leading-relaxed line-clamp-3">
                {currentLineText || 'Select a topic to start line-by-line AI voice instruction.'}
              </p>

              {/* Instant "AI Explain This Line" Trigger */}
              <button
                onClick={handleExplainCurrentLine}
                className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/50 text-[11px] font-semibold transition-all shadow-xs"
                title="Ask AI to simplify and explain this exact line"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Explain This Line in Simple English</span>
              </button>
            </div>

            {/* Progress Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={Math.max(0, totalLines - 1)}
                value={currentLineIndex}
                onChange={(e) => aiVoiceTeacher.jumpToLine(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
                <span>Start</span>
                <span>{Math.round(((currentLineIndex + 1) / totalLines) * 100)}% Completed</span>
                <span>Finish</span>
              </div>
            </div>

            {/* Core Playback Controls (Previous, Play/Pause, Next, Replay, Speed, Voice) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Play / Step Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevious}
                  disabled={currentLineIndex === 0}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white transition-colors disabled:opacity-30 disabled:hover:border-slate-700"
                  title="Previous line"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-600/30"
                  title={isPlaying && !isPaused ? 'Pause' : 'Play lecture'}
                >
                  {isPlaying && !isPaused ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause Voice</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isPaused ? 'Resume Voice' : 'Start AI Teacher'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentLineIndex >= totalLines - 1}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white transition-colors disabled:opacity-30 disabled:hover:border-slate-700"
                  title="Next line"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReplay}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white transition-colors"
                  title="Replay current line"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Presets */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] text-slate-400 font-medium">Speed:</span>
                <div className="inline-flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                  {[0.8, 1.0, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        speed === s
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Selector */}
              {voices.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Volume2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <select
                    value={selectedVoiceName}
                    onChange={handleVoiceChange}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500 max-w-[130px] truncate"
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name.replace(/Google|Microsoft|Apple|Desktop/g, '').trim() || v.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI Deep Dive Explanation Modal */}
      {isExplaining && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090e1a] border border-blue-500/50 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">AI Deep Dive Explanation</h4>
                  <p className="text-[11px] text-blue-300">Teaching Assistant Breakdown</p>
                </div>
              </div>
              <button
                onClick={() => setIsExplaining(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target line quote */}
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs italic text-blue-200">
              "{currentLineText}"
            </div>

            {isLoadingExplanation ? (
              <div className="py-10 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p className="text-xs text-slate-300">
                  AI Professor is analyzing hardware concepts and creating student analogies...
                </p>
              </div>
            ) : explanationData ? (
              <div className="space-y-3 text-xs leading-relaxed">
                {/* 1. Simple breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-400 uppercase tracking-wider text-[10px]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>In Plain English:</span>
                  </div>
                  <p className="text-slate-200">{explanationData.simpleExplanation}</p>
                </div>

                {/* 2. Real world analogy */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Real-World Analogy:</span>
                  </div>
                  <p className="text-slate-200">{explanationData.realWorldAnalogy}</p>
                </div>

                {/* 3. Exam memory hint */}
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                    <span>⚡ Exam Formula & Memory Tip:</span>
                  </div>
                  <p className="text-amber-200">{explanationData.examMemoryTip}</p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleReadExplanationAloud}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen to Explanation</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsExplaining(false);
                      aiVoiceTeacher.play();
                    }}
                    className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Resume Lecture
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};
