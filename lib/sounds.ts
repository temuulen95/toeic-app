let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx || ctx.state === "closed") ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
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

/**
 * Korobeiniki (Tetris Theme A) inspired combo jingle.
 * Plays a short recognizable riff from the opening melody.
 * comboCount >= 5 triggers the extended version.
 */
export function playComboJingle(comboCount: number) {
  if (typeof window === "undefined") return;
  try {
    const ac = getCtx();
    const t0 = ac.currentTime;
    const BPM = 188;
    const Q = 60 / BPM;       // quarter note
    const E = Q / 2;           // eighth note
    const DQ = Q * 1.5;        // dotted quarter

    // Korobeiniki opening (first 8 notes)
    // E5 B4 C5 D5 C5 B4 A4 A4
    const riff1: [number, number][] = [
      [659.25, Q],    // E5
      [493.88, E],    // B4
      [523.25, E],    // C5
      [587.33, Q],    // D5
      [523.25, E],    // C5
      [493.88, E],    // B4
      [440.00, Q],    // A4
      [440.00, E],    // A4 (short)
    ];

    // Extended: C5 E5 D5 C5 B4
    const riff2: [number, number][] = [
      [523.25, E],    // C5
      [659.25, DQ],   // E5 (long)
      [587.33, E],    // D5
      [523.25, E],    // C5
      [493.88, DQ],   // B4 (long)
    ];

    const notes = comboCount >= 5 ? [...riff1, ...riff2] : riff1;

    let t = t0;
    notes.forEach(([freq, dur]) => {
      playNote(ac, freq, t, dur * 0.9, 0.1);
      t += dur;
    });
  } catch { /* ignore */ }
}
