"use client";

import { useEffect, useState } from "react";
import { Question, QuizResult, WordExplanation } from "@/lib/types";
import { playCorrect, playIncorrect, playComboJingle } from "@/lib/sounds";
import ExplanationPanel from "./ExplanationPanel";

interface Props {
  question: Question;
  questionNumber: number;
  total: number;
  selected: number | null;
  onSelect: (index: number) => void;
  onNext: () => void;
  lastResult: QuizResult | null;
  onExplanationReady: (exp: WordExplanation) => void;
  combo: number;
  remainingForNext: number;
}

function speak(text: string) {
  if (typeof window === "undefined") return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

type FlashState = "correct" | "incorrect" | null;

export default function QuizCard({
  question,
  questionNumber,
  total,
  selected,
  onSelect,
  onNext,
  lastResult,
  onExplanationReady,
  combo,
  remainingForNext,
}: Props) {
  const [flash, setFlash] = useState<FlashState>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  const isAnswered = selected !== null;
  const isLast = questionNumber === total;
  const { prompt, choices, correctIndex, direction, word } = question;
  const dirLabel = direction === "en_to_ja" ? "日本語の意味は？" : "英語は？";

  useEffect(() => { setFlash(null); }, [question]);

  useEffect(() => {
    if (combo >= 2) {
      setShowCombo(true);
      const t = setTimeout(() => setShowCombo(false), 1500);
      return () => clearTimeout(t);
    }
  }, [combo]);

  function handleSelect(index: number) {
    const correct = index === correctIndex;
    if (correct) {
      // combo >= 2 means this correct answer brings it to 3+ — play Korobeiniki jingle
      if (combo >= 2) {
        playComboJingle(combo + 1);
      } else {
        playCorrect();
      }
      setFlash("correct");
    } else {
      playIncorrect();
      setFlash("incorrect");
      setShakeKey((k) => k + 1);
    }
    setTimeout(() => setFlash(null), 500);
    onSelect(index);
  }

  const comboLabel =
    combo >= 5 ? "🔥🔥🔥 " + combo + " COMBO!!" :
    combo >= 3 ? "🔥🔥 "   + combo + " COMBO!" :
    combo >= 2 ? "🔥 "     + combo + " COMBO!" : "";

  return (
    <div className="relative">
      {/* フラッシュオーバーレイ */}
      {flash === "correct" && (
        <div key={`fc-${questionNumber}-${selected}`}
          className="fixed inset-0 bg-green-400 pointer-events-none z-50 animate-flash-correct" />
      )}
      {flash === "incorrect" && (
        <div key={`fi-${questionNumber}-${selected}`}
          className="fixed inset-0 bg-red-300 pointer-events-none z-50 animate-flash-incorrect" />
      )}

      {/* コンボバナー */}
      {showCombo && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-combo-pop">
          <div className="bg-orange-500 text-white font-black px-6 py-2 rounded-full text-lg shadow-lg shadow-orange-300">
            {comboLabel}
          </div>
        </div>
      )}

      <div
        key={shakeKey > 0 ? `shake-${shakeKey}` : "card"}
        className={`bg-white rounded-3xl shadow-lg border border-yellow-100 p-6 max-w-sm w-full flex flex-col gap-5 ${
          flash === "incorrect" ? "animate-wrong-shake" : ""
        }`}
      >
        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400">
            {questionNumber} / {total}
          </span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / total) * 100}%` }}
            />
          </div>
          {/* あと○問で進化 */}
          {remainingForNext > 0 && (
            <span className="text-xs text-amber-500 font-bold whitespace-nowrap">
              🥚 あと{remainingForNext}問
            </span>
          )}
        </div>

        {/* Question */}
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-1">{dirLabel}</p>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-bold text-slate-800 tracking-wide">{prompt}</h2>
            {direction === "en_to_ja" && (
              <button
                onClick={() => speak(word.word)}
                className="text-slate-300 hover:text-yellow-500 transition-colors text-xl"
                aria-label="発音を聞く"
              >
                🔊
              </button>
            )}
          </div>
          {word.pos && (
            <span className="text-xs text-slate-400 mt-1 inline-block">{word.pos}</span>
          )}
        </div>

        {/* Choices */}
        <div className="flex flex-col gap-3">
          {choices.map((choice, i) => {
            const isCorrectChoice = i === correctIndex;
            const isSelectedChoice = i === selected;
            let cls = "w-full py-4 px-5 rounded-2xl border-2 text-base font-semibold transition-all duration-200 text-left ";
            if (!isAnswered) {
              cls += "border-slate-200 bg-white hover:border-yellow-400 hover:bg-yellow-50 active:scale-95 cursor-pointer";
            } else if (isCorrectChoice) {
              cls += "border-green-400 bg-green-50 text-green-800";
            } else if (isSelectedChoice) {
              cls += "border-red-400 bg-red-50 text-red-700";
            } else {
              cls += "border-slate-100 bg-slate-50 text-slate-400 cursor-default";
            }
            return (
              <button key={i} className={cls}
                onClick={() => !isAnswered && handleSelect(i)}
                disabled={isAnswered}
              >
                <span className="font-bold mr-3 text-slate-400">{i === 0 ? "A" : "B"}</span>
                {choice}
                {isAnswered && isCorrectChoice && (
                  <span className="ml-2 inline-block animate-check-pop origin-center">✓</span>
                )}
                {isAnswered && isSelectedChoice && !isCorrectChoice && (
                  <span className="ml-2">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 正解/不正解バナー */}
        {isAnswered && lastResult && (
          <div className={`text-center text-sm font-bold py-2 rounded-xl ${
            lastResult.isCorrect ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"
          }`}>
            {lastResult.isCorrect ? "🎉 正解！" : `❌ 不正解 — 正解: ${choices[correctIndex]}`}
          </div>
        )}

        {/* Explanation */}
        {isAnswered && lastResult && (
          <ExplanationPanel result={lastResult} onExplanationReady={onExplanationReady} />
        )}

        {/* Next button */}
        {isAnswered && (
          <button onClick={onNext}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-800 font-bold rounded-2xl transition-all"
          >
            {isLast ? "結果を見る 🎉" : "つぎの問題 →"}
          </button>
        )}
      </div>
    </div>
  );
}
