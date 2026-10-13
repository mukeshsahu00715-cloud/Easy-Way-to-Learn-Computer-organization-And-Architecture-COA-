import React, { useState, useEffect, useMemo, useRef } from 'react';
import { COA_CHAPTERS, Chapter } from '../data/coaData';
import {
  BookOpen, CheckCircle, Clock, Copy, Check, Video, Cpu, ArrowRight, Lightbulb,
  Star, HelpCircle, Volume2, Bot, Sparkles, Play
} from 'lucide-react';
import {
  getFavoriteChapters,
  isChapterFavorited,
  toggleFavoriteChapter,
  getCompletedChapters,
  toggleCompletedChapter
} from '../utils/studyStorage';
import { AIVoiceTutorBar } from './AIVoiceTutorBar';
import { aiVoiceTeacher } from '../services/aiVoiceTeacher';

interface NotesViewProps {
  selectedChapterId: string;
  setSelectedChapterId: (id: string) => void;
  onNavigateToSimulators: () => void;
  onNavigateToVideos: () => void;
  onNavigateToChapterQuiz?: (chapterId: string) => void;
  onFavoritesChanged?: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  selectedChapterId,
  setSelectedChapterId,
  onNavigateToSimulators,
  onNavigateToVideos,
  onNavigateToChapterQuiz,
  onFavoritesChanged
}) => {
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => getCompletedChapters());
  const [favoriteChaptersList, setFavoriteChaptersList] = useState<string[]>(() =>
    getFavoriteChapters().map(f => f.id)
  );
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  const [activeSpeakingLineText, setActiveSpeakingLineText] = useState<string>('');

  const chapter = COA_CHAPTERS.find(c => c.id === selectedChapterId) || COA_CHAPTERS[0];
  const isCompleted = completedChapters.includes(chapter.id);
  const isFavorited = favoriteChaptersList.includes(chapter.id);

  const currentChapterIndex = COA_CHAPTERS.findIndex(c => c.id === chapter.id);
  const prevChapter = currentChapterIndex > 0 ? COA_CHAPTERS[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < COA_CHAPTERS.length - 1 ? COA_CHAPTERS[currentChapterIndex + 1] : null;

  // Prepare line-by-line script for AI Voice Teacher
  const teachableLines = useMemo(() => {
    const lines: string[] = [];
    lines.push(`Welcome to Chapter ${chapter.number}: ${chapter.title}. ${chapter.tagline}.`);
    lines.push(chapter.summary);

    chapter.content.forEach((sec) => {
      lines.push(`${sec.sectionTitle}: ${sec.description}`);
      sec.subsections.forEach((sub) => {
        lines.push(`Regarding ${sub.heading}:`);
        sub.points.forEach((pt) => {
          lines.push(pt);
        });
      });
    });

    lines.push(`Let's study the solved university exam numerical: ${chapter.solvedExample.question}`);
    chapter.solvedExample.stepByStep.forEach((step) => {
      lines.push(step);
    });
    lines.push(`The final result is ${chapter.solvedExample.finalAnswer}.`);

    lines.push(`High-yield exam pointers for this chapter:`);
    chapter.examPointers.forEach((tip) => {
      lines.push(tip);
    });

    return lines;
  }, [chapter]);

  // Load lesson into AI voice teacher when chapter changes
  useEffect(() => {
    aiVoiceTeacher.loadLesson(teachableLines);
  }, [teachableLines]);

  const handleToggleCompleted = (chapterId: string) => {
    toggleCompletedChapter(chapterId);
    setCompletedChapters(getCompletedChapters());
    onFavoritesChanged?.();
  };

  const handleToggleFavorite = (chapterId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    toggleFavoriteChapter(chapterId);
    setFavoriteChaptersList(getFavoriteChapters().map(f => f.id));
    onFavoritesChanged?.();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleGoToChapter = (id: string) => {
    setSelectedChapterId(id);
    const viewer = document.getElementById('chapter-content-viewer');
    if (viewer) {
      viewer.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  // Jump voice teacher to a specific clicked sentence/point
  const handleTeachSpecificLine = (lineContent: string) => {
    const allLines = aiVoiceTeacher.getLines();
    const idx = allLines.findIndex(l => l.includes(lineContent.slice(0, 30)));
    if (idx !== -1) {
      aiVoiceTeacher.jumpToLine(idx);
      aiVoiceTeacher.play();
    } else {
      // If not directly found, load and play this line
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(lineContent);
      window.speechSynthesis.speak(u);
    }
  };

  const isLineCurrentlySpoken = (text: string) => {
    if (!activeSpeakingLineText) return false;
    return text.includes(activeSpeakingLineText.slice(0, 25)) || activeSpeakingLineText.includes(text.slice(0, 25));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
      {/* Chapter Selection Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Curated COA Chapters</h2>
            <p className="text-sm text-slate-400">
              Select a chapter below. Listen to the AI Agent voice teach line by line or study the written notes.
            </p>
          </div>
          <span className="text-xs font-mono text-blue-400 bg-blue-950/80 px-3 py-1.5 rounded-xl border border-blue-800/60 font-semibold shadow-xs">
            Progress: {completedChapters.length} / {COA_CHAPTERS.length} Completed
          </span>
        </div>

        {/* Chapter Cards in Dark Black + Blue & White Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COA_CHAPTERS.map((c) => {
            const isSelected = c.id === chapter.id;
            const done = completedChapters.includes(c.id);
            const isFav = favoriteChaptersList.includes(c.id);

            return (
              <div
                key={c.id}
                onClick={() => setSelectedChapterId(c.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#0c1426] border-blue-500 shadow-xl ring-2 ring-blue-500/30'
                    : 'bg-[#080d1a] border-slate-800/80 hover:border-blue-500/60 hover:bg-[#0c1426] shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                    Ch {c.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleFavorite(c.id, e)}
                      className={`p-1 rounded transition-colors ${
                        isFav ? 'text-amber-400 hover:text-amber-300' : 'text-slate-500 hover:text-amber-400'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {c.readTime}
                    </span>
                    {done && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>

                <h3 className="font-bold text-white text-base mb-1.5 line-clamp-1">{c.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">{c.summary}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400">{c.category}</span>
                  <span className="font-bold text-blue-400 flex items-center gap-1">
                    {isSelected ? 'Reading Now' : 'Open Notes & Audio →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter-Wise Sequential Learning Path Stepper */}
      <div className="mb-8 p-5 bg-[#070b16] border border-blue-900/40 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
              STEP-BY-STEP SYLLABUS
            </span>
            <h3 className="text-sm font-bold text-white">
              Chapter-Wise Study Progression
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-mono">
              Current: <strong className="text-white">Chapter {currentChapterIndex + 1} of {COA_CHAPTERS.length}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 font-mono font-semibold border border-emerald-700/60">
              {completedChapters.length} / {COA_CHAPTERS.length} Completed
            </span>
          </div>
        </div>

        {/* Stepper Cards Track */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {COA_CHAPTERS.map((ch, idx) => {
            const isCur = ch.id === chapter.id;
            const isDone = completedChapters.includes(ch.id);

            return (
              <button
                key={ch.id}
                onClick={() => handleGoToChapter(ch.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isCur
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-500/30'
                    : isDone
                    ? 'bg-[#09161a] text-emerald-200 border-emerald-800/60 hover:bg-[#0c2127]'
                    : 'bg-[#080e1b] text-slate-300 border-slate-800 hover:bg-[#0f172a]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className={isCur ? 'text-blue-100 font-bold' : 'text-slate-400 font-bold'}>
                    0{idx + 1}
                  </span>
                  {isDone && (
                    <CheckCircle className={`w-3.5 h-3.5 ${isCur ? 'text-white' : 'text-emerald-400'}`} />
                  )}
                </div>
                <p className="text-xs font-bold truncate leading-tight mb-1">{ch.title}</p>
                <span className={`text-[10px] block ${isCur ? 'text-blue-100 font-medium' : 'text-slate-400'}`}>
                  {isCur ? 'Active Chapter' : isDone ? 'Finished' : 'Upcoming'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chapter Content Viewer (Dark Black Canvas) */}
      <div id="chapter-content-viewer" className="bg-[#070b16] border border-blue-900/50 rounded-2xl p-6 sm:p-10 shadow-2xl">
        {/* Header Strip */}
        <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400 mb-1">
              <span>CHAPTER {chapter.number}</span>
              <span>·</span>
              <span>{chapter.category.toUpperCase()}</span>
              <span>·</span>
              <span>{chapter.readTime} READ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {chapter.title}
            </h1>
            <p className="text-sm text-slate-300 mt-1">{chapter.tagline}</p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleToggleFavorite(chapter.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isFavorited
                  ? 'bg-amber-950/70 border-amber-400 text-amber-300'
                  : 'bg-[#0c1426] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
              title="Save Chapter to Favorites"
            >
              <Star className={`w-4 h-4 ${isFavorited ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span>{isFavorited ? 'Favorited' : 'Save Favorite'}</span>
            </button>

            <button
              onClick={() => handleToggleCompleted(chapter.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isCompleted
                  ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300'
                  : 'bg-[#0c1426] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
            </button>

            <button
              onClick={onNavigateToVideos}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 border border-blue-400/30"
            >
              <Video className="w-4 h-4" />
              <span>Watch Video</span>
            </button>
          </div>
        </div>

        {/* AI VOICE TEACHER CONTROLLER BAR (Interactive Line-by-Line Audio) */}
        <div className="mb-8">
          <AIVoiceTutorBar
            topicTitle={`Chapter ${chapter.number}: ${chapter.title}`}
            onActiveLineChange={(_idx, text) => setActiveSpeakingLineText(text)}
          />
        </div>

        {/* Key Formulas Strip in Blue & White Design */}
        {chapter.keyFormulas.length > 0 && (
          <div className="mb-10 p-5 bg-[#0a1020] border border-blue-900/50 rounded-2xl shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Essential Formulas & Rules</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {chapter.keyFormulas.map((f, idx) => (
                <div key={idx} className="p-3.5 bg-[#050811] border border-blue-900/40 rounded-xl hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                    <span>{f.name}</span>
                    <button
                      onClick={() => handleCopy(f.formula, `${chapter.id}-f-${idx}`)}
                      className="text-slate-400 hover:text-blue-400 p-1 rounded"
                      title="Copy formula"
                    >
                      {copiedFormula === `${chapter.id}-f-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs font-bold text-blue-300 bg-blue-950/60 p-2.5 rounded-lg mb-1.5 overflow-x-auto border border-blue-800/40">
                    {f.formula}
                  </div>
                  <p className="text-[11px] text-slate-400">{f.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Sections with Synchronized Line-by-Line Highlighting */}
        <div className="space-y-8 mb-10">
          {chapter.content.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <h2 className="text-xl font-bold text-white pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>{sec.sectionTitle}</span>
                <button
                  onClick={() => handleTeachSpecificLine(sec.description)}
                  className="text-xs text-blue-400 hover:text-white font-normal flex items-center gap-1 opacity-70 hover:opacity-100"
                  title="Teach section with AI Voice"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </h2>
              <p className={`text-sm text-slate-300 leading-relaxed ${isLineCurrentlySpoken(sec.description) ? 'ai-voice-active-line font-medium text-white' : ''}`}>
                {sec.description}
              </p>

              <div className="space-y-4">
                {sec.subsections.map((sub, subIdx) => (
                  <div key={subIdx} className="p-4 bg-[#0a1020] border border-blue-900/40 rounded-xl">
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
                      <span>{sub.heading}</span>
                    </h3>
                    <ul className="space-y-2.5 mb-3">
                      {sub.points.map((pt, pIdx) => {
                        const isSpeaking = isLineCurrentlySpoken(pt);
                        return (
                          <li
                            key={pIdx}
                            className={`text-xs text-slate-300 leading-relaxed flex items-start gap-2.5 p-1 rounded-lg transition-colors group ${
                              isSpeaking
                                ? 'ai-voice-active-line text-white bg-blue-950/70 border-l-4 border-blue-400'
                                : 'hover:bg-slate-900/40'
                            }`}
                          >
                            <button
                              onClick={() => handleTeachSpecificLine(pt)}
                              className={`shrink-0 mt-0.5 p-1 rounded hover:bg-blue-600 hover:text-white transition-colors ${
                                isSpeaking ? 'text-blue-400' : 'text-slate-500 opacity-60 group-hover:opacity-100'
                              }`}
                              title="Listen to this line with AI Voice"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="flex-1">{pt}</span>
                          </li>
                        );
                      })}
                    </ul>

                    {sub.codeOrFormula && (
                      <div className="font-mono text-xs bg-[#04060c] border border-blue-900/50 text-blue-300 p-3.5 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {sub.codeOrFormula}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Solved Numerical Problem Card (Dark Black & Blue) */}
        <div className="mb-10 p-6 bg-[#091122] border border-blue-900/60 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Solved University Numerical Problem</span>
            </div>
            <button
              onClick={() => handleTeachSpecificLine(chapter.solvedExample.question)}
              className="text-xs text-blue-400 hover:text-white flex items-center gap-1 font-semibold"
              title="Teach numerical problem with AI Voice"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen Working</span>
            </button>
          </div>

          <h3 className="text-sm font-bold text-white mb-3">
            {chapter.solvedExample.question}
          </h3>

          <div className="space-y-2 mb-4 bg-[#050811] p-4 rounded-xl border border-blue-900/40 font-mono text-xs">
            {chapter.solvedExample.stepByStep.map((step, idx) => (
              <p
                key={idx}
                className={`text-slate-300 leading-relaxed ${isLineCurrentlySpoken(step) ? 'text-blue-300 font-bold bg-blue-950/60 p-1 rounded' : ''}`}
              >
                {step}
              </p>
            ))}
          </div>

          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-200 flex items-center justify-between">
            <span>Result: {chapter.solvedExample.finalAnswer}</span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">VERIFIED</span>
          </div>
        </div>

        {/* High-Yield Exam Pointers */}
        <div className="p-5 bg-amber-950/30 border border-amber-500/40 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>High-Yield Exam Pointers & Trap Alerts</span>
            </div>
            <button
              onClick={() => handleTeachSpecificLine(chapter.examPointers.join('. '))}
              className="text-xs text-amber-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen Exam Tips</span>
            </button>
          </div>
          <ul className="space-y-2">
            {chapter.examPointers.map((tip, idx) => (
              <li key={idx} className="text-xs text-amber-200 flex items-start gap-2 leading-relaxed">
                <span className="font-bold text-amber-400">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chapter-By-Chapter Navigation Bar */}
        <div className="pt-6 border-t border-slate-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {prevChapter ? (
              <button
                onClick={() => handleGoToChapter(prevChapter.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-blue-500 text-xs font-bold text-slate-300 hover:text-white bg-[#0c1426] transition-colors"
              >
                <span>← Previous: Ch {prevChapter.number} ({prevChapter.title})</span>
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-mono">First chapter in curriculum</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToChapterQuiz && (
              <button
                onClick={() => onNavigateToChapterQuiz(chapter.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-950/70 hover:bg-blue-900 text-blue-200 border border-blue-500/50 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>Test Yourself: Chapter {chapter.number} MCQs →</span>
              </button>
            )}

            {nextChapter && (
              <button
                onClick={() => handleGoToChapter(nextChapter.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 border border-blue-400/30"
              >
                <span>Next: Ch {nextChapter.number} ({nextChapter.title}) →</span>
              </button>
            )}
          </div>
        </div>

        {/* Supplementary Links */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onNavigateToSimulators}
            className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300"
          >
            <Cpu className="w-4 h-4" />
            <span>Launch Datapath Simulator for this chapter →</span>
          </button>

          <button
            onClick={onNavigateToVideos}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white"
          >
            <Video className="w-4 h-4 text-red-500" />
            <span>Watch Curated Lecture Videos →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
