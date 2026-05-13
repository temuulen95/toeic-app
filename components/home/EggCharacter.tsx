"use client";

import { EggStage } from "@/lib/types";

/* ── SVG egg for stages s0-s4 ── */
function SvgEgg({ stage }: { stage: "s0"|"s1"|"s2"|"s3"|"s4" }) {
  // egg path: cx≈50, top≈10, bottom≈108, max-width≈76
  const eggPath = "M50 10 C76 10 88 36 88 60 C88 86 70 108 50 108 C30 108 12 86 12 60 C12 36 24 10 50 10Z";
  const fills: Record<string, string> = {
    s0: "#FFFBEB", s1: "#FEF9C3", s2: "#FEF08A", s3: "#FDE68A", s4: "#FCD34D",
  };

  return (
    <svg
      viewBox="0 0 100 120"
      className={`w-28 h-32 ${stage === "s3" ? "animate-crack-wiggle" : ""}`}
    >
      {/* Drop shadow */}
      <ellipse cx="50" cy="116" rx="26" ry="4" fill="#00000012" />

      {/* Egg body */}
      <path d={eggPath} fill={fills[stage]} stroke="#F59E0B" strokeWidth="2" />

      {/* Shine */}
      <ellipse cx="34" cy="34" rx="7" ry="11" fill="white" opacity="0.45"
        transform="rotate(-25 34 34)" />

      {/* s1: hairline crack */}
      {stage >= "s1" && (
        <path d="M44 26 L40 44 L47 50"
          stroke="#92400E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}

      {/* s2: second crack */}
      {stage >= "s2" && (
        <path d="M63 33 L60 52 L65 58"
          stroke="#92400E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}

      {/* s3: third crack + floating chunk */}
      {stage >= "s3" && (
        <>
          <path d="M37 62 L32 76 L41 82"
            stroke="#92400E" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Chip */}
          <path d="M20 72 L16 82 L28 86 L32 76Z"
            fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.2" />
        </>
      )}

      {/* s4: bottom breaks open, beak + eyes peek out */}
      {stage === "s4" && (
        <>
          {/* Bottom opening */}
          <path d="M28 92 L24 104 L50 112 L76 104 L72 92"
            fill="#FFFBEB" stroke="#92400E" strokeWidth="2" strokeLinejoin="round" />
          {/* Beak */}
          <polygon points="44,100 56,100 50,110" fill="#F59E0B" />
          {/* Eyes */}
          <circle cx="42" cy="96" r="2.5" fill="#1E293B" />
          <circle cx="58" cy="96" r="2.5" fill="#1E293B" />
          {/* Eye shine */}
          <circle cx="43" cy="95" r="0.8" fill="white" />
          <circle cx="59" cy="95" r="0.8" fill="white" />
        </>
      )}
    </svg>
  );
}

/* ── Bird emoji for stages s5-s9 ── */
const BIRD_CONFIG: Record<"s5"|"s6"|"s7"|"s8"|"s9", {
  emoji: string; label: string; size: string; extra?: string;
}> = {
  s5: { emoji: "🐣", label: "ヒヨコ誕生",    size: "text-6xl" },
  s6: { emoji: "🐣", label: "元気なヒヨコ",  size: "text-7xl", extra: "animate-bounce" },
  s7: { emoji: "🐥", label: "成長した鳥",    size: "text-6xl" },
  s8: { emoji: "🐥", label: "立派な鳥",      size: "text-7xl" },
  s9: { emoji: "🐥", label: "✨ 輝く鳥",     size: "text-7xl", extra: "animate-bird-glow" },
};

function BirdStage({ stage }: { stage: "s5"|"s6"|"s7"|"s8"|"s9" }) {
  const cfg = BIRD_CONFIG[stage];
  return (
    <div className="relative flex items-center justify-center w-28 h-32">
      {/* Glow ring for s9 */}
      {stage === "s9" && (
        <div className="absolute inset-0 rounded-full bg-yellow-200 animate-ping opacity-30" />
      )}
      <span
        className={`${cfg.size} select-none ${cfg.extra ?? ""}`}
        role="img"
        aria-label={cfg.label}
      >
        {cfg.emoji}
      </span>
      {/* Sparkles for s9 */}
      {stage === "s9" && (
        <>
          <span className="absolute top-0 right-0 text-xl animate-sparkle-spin">✨</span>
          <span className="absolute bottom-2 left-0 text-lg animate-sparkle-spin" style={{ animationDelay: "1s" }}>⭐</span>
          <span className="absolute top-2 left-2 text-base animate-sparkle-spin" style={{ animationDelay: "1.8s" }}>✨</span>
        </>
      )}
    </div>
  );
}

/* ── Stage metadata ── */
export const STAGE_LABELS: Record<EggStage, string> = {
  s0: "普通の卵",
  s1: "小さなヒビ",
  s2: "大きなヒビ",
  s3: "殻が割れ始め",
  s4: "くちばし誕生",
  s5: "ヒヨコ誕生",
  s6: "元気なヒヨコ",
  s7: "少し成長した鳥",
  s8: "立派な鳥",
  s9: "達成！輝く鳥",
};

interface Props {
  stage: EggStage;
  hatching?: boolean;
}

export default function EggCharacter({ stage, hatching = false }: Props) {
  const label = STAGE_LABELS[stage];
  const isEggStage = stage <= "s4";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={hatching ? "animate-hatch-burst" : ""}>
        {isEggStage
          ? <SvgEgg stage={stage as "s0"|"s1"|"s2"|"s3"|"s4"} />
          : <BirdStage stage={stage as "s5"|"s6"|"s7"|"s8"|"s9"} />
        }
      </div>
      <span className="text-xs font-medium text-slate-400">{label}</span>
    </div>
  );
}
