"use client";

import { useEffect, useState } from "react";
import { QuizResult, UserProfile, LearningProgress } from "@/lib/types";
import { calcProgressPercent, getEggStage } from "@/lib/progress";
import { playLevelUp } from "@/lib/sounds";
import EggCharacter from "@/components/home/EggCharacter";
import Confetti from "@/components/effects/Confetti";
import LevelUpBanner from "@/components/effects/LevelUpBanner";

interface Props {
  results: QuizResult[];
  profile: UserProfile;
  progressBefore: LearningProgress;
  progressAfter: LearningProgress;
  onHome: () => void;
}

function speak(text: string) {
  if (typeof window === "undefined") return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  u.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Natural") ||
        v.name.includes("Samantha") ||
        v.name.includes("Google") ||
        v.name.includes("Karen") ||
        v.name.includes("Moira"))
  );
  if (preferred) u.voice = preferred;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export default function ResultScreen({
  results, profile, progressBefore, progressAfter, onHome,
}: Props) {
  const correct = results.filter((r) => r.isCorrect).length;
  const total = results.length;

  const pctBefore = calcProgressPercent(profile, progressBefore);
  const pctAfter  = calcProgressPercent(profile, progressAfter);
  const stageBefore = getEggStage(pctBefore);
  const stageAfter  = getEggStage(pctAfter);
  const leveledUp = stageBefore !== stageAfter;
  const isHatching = stageBefore === "s4" && stageAfter === "s5";

  const [showBanner, setShowBanner] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHatch, setShowHatch] = useState(false);
  const [bannerDone, setBannerDone] = useState(false);

  useEffect(() => {
    if (leveledUp) {
      const t1 = setTimeout(() => { setShowBanner(true); setShowConfetti(true); playLevelUp(); }, 500);
      const t2 = isHatching ? setTimeout(() => setShowHatch(true), 700) : null;
      return () => { clearTimeout(t1); if (t2) clearTimeout(t2); };
    }
  }, [leveledUp, isHatching]);

  const scoreEmoji = correct === total ? "🎉" : correct >= total / 2 ? "👍" : "💪";

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-yellow-100 p-6 max-w-sm w-full flex flex-col gap-5">
      {showConfetti && <Confetti />}
      {showBanner && !bannerDone && (
        <LevelUpBanner newStage={stageAfter} onDone={() => setBannerDone(true)} />
      )}

      <div className="text-center">
        <div className="text-4xl mb-2">{scoreEmoji}</div>
        <h2 className="text-2xl font-bold text-slate-800">{correct} / {total} 正解</h2>
        <p className="text-slate-500 text-sm mt-1">
          {correct === total ? "パーフェクト！素晴らしい！"
            : correct >= total / 2 ? "よくできました！"
            : "次回はもっと頑張ろう！"}
        </p>
      </div>

      {/* Egg */}
      <div className="flex flex-col items-center gap-3">
        <EggCharacter stage={stageAfter} hatching={showHatch && isHatching} />

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>目標スコアまで</span>
            <span className="font-bold text-yellow-600">{pctAfter}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full transition-all duration-1000"
              style={{ width: `${pctAfter}%` }}
            />
          </div>
          {pctAfter > pctBefore && (
            <p className="text-xs text-yellow-600 mt-1 text-right font-bold">
              +{pctAfter - pctBefore}% 進んだ！
            </p>
          )}
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-600">問題の振り返り</h3>
        {results.map((r, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${
            r.isCorrect ? "bg-green-50" : "bg-red-50"
          }`}>
            <span className="mt-0.5">{r.isCorrect ? "✅" : "❌"}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{r.question.word.word}</span>
                <button onClick={() => speak(r.question.word.word)}
                  className="text-xl text-slate-300 hover:text-yellow-500 active:scale-90 transition-all"
                  aria-label="発音"
                >🔊</button>
              </div>
              <span className="text-slate-500">{r.question.word.meaning}</span>
              {!r.isCorrect && (
                <p className="text-xs text-red-500 mt-0.5">
                  あなたの答え: {r.question.choices[r.selectedIndex]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={onHome}
        className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-800 font-bold rounded-2xl transition-all"
      >
        ホームへ戻る 🏠
      </button>
    </div>
  );
}
