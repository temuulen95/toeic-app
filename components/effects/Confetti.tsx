"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "#FCD34D","#34D399","#60A5FA","#F87171",
  "#A78BFA","#F472B6","#FB923C","#4ADE80",
];

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  isRect: boolean;
}

interface Props {
  count?: number;
  durationMs?: number;
}

export default function Confetti({ count = 70, durationMs = 3000 }: Props) {
  const [visible, setVisible] = useState(true);

  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.6,
      duration: 1.4 + Math.random() * 1.0,
      size: 7 + Math.random() * 8,
      isRect: Math.random() > 0.5,
    }))
  );

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(t);
  }, [durationMs]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: "-16px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isRect ? "2px" : "50%",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
