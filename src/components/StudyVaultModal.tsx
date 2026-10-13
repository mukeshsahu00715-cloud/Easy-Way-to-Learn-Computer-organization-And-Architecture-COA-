import React, { useState, useEffect, useRef } from 'react';
import {
  X, Download, Upload, Copy, Check, Star, Bookmark, Award,
  Trash2, FileJson, AlertCircle, CheckCircle2, ArrowRight,
  BookOpen, RefreshCw
} from 'lucide-react';
import {
  generateStudyBackupData,
  exportStudyBackupFile,
  exportFavoritesBackupFile,
  exportQuizResultsBackupFile,
  restoreStudyBackup,
  clearAllStudyData,
  getFavoriteChapters,
  getBookmarkedQuestions,
  getQuizHistory,
  toggleFavoriteChapter,
  toggleBookmarkQuestion,
  savePersonalNote,
  getPersonalNotes,
  StudyBackupData,
  SavedChapter,
  SavedQuizQuestion,
  QuizAttemptRecord
} from '../utils/studyStorage';
import { MCQS } from '../data/coaData';

interface StudyVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToChapter: (chapterId: string) => void;
  onDataChanged?: () => void;
}

export const StudyVaultModal: React.FC<StudyVaultModalProps> = ({
  isOpen,
  onClose,
  onNavigateToChapter,
  onDataChanged
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'quizResults' | 'backup'>('favorites');
  const [backupData, setBackupData] = useState<StudyBackupData | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshData = () => {
    const data = generateStudyBackupData();
    setBackupData(data);
    setPersonalNotes(getPersonalNotes());
    onDataChanged?.();
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
      setRestoreStatus(null);
    }
  }, [isOpen]);

  if (!isOpen || !backupData) return null;

  const handleExportDownload = () => {
    exportStudyBackupFile();
  };

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(backupData, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = restoreStudyBackup(content);
      setRestoreStatus(res);
      if (res.success) {
        refreshData();
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleRemoveFavoriteChapter = (id: string) => {
    toggleFavoriteChapter(id);
    refreshData();
  };

  const handleRemoveBookmarkedQuestion = (id: string) => {
    const mcq = MCQS.find(q => q.id === id);
    if (mcq) {
      toggleBookmarkQuestion(mcq);
      refreshData();
    }
  };

  const handleSaveNote = (chapterId: string) => {
    savePersonalNote(chapterId, noteDraft);
    setEditingNoteId(null);
    refreshData();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all your saved favorites, notes, and quiz history? This cannot be undone unless you have a downloaded JSON backup.')) {
      clearAllStudyData();
      refreshData();
      setRestoreStatus({ success: true, message: 'All local study data was successfully cleared.' });
    }
  };

  const { summary, userData } = backupData;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 text-white">
      <div className="bg-[#070b16] rounded-2xl max-w-4xl w-full border border-blue-900/60 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0a1020] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Study Vault & Local Backup
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  JSON v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage your saved chapters, review bookmarked quiz problems, and export/restore offline JSON study backups.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Summary Strip */}
        <div className="px-5 py-3 border-b border-slate-800 bg-[#050811] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-[#0a1020] border border-blue-900/40 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Saved Chapters</span>
            <strong className="text-sm font-bold text-white">{summary.favoriteChaptersCount}</strong>
          </div>
          <div className="p-2.5 bg-[#0a1020] border border-blue-900/40 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Bookmarked Questions</span>
            <strong className="text-sm font-bold text-white">{summary.bookmarkedQuestionsCount}</strong>
          </div>
          <div className="p-2.5 bg-[#0a1020] border border-blue-900/40 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Quiz Attempts</span>
            <strong className="text-sm font-bold text-white">{summary.totalQuizAttempts}</strong>
          </div>
          <div className="p-2.5 bg-[#0a1020] border border-blue-900/40 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Avg Quiz Accuracy</span>
            <strong className="text-sm font-bold text-emerald-400 font-mono">
              {summary.totalQuizAttempts > 0 ? `${summary.averageQuizScorePct}%` : 'N/A'}
            </strong>
          </div>
        </div>

        {/* Tabs and Primary Actions Bar */}
        <div className="px-5 py-2.5 bg-[#080d1a] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex bg-[#0f172a] border border-slate-800 p-0.5 rounded-xl">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'favorites'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Saved Chapters ({userData.favoriteChapters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('quizResults')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'quizResults'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-300" />
              <span>Quiz History & Bookmarks ({userData.bookmarkedQuestions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'backup'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-400" />
              <span>JSON Backup & Restore</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportFavoritesBackupFile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-blue-300 border border-blue-800 rounded-lg font-semibold transition-all shadow-xs"
              title="Download saved favorite chapters and bookmarks as a JSON file"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Export Favorites (.json)</span>
            </button>
            <button
              onClick={handleExportDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all shadow-md shadow-blue-600/30"
              title="Download complete backup as a JSON file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Backup (.json)</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 bg-[#050811]/90">
          {/* TAB 1: SAVED CHAPTERS & PERSONAL STUDY NOTES */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Saved Favorite Chapters & Study Notes
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Starred chapters stored in local browser memory.
                  </p>
                </div>
                {userData.favoriteChapters.length > 0 && (
                  <button
                    onClick={exportFavoritesBackupFile}
                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-950/70 hover:bg-blue-900 text-blue-300 border border-blue-700/60 rounded-md text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Favorites JSON</span>
                  </button>
                )}
              </div>

              {userData.favoriteChapters.length === 0 ? (
                <div className="text-center py-12 bg-[#090e1a] rounded-2xl border border-slate-800">
                  <Star className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">No Saved Chapters Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Click the star button on any chapter card or reading view to save it to your local favorites.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Browse Chapters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userData.favoriteChapters.map((fav) => {
                    const note = personalNotes[fav.id] || '';
                    const isEditing = editingNoteId === fav.id;

                    return (
                      <div key={fav.id} className="bg-[#090e1a] border border-blue-900/40 rounded-xl p-4 shadow-md">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400 mb-0.5">
                              <span>Chapter {fav.number}</span>
                              <span>·</span>
                              <span>{fav.category}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white">{fav.title}</h4>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                onNavigateToChapter(fav.id);
                                onClose();
                              }}
                              className="flex items-center gap-1 text-xs text-blue-300 hover:text-white font-semibold px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-800"
                            >
                              <span>Open Notes</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemoveFavoriteChapter(fav.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-rose-950/40 transition-colors"
                              title="Remove from favorites"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Personal Revision Notes Box */}
                        <div className="mt-3 pt-3 border-t border-slate-800">
                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                placeholder="Write personal memory triggers, exam hints, or sticky notes for this chapter..."
                                className="w-full text-xs p-2.5 bg-[#050811] text-white border border-blue-500/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                rows={3}
                              />
                              <div className="flex justify-end gap-2 text-xs">
                                <button
                                  onClick={() => setEditingNoteId(null)}
                                  className="px-2.5 py-1 text-slate-400 hover:bg-slate-800 rounded"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveNote(fav.id)}
                                  className="px-3 py-1 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500"
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-2 text-xs">
                              <div className="flex-1">
                                {note ? (
                                  <p className="text-slate-200 bg-[#0c1426] border border-blue-900/50 p-2.5 rounded-lg italic">
                                    "{note}"
                                  </p>
                                ) : (
                                  <span className="text-slate-500 italic">No personal notes attached yet.</span>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setEditingNoteId(fav.id);
                                  setNoteDraft(note);
                                }}
                                className="text-xs text-blue-400 hover:underline font-semibold shrink-0"
                              >
                                {note ? 'Edit Note' : '+ Add Note'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BOOKMARKED QUESTIONS & QUIZ ATTEMPTS */}
          {activeTab === 'quizResults' && (
            <div className="space-y-6">
              {/* Recent Quiz Scores */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-400" />
                    <span>Recent Quiz Attempts & Performance</span>
                  </h4>
                  {userData.quizHistory.length > 0 && (
                    <button
                      onClick={exportQuizResultsBackupFile}
                      className="flex items-center gap-1.5 px-3 py-1 bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800 rounded-md text-xs font-bold transition-colors"
                      title="Download quiz session scores as JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Quiz Results (.json)</span>
                    </button>
                  )}
                </div>

                {userData.quizHistory.length === 0 ? (
                  <div className="p-4 bg-[#090e1a] border border-slate-800 rounded-xl text-center text-xs text-slate-400">
                    No quiz attempts recorded yet. Take an interactive quiz in the Practice Arena to record your performance scores.
                  </div>
                ) : (
                  <div className="border border-slate-800 rounded-xl bg-[#090e1a] overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-[#0c1426] text-slate-300 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Date & Time</th>
                          <th className="p-3">Topic / Filter</th>
                          <th className="p-3">Score</th>
                          <th className="p-3">Accuracy</th>
                          <th className="p-3">Time Taken</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {userData.quizHistory.slice(0, 10).map((attempt) => (
                          <tr key={attempt.id} className="hover:bg-slate-900/40">
                            <td className="p-3 text-slate-400 font-mono text-[11px]">
                              {new Date(attempt.timestamp).toLocaleDateString()} {new Date(attempt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-3 font-semibold text-white">
                              {attempt.chapterFilter}
                            </td>
                            <td className="p-3 font-mono font-bold text-blue-400">
                              {attempt.score} / {attempt.totalQuestions}
                            </td>
                            <td className="p-3 font-mono">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                attempt.percentage >= 70
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                  : attempt.percentage >= 50
                                  ? 'bg-amber-950 text-amber-300 border border-amber-700'
                                  : 'bg-rose-950 text-rose-300 border border-rose-700'
                              }`}>
                                {attempt.percentage}%
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 font-mono text-[11px]">
                              {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Bookmarked Questions */}
              <div>
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-blue-400" />
                  <span>Bookmarked Questions for Revision ({userData.bookmarkedQuestions.length})</span>
                </h4>

                {userData.bookmarkedQuestions.length === 0 ? (
                  <div className="p-4 bg-[#090e1a] border border-slate-800 rounded-xl text-center text-xs text-slate-400">
                    No questions bookmarked yet. Click the bookmark ribbon on tricky quiz questions to save them here for rapid review.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userData.bookmarkedQuestions.map((q) => (
                      <div key={q.id} className="bg-[#090e1a] border border-blue-900/40 rounded-xl p-4 shadow-md">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                            {q.chapterName}
                          </span>
                          <button
                            onClick={() => handleRemoveBookmarkedQuestion(q.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                            title="Remove bookmark"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h5 className="text-xs font-bold text-white mb-2 leading-relaxed">
                          {q.question}
                        </h5>

                        <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-200 font-mono mb-2">
                          <strong>Correct Answer:</strong> {q.correctAnswer}
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed bg-[#050811] p-2.5 rounded-lg border border-slate-800">
                          <strong className="text-blue-300">Rationale:</strong> {q.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BACKUP / RESTORE / JSON PREVIEW */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Notification Banner */}
              {restoreStatus && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  restoreStatus.success
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-500 text-rose-200'
                }`}>
                  {restoreStatus.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs">
                    <strong>{restoreStatus.success ? 'Success!' : 'Restore Failed'}</strong>
                    <p className="mt-0.5">{restoreStatus.message}</p>
                  </div>
                </div>
              )}

              {/* Export & Import Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Download Card */}
                <div className="p-5 bg-[#090e1a] border border-blue-900/50 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold mb-3">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Download Study Backup</h4>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      Saves your saved chapters, personal notes, bookmarked quiz questions, and score logs into a clean, portable <code className="font-mono text-blue-400">.json</code> file.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleExportDownload}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/30"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Complete Backup (.json)</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={exportFavoritesBackupFile}
                        className="flex items-center justify-center gap-1.5 py-2 bg-[#0c1426] hover:bg-[#121f3b] text-blue-300 border border-blue-800 font-bold text-xs rounded-xl transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Favorites (.json)</span>
                      </button>
                      <button
                        onClick={exportQuizResultsBackupFile}
                        className="flex items-center justify-center gap-1.5 py-2 bg-[#0c1426] hover:bg-[#121f3b] text-blue-300 border border-blue-800 font-bold text-xs rounded-xl transition-colors"
                      >
                        <Award className="w-3.5 h-3.5 text-blue-400" />
                        <span>Quiz History (.json)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Restore Card */}
                <div className="p-5 bg-[#090e1a] border border-blue-900/50 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Restore from Backup File</h4>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      Restore your previously exported <code className="font-mono text-emerald-400">.json</code> study file onto another device or browser session.
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".json,application/json"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0c1426] hover:bg-[#121f3b] text-white font-bold text-xs rounded-xl transition-colors border border-slate-700"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Select JSON File to Restore</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* JSON Live Viewer */}
              <div className="bg-[#090e1a] border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-white">Live JSON Payload Preview</span>
                  </div>
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1 text-xs text-blue-300 hover:text-white font-semibold px-2 py-1 rounded bg-blue-950 border border-blue-800"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>

                <div className="max-h-56 overflow-auto bg-[#03060d] p-3.5 rounded-lg font-mono text-[11px] text-emerald-400 border border-slate-800">
                  <pre>{JSON.stringify(backupData, null, 2)}</pre>
                </div>
              </div>

              {/* Danger Zone: Clear Storage */}
              <div className="p-4 border border-rose-900/60 bg-rose-950/30 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h5 className="text-xs font-bold text-rose-300">Reset Local Study Data</h5>
                  <p className="text-[11px] text-rose-400">
                    Permanently clears favorites, bookmarks, and quiz history from this browser.
                  </p>
                </div>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 bg-rose-950 border border-rose-700 text-rose-300 hover:bg-rose-900 hover:text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
