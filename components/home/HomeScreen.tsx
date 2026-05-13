"use client";

import { UserProfile, LearningProgress } from "@/lib/types";
import { calcProgressPercent, getEggStage, getCorrectUntilNextStage } from "@/lib/progress";
import EggCharacter from "./EggCharacter";

interface Props {
  profile: UserProfile;
  progress: LearningProgress;
  onStartQuiz: () => void;
}

export default function HomeScreen({ profile, progress, onStartQuiz }: Props) {
  const pct = calcProgressPercent(profile, progress);
  const stage = getEggStage(pct);
  const remaining = getCorrectUntilNextStage(profile, progress.totalCorrect);

  const today = new Date().toLocaleDateString("ja-JP", {
    month: "long", day: "numeric", weekday: "short",
  });

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-yellow-100 p-8 max-w-sm w-full flex flex-col items-center gap-5">
      <div className="w-full flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{today}</p>
          <h1 className="text-xl font-bold text-slate-800">
            {profile.nickname} さん！
          </h1>
        </div>
        <div className="text-right text-xs text-slate-400">
          <div>{progress.sessionsCompleted} セッション</div>
          <div>{progress.totalCorrect} 正解</div>
        </div>
      </div>

      <EggCharacter stage={stage} />

      {/* あと○問で進化 */}
      {pct < 100 && remaining > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 text-center">
          <span className="text-sm text-amber-700 font-bold">
            🥚 あと <span className="text-lg text-amber-500">{remaining}</span> 問正解で進化！
          </span>
        </div>
      )}
      {pct >= 100 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl px-4 py-2 text-center">
          <span className="text-sm text-yellow-700 font-bold">🎉 目標達成！おめでとう！</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-500">目標スコアまで</span>
          <span className="font-bold text-yellow-600">{pct}%</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>現在 {profile.currentScore}点</span>
          <span>目標 {profile.targetScore}点</span>
        </div>
      </div>

      <button
        onClick={onStartQuiz}
        className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-800 font-bold text-lg rounded-2xl transition-all shadow-sm shadow-yellow-200"
      >
        🎯 今日の5問を始める
      </button>

      <p className="text-xs text-slate-400">1日5分 · 5問でコンプリート</p>
    </div>
  );
}
