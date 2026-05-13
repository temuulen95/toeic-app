"use client";

import { useState } from "react";

interface Props {
  onNext: (nickname: string) => void;
}

export default function Step1Nickname({ onNext }: Props) {
  const [nickname, setNickname] = useState("");

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-7xl">🥚</div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">EggLish へようこそ！</h1>
        <p className="text-slate-500">まず、あなたのニックネームを教えてください</p>
      </div>
      <div className="w-full max-w-xs">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && nickname.trim() && onNext(nickname.trim())}
          placeholder="ニックネーム"
          maxLength={20}
          className="w-full px-4 py-3 text-lg border-2 border-yellow-300 rounded-xl outline-none focus:border-yellow-500 text-center bg-white"
          autoFocus
        />
      </div>
      <button
        onClick={() => nickname.trim() && onNext(nickname.trim())}
        disabled={!nickname.trim()}
        className="px-10 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-slate-200 disabled:text-slate-400 text-slate-800 font-bold rounded-full text-lg transition-all active:scale-95"
      >
        つぎへ →
      </button>
    </div>
  );
}
