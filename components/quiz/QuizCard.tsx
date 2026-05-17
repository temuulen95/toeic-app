"use client";

import { useEffect, useState } from "react";
import { Question, QuizResult, WordExplanation } from "@/lib/types";
import { playCorrect, playIncorrect, playComboJingle } from "@/lib/sounds";
import ExplanationPanel from "./ExplanationPanel";
import WordIllustration from "./WordIllustration";

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

export default function QuizCard({
  question, questionNumber, total, selected,
  onSelect, onNext, lastResult, onExplanationReady,
  combo, remainingForNext,
}: Props) {
  const [flash, setFlash] = useState<FlashState>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [showEatAnim, setShowEatAnim] = useState(false);

  const isAnswered = selected !== null;
  const isLast = questionNumber === total;
  const { prompt, choices, correctIndex, word } = question;

  useEffect(() => {
    setFlash(null);
    setShowEatAnim(false);
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
      setShowEatAnim(true);
      setTimeout(() => setShowEatAnim(false), 1200);
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

  const showExplanation = isAnswered && lastResult !== null;
  const showNextBtn = isAnswered;

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

          {/* Word + speak button (NO emoji here) */}
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
        </div>

        {/* Egg eating animation (correct only) */}
        {showEatAnim && (
          <div className="flex items-center justify-center gap-2 py-1 animate-fade-in">
            <span className="text-lg font-bold text-slate-600 animate-word-eaten">{word.word}</span>
            <svg viewBox="0 0 24 28" className="w-8 h-8 animate-egg-gulp" fill="none">
              <ellipse cx="12" cy="14.5" rx="10" ry="13" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
            </svg>
            <span className="text-sm text-green-600 font-bold">パクッ！</span>
          </div>
        )}

        {/* Choices — 2-column grid with illustrations */}
        <div className="grid grid-cols-2 gap-3">
          {choices.map((choice, i) => {
            const isCorrectChoice  = i === correctIndex;
            const isSelectedChoice = i === selected;
            let cls = "flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all duration-200 ";
            if (!isAnswered) {
              cls += "border-slate-200 bg-white hover:border-yellow-400 hover:bg-yellow-50 active:scale-95 cursor-pointer";
            } else if (isCorrectChoice) {
              cls += "border-green-400 bg-green-50";
            } else if (isSelectedChoice) {
              cls += "border-red-400 bg-red-50";
            } else {
              cls += "border-slate-100 bg-slate-50 opacity-50 cursor-default";
            }
            return (
              <button key={i} className={cls}
                onClick={() => !isAnswered && handleSelect(i)}
                disabled={isAnswered}
              >
                <WordIllustration meaning={choice} />
                <span className={`text-xs font-bold text-center leading-snug ${
                  isAnswered && isCorrectChoice ? "text-green-800" :
                  isAnswered && isSelectedChoice ? "text-red-700" :
                  "text-slate-700"
                }`}>
                  {choice}
                </span>
                {isAnswered && isCorrectChoice && (
                  <span className="text-green-500 font-bold text-sm animate-check-pop">✓</span>
                )}
                {isAnswered && isSelectedChoice && !isCorrectChoice && (
                  <span className="text-red-400 font-bold text-sm">✗</span>
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

        {/* AI解説（正解・不正解どちらも） */}
        {showExplanation && (
          <ExplanationPanel
            result={lastResult!}
            onExplanationReady={onExplanationReady}
          />
        )}

        {/* 次へボタン */}
        {showNextBtn && (
          <button
            onClick={onNext}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-800 font-bold rounded-2xl transition-all"
          >
            {isLast ? "結果を見る 🎉" : "つぎへ →"}
          </button>
        )}
      </div>
    </div>
  );
}
