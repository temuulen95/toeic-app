"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AppPhase, LearningProgress, QuizResult, UserProfile, Word } from "@/lib/types";
import { getProfile, getProgress, saveProfile, saveProgress } from "@/lib/storage";
import { unlockAudio } from "@/lib/sounds";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import HomeScreen from "./home/HomeScreen";
import QuizScreen from "./quiz/QuizScreen";
import ResultScreen from "./result/ResultScreen";
import EggCharacter from "./home/EggCharacter";

export default function AppController() {
  const { user, isLoaded } = useUser();
  const [phase, setPhase] = useState<AppPhase | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<LearningProgress>({
    totalAnswered: 0,
    totalCorrect: 0,
    sessionsCompleted: 0,
    studiedWordIds: [],
    lastStudiedAt: null,
  });
  const [words, setWords] = useState<Word[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [progressSnapshot, setProgressSnapshot] = useState<LearningProgress>(progress);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Unlock Web Audio API on first user interaction (required for iOS Safari)
  useEffect(() => {
    const unlock = () => {
      unlockAudio();
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("mousedown", unlock, true);
    };
    window.addEventListener("touchstart", unlock, true);
    window.addEventListener("mousedown", unlock, true);
    return () => {
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("mousedown", unlock, true);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const userId = user.id;
    const savedProfile = getProfile(userId);
    const savedProgress = getProgress(userId);
    setProgress(savedProgress);

    if (savedProfile) {
      setProfile(savedProfile);
      setPhase("home");
    } else {
      setPhase("onboarding");
    }

    fetch("/api/words")
      .then(r => r.json())
      .then(setWords)
      .catch(() => setLoadError("単語リストの読み込みに失敗しました"));
  }, [isLoaded, user]);

  function handleOnboardingComplete(newProfile: UserProfile) {
    if (!user) return;
    saveProfile(user.id, newProfile);
    setProfile(newProfile);
    setPhase("home");
  }

  function handleStartQuiz() {
    setProgressSnapshot(progress);
    setPhase("quiz");
  }

  function handleQuizComplete(results: QuizResult[]) {
    if (!user) return;
    const correct = results.filter(r => r.isCorrect).length;
    const newWordIds = results.map(r => String(r.question.word.id));

    const newProgress: LearningProgress = {
      totalAnswered: progress.totalAnswered + results.length,
      totalCorrect: progress.totalCorrect + correct,
      sessionsCompleted: progress.sessionsCompleted + 1,
      studiedWordIds: [...new Set([...progress.studiedWordIds, ...newWordIds])],
      lastStudiedAt: new Date().toISOString(),
    };

    saveProgress(user.id, newProgress);
    setProgress(newProgress);
    setQuizResults(results);
    setPhase("result");
  }

  if (!isLoaded || phase === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <EggCharacter stage="s0" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{loadError}</p>
        <p className="text-sm mt-2 text-slate-400">data/toeic_wordlist.json を確認してください</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-amber-50 flex flex-col items-center justify-start py-4 px-4">
      {phase === "onboarding" && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
      {phase === "home" && profile && (
        <HomeScreen
          profile={profile}
          progress={progress}
          onStartQuiz={handleStartQuiz}
        />
      )}
      {phase === "quiz" && words.length >= 2 && profile && (
        <QuizScreen
          words={words}
          studiedWordIds={progress.studiedWordIds}
          profile={profile}
          baseProgress={progressSnapshot}
          onComplete={handleQuizComplete}
        />
      )}
      {phase === "quiz" && words.length < 2 && (
        <div className="text-slate-500 text-sm">単語を読み込み中...</div>
      )}
      {phase === "result" && profile && (
        <ResultScreen
          results={quizResults}
          profile={profile}
          progressBefore={progressSnapshot}
          progressAfter={progress}
          onHome={() => setPhase("home")}
        />
      )}
    </div>
  );
}
