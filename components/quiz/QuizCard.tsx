"use client";

import { useEffect, useState } from "react";
import { Question, QuizResult, WordExplanation } from "@/lib/types";
import { playCorrect, playIncorrect, playComboJingle } from "@/lib/sounds";
import ExplanationPanel from "./ExplanationPanel";
import SentenceBuilder from "./SentenceBuilder";

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
  motivation: string;
}

function speak(text: string) {
  if (typeof window === "undefined") return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  u.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    v => v.lang.startsWith("en") && (
      v.name.includes("Natural") || v.name.includes("Samantha") ||
      v.name.includes("Google")  || v.name.includes("Karen")    ||
      v.name.includes("Moira")
    )
  );
  if (preferred) u.voice = preferred;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

type FlashState = "correct" | "incorrect" | null;

// After a correct answer the card shows:
//   1. answer feedback banner
//   2. SentenceBuilder  ← handles its own "次の問題へ" (calls onNext directly)
//
// After an incorrect answer the card shows:
//   1. answer feedback banner
//   2. ExplanationPanel
//   3. "次の問題 →" button

export default function QuizCard({
  question, questionNumber, total, selected,
  onSelect, onNext, lastResult, onExplanationReady,
  combo, remainingForNext, motivation,
}: Props) {
  const [flash,         setFlash]         = useState<FlashState>(null);
  const [shakeKey,      setShakeKey]      = useState(0);
  const [showCombo,     setShowCombo]     = useState(false);
  // skipped = user pressed "スキップ" in SentenceBuilder → show explanation then next btn
  const [sbSkipped,     setSbSkipped]     = useState(false);

  const isAnswered = selected !== null;
  const isLast     = questionNumber === total;
  const { prompt, choices, correctIndex, word } = question;
  const emoji = word.emoji ?? "";

  // Reset per-question state when question changes
  useEffect(() => {
    setFlash(null);
    setSbSkipped(false);
  }, [question]);

  useEffect(() => {
    if (combo >= 2) {
      setShowCombo(true);
      const t = setTimeout(() => setShowCombo(false), 1500);
      return () => clearTimeout(t);
    }
  }, [combo]);

  function handleSelect(idx: number) {
    const correct = idx === correctIndex;
    if (correct) {
      combo >= 2 ? playComboJingle(combo + 1) : playCorrect();
      setFlash("correct");
    } else {
      playIncorrect();
      setFlash("incorrect");
      setShakeKey(k => k + 1);
    }
    setTimeout(() => setFlash(null), 500);
    onSelect(idx);
  }

  const comboLabel =
    combo >= 5 ? `🔥🔥🔥 ${combo} COMBO!!` :
    combo >= 3 ? `🔥🔥 ${combo} COMBO!`   :
    combo >= 2 ? `🔥 ${combo} COMBO!`     : "";

  // Decide what to show after answering
  const showSentenceBuilder =
    isAnswered && !!lastResult?.isCorrect && !sbSkipped;

  const showExplanation =
    isAnswered && lastResult &&
    (!lastResult.isCorrect || sbSkipped);

  const showNextBtn =
    isAnswered && (!lastResult?.isCorrect || sbSkipped);

  return (
    <div className="relative">
      {/* Flash overlays */}
      {flash === "correct" && (
        <div key={`fc-${questionNumber}-${selected}`}
          className="fixed inset-0 bg-green-400 pointer-events-none z-50 animate-flash-correct" />
      )}
      {flash === "incorrect" && (
        <div key={`fi-${questionNumber}-${selected}`}
          className="fixed inset-0 bg-red-300 pointer-events-none z-50 animate-flash-incorrect" />
      )}

      {/* Combo banner */}
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
        {/* Progress bar */}
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
          {remainingForNext > 0 && (
            <span className="text-xs text-amber-500 font-bold whitespace-nowrap">
              🥚 あと{remainingForNext}問
            </span>
          )}
        </div>

        {/* Question */}
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-3">日本語の意味は？</p>

          {/* Emoji hint (only before answering) */}
          {emoji && !isAnswered && (
            <div className="text-5xl mb-3 select-none">{emoji}</div>
          )}

          {/* Word + speak button */}
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-3xl font-bold text-slate-800 tracking-wide">{prompt}</h2>
            <button
              onClick={() => speak(word.word)}
              className="text-2xl text-slate-300 hover:text-yellow-500 active:scale-90 transition-all"
              aria-label="発音を聞く"
            >
              🔊
            </button>
          </div>

          {word.pos && (
            <span className="text-xs text-slate-400 mt-1 inline-block">{word.pos}</span>
          )}

          {/* Emoji + meaning revealed after answering */}
          {isAnswered && (
            <div className="mt-3 flex items-center justify-center gap-2 animate-check-pop">
              {emoji && <span className="text-3xl">{emoji}</span>}
              <span className="text-base font-bold text-slate-700">{word.meaning}</span>
            </div>
          )}
        </div>

        {/* Choices */}
        <div className="flex flex-col gap-3">
          {choices.map((choice, i) => {
            const isCorrectChoice  = i === correctIndex;
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
                  <span className="ml-2 inline-block animate-check-pop">✓</span>
                )}
                {isAnswered && isSelectedChoice && !isCorrectChoice && (
                  <span className="ml-2">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer result banner */}
        {isAnswered && lastResult && (
          <div className={`text-center text-sm font-bold py-2 rounded-xl ${
            lastResult.isCorrect
              ? "bg-green-100 text-green-700"
              : "bg-red-50 text-red-600"
          }`}>
            {lastResult.isCorrect
              ? "🎉 正解！"
              : `❌ 不正解 — 正解: ${choices[correctIndex]}`}
          </div>
        )}

        {/* ── Sentence Builder（正解時） ── */}
        {showSentenceBuilder && (
          <SentenceBuilder
            word={word}
            motivation={motivation}
            onNext={onNext}           // 完了→次の問題
            onSkip={() => setSbSkipped(true)}  // スキップ→解説表示
          />
        )}

        {/* ── AI解説（不正解 or スキップ後） ── */}
        {showExplanation && (
          <ExplanationPanel
            result={lastResult!}
            onExplanationReady={onExplanationReady}
          />
        )}

        {/* ── 次へボタン（不正解 or スキップ後） ── */}
        {showNextBtn && (
          <button
            onClick={onNext}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-800 font-bold rounded-2xl transition-all"
          >
            {isLast ? "結果を見る 🎉" : "つぎの問題 →"}
          </button>
        )}
      </div>
    </div>
  );
}
