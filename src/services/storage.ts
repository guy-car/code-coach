import { Problem } from './problems';

export interface UserProgress {
  currentLevel: 'easy' | 'medium' | 'hard';
  currentProblemIndex: number;
  levelsCompleted: string[];
  generatedProblems: {
    [key: string]: Problem[];
  };
}

const STORAGE_KEY = 'js-practice-progress';

export function loadUserProgress(): UserProgress {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      currentLevel: 'easy',
      currentProblemIndex: 0,
      levelsCompleted: [],
      generatedProblems: {}
    };
  }
  return JSON.parse(stored);
}

export function saveUserProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateUserProgress(updates: Partial<UserProgress>): void {
  const current = loadUserProgress();
  const updated = { ...current, ...updates };
  saveUserProgress(updated);
}

export function markLevelCompleted(level: 'easy' | 'medium' | 'hard'): void {
  const current = loadUserProgress();
  if (!current.levelsCompleted.includes(level)) {
    current.levelsCompleted.push(level);
    saveUserProgress(current);
  }
}

export function cacheGeneratedProblems(level: 'easy' | 'medium' | 'hard', problems: Problem[]): void {
  const current = loadUserProgress();
  current.generatedProblems[level] = problems;
  saveUserProgress(current);
}

export function getCachedProblems(level: 'easy' | 'medium' | 'hard'): Problem[] | undefined {
  const current = loadUserProgress();
  return current.generatedProblems[level];
} 