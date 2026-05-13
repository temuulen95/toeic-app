"use client";

import { useEffect, useRef, useState } from "react";
import { QuizResult, WordExplanation } from "@/lib/types";

interface Props {
  result: QuizResult;
  onExplanationReady: (exp: WordExplanation) => void;
}

export default function ExplanationPanel({ result, onExplanationReady }: Props) {
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const notifiedRef = useRef(false);

  useEffect(() => {
    notifiedRef.current = false;
    setRaw("");
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    async function fetchExplanation() {
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("解説の取得に失敗しました");
        if (!res.body) throw new Error("レスポンスボディがありません");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        setLoading(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setRaw(accumulated);
        }

        // JSONとして解析してコールバック
        try {
          const parsed: WordExplanation = JSON.parse(accumulated);
          if (!notifiedRef.current) {
            notifiedRef.current = true;
            onExplanationReady(parsed);
          }
        } catch {
          // JSON解析失敗は無視（UIには生テキストを表示）
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchExplanation();
    return () => controller.abort();
  }, [result.question.word.word]);

  let parsed: WordExplanation | null = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    /* streaming中はparseできない */
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 rounded-xl text-red-500 text-sm">{error}</div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🤖</span>
        <span className="font-bold text-slate-700 text-sm">AI解説</span>
        {loading && (
          <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin ml-1" />
        )}
      </div>

      {loading && !parsed ? (
        <div className="text-slate-400 text-sm">解説を生成中...</div>
      ) : parsed ? (
        <>
          <p className="text-slate-700 text-sm leading-relaxed">{parsed.explanation}</p>
          <div className="space-y-2">
            <div className="bg-white rounded-xl p-3 border border-amber-100">
              <div className="text-xs font-bold text-amber-600 mb-1">💼 ビジネスシーン</div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{parsed.businessExample}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-amber-100">
              <div className="text-xs font-bold text-sky-600 mb-1">🌸 日常シーン</div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{parsed.dailyExample}</p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-slate-500 text-sm whitespace-pre-wrap">{raw}</p>
      )}
    </div>
  );
}
