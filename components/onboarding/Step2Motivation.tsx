"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/types";

type Motivation = UserProfile["motivation"];

interface Props {
  onNext: (motivation: Motivation) => void;
}

const options: { value: Motivation; label: string; emoji: string; desc: string }[] = [
  { value: "career",             label: "キャリアアップ", emoji: "💼", desc: "転職・昇進を目指す" },
  { value: "overseas_assignment",label: "海外赴任",       emoji: "✈️", desc: "仕事で海外へ" },
  { value: "travel",             label: "海外旅行",       emoji: "🌍", desc: "旅行をもっと楽しく" },
];

export default function Step2Motivation({ onNext }: Props) {
  const [selected, setSelected] = useState<Motivation | null>(null);

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
            onClick={() => setSelected(opt.value)}
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

      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="px-10 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-slate-200 disabled:text-slate-400 text-slate-800 font-bold rounded-full text-lg transition-all active:scale-95"
      >
        つぎへ →
      </button>
    </div>
  );
}
