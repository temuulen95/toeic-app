"use client";

import { useEffect, useRef, useState } from "react";
import { Word } from "@/lib/types";
import { playCorrect, playIncorrect } from "@/lib/sounds";

interface SentenceData { sentence: string; translation: string; }
type Chip  = { text: string; key: string };
type Phase = "loading" | "error" | "playing" | "correct" | "incorrect";

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
  questionNumber: number;
  total: number;
  onComplete: (isCorrect: boolean) => void;
  onFeedback?: (phase: "correct" | "incorrect", sentence: string, translation: string) => void;
}

export default function SentenceBuilder({ word, motivation, questionNumber, total, onComplete, onFeedback }: Props) {
  const [data,    setData]    = useState<SentenceData | null>(null);
  const [phase,   setPhase]   = useState<Phase>("loading");
  const [bank,    setBank]    = useState<Chip[]>([]);
  const [placed,  setPlaced]  = useState<Chip[]>([]);
  const [flash,   setFlash]   = useState<"correct" | "incorrect" | null>(null);
  const [usedReveal, setUsedReveal] = useState(false);

  const placedRef = useRef<Chip[]>([]);
  const dataRef   = useRef<SentenceData | null>(null);
  placedRef.current = placed;
  dataRef.current   = data;

  useEffect(() => {
    let cancelled = false;
    setPhase("loading");
    setData(null);
    setBank([]);
    setPlaced([]);
    setUsedReveal(false);

    fetch("/api/sentence", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: word.word, meaning: word.meaning, motivation }),
    })
      .then(r => { if (!r.ok) throw new Error("server error"); return r.json(); })
      .then((d: SentenceData) => {
        if (cancelled) return;
        if (!d.sentence) throw new Error("no sentence");
        d.sentence = d.sentence.replace(/[.,!?;:]+$/, "").trim();
        setData(d);
        setBank(shuffle(toChips(d.sentence)));
        setPlaced([]);
        setPhase("playing");
      })
      .catch(() => {
        if (!cancelled) setPhase("error");
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.word]);

  // Auto-check when bank empties
  useEffect(() => {
    if (phase !== "playing" || bank.length !== 0 || placed.length === 0) return;
    const id = setTimeout(() => {
      const cur = placedRef.current;
      const dat = dataRef.current;
      if (!dat || cur.length === 0) return;
      const answer  = cur.map(c => c.text).join(" ").toLowerCase();
      const correct = dat.sentence.toLowerCase();
      if (answer === correct) {
        playCorrect();
        triggerFlash("correct");
        setPhase("correct");
        onFeedback?.("correct", dat.sentence, dat.translation);
      } else {
        playIncorrect();
        triggerFlash("incorrect");
        setPhase("incorrect");
        onFeedback?.("incorrect", dat.sentence, dat.translation);
      }
    }, 350);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank.length, placed.length, phase]);

  function triggerFlash(type: "correct" | "incorrect") {
    setFlash(type);
    setTimeout(() => setFlash(null), 600);
  }

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
    setUsedReveal(true);
    setPlaced(toChips(data.sentence));
    setBank([]);
    setPhase("correct");
  }

  const borderColor =
    phase === "correct"   ? "border-green-400 bg-green-50"  :
    phase === "incorrect" ? "border-red-400   bg-red-50"    :
    phase === "error"     ? "border-slate-200 bg-slate-50"  :
                            "border-sky-200   bg-sky-50";

  // isLast means this is the last quiz item overall
  const isLast = questionNumber === total;

  return (
    <>
      {/* Flash overlay */}
      {flash === "correct" && (
        <div className="fixed inset-0 bg-green-400 pointer-events-none z-[60] animate-flash-correct" />
      )}
      {flash === "incorrect" && (
        <div className="fixed inset-0 bg-red-400 pointer-events-none z-[60] animate-flash-incorrect" />
      )}

      <div className={`bg-white rounded-3xl shadow-lg border border-yellow-100 p-4 max-w-sm w-full flex flex-col gap-3`}>
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400">
            {questionNumber} / {total}
          </span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-400 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / total) * 100}%` }}
            />
          </div>
          <span className="text-xs text-sky-500 font-bold">🧩 並び替え</span>
        </div>

        <div className={`rounded-2xl border-2 transition-colors duration-300 overflow-hidden ${borderColor}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <div className="text-white font-black text-sm tracking-wide">文章並び替えパズル</div>
              <div className="text-sky-100 text-xs">
                <span className="font-bold text-white">{word.word}</span>
                <span className="ml-1">を使って並べよう</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Loading */}
            {phase === "loading" && (
              <div className="flex items-center gap-3 py-4 justify-center text-sky-600">
                <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">例文を生成中...</span>
              </div>
            )}

            {/* Error */}
            {phase === "error" && (
              <div className="py-4 space-y-3 text-center">
                <p className="text-sm text-slate-500">例文の生成に失敗しました</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setPhase("loading");
                      fetch("/api/sentence", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ word: word.word, meaning: word.meaning, motivation }),
                      })
                        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
                        .then((d: SentenceData) => {
                          if (!d.sentence) throw new Error();
                          d.sentence = d.sentence.replace(/[.,!?;:]+$/, "").trim();
                          setData(d);
                          setBank(shuffle(toChips(d.sentence)));
                          setPlaced([]);
                          setPhase("playing");
                        })
                        .catch(() => setPhase("error"));
                    }}
                    className="px-4 py-2 bg-sky-500 text-white text-sm font-bold rounded-xl hover:bg-sky-600 active:scale-95 transition-all"
                  >
                    🔄 もう一度
                  </button>
                  <button
                    onClick={() => onComplete(false)}
                    className="px-4 py-2 border-2 border-slate-200 text-slate-500 text-sm font-bold rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    スキップ
                  </button>
                </div>
              </div>
            )}

            {/* Playing / Result */}
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
                          phase === "playing"   ? "bg-sky-500 text-white shadow-sm hover:bg-sky-600" :
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
                {phase === "playing" && (
                  <div>
                    <div className="text-xs font-bold text-slate-500 mb-2">② 単語バンク</div>
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

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                  {/* Sub-action row */}
                  {(phase === "playing" && placed.length > 0) || phase === "incorrect" ? (
                    <div className="flex gap-2">
                      {phase === "playing" && placed.length > 0 && (
                        <button
                          onClick={reset}
                          className="flex-1 h-11 whitespace-nowrap border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all active:scale-95"
                        >
                          🔄 リセット
                        </button>
                      )}
                      {phase === "incorrect" && (
                        <>
                          <button
                            onClick={reset}
                            className="flex-1 h-11 whitespace-nowrap border-2 border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl text-sm font-bold transition-all active:scale-95"
                          >
                            🔄 もう一度
                          </button>
                          <button
                            onClick={reveal}
                            className="flex-1 h-11 whitespace-nowrap border-2 border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all active:scale-95"
                          >
                            📖 正解を見る
                          </button>
                        </>
                      )}
                    </div>
                  ) : null}
                  {/* Primary CTA */}
                  {(phase === "correct" || phase === "incorrect") && (
                    <button
                      onClick={() => onComplete(phase === "correct" && !usedReveal)}
                      className={`w-full h-12 font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm ${
                        phase === "correct"
                          ? "bg-yellow-400 hover:bg-yellow-500 text-slate-800"
                          : "bg-yellow-400 hover:bg-yellow-500 text-slate-800"
                      }`}
                    >
                      {isLast ? "結果を見る 🎉" : "つぎへ →"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
