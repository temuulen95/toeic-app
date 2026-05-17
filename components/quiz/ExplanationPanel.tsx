"use client";

import { useEffect, useState } from "react";
import { QuizResult, WordExplanation } from "@/lib/types";

interface Props {
  result: QuizResult;
  onExplanationReady: (exp: WordExplanation) => void;
}

export default function ExplanationPanel({ result, onExplanationReady }: Props) {
  const [data, setData] = useState<WordExplanation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const word = result.question.word;

  useEffect(() => {
    setData(null);
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result }),
      signal: controller.signal,
    })
      .then(r => r.json())
      .then((parsed: WordExplanation) => {
        setData(parsed);
        setLoading(false);
        onExplanationReady(parsed);
      })
      .catch(err => {
        if (err.name === "AbortError") return;
        setError("解説の取得に失敗しました");
        setLoading(false);
      });

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.question.word.word]);

  if (error) {
    return <div className="p-3 bg-red-50 rounded-xl text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="font-black text-slate-800">{word.word}</span>
        <span className="text-amber-700 font-bold text-sm">{word.meaning}</span>
        {loading && (
          <div className="ml-auto w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {loading && !data ? (
        <div className="text-slate-400 text-sm animate-pulse">解説を生成中...</div>
      ) : data ? (
        <>
          {/* Examples first — 70% visual weight */}
          <div className="space-y-2">
            <div className="bg-white rounded-xl p-4 border border-amber-100">
              <div className="text-xs font-bold text-amber-600 mb-2">💼 ビジネス例文</div>
              <p className="text-base font-semibold text-slate-800 leading-relaxed">{data.businessExample}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-amber-100">
              <div className="text-xs font-bold text-sky-600 mb-2">🌸 日常例文</div>
              <p className="text-base font-semibold text-slate-800 leading-relaxed">{data.dailyExample}</p>
            </div>
          </div>
          {/* Explanation — 30% visual weight */}
          {data.explanation && (
            <p className="text-slate-400 text-xs leading-relaxed border-t border-amber-100 pt-2">
              {data.explanation}
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
