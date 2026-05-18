import { UserProfile, LearningProgress } from "./types";

const defaultProgress: LearningProgress = {
  totalAnswered: 0,
  totalCorrect: 0,
  sessionsCompleted: 0,
  studiedWordIds: [],
  lastStudiedAt: null,
};

function profileKey(userId: string) {
  return `egglish_profile_${userId}`;
}

function progressKey(userId: string) {
  return `egglish_progress_${userId}`;
}

export function getProfile(userId: string): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(profileKey(userId));
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export function saveProfile(userId: string, profile: UserProfile): void {
  localStorage.setItem(profileKey(userId), JSON.stringify(profile));
}

export function getProgress(userId: string): LearningProgress {
  if (typeof window === "undefined") return defaultProgress;
  const raw = localStorage.getItem(progressKey(userId));
  return raw ? (JSON.parse(raw) as LearningProgress) : defaultProgress;
}

export function saveProgress(userId: string, progress: LearningProgress): void {
  localStorage.setItem(progressKey(userId), JSON.stringify(progress));
}

export function resetAll(userId: string): void {
  localStorage.removeItem(profileKey(userId));
  localStorage.removeItem(progressKey(userId));
}
