let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx || ctx.state === "closed") ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function playCorrect() {
  if (typeof window === "undefined") return;
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    // C5 → E5 → G5 上昇アルペジオ
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ac.destination);
      const t = now + i * 0.09;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.start(t);
      osc.stop(t + 0.28);
    });
  } catch { /* ignore */ }
}

export function playIncorrect() {
  if (typeof window === "undefined") return;
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    // 優しい木製タップ音：短くて柔らかい
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);
    osc.connect(gain);
    gain.connect(ac.destination);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.start(now);
    osc.stop(now + 0.15);
  } catch { /* ignore */ }
}

export function playLevelUp() {
  if (typeof window === "undefined") return;
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    // ファンファーレ風 4音
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ac.destination);
      const t = now + i * 0.13;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch { /* ignore */ }
}
