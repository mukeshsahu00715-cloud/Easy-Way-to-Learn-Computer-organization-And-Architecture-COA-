import { COA_CHAPTERS, MCQS, MCQQuestion } from '../data/coaData';

export interface SavedChapter {
  id: string;
  number: string;
  title: string;
  category: string;
  savedAt: string;
}

export interface SavedQuizQuestion {
  id: string;
  chapterId: string;
  chapterName: string;
  question: string;
  userSelection?: string;
  correctAnswer: string;
  explanation: string;
  savedAt: string;
}

export interface QuizAttemptRecord {
  id: string;
  timestamp: string;
  chapterFilter: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  timeLimitSeconds?: number;
  isTimedExam?: boolean;
}

export interface StudyBackupData {
  schemaVersion: string;
  appName: string;
  exportedAt: string;
  summary: {
    favoriteChaptersCount: number;
    bookmarkedQuestionsCount: number;
    completedChaptersCount: number;
    totalQuizAttempts: number;
    averageQuizScorePct: number;
  };
  userData: {
    favoriteChapters: SavedChapter[];
    completedChapters: string[];
    bookmarkedQuestions: SavedQuizQuestion[];
    quizHistory: QuizAttemptRecord[];
    personalNotes: Record<string, string>;
  };
}

const STORAGE_KEYS = {
  FAVORITE_CHAPTERS: 'coa_favorite_chapters',
  COMPLETED_CHAPTERS: 'coa_completed_chapters',
  BOOKMARKED_QUESTIONS: 'coa_bookmarked_questions',
  QUIZ_HISTORY: 'coa_quiz_history',
  PERSONAL_NOTES: 'coa_personal_notes',
};

// Safe JSON parser for localStorage
function readStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write to localStorage for key: ${key}`, err);
  }
}

// CHAPTER FAVORITES
export function getFavoriteChapters(): SavedChapter[] {
  return readStorage<SavedChapter[]>(STORAGE_KEYS.FAVORITE_CHAPTERS, []);
}

export function isChapterFavorited(chapterId: string): boolean {
  const favorites = getFavoriteChapters();
  return favorites.some(f => f.id === chapterId);
}

export function toggleFavoriteChapter(chapterId: string): boolean {
  const favorites = getFavoriteChapters();
  const exists = favorites.some(f => f.id === chapterId);
  let updated: SavedChapter[];

  if (exists) {
    updated = favorites.filter(f => f.id !== chapterId);
  } else {
    const chapter = COA_CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) return false;
    const newEntry: SavedChapter = {
      id: chapter.id,
      number: chapter.number,
      title: chapter.title,
      category: chapter.category,
      savedAt: new Date().toISOString()
    };
    updated = [newEntry, ...favorites];
  }

  writeStorage(STORAGE_KEYS.FAVORITE_CHAPTERS, updated);
  return !exists;
}

// COMPLETED CHAPTERS
export function getCompletedChapters(): string[] {
  return readStorage<string[]>(STORAGE_KEYS.COMPLETED_CHAPTERS, []);
}

export function toggleCompletedChapter(chapterId: string): boolean {
  const list = getCompletedChapters();
  const exists = list.includes(chapterId);
  const updated = exists ? list.filter(id => id !== chapterId) : [...list, chapterId];
  writeStorage(STORAGE_KEYS.COMPLETED_CHAPTERS, updated);
  return !exists;
}

// BOOKMARKED QUESTIONS
export function getBookmarkedQuestions(): SavedQuizQuestion[] {
  return readStorage<SavedQuizQuestion[]>(STORAGE_KEYS.BOOKMARKED_QUESTIONS, []);
}

export function isQuestionBookmarked(questionId: string): boolean {
  const list = getBookmarkedQuestions();
  return list.some(q => q.id === questionId);
}

export function toggleBookmarkQuestion(question: MCQQuestion, userPickIdx?: number): boolean {
  const list = getBookmarkedQuestions();
  const exists = list.some(q => q.id === question.id);
  let updated: SavedQuizQuestion[];

  if (exists) {
    updated = list.filter(q => q.id !== question.id);
  } else {
    const newEntry: SavedQuizQuestion = {
      id: question.id,
      chapterId: question.chapterId,
      chapterName: question.chapterName,
      question: question.question,
      userSelection: userPickIdx !== undefined ? question.options[userPickIdx] : undefined,
      correctAnswer: question.options[question.correctIndex],
      explanation: question.explanation,
      savedAt: new Date().toISOString()
    };
    updated = [newEntry, ...list];
  }

  writeStorage(STORAGE_KEYS.BOOKMARKED_QUESTIONS, updated);
  return !exists;
}

// QUIZ HISTORY
export function getQuizHistory(): QuizAttemptRecord[] {
  return readStorage<QuizAttemptRecord[]>(STORAGE_KEYS.QUIZ_HISTORY, []);
}

export function saveQuizAttempt(record: {
  chapterFilter: string;
  score: number;
  totalQuestions: number;
  timeSpentSeconds?: number;
  timeLimitSeconds?: number;
  isTimedExam?: boolean;
}): QuizAttemptRecord {
  const history = getQuizHistory();
  const newAttempt: QuizAttemptRecord = {
    id: `quiz-${Date.now()}`,
    timestamp: new Date().toISOString(),
    chapterFilter: record.chapterFilter,
    score: record.score,
    totalQuestions: record.totalQuestions,
    percentage: Math.round((record.score / record.totalQuestions) * 100),
    timeSpentSeconds: record.timeSpentSeconds ?? 0,
    timeLimitSeconds: record.timeLimitSeconds,
    isTimedExam: record.isTimedExam ?? false
  };
  const updated = [newAttempt, ...history.slice(0, 19)]; // Keep latest 20
  writeStorage(STORAGE_KEYS.QUIZ_HISTORY, updated);
  return newAttempt;
}

// PERSONAL NOTES
export function getPersonalNotes(): Record<string, string> {
  return readStorage<Record<string, string>>(STORAGE_KEYS.PERSONAL_NOTES, {});
}

export function savePersonalNote(chapterId: string, noteText: string): void {
  const notes = getPersonalNotes();
  if (noteText.trim() === '') {
    delete notes[chapterId];
  } else {
    notes[chapterId] = noteText;
  }
  writeStorage(STORAGE_KEYS.PERSONAL_NOTES, notes);
}

// FULL BACKUP EXPORT & IMPORT
export function generateStudyBackupData(): StudyBackupData {
  const favChapters = getFavoriteChapters();
  const bookmarkedQs = getBookmarkedQuestions();
  const completedChs = getCompletedChapters();
  const quizHist = getQuizHistory();
  const notes = getPersonalNotes();

  const avgScore = quizHist.length > 0
    ? Math.round(quizHist.reduce((acc, curr) => acc + curr.percentage, 0) / quizHist.length)
    : 0;

  return {
    schemaVersion: "1.0.0",
    appName: "COA Study Hub - Local Study Backup",
    exportedAt: new Date().toISOString(),
    summary: {
      favoriteChaptersCount: favChapters.length,
      bookmarkedQuestionsCount: bookmarkedQs.length,
      completedChaptersCount: completedChs.length,
      totalQuizAttempts: quizHist.length,
      averageQuizScorePct: avgScore
    },
    userData: {
      favoriteChapters: favChapters,
      completedChapters: completedChs,
      bookmarkedQuestions: bookmarkedQs,
      quizHistory: quizHist,
      personalNotes: notes
    }
  };
}

export function downloadJsonFile(filename: string, data: unknown): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportFavoritesBackupFile(): void {
  const favChapters = getFavoriteChapters();
  const bookmarkedQs = getBookmarkedQuestions();
  const notes = getPersonalNotes();

  const data = {
    backupType: "saved_favorites",
    appName: "COA Study Hub - Favorites Backup",
    exportedAt: new Date().toISOString(),
    summary: {
      favoriteChaptersCount: favChapters.length,
      bookmarkedQuestionsCount: bookmarkedQs.length,
      notesCount: Object.keys(notes).length
    },
    userData: {
      favoriteChapters: favChapters,
      bookmarkedQuestions: bookmarkedQs,
      personalNotes: notes
    }
  };

  const dateStr = new Date().toISOString().slice(0, 10);
  downloadJsonFile(`coa_saved_favorites_${dateStr}.json`, data);
}

export function exportQuizResultsBackupFile(): void {
  const quizHist = getQuizHistory();
  const avgScore = quizHist.length > 0
    ? Math.round(quizHist.reduce((acc, curr) => acc + curr.percentage, 0) / quizHist.length)
    : 0;

  const data = {
    backupType: "quiz_results",
    appName: "COA Study Hub - Quiz Performance Backup",
    exportedAt: new Date().toISOString(),
    summary: {
      totalAttempts: quizHist.length,
      averageScorePercentage: avgScore
    },
    userData: {
      quizHistory: quizHist
    }
  };

  const dateStr = new Date().toISOString().slice(0, 10);
  downloadJsonFile(`coa_quiz_results_${dateStr}.json`, data);
}

export function exportStudyBackupFile(): void {
  const data = generateStudyBackupData();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  const filename = `coa_complete_study_backup_${dateStr}_${timeStr}.json`;
  downloadJsonFile(filename, data);
}

export function restoreStudyBackup(jsonContent: string): { success: boolean; message: string; summary?: StudyBackupData['summary'] } {
  try {
    const parsed = JSON.parse(jsonContent);

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Invalid backup file: Not a valid JSON object.' };
    }

    const userData = parsed.userData || parsed.savedFavorites || parsed;

    let restoredItems = 0;

    if (Array.isArray(userData.favoriteChapters)) {
      writeStorage(STORAGE_KEYS.FAVORITE_CHAPTERS, userData.favoriteChapters);
      restoredItems += userData.favoriteChapters.length;
    }
    if (Array.isArray(userData.completedChapters)) {
      writeStorage(STORAGE_KEYS.COMPLETED_CHAPTERS, userData.completedChapters);
    }
    if (Array.isArray(userData.bookmarkedQuestions)) {
      writeStorage(STORAGE_KEYS.BOOKMARKED_QUESTIONS, userData.bookmarkedQuestions);
      restoredItems += userData.bookmarkedQuestions.length;
    }
    if (Array.isArray(userData.quizHistory)) {
      writeStorage(STORAGE_KEYS.QUIZ_HISTORY, userData.quizHistory);
      restoredItems += userData.quizHistory.length;
    }
    if (userData.personalNotes && typeof userData.personalNotes === 'object') {
      writeStorage(STORAGE_KEYS.PERSONAL_NOTES, userData.personalNotes);
    }

    if (restoredItems === 0 && !userData.completedChapters && !userData.personalNotes) {
      return { success: false, message: 'Backup file recognized, but no matching favorites, chapters, or quiz records found.' };
    }

    const newBackup = generateStudyBackupData();
    return {
      success: true,
      message: 'Study backup successfully restored and synchronized!',
      summary: newBackup.summary
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to parse backup JSON: ${err instanceof Error ? err.message : 'Unknown syntax error'}`
    };
  }
}

export function clearAllStudyData(): void {
  Object.values(STORAGE_KEYS).forEach(k => {
    localStorage.removeItem(k);
  });
}
