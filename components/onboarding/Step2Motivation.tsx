"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/types";

type Motivation = UserProfile["motivation"];
type CareerSub = UserProfile["careerSubType"];

interface Props {
  onNext: (motivation: Motivation, careerSubType?: CareerSub) => void;
}

const options: { value: Motivation; label: string; emoji: string; desc: string }[] = [
  { value: "career", label: "キャリアアップ", emoji: "💼", desc: "転職・昇進を目指す" },
  { value: "overseas_assignment", label: "海外赴任", emoji: "✈️", desc: "仕事で海外へ" },
  { value: "travel", label: "海外旅行", emoji: "🌍", desc: "旅行をもっと楽しく" },
];

const careerOptions: { value: CareerSub; label: string }[] = [
  { value: "job_change", label: "転職" },
  { value: "promotion", label: "昇進・昇格" },
];

export default function Step2Motivation({ onNext }: Props) {
  const [selected, setSelected] = useState<Motivation | null>(null);
  const [careerSub, setCareerSub] = useState<CareerSub | undefined>(undefined);

  function handleConfirm() {
    if (!selected) return;
    onNext(selected, selected === "career" ? careerSub : undefined);
  }

  const canProceed = selected && (selected !== "career" || careerSub);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">学習の目的は？</h2>
        <p className="text-slate-500 text-sm">あなたに合ったアドバイスをします</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setSelected(opt.value); setCareerSub(undefined); }}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all text-left ${
              selected === opt.value
                ? "border-yellow-400 bg-yellow-50"
                : "border-slate-200 bg-white hover:border-yellow-300"
            }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <div>
              <div className="font-bold text-slate-800">{opt.label}</div>
              <div className="text-xs text-slate-500">{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {selected === "career" && (
        <div className="w-full max-w-sm">
          <p className="text-sm text-slate-600 mb-2 font-medium">具体的な目標は？</p>
          <div className="flex gap-3">
            {careerOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCareerSub(opt.value)}
                className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                  careerSub === opt.value
                    ? "border-yellow-400 bg-yellow-100 text-yellow-800"
                    : "border-slate-200 bg-white text-slate-600 hover:border-yellow-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={!canProceed}
        className="px-10 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-slate-200 disabled:text-slate-400 text-slate-800 font-bold rounded-full text-lg transition-all active:scale-95"
      >
        つぎへ →
      </button>
    </div>
  );
}
