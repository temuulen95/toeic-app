"use client";

import { useEffect, useState, useCallback } from "react";
import { Word } from "@/lib/types";

interface SentenceData {
  sentence: string;
  translation: string;
}

type Chip = { text: string; key: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  word: Word;
  motivation: string;
  onDone: () => void;
}

type CheckState = "idle" | "correct" | "incorrect";

export default function SentenceBuilder({ word, motivation, onDone }: Props) {
  const [data, setData] = useState<SentenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bank, setBank] = useState<Chip[]>([]);
  const [placed, setPlaced] = useState<Chip[]>([]);
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/sentence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: word.word, meaning: word.meaning, motivation }),
    })
      .then((r) => r.json())
      .then((d: SentenceData) => {
        setData(d);
        const chips: Chip[] = d.sentence
          .split(" ")
          .filter(Boolean)
          .map((t, i) => ({ text: t, key: `${t}-${i}` }));
        setBank(shuffle(chips));
        setPlaced([]);
        setCheckState("idle");
        setDone(false);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        onDone(); // silently skip on error
      });
  }, [word.word, motivation, onDone]);

  const tapBank = useCallback((chip: Chip) => {
    if (checkState !== "idle") return;
    setBank((b) => b.filter((c) => c.key !== chip.key));
    setPlaced((p) => [...p, chip]);
  }, [checkState]);

  const tapPlaced = useCallback((chip: Chip) => {
    if (checkState !== "idle") return;
    setPlaced((p) => p.filter((c) => c.key !== chip.key));
    setBank((b) => [...b, chip]);
  }, [checkState]);

  const check = useCallback(() => {
    if (!data || placed.length === 0) return;
    const answer = placed.map((c) => c.text).join(" ").toLowerCase();
    const correct = data.sentence.toLowerCase();
    if (answer === correct) {
      setCheckState("correct");
      setDone(true);
    } else {
      setCheckState("incorrect");
    }
  }, [data, placed]);

  const reveal = useCallback(() => {
    if (!data) return;
    const chips: Chip[] = data.sentence
      .split(" ")
      .filter(Boolean)
      .map((t, i) => ({ text: t, key: `${t}-${i}` }));
    setPlaced(chips);
    setBank([]);
    setCheckState("correct");
    setDone(true);
  }, [data]);

  const retry = useCallback(() => {
    if (!data) return;
    const chips: Chip[] = data.sentence
      .split(" ")
      .filter(Boolean)
      .map((t, i) => ({ text: t, key: `${t}-${i}` }));
    setBank(shuffle(chips));
    setPlaced([]);
    setCheckState("idle");
  }, [data]);

  if (loading) {
    return (
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-sky-600 text-sm">
          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          応用問題を生成中...
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={`rounded-2xl border-2 p-4 space-y-4 transition-all ${
      checkState === "correct"
        ? "bg-green-50 border-green-300"
        : checkState === "incorrect"
        ? "bg-red-50 border-red-300"
        : "bg-sky-50 border-sky-200"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-black text-slate-700 text-sm">応用問題：並び替え</span>
        </div>
        <button
          onClick={onDone}
          className="text-xs text-slate-400 hover:text-slate-600 underline"
        >
          スキップ
        </button>
      </div>

      {/* Instruction */}
      <p className="text-xs text-slate-500">
        単語をタップして正しい語順に並べてください
      </p>

      {/* Answer area */}
      <div className={`min-h-12 flex flex-wrap gap-2 items-center bg-white rounded-xl p-3 border-2 transition-colors ${
        checkState === "correct"
          ? "border-green-400"
          : checkState === "incorrect"
          ? "border-red-400"
          : "border-dashed border-slate-200"
      }`}>
        {placed.length === 0 && (
          <span className="text-slate-300 text-sm select-none">ここに並べます</span>
        )}
        {placed.map((chip) => (
          <button
            key={chip.key}
            onClick={() => tapPlaced(chip)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${
              checkState === "idle"
                ? "bg-sky-500 text-white shadow-sm hover:bg-sky-600"
                : checkState === "correct"
                ? "bg-green-500 text-white"
                : "bg-red-400 text-white"
            }`}
          >
            {chip.text}
          </button>
        ))}
      </div>

      {/* Word bank */}
      {checkState === "idle" && (
        <div className="flex flex-wrap gap-2 min-h-10">
          {bank.map((chip) => (
            <button
              key={chip.key}
              onClick={() => tapBank(chip)}
              className="px-3 py-1.5 rounded-lg text-sm font-bold bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-400 hover:bg-sky-50 active:scale-95 transition-all shadow-sm"
            >
              {chip.text}
            </button>
          ))}
          {bank.length === 0 && placed.length > 0 && (
            <span className="text-xs text-slate-400 self-center">全ての単語を配置しました</span>
          )}
        </div>
      )}

      {/* Result feedback */}
      {checkState === "correct" && (
        <div className="bg-green-100 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-green-700 font-black text-sm">
            <span>🎉</span> 正解！すばらしい！
          </div>
          <p className="text-xs text-slate-600">{data.translation}</p>
        </div>
      )}

      {checkState === "incorrect" && (
        <div className="bg-red-50 rounded-xl p-3 space-y-1">
          <div className="text-red-600 font-bold text-sm">❌ 惜しい！正しい順番は：</div>
          <p className="text-slate-700 font-bold text-sm">{data.sentence}</p>
          <p className="text-xs text-slate-500">{data.translation}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {checkState === "idle" && (
          <>
            <button
              onClick={check}
              disabled={placed.length === 0}
              className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-sm transition-all active:scale-95"
            >
              確認する
            </button>
            {placed.length > 0 && (
              <button
                onClick={() => { setPlaced([]); setBank(shuffle(data.sentence.split(" ").filter(Boolean).map((t, i) => ({ text: t, key: `${t}-${i}` })))); }}
                className="px-3 py-2.5 border-2 border-slate-200 text-slate-500 hover:border-slate-300 rounded-xl text-sm transition-all"
              >
                リセット
              </button>
            )}
          </>
        )}
        {checkState === "incorrect" && (
          <>
            <button
              onClick={retry}
              className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-800 font-bold rounded-xl text-sm transition-all active:scale-95"
            >
              もう一度
            </button>
            <button
              onClick={reveal}
              className="flex-1 py-2.5 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-sm transition-all"
            >
              正解を見る
            </button>
          </>
        )}
        {done && (
          <button
            onClick={onDone}
            className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-all active:scale-95"
          >
            つぎへ →
          </button>
        )}
      </div>
    </div>
  );
}
