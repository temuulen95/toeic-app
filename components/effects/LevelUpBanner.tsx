"use client";

import { useEffect, useState } from "react";
import { EggStage } from "@/lib/types";
import { getStageIndex } from "@/lib/progress";

const STAGE_NAMES: Record<EggStage, string> = {
  s0: "おやすみ卵",
  s1: "めざめの卵",
  s2: "きらきら卵",
  s3: "わくわく卵",
  s4: "かえりかけ卵",
  s5: "たまごのひよこ",
  s6: "げんきなひよこ",
  s7: "せいちょうした鳥",
  s8: "りっぱな鳥",
  s9: "✨ かがやく鳥",
};

interface Props {
  newStage: EggStage;
  onDone: () => void;
}

export default function LevelUpBanner({ newStage, onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [numVisible, setNumVisible] = useState(false);

  const newLevel = getStageIndex(newStage) + 1;
  const prevLevel = Math.max(1, newLevel - 1);

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase("hold"); setNumVisible(true); }, 600);
    const t2 = setTimeout(() => setPhase("out"), 3000);
    const t3 = setTimeout(onDone, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const animClass =
    phase === "in"  ? "animate-level-up-in"  :
    phase === "out" ? "animate-level-up-out" : "";

  const isMax = newLevel === 10;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
      <div className={`${animClass} text-center relative`}>
        {/* Orbiting stars */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-star-orbit text-xl" style={{ position: "absolute" }}>⭐</div>
          <div className="animate-star-orbit text-base" style={{ position: "absolute", animationDelay: "-1.2s" }}>✨</div>
          <div className="animate-star-orbit text-lg" style={{ position: "absolute", animationDelay: "-0.6s" }}>🌟</div>
        </div>

        {/* Main card */}
        <div className={`relative bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 rounded-3xl px-10 py-8 shadow-2xl shadow-amber-400 border-4 border-yellow-200 animate-lv-flash-bg`}>
          {/* LEVEL UP label */}
          <div className="text-yellow-900 text-sm font-black tracking-[0.35em] mb-4 drop-shadow">
            ✦ LEVEL UP ✦
          </div>

          {/* Level number transition */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="text-center">
              <div className="text-white/60 text-xs font-bold mb-0.5">FROM</div>
              <div className="text-white/70 text-3xl font-black">Lv.{prevLevel}</div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="text-white text-2xl">→</div>
            </div>
            <div className="text-center">
              <div className="text-white/80 text-xs font-bold mb-0.5">NOW</div>
              <div className={`text-white text-5xl font-black drop-shadow-lg ${numVisible ? "animate-lv-num-pop" : "opacity-0"}`}>
                Lv.{newLevel}
              </div>
            </div>
          </div>

          {/* 10-segment level gauge */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 10 }, (_, i) => {
              const filled = i < newLevel;
              const isCurrent = i === newLevel - 1;
              return (
                <div
                  key={i}
                  className={`h-4 flex-1 rounded transition-all duration-300 ${
                    isCurrent
                      ? "bg-white shadow-lg shadow-white/60 scale-110"
                      : filled
                      ? "bg-white/80"
                      : "bg-white/25"
                  }`}
                  style={filled ? { animationDelay: `${i * 0.07}s` } : {}}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-white/60 text-xs mb-4 px-0.5">
            <span>Lv.1</span>
            <span>Lv.10</span>
          </div>

          {/* Stage name */}
          <div className="bg-black/15 rounded-2xl px-5 py-2.5">
            <span className="text-white font-black text-base tracking-wide">
              {isMax ? "🏆 " : ""}{STAGE_NAMES[newStage]}
            </span>
          </div>

          {/* Corner decorations */}
          <div className="absolute -top-3 -left-3 text-2xl animate-bounce">⭐</div>
          <div className="absolute -top-3 -right-3 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>✨</div>
          <div className="absolute -bottom-3 -left-3 text-xl animate-bounce" style={{ animationDelay: "0.4s" }}>🌟</div>
          <div className="absolute -bottom-3 -right-3 text-xl animate-bounce" style={{ animationDelay: "0.6s" }}>⭐</div>
        </div>
      </div>
    </div>
  );
}
