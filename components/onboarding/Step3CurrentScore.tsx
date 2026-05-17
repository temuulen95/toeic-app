"use client";

import { useState } from "react";

interface Props {
  onNext: (score: number) => void;
}

const MAX_SCORE = 700;
const PRESETS = [300, 400, 500, 600, 700];

export default function Step3CurrentScore({ onNext }: Props) {
  const [score, setScore] = useState<number | null>(500);
  const [sliderValue, setSliderValue] = useState(500);

  const displayScore = score === null ? "わからない" : score >= MAX_SCORE ? "700以上" : `${score}`;

  function handleSlider(v: number) {
    setScore(v);
    setSliderValue(v);
  }

  function handleUnknown() {
    setScore(null);
  }

  function handlePreset(p: number) {
    setScore(p);
    setSliderValue(p);
  }

  function handleNext() {
    // わからない → 0 (all levels shown)
    onNext(score === null ? 0 : score);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">現在のスコアは？</h2>
        <p className="text-slate-500 text-sm">だいたいで大丈夫です</p>
      </div>

      <div className="text-center">
        <div className={`text-6xl font-bold ${score === null ? "text-slate-400" : "text-yellow-500"}`}>
          {displayScore}
        </div>
        {score !== null && <div className="text-slate-400 text-sm mt-1">点</div>}
      </div>

      {/* Slider (disabled when わからない) */}
      <div className={`w-full max-w-xs transition-opacity ${score === null ? "opacity-40 pointer-events-none" : ""}`}>
        <input
          type="range"
          min={0}
          max={MAX_SCORE}
          step={10}
          value={sliderValue}
          onChange={e => handleSlider(Number(e.target.value))}
          className="w-full accent-yellow-400"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0</span>
          <span>700以上</span>
        </div>
      </div>

      {/* Presets + わからない */}
      <div className="flex flex-wrap justify-center gap-2 max-w-xs">
        <button
          onClick={handleUnknown}
          className={`px-3 py-1 rounded-full text-sm border transition-all ${
            score === null
              ? "bg-slate-400 border-slate-400 font-bold text-white"
              : "border-slate-300 text-slate-500 hover:border-slate-400"
          }`}
        >
          わからない
        </button>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => handlePreset(p)}
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              score === p
                ? "bg-yellow-400 border-yellow-400 font-bold text-slate-800"
                : "border-slate-300 text-slate-500 hover:border-yellow-400"
            }`}
          >
            {p >= MAX_SCORE ? "700以上" : p}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        className="px-10 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-800 font-bold rounded-full text-lg transition-all active:scale-95"
      >
        つぎへ →
      </button>
    </div>
  );
}
