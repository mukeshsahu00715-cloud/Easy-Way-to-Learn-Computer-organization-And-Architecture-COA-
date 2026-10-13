import React from 'react';
import { Cpu, Code, BookOpen, Layers, Video, HelpCircle, Sparkles, Download } from 'lucide-react';
import { exportFavoritesBackupFile } from '../utils/studyStorage';

interface NavbarProps {
  activeTab: 'notes' | 'simulators' | 'videos' | 'quiz' | 'cheatsheet';
  setActiveTab: (tab: 'notes' | 'simulators' | 'videos' | 'quiz' | 'cheatsheet') => void;
  onOpenVault: () => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenVault,
  favoritesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#060913]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('notes')}
          className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
            COA
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Study<span className="text-blue-500">Hub</span>
          </span>
        </button>

        {/* Zone 2: Clean nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
          <button
            onClick={() => setActiveTab('notes')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'notes' ? 'text-blue-400 border-b-2 border-blue-500 font-bold' : 'hover:text-white'
            }`}
          >
            Chapter Notes
          </button>

          <button
            onClick={() => setActiveTab('simulators')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'simulators' ? 'text-blue-400 border-b-2 border-blue-500 font-bold' : 'hover:text-white'
            }`}
          >
            Architecture Simulators
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'videos' ? 'text-blue-400 border-b-2 border-blue-500 font-bold' : 'hover:text-white'
            }`}
          >
            Video Lectures
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'quiz' ? 'text-blue-400 border-b-2 border-blue-500 font-bold' : 'hover:text-white'
            }`}
          >
            MCQs & Exam Practice
          </button>

          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'cheatsheet' ? 'text-blue-400 border-b-2 border-blue-500 font-bold' : 'hover:text-white'
            }`}
          >
            Formula Cheatsheet
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportFavoritesBackupFile()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-200 bg-[#091224] hover:bg-[#111f3d] rounded-xl transition-all whitespace-nowrap shrink-0 border border-blue-500/40"
            title="Export Saved Favorites directly to JSON file"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Favorites (.json)</span>
          </button>

          <button
            onClick={onOpenVault}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md shadow-blue-600/25 border border-blue-400/30"
            title="Open Saved Favorites & JSON Backup System"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Favorites Vault</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-white/20 text-white rounded text-[11px] font-mono">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
