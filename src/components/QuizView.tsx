import React, { useState, useEffect, useMemo } from 'react';
import { MCQS, PRACTICE_EXAM_QUESTIONS, MCQQuestion, PracticeQuestion } from '../data/coaData';
import {
  HelpCircle, CheckCircle2, XCircle, RotateCcw, ChevronRight, Eye, EyeOff,
  Bookmark, Award, Download, Clock, Timer, Pause, Play, AlertTriangle, Sparkles, Check,
  ArrowRight, FileJson, Star, Volume2, Bot
} from 'lucide-react';
import {
  getBookmarkedQuestions,
  toggleBookmarkQuestion,
  saveQuizAttempt,
  exportStudyBackupFile,
  exportQuizResultsBackupFile,
  exportFavoritesBackupFile
} from '../utils/studyStorage';

interface QuizViewProps {
  initialChapterFilter?: string;
  onQuizCompleted?: () => void;
  onOpenVault?: () => void;
}

const CHAPTER_SEQUENCE = [
  { id: 'number-systems', number: '01', title: 'Number Systems & Arithmetic' },
  { id: 'logic-gates-circuits', number: '02', title: 'Logic Gates & Circuits' },
  { id: 'cpu-registers', number: '03', title: 'CPU Architecture & Registers' },
  { id: 'instruction-cycle-addressing', number: '04', title: 'Instruction Cycle & Addressing' },
  { id: 'memory-hierarchy-cache', number: '05', title: 'Memory Hierarchy & Cache' },
  { id: 'pipelining-io', number: '06', title: 'Pipelining & DMA' },
];

export const QuizView: React.FC<QuizViewProps> = ({
  initialChapterFilter,
  onQuizCompleted,
  onOpenVault
}) => {
  const [activeTab, setActiveTab] = useState<'mcqs' | 'subjective'>('mcqs');
  const [selectedFilter, setSelectedFilter] = useState<string>(initialChapterFilter || 'demo-exam');

  // Exam Timing Mode: 'timed' (Countdown clock) or 'practice' (Untimed stopwatch)
  const [isTimedMode, setIsTimedMode] = useState<boolean>(true);
  const [selectedDurationSeconds, setSelectedDurationSeconds] = useState<number>(300); // 5 mins default

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<{ [qId: string]: number }>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() =>
    getBookmarkedQuestions().map(q => q.id)
  );
  const [isFinished, setIsFinished] = useState(false);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [showReviewList, setShowReviewList] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(selectedDurationSeconds);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Subjective practice questions state
  const [revealedSolutions, setRevealedSolutions] = useState<{ [id: string]: boolean }>({});

  // Filter questions list
  const filteredMCQs = useMemo(() => {
    if (selectedFilter === 'demo-exam') {
      const demoIds = ['mcq-1', 'mcq-2', 'mcq-6', 'mcq-8', 'mcq-12', 'mcq-4', 'mcq-3', 'mcq-14', 'mcq-5', 'mcq-20'];
      return MCQS.filter(q => demoIds.includes(q.id));
    }
    if (selectedFilter === 'all') {
      return MCQS;
    }
    return MCQS.filter(q => q.chapterId === selectedFilter);
  }, [selectedFilter]);

  const currentQ: MCQQuestion | undefined = filteredMCQs[currentQuestionIndex];

  // Sequence detection for Chapter-Wise One-by-One progression
  const currentChapterIndexInSeq = CHAPTER_SEQUENCE.findIndex(c => c.id === selectedFilter);
  const nextChapterInSeq = currentChapterIndexInSeq !== -1 && currentChapterIndexInSeq < CHAPTER_SEQUENCE.length - 1
    ? CHAPTER_SEQUENCE[currentChapterIndexInSeq + 1]
    : null;

  // Reset timer whenever quiz or preset restarts
  const resetTimer = (newDuration: number = selectedDurationSeconds) => {
    setTimeRemaining(newDuration);
    setTimeElapsed(0);
    setIsTimerPaused(false);
    setIsTimeExpired(false);
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (isFinished || isTimerPaused) return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);

      if (isTimedMode) {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitOnTimeout();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, isTimerPaused, isTimedMode, selectedDurationSeconds]);

  // Handle timeout auto-submit
  const handleAutoSubmitOnTimeout = () => {
    setIsTimeExpired(true);
    setIsFinished(true);
    saveQuizAttempt({
      chapterFilter: selectedFilter,
      score,
      totalQuestions: filteredMCQs.length,
      timeSpentSeconds: selectedDurationSeconds,
      timeLimitSeconds: selectedDurationSeconds,
      isTimedExam: true
    });
    onQuizCompleted?.();
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQ || isFinished) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswersHistory(prev => ({
      ...prev,
      [currentQ.id]: index
    }));
  };

  const handleNextQuestion = () => {
    stopSpeaking();
    if (currentQuestionIndex < filteredMCQs.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const totalSpent = isTimedMode ? (selectedDurationSeconds - timeRemaining) : timeElapsed;
      saveQuizAttempt({
        chapterFilter: selectedFilter,
        score,
        totalQuestions: filteredMCQs.length,
        timeSpentSeconds: totalSpent,
        timeLimitSeconds: isTimedMode ? selectedDurationSeconds : undefined,
        isTimedExam: isTimedMode
      });
      onQuizCompleted?.();
    }
  };

  const handleRestartQuiz = (newFilter?: string, newDuration?: number) => {
    stopSpeaking();
    const targetFilter = newFilter ?? selectedFilter;
    const targetDuration = newDuration ?? selectedDurationSeconds;
    if (newFilter) setSelectedFilter(newFilter);
    if (newDuration) setSelectedDurationSeconds(newDuration);

    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setAnswersHistory({});
    setIsFinished(false);
    setIsTimeExpired(false);
    setShowReviewList(false);
    resetTimer(targetDuration);
  };

  const toggleBookmark = (q: MCQQuestion) => {
    toggleBookmarkQuestion(q, selectedOption !== null ? selectedOption : undefined);
    setBookmarkedIds(getBookmarkedQuestions().map(item => item.id));
    onQuizCompleted?.();
  };

  const toggleRevealSolution = (id: string) => {
    setRevealedSolutions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // AI Voice Reader for Quiz Questions & Options
  const handleReadQuestionWithAI = () => {
    if (!currentQ || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeakingQuestion(true);

    const optionsText = currentQ.options
      .map((opt, i) => `Option ${String.fromCharCode(65 + i)}: ${opt}`)
      .join('. ');
    const fullSpeech = `Question: ${currentQ.question}. The options are: ${optionsText}`;

    const utterance = new SpeechSynthesisUtterance(fullSpeech);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingQuestion(false);
  };

  // Timing metrics for final scoreboard
  const finalTimeSpent = isTimedMode
    ? (isTimeExpired ? selectedDurationSeconds : (selectedDurationSeconds - timeRemaining))
    : timeElapsed;
  const avgTimePerQuestion = filteredMCQs.length > 0 ? (finalTimeSpent / filteredMCQs.length).toFixed(1) : '0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
      {/* Top Header: Title & Main Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>TEST YOUR ARCHITECTURAL MASTERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Practice & Exam Testing Arena
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Countdown timed demo exams with dark theme and blue & white options for high visual contrast.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-[#0c1322] p-1 rounded-xl self-start sm:self-auto border border-blue-900/50">
          <button
            onClick={() => setActiveTab('mcqs')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'mcqs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive MCQs
          </button>
          <button
            onClick={() => setActiveTab('subjective')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'subjective'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            University Exam Numericals
          </button>
        </div>
      </div>

      {activeTab === 'mcqs' ? (
        <div>
          {/* Chapter-Wise Sequence Progression Bar */}
          <div className="mb-6 bg-[#070b16] text-white rounded-2xl p-5 shadow-xl border border-blue-900/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-blue-400 font-bold tracking-wider block">
                  CHAPTER-BY-CHAPTER STUDY PROGRESSION
                </span>
                <h3 className="text-sm font-bold text-white">
                  Study & Test Each Chapter One by One
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestartQuiz('demo-exam', 300)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    selectedFilter === 'demo-exam'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                      : 'bg-[#0f172a] hover:bg-[#1e293b] text-blue-300 border border-blue-900/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Full Demo Exam (10 Qs)</span>
                </button>
                <button
                  onClick={() => handleRestartQuiz('all', 600)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 border border-slate-800'
                  }`}
                >
                  All Questions ({MCQS.length})
                </button>
              </div>
            </div>

            {/* Stepper Buttons 1 to 6 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {CHAPTER_SEQUENCE.map((ch) => {
                const isCurrent = selectedFilter === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleRestartQuiz(ch.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg ring-2 ring-blue-500/40'
                        : 'bg-[#0a0f1d] border-slate-800/80 hover:border-blue-500/50 hover:bg-[#10182b] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={isCurrent ? 'text-blue-100 font-bold' : 'text-blue-400 font-bold'}>
                        Ch {ch.number}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                        isCurrent ? 'bg-blue-700 text-white font-bold' : 'bg-slate-800 text-slate-300'
                      }`}>
                        5 Qs
                      </span>
                    </div>
                    <div className="text-xs font-bold truncate leading-tight">
                      {ch.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exam Timer Configuration Bar */}
          <div className="mb-6 p-4 bg-[#080d1a] border border-blue-900/40 rounded-xl shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">Timer Mode:</span>
                <div className="inline-flex bg-[#0f172a] border border-slate-800 p-0.5 rounded-lg">
                  <button
                    onClick={() => {
                      setIsTimedMode(true);
                      handleRestartQuiz(undefined, selectedDurationSeconds);
                    }}
                    className={`px-3 py-1 font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                      isTimedMode
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>Countdown Clock</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsTimedMode(false);
                      handleRestartQuiz();
                    }}
                    className={`px-3 py-1 font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                      !isTimedMode
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Self-Paced Stopwatch</span>
                  </button>
                </div>
              </div>

              {/* Countdown presets */}
              {isTimedMode && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Exam Duration:</span>
                  <div className="flex gap-1.5">
                    {[
                      { label: '3 Mins (Sprint)', secs: 180 },
                      { label: '5 Mins (Standard)', secs: 300 },
                      { label: '10 Mins (Extended)', secs: 600 }
                    ].map(preset => (
                      <button
                        key={preset.secs}
                        onClick={() => handleRestartQuiz(undefined, preset.secs)}
                        className={`px-2.5 py-1 rounded-md font-mono font-medium transition-colors ${
                          selectedDurationSeconds === preset.secs
                            ? 'bg-blue-600 text-white border border-blue-400 font-bold'
                            : 'bg-[#0f172a] text-slate-300 hover:bg-slate-800 border border-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Quiz Session Card (Dark Black Canvas) */}
          <div className="bg-[#070b16] border border-blue-900/50 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto">
            {!isFinished && currentQ ? (
              <div>
                {/* Meta Header with Real-time Countdown Timer */}
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-950/80 text-blue-300 border border-blue-800 font-mono text-xs font-bold">
                      Question {currentQuestionIndex + 1} of {filteredMCQs.length}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {currentQ.chapterName}
                    </span>
                  </div>

                  {/* Countdown Timer Badge */}
                  <div className="flex items-center gap-3">
                    {/* AI Voice Read Button for Question */}
                    <button
                      onClick={handleReadQuestionWithAI}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        isSpeakingQuestion
                          ? 'bg-blue-600 border-blue-400 text-white animate-pulse'
                          : 'bg-[#0c1426] border-blue-900/60 text-blue-300 hover:text-white hover:border-blue-500'
                      }`}
                      title={isSpeakingQuestion ? 'Stop voice reader' : 'AI voice read question & options'}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeakingQuestion ? 'Speaking...' : 'Listen'}</span>
                    </button>

                    {isTimedMode ? (
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs transition-colors ${
                          timeRemaining <= 20
                            ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                            : timeRemaining <= 60
                            ? 'bg-amber-950 border-amber-500 text-amber-300'
                            : 'bg-[#0c1426] border-blue-900 text-blue-200'
                        }`}>
                          <Timer className={`w-4 h-4 ${timeRemaining <= 20 ? 'text-rose-400' : 'text-blue-400'}`} />
                          <span className="tabular-nums text-sm font-extrabold">{formatTime(timeRemaining)}</span>
                          <span className="text-[10px] text-slate-400 font-sans font-normal">left</span>
                        </div>

                        {/* Pause / Resume */}
                        <button
                          onClick={() => setIsTimerPaused(!isTimerPaused)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title={isTimerPaused ? 'Resume countdown' : 'Pause timer'}
                        >
                          {isTimerPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1426] border border-slate-800 text-xs font-mono text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="tabular-nums font-semibold">{formatTime(timeElapsed)}</span>
                        <span className="text-[10px] text-slate-400">elapsed</span>
                      </div>
                    )}

                    {/* Bookmark to Study Vault */}
                    <button
                      onClick={() => toggleBookmark(currentQ)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        bookmarkedIds.includes(currentQ.id)
                          ? 'bg-amber-950/70 border-amber-400 text-amber-400'
                          : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                      title={bookmarkedIds.includes(currentQ.id) ? 'Remove bookmark' : 'Bookmark to Study Vault'}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(currentQ.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    <span className="text-xs font-mono font-bold text-slate-300">
                      Score: {score} / {currentQuestionIndex + (isAnswered ? 1 : 0)}
                    </span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full mb-6 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300 shadow-sm shadow-blue-500/50"
                    style={{ width: `${((currentQuestionIndex + (isAnswered ? 1 : 0)) / filteredMCQs.length) * 100}%` }}
                  />
                </div>

                {/* Question Text in Crisp White */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
                  {currentQ.question}
                </h3>

                {/* OPTIONS DESIGN: BLUE & WHITE WITH DARK BLACK BACKGROUND */}
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((opt, idx) => {
                    const isPicked = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    // Standard Option Style: Dark black background, blue border, white text
                    let btnStyle = 'bg-[#0a1020] border-blue-500/30 text-white hover:border-blue-400 hover:bg-[#101b33]';

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/90 border-emerald-400 text-white font-bold ring-1 ring-emerald-400/50';
                      } else if (isPicked) {
                        btnStyle = 'bg-rose-950/90 border-rose-400 text-white font-bold ring-1 ring-rose-400/50';
                      } else {
                        btnStyle = 'bg-[#070b16] border-slate-800/80 text-slate-400 opacity-60';
                      }
                    } else if (isPicked) {
                      btnStyle = 'bg-blue-900/50 border-blue-400 text-white ring-2 ring-blue-500/40';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all shadow-sm ${btnStyle}`}
                      >
                        {/* Option letter badge in vibrant blue and white */}
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 transition-colors ${
                          isAnswered && isCorrect
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : isAnswered && isPicked
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-blue-600 text-white shadow-xs'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {/* Option text in crisp white */}
                        <span className="text-sm font-medium text-white leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Rationale */}
                {isAnswered && (
                  <div className={`p-4 rounded-xl border mb-6 ${
                    selectedOption === currentQ.correctIndex
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1">
                      {selectedOption === currentQ.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">Correct Answer!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span className="text-rose-300">Incorrect. Rationale:</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200">{currentQ.explanation}</p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-400">
                    Difficulty: <strong className="text-blue-300 font-semibold">{currentQ.difficulty}</strong>
                  </span>

                  <button
                    onClick={handleNextQuestion}
                    disabled={!isAnswered}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/30 disabled:opacity-30 disabled:hover:bg-blue-600"
                  >
                    <span>{currentQuestionIndex === filteredMCQs.length - 1 ? 'Finish Exam' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Finished / Scoreboard View with Detailed Time Tracking */
              <div className="py-6 text-center text-white">
                <div className="w-16 h-16 rounded-2xl bg-blue-950/60 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-4">
                  {isTimeExpired ? (
                    <AlertTriangle className="w-8 h-8 text-amber-400" />
                  ) : (
                    <Award className="w-8 h-8 text-blue-400" />
                  )}
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-1">
                  {isTimeExpired ? "Time Expired! Exam Auto-Submitted" : "Exam Session Completed!"}
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  {isTimeExpired
                    ? "The countdown timer reached 0:00. Your completed answers have been scored and logged."
                    : "Here is your performance and speed breakdown for this test session."}
                </p>

                {/* 4-Card Analytics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-6 text-left">
                  <div className="p-3 bg-[#0a1020] border border-blue-900/50 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-blue-400 block mb-0.5">Final Score</span>
                    <strong className="text-xl font-black text-white block">{score} / {filteredMCQs.length}</strong>
                    <span className="text-[10px] text-slate-400">Correct answers</span>
                  </div>

                  <div className="p-3 bg-[#0a1020] border border-blue-900/50 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-blue-400 block mb-0.5">Accuracy</span>
                    <strong className="text-xl font-black text-white block font-mono">
                      {Math.round((score / filteredMCQs.length) * 100)}%
                    </strong>
                    <span className="text-[10px] text-slate-400">Passing threshold 60%</span>
                  </div>

                  <div className="p-3 bg-[#0a1020] border border-blue-500/50 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-blue-300 block mb-0.5">Time Spent</span>
                    <strong className="text-xl font-black text-white block font-mono tabular-nums">
                      {formatTime(finalTimeSpent)}
                    </strong>
                    <span className="text-[10px] text-blue-300">
                      {isTimedMode ? `Limit: ${formatTime(selectedDurationSeconds)}` : 'Untimed test'}
                    </span>
                  </div>

                  <div className="p-3 bg-[#0a1020] border border-blue-900/50 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-blue-400 block mb-0.5">Average Speed</span>
                    <strong className="text-xl font-black text-white block font-mono tabular-nums">
                      {avgTimePerQuestion}s
                    </strong>
                    <span className="text-[10px] text-slate-400">Per question</span>
                  </div>
                </div>

                {/* Next Chapter Stepper Callout (Chapter-by-Chapter Flow) */}
                {nextChapterInSeq && (
                  <div className="p-4 bg-[#0c1a2e] border border-blue-500/50 rounded-xl max-w-xl mx-auto mb-6 text-left flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-300 uppercase block">
                        CONTINUE CHAPTER-WISE STUDY
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Next: Chapter {nextChapterInSeq.number} — {nextChapterInSeq.title}
                      </h4>
                      <p className="text-xs text-blue-200/80">
                        Proceed to the next chapter test one by one.
                      </p>
                    </div>
                    <button
                      onClick={() => handleRestartQuiz(nextChapterInSeq.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 shrink-0"
                    >
                      <span>Start Ch {nextChapterInSeq.number}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Export Features (Saved Favorites & Quiz Results JSON Downloads) */}
                <div className="p-4 bg-[#0a1020] border border-blue-900/50 rounded-xl max-w-xl mx-auto mb-6 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <FileJson className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">Export & Backup Study Records</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Download your study results or saved favorites as JSON files to keep local backups of your exam scores and bookmarks.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => exportQuizResultsBackupFile()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
                      title="Export all quiz attempt scores to JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Quiz Results (.json)</span>
                    </button>

                    <button
                      onClick={() => exportFavoritesBackupFile()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-blue-300 border border-blue-800 rounded-lg text-xs font-semibold transition-all"
                      title="Export saved favorite chapters and bookmarks to JSON"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Export Saved Favorites (.json)</span>
                    </button>

                    <button
                      onClick={() => exportStudyBackupFile()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-all"
                      title="Download complete study backup including notes and history"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Full Backup (.json)</span>
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                  <button
                    onClick={() => handleRestartQuiz()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white border border-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-blue-400" />
                    <span>Retake Current Test</span>
                  </button>

                  <button
                    onClick={() => setShowReviewList(!showReviewList)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 border border-blue-500/50 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span>{showReviewList ? 'Hide Answer Review' : 'Review Questions & Answers'}</span>
                  </button>

                  {onOpenVault && (
                    <button
                      onClick={onOpenVault}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0a1829] hover:bg-[#10243d] text-blue-300 border border-blue-500/40 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-blue-400" />
                      <span>View in Study Vault</span>
                    </button>
                  )}
                </div>

                {/* Detailed Questions Review Accordion */}
                {showReviewList && (
                  <div className="max-w-2xl mx-auto text-left space-y-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                      Question-by-Question Review:
                    </h4>
                    {filteredMCQs.map((q, idx) => {
                      const userPick = answersHistory[q.id];
                      const isCorrect = userPick === q.correctIndex;

                      return (
                        <div key={q.id} className="p-4 bg-[#0a1020] border border-blue-900/40 rounded-xl text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">Q{idx + 1}. {q.question}</span>
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-rose-950 text-rose-300 border border-rose-600'
                            }`}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>

                          <div className="text-slate-300">
                            <strong>Your Answer: </strong>
                            <span className="text-white">{userPick !== undefined ? q.options[userPick] : 'Not answered'}</span>
                          </div>

                          {!isCorrect && (
                            <div className="text-emerald-400 font-semibold">
                              <strong>Correct Answer: </strong>
                              <span>{q.options[q.correctIndex]}</span>
                            </div>
                          )}

                          <div className="text-slate-300 bg-[#050811] p-2.5 rounded border border-slate-800">
                            <strong className="text-blue-300">Explanation: </strong> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Mode 2: University High-Yield Subjective Exam Questions */
        <div className="space-y-6">
          <p className="text-sm text-slate-300">
            These are actual 10-mark problems frequently asked in semester university & GATE examinations. Work them out on scratch paper, then reveal the full step-by-step solution.
          </p>

          <div className="space-y-6">
            {PRACTICE_EXAM_QUESTIONS.map((pq) => {
              const isRevealed = !!revealedSolutions[pq.id];

              return (
                <div key={pq.id} className="bg-[#070b16] border border-blue-900/50 rounded-xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-800">
                      {pq.marks} Marks Problem
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {pq.title}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-4 leading-relaxed">
                    {pq.question}
                  </h3>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => toggleRevealSolution(pq.id)}
                      className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300"
                    >
                      {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{isRevealed ? 'Hide Model Solution' : 'Reveal Model Answer & Working'}</span>
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <div className="bg-[#050811] border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-2 mb-3">
                        {pq.modelAnswer.map((line, idx) => (
                          <p key={idx} className="text-slate-300 leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>

                      <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-200">
                        <strong>Exam Examiner Tip:</strong> {pq.keyTip}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
