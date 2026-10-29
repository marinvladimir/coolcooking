// Tiny 8-bit sound effects made with a square-wave oscillator.

let context: AudioContext | null = null;

const getContext = () => {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  context ??= new AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
};

const play = (
  notes: [frequency: number, duration: number][],
  volume = 0.06
) => {
  const ctx = getContext();
  if (!ctx) return;
  let time = ctx.currentTime;
  for (const [frequency, duration] of notes) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(time);
    oscillator.stop(time + duration);
    time += duration * 0.9;
  }
};

/** Short "coin" blip – used when a cooking step changes. */
export const playBlip = () =>
  play([
    [988, 0.08],
    [1319, 0.16],
  ]);

/** Little victory fanfare – used when the timer finishes. */
export const playFanfare = () =>
  play([
    [523, 0.12],
    [659, 0.12],
    [784, 0.12],
    [1047, 0.3],
    [784, 0.12],
    [1047, 0.45],
  ]);
