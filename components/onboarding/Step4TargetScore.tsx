"use client";

import { useState } from "react";

interface Props {
  currentScore: number;
  onNext: (score: number) => void;
}

const PRESETS = [500, 600, 700, 730, 800, 860, 900, 990];

export default function Step4TargetScore({ currentScore, onNext }: Props) {
  const defaultTarget = PRESETS.find((p) => p > currentScore) ?? 990;
  const [score, setScore] = useState(defaultTarget);

  const gap = score - currentScore;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">目標スコアは？</h2>
        <p className="text-slate-500 text-sm">現在: {currentScore}点 → 目標: ?</p>
      </div>

      <div className="text-center">
        <div className="text-6xl font-bold text-yellow-500">{score}</div>
        <div className="text-slate-400 text-sm mt-1">点</div>
        {gap > 0 && (
          <div className="mt-2 text-sm text-slate-500">
            あと <span className="font-bold text-yellow-600">+{gap}点</span> ！
          </div>
        )}
      </div>

      <div className="w-full max-w-xs">
        <input
          type="range"
          min={Math.min(currentScore + 50, 990)}
          max={990}
          step={5}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full accent-yellow-400"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{Math.min(currentScore + 50, 990)}</span>
          <span>990</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-xs">
        {PRESETS.filter((p) => p > currentScore).map((p) => (
          <button
            key={p}
            onClick={() => setScore(p)}
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              score === p
                ? "bg-yellow-400 border-yellow-400 font-bold text-slate-800"
                : "border-slate-300 text-slate-500 hover:border-yellow-400"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onNext(score)}
        className="px-10 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-800 font-bold rounded-full text-lg transition-all active:scale-95"
      >
        はじめる！🐣
      </button>
    </div>
  );
}
