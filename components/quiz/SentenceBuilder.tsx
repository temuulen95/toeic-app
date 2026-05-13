"use client";

import { useEffect, useRef, useState } from "react";
import { Word } from "@/lib/types";
import { playCorrect, playIncorrect } from "@/lib/sounds";

/* ── types ── */
interface SentenceData { sentence: string; translation: string; }
type Chip  = { text: string; key: string };
type Phase = "loading" | "playing" | "correct" | "incorrect";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toChips(sentence: string): Chip[] {
  return sentence.split(" ").filter(Boolean).map((t, i) => ({ text: t, key: `${t}__${i}` }));
}

interface Props {
  word: Word;
  motivation: string;
  onNext: () => void;   // proceed to next question
  onSkip: () => void;   // skip → go straight to explanation
}

/* ── component ── */
export default function SentenceBuilder({ word, motivation, onNext, onSkip }: Props) {
  const [data,    setData]    = useState<SentenceData | null>(null);
  const [phase,   setPhase]   = useState<Phase>("loading");
  const [bank,    setBank]    = useState<Chip[]>([]);
  const [placed,  setPlaced]  = useState<Chip[]>([]);
  const [flash,   setFlash]   = useState<"correct" | "incorrect" | null>(null);

  // keep latest placed/data accessible in setTimeout without stale closure
  const placedRef = useRef<Chip[]>([]);
  const dataRef   = useRef<SentenceData | null>(null);
  placedRef.current = placed;
  dataRef.current   = data;

  /* fetch sentence on mount */
  useEffect(() => {
    let cancelled = false;
    setPhase("loading");
    fetch("/api/sentence", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: word.word, meaning: word.meaning, motivation }),
    })
      .then(r => r.json())
      .then((d: SentenceData) => {
        if (cancelled) return;
        d.sentence = d.sentence.replace(/[.,!?;:]+$/, "").trim();
        setData(d);
        setBank(shuffle(toChips(d.sentence)));
        setPlaced([]);
        setPhase("playing");
      })
      .catch(() => { if (!cancelled) onSkip(); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.word]);

  /* auto-check when bank empties */
  useEffect(() => {
    if (phase !== "playing" || bank.length !== 0 || placed.length === 0) return;
    const id = setTimeout(() => {
      const cur  = placedRef.current;
      const dat  = dataRef.current;
      if (!dat || cur.length === 0) return;
      const answer  = cur.map(c => c.text).join(" ").toLowerCase();
      const correct = dat.sentence.toLowerCase();
      if (answer === correct) {
        playCorrect();
        triggerFlash("correct");
        setPhase("correct");
      } else {
        playIncorrect();
        triggerFlash("incorrect");
        setPhase("incorrect");
      }
    }, 350);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank.length, placed.length, phase]);

  function triggerFlash(type: "correct" | "incorrect") {
    setFlash(type);
    setTimeout(() => setFlash(null), 600);
  }

  /* chip interactions */
  function tapBank(chip: Chip) {
    if (phase !== "playing") return;
    setBank(b => b.filter(c => c.key !== chip.key));
    setPlaced(p => [...p, chip]);
  }

  function tapPlaced(chip: Chip) {
    if (phase !== "playing") return;
    setPlaced(p => p.filter(c => c.key !== chip.key));
    setBank(b => [...b, chip]);
  }

  function reset() {
    if (!data) return;
    setBank(shuffle(toChips(data.sentence)));
    setPlaced([]);
    setPhase("playing");
  }

  function reveal() {
    if (!data) return;
    setPlaced(toChips(data.sentence));
    setBank([]);
    setPhase("correct");
  }

  /* ── render ── */
  const borderColor =
    phase === "correct"   ? "border-green-400 bg-green-50"  :
    phase === "incorrect" ? "border-red-400   bg-red-50"    :
                            "border-sky-200   bg-sky-50";

  return (
    <>
      {/* Full-screen flash overlay */}
      {flash === "correct" && (
        <div className="fixed inset-0 bg-green-400 pointer-events-none z-[60] animate-flash-correct" />
      )}
      {flash === "incorrect" && (
        <div className="fixed inset-0 bg-red-400 pointer-events-none z-[60] animate-flash-incorrect" />
      )}

      <div className={`rounded-2xl border-2 transition-colors duration-300 overflow-hidden ${borderColor}`}>

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <div className="text-white font-black text-sm tracking-wide">応用問題</div>
              <div className="text-sky-100 text-xs">単語を正しい順番に並べよう</div>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-white/60 hover:text-white text-xs underline transition-colors"
          >
            スキップ
          </button>
        </div>

        <div className="p-4 space-y-4">

          {/* ── Loading ── */}
          {phase === "loading" && (
            <div className="flex items-center gap-3 py-4 justify-center text-sky-600">
              <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">例文を生成中...</span>
            </div>
          )}

          {/* ── Playing / Result ── */}
          {phase !== "loading" && data && (
            <>
              {/* Answer area */}
              <div>
                <div className="text-xs font-bold text-slate-500 mb-2">① ここに並べる</div>
                <div className={`min-h-14 flex flex-wrap gap-2 items-center p-3 rounded-xl border-2 transition-colors ${
                  phase === "correct"   ? "border-green-400 bg-white" :
                  phase === "incorrect" ? "border-red-400   bg-white" :
                                          "border-dashed border-slate-300 bg-white"
                }`}>
                  {placed.length === 0 && (
                    <span className="text-slate-300 text-sm select-none">ここにタップで追加</span>
                  )}
                  {placed.map(chip => (
                    <button
                      key={chip.key}
                      onClick={() => tapPlaced(chip)}
                      className={`px-3 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                        phase === "playing"   ? "bg-sky-500 text-white shadow-sm hover:bg-sky-600 hover:shadow-md" :
                        phase === "correct"   ? "bg-green-500 text-white cursor-default" :
                                                "bg-red-400 text-white cursor-default"
                      }`}
                    >
                      {chip.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Word bank */}
              {(phase === "playing") && (
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-2">② 単語バンク（タップで追加・タップで戻す）</div>
                  <div className="flex flex-wrap gap-2 min-h-10">
                    {bank.map(chip => (
                      <button
                        key={chip.key}
                        onClick={() => tapBank(chip)}
                        className="px-3 py-2 rounded-xl text-sm font-bold bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 active:scale-95 transition-all shadow-sm"
                      >
                        {chip.text}
                      </button>
                    ))}
                    {bank.length === 0 && (
                      <div className="w-full flex items-center justify-center py-2">
                        <div className="flex items-center gap-2 text-sky-500 text-xs font-medium">
                          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                          チェック中...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Correct feedback */}
              {phase === "correct" && (
                <div className="bg-green-100 rounded-xl p-3 border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 font-black text-base mb-1">
                    <span>🎉</span> 正解！すばらしい！
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{data.translation}</p>
                </div>
              )}

              {/* Incorrect feedback */}
              {phase === "incorrect" && (
                <div className="bg-red-50 rounded-xl p-3 border border-red-200 space-y-2">
                  <div className="text-red-600 font-black text-sm flex items-center gap-1">
                    ❌ 惜しい！正しい順番はこちら：
                  </div>
                  <p className="text-slate-800 font-bold text-sm bg-white rounded-lg px-3 py-2 border border-red-100">
                    {data.sentence}
                  </p>
                  <p className="text-xs text-slate-500">{data.translation}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                {phase === "playing" && placed.length > 0 && (
                  <button
                    onClick={reset}
                    className="flex-1 py-3 border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all active:scale-95"
                  >
                    🔄 リセット
                  </button>
                )}
                {phase === "incorrect" && (
                  <>
                    <button
                      onClick={reset}
                      className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-slate-800 font-bold rounded-xl text-sm transition-all active:scale-95"
                    >
                      もう一度
                    </button>
                    <button
                      onClick={reveal}
                      className="flex-1 py-3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-sm transition-all active:scale-95"
                    >
                      正解を見る
                    </button>
                  </>
                )}
                {(phase === "correct" || phase === "incorrect") && (
                  <button
                    onClick={onNext}
                    className={`w-full py-3 font-bold rounded-xl text-sm transition-all active:scale-95 ${
                      phase === "correct"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-slate-700 hover:bg-slate-800 text-white"
                    }`}
                  >
                    次の問題へ →
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
