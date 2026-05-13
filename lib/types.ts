export interface UserProfile {
  nickname: string;
  motivation: "career" | "overseas_assignment" | "travel";
  careerSubType?: "job_change" | "promotion";
  currentScore: number;
  targetScore: number;
}

export interface LearningProgress {
  totalAnswered: number;
  totalCorrect: number;
  sessionsCompleted: number;
  studiedWordIds: string[];
  lastStudiedAt: string | null;
}

export type EggStage =
  | "s0" | "s1" | "s2" | "s3" | "s4"
  | "s5" | "s6" | "s7" | "s8" | "s9";

export interface Word {
  id: number;
  word: string;
  meaning: string;
  pos?: string;
  level?: number;
  example_scene?: string;
  similar?: string;
  emoji?: string;
}

export type QuizDirection = "en_to_ja" | "ja_to_en";

export interface Question {
  word: Word;
  direction: QuizDirection;
  prompt: string;
  choices: string[];
  correctIndex: 0 | 1;
}

export interface WordExplanation {
  explanation: string;
  businessExample: string;
  dailyExample: string;
}

export interface QuizResult {
  question: Question;
  selectedIndex: number;
  isCorrect: boolean;
  explanation: WordExplanation | null;
}

export type AppPhase = "onboarding" | "home" | "quiz" | "result";
export type OnboardingStep = 1 | 2 | 3 | 4;
