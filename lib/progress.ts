import { EggStage, LearningProgress, UserProfile } from "./types";

const STAGES: EggStage[] = ["s0","s1","s2","s3","s4","s5","s6","s7","s8","s9"];

export function calcProgressPercent(
  profile: UserProfile,
  progress: LearningProgress
): number {
  const gap = profile.targetScore - profile.currentScore;
  if (gap <= 0) return 100;
  return Math.min(100, Math.round((progress.totalCorrect / gap) * 100));
}

export function getEggStage(percent: number): EggStage {
  const idx = Math.min(9, Math.floor(percent / 10));
  return STAGES[idx];
}

export function getStageIndex(stage: EggStage): number {
  return STAGES.indexOf(stage);
}

export function getCorrectUntilNextStage(
  profile: UserProfile,
  totalCorrect: number
): number {
  const gap = profile.targetScore - profile.currentScore;
  if (gap <= 0) return 0;
  const pct = Math.min(100, (totalCorrect / gap) * 100);
  if (pct >= 100) return 0;
  const nextPct = (Math.floor(pct / 10) + 1) * 10;
  const needed = Math.ceil((nextPct / 100) * gap);
  return Math.max(0, needed - totalCorrect);
}
