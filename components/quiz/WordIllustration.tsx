"use client";

// Maps a Japanese meaning string to a Duolingo-style SVG illustration
function getCategory(meaning: string): string {
  if (/報告|書類|レポート|文書|メモ|記録|資料|議事録/.test(meaning)) return "document";
  if (/会議|ミーティング|打合|協議|集会|委員会/.test(meaning)) return "meeting";
  if (/お金|収益|利益|売上|資金|予算|費用|コスト|価格|給与|報酬|支払|財務|経費/.test(meaning)) return "money";
  if (/メール|連絡|通知|知らせ|配信|発送/.test(meaning)) return "email";
  if (/管理|運営|経営|監督|指揮|統括|制御|維持/.test(meaning)) return "management";
  if (/増加|成長|向上|拡大|改善|発展|促進/.test(meaning)) return "growth";
  if (/グローバル|海外|国際|外国|世界|輸入|輸出/.test(meaning)) return "globe";
  if (/従業員|社員|部下|スタッフ|採用|雇用|求人|人事/.test(meaning)) return "person";
  if (/時間|スケジュール|期限|締切|日程|予定|期間/.test(meaning)) return "time";
  if (/計画|戦略|目標|方針|プラン/.test(meaning)) return "target";
  if (/提供|与える|配る|贈る|渡す|供給|配布/.test(meaning)) return "give";
  if (/話す|述べる|発表|説明|プレゼン|発言/.test(meaning)) return "speech";
  if (/完了|終了|解決|達成|承認|確認/.test(meaning)) return "check";
  if (/問題|課題|困難|トラブル|障害/.test(meaning)) return "issue";
  if (/する|行う|実施|実行|適用|実現/.test(meaning)) return "action";
  return "book";
}

// ── SVG Icon components ──────────────────────────────

function DocumentIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <rect x="9" y="4" width="24" height="36" rx="3" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M27 4 v8 h6" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="27" y="4" width="6" height="8" rx="1" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5"/>
      <line x1="14" y1="20" x2="28" y2="20" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
      <line x1="14" y1="26" x2="28" y2="26" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
      <line x1="14" y1="32" x2="22" y2="32" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function MeetingIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <circle cx="16" cy="14" r="7" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2"/>
      <circle cx="32" cy="14" r="7" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2"/>
      <path d="M4 40 C4 30 28 30 28 40" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 40 C20 30 44 30 44 40" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <circle cx="24" cy="24" r="19" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
      <circle cx="24" cy="24" r="13" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5"/>
      <text x="24" y="30" textAnchor="middle" fontSize="15" fill="#D97706" fontWeight="bold" fontFamily="Arial">¥</text>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <rect x="6" y="12" width="36" height="26" rx="3" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2"/>
      <path d="M6 15 L24 28 L42 15" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="34" x2="16" y2="24" stroke="#F9A8D4" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="42" y1="34" x2="32" y2="24" stroke="#F9A8D4" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ManagementIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <rect x="10" y="8" width="28" height="34" rx="3" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2"/>
      <rect x="18" y="4" width="12" height="8" rx="2" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5"/>
      <line x1="16" y1="22" x2="32" y2="22" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="29" x2="32" y2="29" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="15,36 18,39 25,33" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <rect x="8" y="28" width="8" height="14" rx="2" fill="#99F6E4" stroke="#0D9488" strokeWidth="1.5"/>
      <rect x="20" y="20" width="8" height="22" rx="2" fill="#5EEAD4" stroke="#0D9488" strokeWidth="1.5"/>
      <rect x="32" y="10" width="8" height="32" rx="2" fill="#2DD4BF" stroke="#0D9488" strokeWidth="1.5"/>
      <polyline points="12,26 24,18 36,8" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="36" cy="8" r="3" fill="#0D9488"/>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <circle cx="24" cy="24" r="19" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="2"/>
      <ellipse cx="24" cy="24" rx="10" ry="19" stroke="#7DD3FC" strokeWidth="1.5"/>
      <line x1="5" y1="24" x2="43" y2="24" stroke="#7DD3FC" strokeWidth="1.5"/>
      <path d="M8 16 Q24 13 40 16" stroke="#7DD3FC" strokeWidth="1.2" fill="none"/>
      <path d="M8 32 Q24 35 40 32" stroke="#7DD3FC" strokeWidth="1.2" fill="none"/>
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <circle cx="24" cy="14" r="10" fill="#D1FAE5" stroke="#10B981" strokeWidth="2"/>
      <path d="M6 46 C6 34 42 34 42 46" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function TimeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <circle cx="24" cy="24" r="19" fill="#F8FAFC" stroke="#475569" strokeWidth="2"/>
      <circle cx="24" cy="24" r="2" fill="#475569"/>
      <line x1="24" y1="24" x2="24" y2="10" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="24" x2="34" y2="24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="6" x2="24" y2="8" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="40" x2="24" y2="42" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="24" x2="8" y2="24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="24" x2="42" y2="24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <circle cx="24" cy="24" r="19" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2"/>
      <circle cx="24" cy="24" r="12" fill="#FECACA" stroke="#EF4444" strokeWidth="1.5"/>
      <circle cx="24" cy="24" r="6" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5"/>
      <circle cx="24" cy="24" r="2.5" fill="#EF4444"/>
    </svg>
  );
}

function GiveIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <rect x="12" y="20" width="24" height="20" rx="2" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2"/>
      <rect x="10" y="16" width="28" height="8" rx="2" fill="#C7D2FE" stroke="#6366F1" strokeWidth="2"/>
      <line x1="24" y1="16" x2="24" y2="40" stroke="#6366F1" strokeWidth="2"/>
      <path d="M24 16 C24 10 18 6 18 10 C18 14 24 14 24 16Z" fill="#A5B4FC" stroke="#6366F1" strokeWidth="1.5"/>
      <path d="M24 16 C24 10 30 6 30 10 C30 14 24 14 24 16Z" fill="#A5B4FC" stroke="#6366F1" strokeWidth="1.5"/>
    </svg>
  );
}

function SpeechIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <rect x="4" y="8" width="34" height="24" rx="5" fill="#FDF4FF" stroke="#A21CAF" strokeWidth="2"/>
      <path d="M10 36 L6 44 L18 36" fill="#FDF4FF" stroke="#A21CAF" strokeWidth="2" strokeLinejoin="round"/>
      <line x1="12" y1="18" x2="30" y2="18" stroke="#D946EF" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="24" x2="24" y2="24" stroke="#D946EF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <circle cx="24" cy="24" r="19" fill="#F0FDF4" stroke="#22C55E" strokeWidth="2"/>
      <polyline points="14,24 21,31 34,16" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IssueIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <path d="M24 6 L44 40 H4 Z" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" strokeLinejoin="round"/>
      <line x1="24" y1="20" x2="24" y2="30" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="35" r="1.5" fill="#CA8A04"/>
    </svg>
  );
}

function ActionIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <polygon points="10,8 38,24 10,40" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round"/>
      <line x1="28" y1="24" x2="44" y2="24" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
      <polyline points="38,18 44,24 38,30" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
      <path d="M6 10 C6 10 16 8 24 12 C32 8 42 10 42 10 L42 40 C42 40 32 38 24 42 C16 38 6 40 6 40 Z"
        fill="#F8FAFC" stroke="#64748B" strokeWidth="2" strokeLinejoin="round"/>
      <line x1="24" y1="12" x2="24" y2="42" stroke="#94A3B8" strokeWidth="1.5"/>
      <line x1="12" y1="18" x2="22" y2="17" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="12" y1="24" x2="22" y2="23" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="26" y1="17" x2="36" y2="18" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="26" y1="23" x2="36" y2="24" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

import { ReactElement } from "react";

const ICON_MAP: Record<string, () => ReactElement> = {
  document:   DocumentIcon,
  meeting:    MeetingIcon,
  money:      MoneyIcon,
  email:      EmailIcon,
  management: ManagementIcon,
  growth:     GrowthIcon,
  globe:      GlobeIcon,
  person:     PersonIcon,
  time:       TimeIcon,
  target:     TargetIcon,
  give:       GiveIcon,
  speech:     SpeechIcon,
  check:      CheckIcon,
  issue:      IssueIcon,
  action:     ActionIcon,
  book:       BookIcon,
};

interface Props {
  meaning: string;
}

export default function WordIllustration({ meaning }: Props) {
  const category = getCategory(meaning);
  const Icon = ICON_MAP[category] ?? BookIcon;
  return <Icon />;
}
