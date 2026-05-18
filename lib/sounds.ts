let ctx: AudioContext | null = null;

// iOS Safari requires AudioContext to be created AND resumed inside a user gesture.
// We defer creation until the first interaction, then play a silent buffer to unlock.
export function unlockAudio(): void {
  if (typeof window === "undefined") return;
  try {
    if (!ctx || ctx.state === "closed") {
      ctx = new AudioContext();
    }
    const resume = ctx.resume();
    // Play a silent 1-frame buffer — required for older iOS to fully unlock
    resume.then(() => {
      if (!ctx) return;
      const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    }).catch(() => {});
  } catch { /* ignore */ }
}

function getCtx(): AudioContext {
  if (!ctx || ctx.state === "closed") ctx = new AudioContext();
  // Best-effort resume (works on desktop; no-op on locked iOS — unlockAudio() handles that)
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function playNote(ac: AudioContext, freq: number, startTime: number, duration: number, vol = 0.12) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "square";
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ac.destination);
  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.setValueAtTime(vol * 0.85, startTime + duration * 0.7);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

export function playCorrect() {
  if (typeof window === "undefined") return;
  try {
    const ac = getCtx();
    const now = ac.currentTime;
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

export function playComboJingle(comboCount: number) {
  if (typeof window === "undefined") return;
  try {
    const ac = getCtx();
    const t0 = ac.currentTime;
    const BPM = 188;
    const Q = 60 / BPM;
    const E = Q / 2;
    const DQ = Q * 1.5;

    const riff1: [number, number][] = [
      [659.25, Q], [493.88, E], [523.25, E], [587.33, Q],
      [523.25, E], [493.88, E], [440.00, Q], [440.00, E],
    ];
    const riff2: [number, number][] = [
      [523.25, E], [659.25, DQ], [587.33, E], [523.25, E], [493.88, DQ],
    ];

    const notes = comboCount >= 5 ? [...riff1, ...riff2] : riff1;
    let t = t0;
    notes.forEach(([freq, dur]) => {
      playNote(ac, freq, t, dur * 0.9, 0.1);
      t += dur;
    });
  } catch { /* ignore */ }
}
