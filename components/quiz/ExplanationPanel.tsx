"use client";

import { useEffect, useRef, useState } from "react";
import { QuizResult, WordExplanation } from "@/lib/types";

interface Props {
  result: QuizResult;
  motivation: string;
  onExplanationReady?: (exp: WordExplanation) => void;
}

// Extract a complete JSON string value from partial JSON text
function extractField(text: string, key: string): string | null {
  const regex = new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\[\\s\\S])*)"`, "");
  const match = text.match(regex);
  if (!match) return null;
  try {
    return JSON.parse(`"${match[1]}"`);
  } catch {
    return null;
  }
}

const FIELDS: (keyof WordExplanation)[] = [
  "wrongAnswerNote",
  "businessExample",
  "dailyExample",
  "explanation",
];

export default function ExplanationPanel({ result, motivation, onExplanationReady }: Props) {
  const [data, setData] = useState<Partial<WordExplanation>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const word = result.question.word;

  const accRef = useRef("");
  const foundRef = useRef(new Set<keyof WordExplanation>());
  const readyCalled = useRef(false);

  useEffect(() => {
    setData({});
    setLoading(true);
    setError(null);
    accRef.current = "";
    foundRef.current = new Set();
    readyCalled.current = false;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result, motivation }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) throw new Error("server error");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();

            if (payload === "[DONE]") {
              setLoading(false);
              // Final parse — fill any missing fields
              try {
                const parsed = JSON.parse(accRef.current) as WordExplanation;
                setData(parsed);
                if (!readyCalled.current) {
                  readyCalled.current = true;
                  onExplanationReady?.(parsed);
                }
              } catch {
                const acc = accRef.current;
                const final: WordExplanation = {
                  businessExample: extractField(acc, "businessExample") ?? "",
                  dailyExample:    extractField(acc, "dailyExample")    ?? "",
                  explanation:     extractField(acc, "explanation")     ?? "",
                  wrongAnswerNote: extractField(acc, "wrongAnswerNote") ?? undefined,
                };
                setData(final);
                if (!readyCalled.current) {
                  readyCalled.current = true;
                  onExplanationReady?.(final);
                }
              }
              break outer;
            }

            try {
              const { t } = JSON.parse(payload) as { t: string };
              accRef.current += t;

              // Progressive: reveal each field as soon as its value is complete
              const newlyFound: Partial<WordExplanation> = {};
              for (const field of FIELDS) {
                if (!foundRef.current.has(field)) {
                  const val = extractField(accRef.current, field);
                  if (val !== null) {
                    foundRef.current.add(field);
                    (newlyFound as Record<string, string>)[field] = val;
                  }
                }
              }
              if (Object.keys(newlyFound).length > 0) {
                setData(prev => ({ ...prev, ...newlyFound }));
              }
            } catch {}
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError("解説の取得に失敗しました");
        setLoading(false);
      }
    })();

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.question.word.word]);

  if (error) {
    return <div className="p-3 bg-red-50 rounded-xl text-red-500 text-sm">{error}</div>;
  }

  const hasData = Object.keys(data).length > 0;

  return (
    <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="font-black text-slate-800 text-sm">{word.word}</span>
        <span className="text-amber-700 font-bold text-xs">{word.meaning}</span>
        {loading && (
          <div className="ml-auto w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {!hasData && loading ? (
        <div className="text-slate-400 text-xs animate-pulse">解説を生成中...</div>
      ) : (
        <>
          {data.wrongAnswerNote && (
            <p className="text-red-700 text-xs leading-relaxed bg-red-50 rounded-lg px-2 py-1.5 font-medium">
              ❌ {data.wrongAnswerNote}
            </p>
          )}

          <div className="space-y-1.5">
            <div className="bg-white rounded-xl px-3 py-2 border border-amber-100">
              <span className="text-xs font-bold text-amber-600">💼 </span>
              {data.businessExample ? (
                <span className="text-xs text-slate-800 leading-relaxed">{data.businessExample}</span>
              ) : (
                <span className="inline-block w-32 h-3 bg-amber-100 rounded animate-pulse align-middle" />
              )}
            </div>
            <div className="bg-white rounded-xl px-3 py-2 border border-amber-100">
              <span className="text-xs font-bold text-sky-600">🌸 </span>
              {data.dailyExample ? (
                <span className="text-xs text-slate-800 leading-relaxed">{data.dailyExample}</span>
              ) : (
                <span className="inline-block w-32 h-3 bg-sky-100 rounded animate-pulse align-middle" />
              )}
            </div>
          </div>

          {data.explanation && (
            <p className="text-slate-400 text-xs leading-relaxed border-t border-amber-100 pt-1.5">
              {data.explanation}
            </p>
          )}
        </>
      )}
    </div>
  );
}
