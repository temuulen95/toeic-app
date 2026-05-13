"use client";

import React from "react";
import { EggStage } from "@/lib/types";

/* ── Stage 0: Sleeping egg ── */
function SvgEggS0() {
  return (
    <svg viewBox="0 0 100 120" className="w-28 h-32 animate-egg-breathe" style={{ transformOrigin: "50% 95%" }}>
      <ellipse cx="50" cy="116" rx="26" ry="4" fill="#00000012" />
      <path d="M50 10 C76 10 88 36 88 60 C88 86 70 108 50 108 C30 108 12 86 12 60 C12 36 24 10 50 10Z"
        fill="#FFFDF0" stroke="#F5E4C3" strokeWidth="1.5" />
      <ellipse cx="34" cy="32" rx="7" ry="11" fill="white" opacity="0.5" transform="rotate(-25 34 32)" />
      {/* Sleeping eyes */}
      <path d="M36 63 Q39 59 42 63" stroke="#8B6355" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M58 63 Q61 59 64 63" stroke="#8B6355" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Smile */}
      <path d="M44 73 Q50 78 56 73" stroke="#C9956C" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="33" cy="70" rx="7" ry="4" fill="#FFB0C8" opacity="0.45" />
      <ellipse cx="67" cy="70" rx="7" ry="4" fill="#FFB0C8" opacity="0.45" />
      {/* Zzz */}
      <text x="70" y="36" fontSize="9" fill="#B0B8C8" fontFamily="Arial" fontWeight="bold">z</text>
      <text x="77" y="26" fontSize="13" fill="#C8D0DC" fontFamily="Arial" fontWeight="bold">Z</text>
    </svg>
  );
}

/* ── Stage 1: Curious egg (one crack) ── */
function SvgEggS1() {
  return (
    <svg viewBox="0 0 100 120" className="w-28 h-32">
      <ellipse cx="50" cy="116" rx="26" ry="4" fill="#00000012" />
      <path d="M50 10 C76 10 88 36 88 60 C88 86 70 108 50 108 C30 108 12 86 12 60 C12 36 24 10 50 10Z"
        fill="#FEFCE8" stroke="#F5E069" strokeWidth="1.5" />
      <ellipse cx="34" cy="32" rx="7" ry="11" fill="white" opacity="0.5" transform="rotate(-25 34 32)" />
      {/* Crack */}
      <path d="M62 18 L58 36 L64 43 L60 55" stroke="#C4A000" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Left eye: sleepy */}
      <path d="M36 63 Q39 60 42 63" stroke="#8B6355" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Right eye: open, surprised */}
      <circle cx="61" cy="62" r="6" fill="white" />
      <circle cx="61" cy="62" r="3.5" fill="#2D1B0E" />
      <circle cx="62.5" cy="60.5" r="1.3" fill="white" />
      {/* Raised eyebrow */}
      <path d="M57 55 Q61 53 65 55" stroke="#8B6355" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Small "o" mouth */}
      <ellipse cx="48" cy="75" rx="4" ry="3.5" fill="#C9956C" opacity="0.6" />
      {/* Blush right only */}
      <ellipse cx="68" cy="69" rx="7" ry="4" fill="#FFB0C8" opacity="0.45" />
    </svg>
  );
}

/* ── Stage 2: Eager egg (two cracks, both eyes open) ── */
function SvgEggS2() {
  return (
    <svg viewBox="0 0 100 120" className="w-28 h-32 animate-egg-sway" style={{ transformOrigin: "50% 95%" }}>
      <ellipse cx="50" cy="116" rx="26" ry="4" fill="#00000012" />
      <path d="M50 10 C76 10 88 36 88 60 C88 86 70 108 50 108 C30 108 12 86 12 60 C12 36 24 10 50 10Z"
        fill="#FEF9C3" stroke="#F5D020" strokeWidth="1.5" />
      <ellipse cx="34" cy="32" rx="7" ry="11" fill="white" opacity="0.5" transform="rotate(-25 34 32)" />
      {/* Two cracks */}
      <path d="M44 18 L40 36 L47 42" stroke="#C4A000" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M64 30 L61 50 L67 57" stroke="#C4A000" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Left eye */}
      <circle cx="38" cy="61" r="6.5" fill="white" />
      <circle cx="38" cy="61" r="3.8" fill="#2D1B0E" />
      <circle cx="39.5" cy="59.5" r="1.5" fill="white" />
      {/* Right eye */}
      <circle cx="62" cy="61" r="6.5" fill="white" />
      <circle cx="62" cy="61" r="3.8" fill="#2D1B0E" />
      <circle cx="63.5" cy="59.5" r="1.5" fill="white" />
      {/* Big smile */}
      <path d="M41 76 Q50 84 59 76" stroke="#C9956C" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      {/* Blush both */}
      <ellipse cx="31" cy="69" rx="7" ry="4" fill="#FFB0C8" opacity="0.45" />
      <ellipse cx="69" cy="69" rx="7" ry="4" fill="#FFB0C8" opacity="0.45" />
    </svg>
  );
}

/* ── Stage 3: Excited egg (big cracks, wiggling) ── */
function SvgEggS3() {
  return (
    <svg viewBox="0 0 100 120" className="w-28 h-32 animate-crack-wiggle" style={{ transformOrigin: "50% 95%" }}>
      <ellipse cx="50" cy="116" rx="26" ry="4" fill="#00000012" />
      <path d="M50 10 C76 10 88 36 88 60 C88 86 70 108 50 108 C30 108 12 86 12 60 C12 36 24 10 50 10Z"
        fill="#FEF08A" stroke="#EFBF04" strokeWidth="1.5" />
      <ellipse cx="34" cy="32" rx="7" ry="11" fill="white" opacity="0.5" transform="rotate(-25 34 32)" />
      {/* Three cracks */}
      <path d="M44 18 L40 38 L47 44 L43 58" stroke="#C4A000" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M64 28 L61 48 L67 56" stroke="#C4A000" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30 66 L26 78 L35 84" stroke="#C4A000" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Chip flying off */}
      <path d="M16 68 L13 80 L25 84 L28 72Z" fill="#FDE68A" stroke="#EFBF04" strokeWidth="1.2" />
      {/* Wide excited eyes */}
      <circle cx="37" cy="58" r="7.5" fill="white" />
      <circle cx="37" cy="58" r="4.5" fill="#2D1B0E" />
      <circle cx="38.8" cy="56.2" r="1.8" fill="white" />
      <circle cx="63" cy="58" r="7.5" fill="white" />
      <circle cx="63" cy="58" r="4.5" fill="#2D1B0E" />
      <circle cx="64.8" cy="56.2" r="1.8" fill="white" />
      {/* Raised eyebrows */}
      <path d="M31 49 Q37 46 43 49" stroke="#8B6355" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M57 49 Q63 46 69 49" stroke="#8B6355" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Open excited mouth */}
      <path d="M40 75 Q50 86 60 75" stroke="#C9956C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="79" rx="7" ry="3" fill="#E07060" opacity="0.25" />
      {/* Blush */}
      <ellipse cx="28" cy="68" rx="7" ry="4" fill="#FFB0C8" opacity="0.5" />
      <ellipse cx="72" cy="68" rx="7" ry="4" fill="#FFB0C8" opacity="0.5" />
    </svg>
  );
}

/* ── Stage 4: Hatching (chick peeking out) ── */
function SvgEggS4() {
  return (
    <svg viewBox="0 0 100 120" className="w-28 h-32">
      <ellipse cx="50" cy="116" rx="26" ry="4" fill="#00000012" />
      {/* Lower shell */}
      <path d="M50 52 C76 52 88 72 88 90 C88 104 70 114 50 114 C30 114 12 104 12 90 C12 72 24 52 50 52Z"
        fill="#FCD34D" stroke="#D4A017" strokeWidth="1.5" />
      {/* Upper shell cracked open - irregular top */}
      <path d="M22 56 C24 36 36 16 50 12 C64 16 76 36 78 56 L70 62 L64 52 L57 60 L50 48 L43 60 L36 52 L30 64Z"
        fill="#FDE68A" stroke="#D4A017" strokeWidth="1.5" />
      {/* Chick body */}
      <ellipse cx="50" cy="82" rx="20" ry="22" fill="#FDE68A" />
      {/* Chick head */}
      <circle cx="50" cy="58" r="17" fill="#FDE68A" />
      {/* Head tuft */}
      <path d="M43 43 Q46 35 50 38 Q54 35 57 43" fill="#FDE68A" stroke="#D4A017" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M48 40 Q50 32 52 40" fill="#FDE68A" stroke="#D4A017" strokeWidth="1" />
      {/* Eyes */}
      <circle cx="43" cy="56" r="6" fill="white" />
      <circle cx="43" cy="56" r="3.5" fill="#2D1B0E" />
      <circle cx="44.4" cy="54.4" r="1.4" fill="white" />
      <circle cx="57" cy="56" r="6" fill="white" />
      <circle cx="57" cy="56" r="3.5" fill="#2D1B0E" />
      <circle cx="58.4" cy="54.4" r="1.4" fill="white" />
      {/* Beak */}
      <path d="M45 64 L55 64 L50 71Z" fill="#F59E0B" />
      {/* Blush */}
      <ellipse cx="36" cy="62" rx="5" ry="3" fill="#FFB0C8" opacity="0.6" />
      <ellipse cx="64" cy="62" rx="5" ry="3" fill="#FFB0C8" opacity="0.6" />
      {/* Wing nubs */}
      <path d="M31 86 Q24 92 28 99 Q35 95 33 87Z" fill="#FDE68A" stroke="#D4A017" strokeWidth="1" />
      <path d="M69 86 Q76 92 72 99 Q65 95 67 87Z" fill="#FDE68A" stroke="#D4A017" strokeWidth="1" />
    </svg>
  );
}

/* ── Stage 5: Baby chick in shell fragment ── */
function SvgBirdS5() {
  return (
    <svg viewBox="0 0 100 120" className="w-28 h-32">
      <ellipse cx="50" cy="116" rx="22" ry="3.5" fill="#00000015" />
      {/* Shell base */}
      <path d="M28 108 Q24 96 28 88 Q50 82 72 88 Q76 96 72 108Z"
        fill="#FDE68A" stroke="#D4A017" strokeWidth="1.5" />
      {/* Body */}
      <ellipse cx="50" cy="86" rx="17" ry="15" fill="#FEF08A" />
      {/* Head */}
      <circle cx="50" cy="68" r="18" fill="#FEF08A" />
      {/* Tuft */}
      <path d="M44 52 Q47 43 50 46 Q53 43 56 52" fill="#FEF08A" stroke="#D4A017" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Eyes (big and cute) */}
      <circle cx="42" cy="66" r="7" fill="white" />
      <circle cx="42" cy="66" r="4" fill="#2D1B0E" />
      <circle cx="43.5" cy="64.2" r="1.6" fill="white" />
      <circle cx="58" cy="66" r="7" fill="white" />
      <circle cx="58" cy="66" r="4" fill="#2D1B0E" />
      <circle cx="59.5" cy="64.2" r="1.6" fill="white" />
      {/* Beak */}
      <path d="M46 74 L54 74 L50 81Z" fill="#F59E0B" />
      {/* Blush */}
      <ellipse cx="34" cy="71" rx="5.5" ry="3.5" fill="#FFB0C8" opacity="0.5" />
      <ellipse cx="66" cy="71" rx="5.5" ry="3.5" fill="#FFB0C8" opacity="0.5" />
      {/* Tiny wings */}
      <path d="M33 84 Q25 90 29 98 Q37 94 35 85Z" fill="#FEF08A" stroke="#D4A017" strokeWidth="1" />
      <path d="M67 84 Q75 90 71 98 Q63 94 65 85Z" fill="#FEF08A" stroke="#D4A017" strokeWidth="1" />
    </svg>
  );
}

/* ── Stage 6: Energetic chick (bouncing, wings out) ── */
function SvgBirdS6() {
  return (
    <svg viewBox="0 0 100 120" className="w-28 h-32 animate-bird-hop">
      <ellipse cx="50" cy="116" rx="24" ry="4" fill="#00000015" />
      {/* Body */}
      <ellipse cx="50" cy="90" rx="20" ry="18" fill="#FEF08A" />
      {/* Head */}
      <circle cx="50" cy="65" r="20" fill="#FEF08A" />
      {/* Tuft x2 */}
      <path d="M42 47 Q45 37 50 41 Q55 37 58 47" fill="#FEF08A" stroke="#D4A017" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M47 45 Q50 35 53 45" fill="#FEF08A" stroke="#D4A017" strokeWidth="1.2" />
      {/* Happy squinting eyes */}
      <path d="M38 63 Q42 59 46 63" stroke="#2D1B0E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M54 63 Q58 59 62 63" stroke="#2D1B0E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Open happy beak */}
      <path d="M45 74 L55 74 L50 82Z" fill="#F59E0B" />
      <path d="M45 74 L55 74" stroke="#D4A017" strokeWidth="1" />
      {/* Blush */}
      <ellipse cx="35" cy="70" rx="6" ry="4" fill="#FFB0C8" opacity="0.55" />
      <ellipse cx="65" cy="70" rx="6" ry="4" fill="#FFB0C8" opacity="0.55" />
      {/* Wings spread */}
      <path d="M30 88 Q16 82 14 72 Q22 68 32 76 Q30 82 30 88Z" fill="#FDE68A" stroke="#D4A017" strokeWidth="1.2" />
      <path d="M70 88 Q84 82 86 72 Q78 68 68 76 Q70 82 70 88Z" fill="#FDE68A" stroke="#D4A017" strokeWidth="1.2" />
      {/* Feet */}
      <path d="M42 108 L40 116 M40 116 L36 114 M40 116 L42 114 M40 116 L44 116" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M58 108 L56 116 M56 116 L52 114 M56 116 L58 114 M56 116 L60 116" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Stage 7: Young bird (standing, defined feathers) ── */
function SvgBirdS7() {
  return (
    <svg viewBox="0 0 100 120" className="w-28 h-32">
      <ellipse cx="50" cy="116" rx="26" ry="4" fill="#00000015" />
      {/* Tail */}
      <path d="M66 90 L78 98 L72 104 L68 96 L74 106 L66 108 L62 100Z" fill="#FDE68A" stroke="#D4A017" strokeWidth="1" />
      {/* Body */}
      <ellipse cx="50" cy="88" rx="22" ry="20" fill="#FBBF24" />
      {/* Wing detail on body */}
      <path d="M30 82 Q22 90 26 100 Q38 98 40 86Z" fill="#FDE68A" stroke="#D4A017" strokeWidth="1.2" />
      <path d="M70 82 Q78 90 74 100 Q62 98 60 86Z" fill="#FDE68A" stroke="#D4A017" strokeWidth="1.2" />
      {/* Wing feather lines */}
      <path d="M32 85 Q24 91 26 96" stroke="#D4A017" strokeWidth="0.8" fill="none" />
      <path d="M35 88 Q28 94 30 99" stroke="#D4A017" strokeWidth="0.8" fill="none" />
      {/* Head */}
      <circle cx="50" cy="62" r="22" fill="#FBBF24" />
      {/* Crest */}
      <path d="M42 42 Q44 32 50 36 Q56 32 58 42" fill="#FBBF24" stroke="#D4A017" strokeWidth="1.3" strokeLinejoin="round" />
      {/* Eyes */}
      <circle cx="42" cy="60" r="7" fill="white" />
      <circle cx="42" cy="60" r="4.2" fill="#1A0F0A" />
      <circle cx="43.5" cy="58.2" r="1.7" fill="white" />
      <circle cx="58" cy="60" r="7" fill="white" />
      <circle cx="58" cy="60" r="4.2" fill="#1A0F0A" />
      <circle cx="59.5" cy="58.2" r="1.7" fill="white" />
      {/* Beak */}
      <path d="M45 70 L55 70 L50 77Z" fill="#EA580C" />
      {/* Blush */}
      <ellipse cx="33" cy="66" rx="6" ry="3.5" fill="#FFB0C8" opacity="0.45" />
      <ellipse cx="67" cy="66" rx="6" ry="3.5" fill="#FFB0C8" opacity="0.45" />
      {/* Feet */}
      <path d="M40 108 L38 116 M38 116 L34 114 M38 116 L38 114 M38 116 L42 116" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M60 108 L62 116 M62 116 L58 114 M62 116 L64 114 M62 116 L66 116" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ── Stage 8: Mature bird (proud, prominent crest) ── */
function SvgBirdS8() {
  return (
    <svg viewBox="0 0 100 120" className="w-28 h-32">
      <ellipse cx="50" cy="116" rx="28" ry="4.5" fill="#00000015" />
      {/* Tail feathers */}
      <path d="M66 88 L82 94 L76 102 L70 94 L78 104 L68 108 L62 98 L70 106 L62 110Z"
        fill="#F59E0B" stroke="#D4A017" strokeWidth="1.1" strokeLinejoin="round" />
      {/* Body */}
      <ellipse cx="49" cy="86" rx="24" ry="22" fill="#F59E0B" />
      {/* Belly/chest lighter */}
      <ellipse cx="47" cy="90" rx="14" ry="16" fill="#FDE68A" />
      {/* Wings */}
      <path d="M25 80 Q14 88 16 100 Q30 98 34 84Z" fill="#FDE68A" stroke="#D4A017" strokeWidth="1.3" />
      <path d="M73 80 Q84 88 82 100 Q68 98 64 84Z" fill="#FDE68A" stroke="#D4A017" strokeWidth="1.3" />
      <path d="M27 83 Q18 90 18 97" stroke="#D4A017" strokeWidth="0.9" fill="none" />
      <path d="M30 87 Q22 94 22 100" stroke="#D4A017" strokeWidth="0.9" fill="none" />
      {/* Head */}
      <circle cx="50" cy="58" r="24" fill="#F59E0B" />
      {/* Prominent crest */}
      <path d="M38 37 Q40 26 50 30 Q60 26 62 37" fill="#F59E0B" stroke="#D4A017" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M44 34 Q46 24 50 27 Q54 24 56 34" fill="#F59E0B" stroke="#D4A017" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M48 32 Q50 22 52 32" fill="#F59E0B" stroke="#D4A017" strokeWidth="1.2" />
      {/* Eyes */}
      <circle cx="41" cy="57" r="8" fill="white" />
      <circle cx="41" cy="57" r="4.8" fill="#1A0F0A" />
      <circle cx="42.8" cy="55" r="2" fill="white" />
      <circle cx="59" cy="57" r="8" fill="white" />
      <circle cx="59" cy="57" r="4.8" fill="#1A0F0A" />
      <circle cx="60.8" cy="55" r="2" fill="white" />
      {/* Beak */}
      <path d="M44 68 L56 68 L50 76Z" fill="#EA580C" />
      <path d="M44 68 L56 68" stroke="#C2410C" strokeWidth="1" />
      {/* Blush */}
      <ellipse cx="30" cy="63" rx="6.5" ry="4" fill="#FFB0C8" opacity="0.4" />
      <ellipse cx="70" cy="63" rx="6.5" ry="4" fill="#FFB0C8" opacity="0.4" />
      {/* Feet */}
      <path d="M38 108 L36 116 M36 116 L31 114 M36 116 L36 114 M36 116 L41 116" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
      <path d="M62 108 L64 116 M64 116 L59 114 M64 116 L66 114 M64 116 L69 116" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Stage 9: Legendary shining bird ── */
function SvgBirdS9() {
  return (
    <svg viewBox="0 0 100 120" className="w-28 h-32 animate-bird-shine">
      <defs>
        <radialGradient id="s9-body" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="60%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <radialGradient id="s9-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer glow */}
      <ellipse cx="50" cy="68" rx="46" ry="52" fill="url(#s9-glow)" />
      <ellipse cx="50" cy="116" rx="30" ry="5" fill="#F59E0B" opacity="0.25" />
      {/* Tail feathers (spread) */}
      <path d="M64 86 L84 88 L80 98 L70 92 L82 104 L68 106 L62 96 L72 108 L60 110Z"
        fill="#FCD34D" stroke="#D4A017" strokeWidth="1.1" strokeLinejoin="round" />
      {/* Body */}
      <ellipse cx="49" cy="84" rx="25" ry="23" fill="url(#s9-body)" />
      {/* Belly */}
      <ellipse cx="47" cy="88" rx="14" ry="17" fill="#FFFBEB" opacity="0.7" />
      {/* Wings spread */}
      <path d="M24 76 Q10 82 8 96 Q22 96 30 80Z" fill="#FCD34D" stroke="#D4A017" strokeWidth="1.3" />
      <path d="M74 76 Q88 82 90 96 Q76 96 68 80Z" fill="#FCD34D" stroke="#D4A017" strokeWidth="1.3" />
      <path d="M26 79 Q14 86 12 93" stroke="#D4A017" strokeWidth="0.9" fill="none" />
      <path d="M29 83 Q18 90 17 97" stroke="#D4A017" strokeWidth="0.9" fill="none" />
      {/* Head */}
      <circle cx="50" cy="55" r="25" fill="url(#s9-body)" />
      {/* Crown of feathers */}
      <path d="M34 34 Q36 22 42 26 Q45 18 50 22 Q55 18 58 26 Q64 22 66 34"
        fill="#FCD34D" stroke="#D4A017" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M39 32 Q40 22 46 25" fill="#FCD34D" stroke="#D4A017" strokeWidth="1.3" />
      <path d="M61 32 Q60 22 54 25" fill="#FCD34D" stroke="#D4A017" strokeWidth="1.3" />
      {/* Crown gems */}
      <circle cx="42" cy="24" r="2.5" fill="#EF4444" />
      <circle cx="50" cy="20" r="3" fill="#8B5CF6" />
      <circle cx="58" cy="24" r="2.5" fill="#3B82F6" />
      {/* Eyes (brilliant) */}
      <circle cx="40" cy="54" r="9" fill="white" />
      <circle cx="40" cy="54" r="5.5" fill="#1A0F0A" />
      <circle cx="42" cy="52" r="2.2" fill="white" />
      <circle cx="39" cy="56" r="1" fill="white" opacity="0.7" />
      <circle cx="60" cy="54" r="9" fill="white" />
      <circle cx="60" cy="54" r="5.5" fill="#1A0F0A" />
      <circle cx="62" cy="52" r="2.2" fill="white" />
      <circle cx="59" cy="56" r="1" fill="white" opacity="0.7" />
      {/* Beak */}
      <path d="M43 66 L57 66 L50 75Z" fill="#EA580C" />
      <path d="M43 66 L57 66" stroke="#C2410C" strokeWidth="1.2" />
      {/* Blush */}
      <ellipse cx="28" cy="61" rx="7" ry="4.5" fill="#FFB0C8" opacity="0.45" />
      <ellipse cx="72" cy="61" rx="7" ry="4.5" fill="#FFB0C8" opacity="0.45" />
      {/* Sparkles */}
      <g className="animate-sparkle-spin" style={{ transformOrigin: "18px 40px" }}>
        <path d="M18 34 L19.5 40 L18 46 L16.5 40Z" fill="#FCD34D" />
        <path d="M12 40 L18 38.5 L24 40 L18 41.5Z" fill="#FCD34D" />
      </g>
      <g className="animate-sparkle-spin" style={{ transformOrigin: "82px 36px", animationDelay: "1s" }}>
        <path d="M82 30 L83.5 36 L82 42 L80.5 36Z" fill="#FCD34D" />
        <path d="M76 36 L82 34.5 L88 36 L82 37.5Z" fill="#FCD34D" />
      </g>
      <g className="animate-sparkle-spin" style={{ transformOrigin: "86px 90px", animationDelay: "0.5s" }}>
        <path d="M86 86 L87 90 L86 94 L85 90Z" fill="#FDE68A" />
        <path d="M82 90 L86 89 L90 90 L86 91Z" fill="#FDE68A" />
      </g>
      {/* Feet */}
      <path d="M37 107 L35 115 M35 115 L30 113 M35 115 L35 113 M35 115 L40 115" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M63 107 L65 115 M65 115 L60 113 M65 115 L67 113 M65 115 L70 115" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Stage labels ── */
export const STAGE_LABELS: Record<EggStage, string> = {
  s0: "Lv.1  おやすみ卵",
  s1: "Lv.2  めざめの卵",
  s2: "Lv.3  きらきら卵",
  s3: "Lv.4  わくわく卵",
  s4: "Lv.5  かえりかけ卵",
  s5: "Lv.6  たまごのひよこ",
  s6: "Lv.7  げんきなひよこ",
  s7: "Lv.8  せいちょうした鳥",
  s8: "Lv.9  りっぱな鳥",
  s9: "Lv.10 ✨かがやく鳥",
};

interface Props {
  stage: EggStage;
  hatching?: boolean;
}

const STAGE_COMPONENTS: Record<EggStage, () => React.ReactElement> = {
  s0: SvgEggS0,
  s1: SvgEggS1,
  s2: SvgEggS2,
  s3: SvgEggS3,
  s4: SvgEggS4,
  s5: SvgBirdS5,
  s6: SvgBirdS6,
  s7: SvgBirdS7,
  s8: SvgBirdS8,
  s9: SvgBirdS9,
};

export default function EggCharacter({ stage, hatching = false }: Props) {
  const label = STAGE_LABELS[stage];
  const Component = STAGE_COMPONENTS[stage];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={hatching ? "animate-hatch-burst" : ""}>
        <Component />
      </div>
      <span className="text-xs font-medium text-slate-400">{label}</span>
    </div>
  );
}
