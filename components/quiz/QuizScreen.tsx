"use client";

import { useState } from "react";
import { Question, QuizResult, Word, WordExplanation, UserProfile, LearningProgress } from "@/lib/types";
import { generateQuiz } from "@/lib/quiz";
import { getCorrectUntilNextStage } from "@/lib/progress";
import QuizCard from "./QuizCard";

const QUIZ_COUNT = 5;

interface Props {
  words: Word[];
  studiedWordIds: string[];
  profile: UserProfile;
  baseProgress: LearningProgress;
  onComplete: (results: QuizResult[]) => void;
}

export default function QuizScreen({ words, studiedWordIds, profile, baseProgress, onComplete }: Props) {
  const [questions] = useState<Question[]>(() =>
    generateQuiz(words, QUIZ_COUNT, studiedWordIds)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [pendingResult, setPendingResult] = useState<QuizResult | null>(null);
  const [combo, setCombo] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const runningTotal = baseProgress.totalCorrect + sessionCorrect;
  const remainingForNext = getCorrectUntilNextStage(profile, runningTotal);

  function handleSelect(index: number) {
    const q = questions[currentIndex];
    const correct = index === q.correctIndex;
    const result: QuizResult = {
      question: q,
      selectedIndex: index,
      isCorrect: correct,
      explanation: null,
    };
    setSelected(index);
    setPendingResult(result);
    if (correct) {
      setCombo((c) => c + 1);
      setSessionCorrect((c) => c + 1);
    } else {
      setCombo(0);
    }
  }

  function handleExplanationReady(exp: WordExplanation) {
    setPendingResult((prev) => prev ? { ...prev, explanation: exp } : prev);
  }

  function handleNext() {
    const finalResult = pendingResult!;
    const newResults = [...results, finalResult];
    setResults(newResults);

    if (currentIndex + 1 >= questions.length) {
      onComplete(newResults);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setPendingResult(null);
    }
  }

  return (
    <QuizCard
      question={questions[currentIndex]}
      questionNumber={currentIndex + 1}
      total={questions.length}
      selected={selected}
      onSelect={handleSelect}
      onNext={handleNext}
      lastResult={pendingResult}
      onExplanationReady={handleExplanationReady}
      combo={combo}
      remainingForNext={remainingForNext}
      motivation={profile.motivation}
    />
  );
}
