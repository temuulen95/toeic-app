"use client";

import { useState } from "react";
import { QuizItem, QuizResult, Word, Question, UserProfile, LearningProgress } from "@/lib/types";
import { generateQuizItems } from "@/lib/quiz";
import { calcProgressPercent, getEggStage, getCorrectUntilNextStage } from "@/lib/progress";
import EggCharacter from "@/components/home/EggCharacter";
import QuizCard from "./QuizCard";
import SentenceBuilder from "./SentenceBuilder";
import ExplanationPanel from "./ExplanationPanel";

const WORD_COUNT = 5;

interface Props {
  words: Word[];
  studiedWordIds: string[];
  profile: UserProfile;
  baseProgress: LearningProgress;
  onComplete: (results: QuizResult[]) => void;
}

export default function QuizScreen({ words, studiedWordIds, profile, baseProgress, onComplete }: Props) {
  const [items] = useState<QuizItem[]>(() =>
    generateQuizItems(words, WORD_COUNT, studiedWordIds, profile.currentScore)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [pendingResult, setPendingResult] = useState<QuizResult | null>(null);
  const [combo, setCombo] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [eggMood, setEggMood] = useState<"happy" | "sad" | null>(null);
  const [spFeedback, setSpFeedback] = useState<{ phase: "correct" | "incorrect"; sentence: string; translation: string } | null>(null);

  const currentItem = items[currentIndex];
  const totalItems = items.length;
  const runningTotal = baseProgress.totalCorrect + sessionCorrect;
  const remainingForNext = getCorrectUntilNextStage(profile, runningTotal);

  const eggStage = getEggStage(calcProgressPercent(profile, baseProgress));

  function advance(newResults: QuizResult[]) {
    setEggMood(null);
    setSpFeedback(null);
    if (currentIndex + 1 >= totalItems) {
      onComplete(newResults);
    } else {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setPendingResult(null);
    }
  }

  function handleMCSelect(index: number) {
    const q = (currentItem as { kind: "mc"; question: Question }).question;
    const correct = index === q.correctIndex;
    const result: QuizResult = {
      kind: "mc",
      question: q,
      selectedIndex: index,
      isCorrect: correct,
      explanation: null,
    };
    setSelected(index);
    setPendingResult(result);
    setEggMood(correct ? "happy" : "sad");
    if (correct) {
      setCombo(c => c + 1);
      setSessionCorrect(c => c + 1);
    } else {
      setCombo(0);
    }
  }

  function handleMCNext() {
    const finalResult = pendingResult!;
    const newResults = [...results, finalResult];
    setResults(newResults);
    advance(newResults);
  }

  function handleSPFeedback(phase: "correct" | "incorrect", sentence: string, translation: string) {
    setSpFeedback({ phase, sentence, translation });
    setEggMood(phase === "correct" ? "happy" : "sad");
  }

  function handleSPComplete(isCorrect: boolean) {
    const spWord = (currentItem as { kind: "sp"; word: Word }).word;
    const fakeQuestion: Question = {
      word: spWord,
      direction: "en_to_ja",
      prompt: spWord.word,
      choices: [spWord.meaning, ""],
      correctIndex: 0,
    };
    const result: QuizResult = {
      kind: "sp",
      question: fakeQuestion,
      selectedIndex: isCorrect ? 0 : -1,
      isCorrect,
      explanation: null,
    };
    if (isCorrect) setSessionCorrect(c => c + 1);
    const newResults = [...results, result];
    setResults(newResults);
    advance(newResults);
  }

  const eggEl = (
    <div className={eggMood === "happy" ? "animate-egg-sway" : eggMood === "sad" ? "animate-wrong-shake" : ""}>
      <EggCharacter stage={eggStage} />
    </div>
  );

  if (currentItem.kind === "mc") {
    return (
      <div className="flex flex-col items-center w-full max-w-sm gap-4">
        <div className="flex flex-col items-center gap-2 w-full">
          {eggEl}
          {pendingResult && (
            <>
              <div className={`text-sm font-black px-4 py-1 rounded-full ${
                pendingResult.isCorrect ? "text-green-700 bg-green-100" : "text-red-600 bg-red-100"
              }`}>
                {pendingResult.isCorrect ? "🎉 正解！" : "❌ 不正解"}
              </div>
              <ExplanationPanel
                result={pendingResult}
                motivation={profile.motivation}
              />
            </>
          )}
        </div>
        <QuizCard
          question={currentItem.question}
          questionNumber={currentIndex + 1}
          total={totalItems}
          selected={selected}
          onSelect={handleMCSelect}
          onNext={handleMCNext}
          lastResult={pendingResult}
          combo={combo}
          remainingForNext={remainingForNext}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm gap-4">
      <div className="flex flex-col items-center gap-2 w-full">
        {eggEl}
        {spFeedback && (
          <div className={`w-full rounded-2xl border-2 p-4 space-y-2 ${
            spFeedback.phase === "correct"
              ? "bg-green-50 border-green-300"
              : "bg-red-50 border-red-300"
          }`}>
            {spFeedback.phase === "correct" ? (
              <>
                <div className="font-black text-green-700 text-sm">🎉 正解！すばらしい！</div>
                <p className="text-slate-600 text-sm leading-relaxed">{spFeedback.translation}</p>
              </>
            ) : (
              <>
                <div className="font-black text-red-600 text-sm">❌ 惜しい！正しい順番はこちら：</div>
                <p className="font-bold text-slate-800 text-sm bg-white rounded-lg px-3 py-2 border border-red-100">{spFeedback.sentence}</p>
                <p className="text-xs text-slate-500">{spFeedback.translation}</p>
              </>
            )}
          </div>
        )}
      </div>
      <SentenceBuilder
        word={currentItem.word}
        motivation={profile.motivation}
        questionNumber={currentIndex + 1}
        total={totalItems}
        onComplete={handleSPComplete}
        onFeedback={handleSPFeedback}
      />
    </div>
  );
}
