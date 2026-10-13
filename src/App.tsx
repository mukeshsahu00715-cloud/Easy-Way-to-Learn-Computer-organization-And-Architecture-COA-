import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NotesView } from './components/NotesView';
import { VideosView } from './components/VideosView';
import { QuizView } from './components/QuizView';
import { CheatsheetView } from './components/CheatsheetView';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { StudyVaultModal } from './components/StudyVaultModal';
import { InstructionCycleSim } from './components/Simulators/InstructionCycleSim';
import { NumberSystemSim } from './components/Simulators/NumberSystemSim';
import { CacheCalcSim } from './components/Simulators/CacheCalcSim';
import { LogicGateSim } from './components/Simulators/LogicGateSim';
import { COA_CHAPTERS } from './data/coaData';
import { getFavoriteChapters, getBookmarkedQuestions } from './utils/studyStorage';
import { Cpu, Binary, Layers, Sliders, BookOpen, Search, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'notes' | 'simulators' | 'videos' | 'quiz' | 'cheatsheet'>('notes');
  const [activeSimulator, setActiveSimulator] = useState<'cpu' | 'numbers' | 'cache' | 'logic'>('cpu');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('number-systems');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);

  const updateCounts = useCallback(() => {
    const favs = getFavoriteChapters();
    const bms = getBookmarkedQuestions();
    setFavoritesCount(favs.length + bms.length);
  }, []);

  useEffect(() => {
    updateCounts();
  }, [updateCounts]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return COA_CHAPTERS.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.topics.some(t => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSelectSearchResult = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setActiveTab('notes');
    setSearchQuery('');
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050811] flex flex-col text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVault={() => setIsVaultOpen(true)}
        favoritesCount={favoritesCount}
      />

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExploreChapters={() => {
          setActiveTab('notes');
          const el = document.getElementById('main-content');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onLaunchSimulator={() => {
          setActiveTab('simulators');
          const el = document.getElementById('main-content');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Global Search Results Overlay (when searching) */}
      {searchQuery.trim().length > 0 && (
        <div className="bg-[#070b16] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-blue-900/60">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">
                Search Results for "{searchQuery}" ({searchResults.length} found)
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-blue-400 hover:text-white underline"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(res => (
                  <div
                    key={res.id}
                    onClick={() => handleSelectSearchResult(res.id)}
                    className="p-4 rounded-xl bg-[#0b1222] border border-blue-900/60 hover:border-blue-400 cursor-pointer transition-all shadow-md hover:bg-[#101b33]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-blue-400">Chapter {res.number}</span>
                      <span className="text-xs text-slate-400">{res.readTime}</span>
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1">{res.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2 mb-2">{res.summary}</p>
                    <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                      <span>Jump to notes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No exact match found for "{searchQuery}". Try searching for <em>CPU, cache, Booth, pipeline, addressing,</em> or <em>logic</em>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main id="main-content" className="flex-1">
        {activeTab === 'notes' && (
          <NotesView
            selectedChapterId={selectedChapterId}
            setSelectedChapterId={setSelectedChapterId}
            onNavigateToSimulators={() => {
              setActiveTab('simulators');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            onNavigateToVideos={() => {
              setActiveTab('videos');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            onNavigateToChapterQuiz={(chapterId) => {
              setSelectedChapterId(chapterId);
              setActiveTab('quiz');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            onFavoritesChanged={updateCounts}
          />
        )}

        {activeTab === 'simulators' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
            {/* Simulator Switcher Deck */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span>HARDWARE VISUALIZATION SANDBOXES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Interactive Computer Architecture Simulators
              </h2>
              <p className="text-sm text-slate-300 mb-6">
                Interact with the fundamental building blocks of computers: datapath registers, cache line calculators, signed binary logic, and gates.
              </p>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-[#0a1020] border border-blue-900/50 rounded-2xl max-w-fit shadow-md">
                <button
                  onClick={() => setActiveSimulator('cpu')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeSimulator === 'cpu'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-blue-300" />
                  <span>CPU Datapath Cycle</span>
                </button>

                <button
                  onClick={() => setActiveSimulator('numbers')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeSimulator === 'numbers'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Binary className="w-4 h-4 text-blue-300" />
                  <span>2's Complement & Radix</span>
                </button>

                <button
                  onClick={() => setActiveSimulator('cache')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeSimulator === 'cache'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-blue-300" />
                  <span>Cache Tag & AMAT</span>
                </button>

                <button
                  onClick={() => setActiveSimulator('logic')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeSimulator === 'logic'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-blue-300" />
                  <span>Logic Gates & Truth Table</span>
                </button>
              </div>
            </div>

            {/* Active Sandbox View */}
            {activeSimulator === 'cpu' && <InstructionCycleSim />}
            {activeSimulator === 'numbers' && <NumberSystemSim />}
            {activeSimulator === 'cache' && <CacheCalcSim />}
            {activeSimulator === 'logic' && <LogicGateSim />}
          </div>
        )}

        {activeTab === 'videos' && (
          <VideosView
            onSelectChapterNotes={(chapterId) => {
              setSelectedChapterId(chapterId);
              setActiveTab('notes');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            initialChapterFilter={selectedChapterId}
            onQuizCompleted={updateCounts}
            onOpenVault={() => setIsVaultOpen(true)}
          />
        )}

        {activeTab === 'cheatsheet' && <CheatsheetView />}
      </main>

      {/* Study Vault & JSON Backup Modal */}
      <StudyVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        onNavigateToChapter={(id) => {
          setSelectedChapterId(id);
          setActiveTab('notes');
        }}
        onDataChanged={updateCounts}
      />

      {/* Standalone Export Modal */}
      <StandaloneExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Editorial Footer */}
      <footer className="bg-[#03060e] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-600/30">
              COA
            </div>
            <div>
              <span className="text-sm font-bold text-white block">COA Study Hub</span>
              <span className="text-xs text-slate-400">
                Computer Organization and Architecture Learning Platform with AI Voice Teacher
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button onClick={() => setActiveTab('notes')} className="hover:text-white transition-colors">
              Chapters
            </button>
            <button onClick={() => setActiveTab('simulators')} className="hover:text-white transition-colors">
              Simulators
            </button>
            <button onClick={() => setActiveTab('videos')} className="hover:text-white transition-colors">
              Lectures
            </button>
            <button onClick={() => setActiveTab('quiz')} className="hover:text-white transition-colors">
              MCQs
            </button>
            <button onClick={() => setIsVaultOpen(true)} className="text-blue-400 hover:text-blue-300 font-semibold">
              Study Vault & Backup (.json)
            </button>
            <button onClick={() => setIsExportModalOpen(true)} className="text-slate-400 hover:text-white font-semibold">
              VS Code Standalone Files
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Learn smart · Listen line by line · Understand deeply
          </div>
        </div>
      </footer>
    </div>
  );
}
