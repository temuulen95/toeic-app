"use client";

import { useEffect, useState } from "react";
import { EggStage } from "@/lib/types";

const STAGE_NAMES: Record<EggStage, string> = {
  s0: "普通の卵",
  s1: "小さなヒビ",
  s2: "大きなヒビ",
  s3: "殻が割れ始め",
  s4: "くちばし誕生",
  s5: "ヒヨコ誕生",
  s6: "元気なヒヨコ",
  s7: "成長した鳥",
  s8: "立派な鳥",
  s9: "✨ 達成！輝く鳥",
};

interface Props {
  newStage: EggStage;
  onDone: () => void;
}

export default function LevelUpBanner({ newStage, onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 600);
    const t2 = setTimeout(() => setPhase("out"), 2400);
    const t3 = setTimeout(onDone, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const animClass =
    phase === "in"  ? "animate-level-up-in"  :
    phase === "out" ? "animate-level-up-out" : "";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
      <div className={`${animClass} text-center`}>
        <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl px-10 py-7 shadow-2xl shadow-yellow-300">
          <div className="text-white text-xs font-bold tracking-widest mb-1 opacity-80">
            LEVEL UP!
          </div>
          <div className="text-white text-4xl font-black mb-2">⭐ 進化！ ⭐</div>
          <div className="bg-white/20 rounded-2xl px-4 py-2">
            <span className="text-white font-bold text-lg">{STAGE_NAMES[newStage]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
