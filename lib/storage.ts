import { UserProfile, LearningProgress } from "./types";

const PROFILE_KEY = "egglish_profile";
const PROGRESS_KEY = "egglish_progress";

const defaultProgress: LearningProgress = {
  totalAnswered: 0,
  totalCorrect: 0,
  sessionsCompleted: 0,
  studiedWordIds: [],
  lastStudiedAt: null,
};

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProgress(): LearningProgress {
  if (typeof window === "undefined") return defaultProgress;
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? (JSON.parse(raw) as LearningProgress) : defaultProgress;
}

export function saveProgress(progress: LearningProgress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function resetAll(): void {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}
