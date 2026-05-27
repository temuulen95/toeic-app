"use client";

import { useState } from "react";
import { QuizItem, QuizResult, Word, Question, WordExplanation, UserProfile, LearningProgress } from "@/lib/types";
import { generateQuizItems } from "@/lib/quiz";
import { calcProgressPercent, getEggStage, getCorrectUntilNextStage } from "@/lib/progress";
import EggCharacter from "@/components/home/EggCharacter";
import QuizCard from "./QuizCard";
import SentenceBuilder from "./SentenceBuilder";

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
  const [eggSpeech, setEggSpeech] = useState<string | null>(null);

  const currentItem = items[currentIndex];
  const totalItems = items.length;
  const runningTotal = baseProgress.totalCorrect + sessionCorrect;
  const remainingForNext = getCorrectUntilNextStage(profile, runningTotal);

  const eggStage = getEggStage(calcProgressPercent(profile, baseProgress));

  function advance(newResults: QuizResult[]) {
    setEggMood(null);
    setEggSpeech(null);
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
    setEggSpeech(null);
    if (correct) {
      setCombo(c => c + 1);
      setSessionCorrect(c => c + 1);
    } else {
      setCombo(0);
    }
  }

  function handleMCExplanationReady(exp: WordExplanation) {
    setPendingResult(prev => prev ? { ...prev, explanation: exp } : prev);
    const speech = exp.wrongAnswerNote || exp.explanation;
    if (speech) setEggSpeech(speech);
  }

  function handleMCNext() {
    const finalResult = pendingResult!;
    const newResults = [...results, finalResult];
    setResults(newResults);
    advance(newResults);
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

  const eggSection = (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className={eggMood === "happy" ? "animate-egg-sway" : eggMood === "sad" ? "animate-wrong-shake" : ""}>
        <EggCharacter stage={eggStage} />
      </div>
      {eggSpeech && (
        <div className="relative bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-2 max-w-[300px] text-center">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0
            border-l-[6px] border-r-[6px] border-b-[8px]
            border-l-transparent border-r-transparent border-b-yellow-200" />
          <p className="text-xs font-bold text-yellow-800 leading-relaxed">{eggSpeech}</p>
        </div>
      )}
    </div>
  );

  if (currentItem.kind === "mc") {
    return (
      <div className="flex flex-col items-center w-full max-w-sm gap-4">
        {eggSection}
        <QuizCard
          question={currentItem.question}
          questionNumber={currentIndex + 1}
          total={totalItems}
          selected={selected}
          onSelect={handleMCSelect}
          onNext={handleMCNext}
          lastResult={pendingResult}
          onExplanationReady={handleMCExplanationReady}
          combo={combo}
          remainingForNext={remainingForNext}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm gap-4">
      {eggSection}
      <SentenceBuilder
        word={currentItem.word}
        motivation={profile.motivation}
        questionNumber={currentIndex + 1}
        total={totalItems}
        onComplete={handleSPComplete}
      />
    </div>
  );
}
