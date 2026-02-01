// Web Audio API sound utilities for arcade-style beeps

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playBeep(frequency: number, duration: number, type: OscillatorType = 'square') {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  // Arcade-style envelope
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

// Three beeps for workout start: beep beep BOOP (last one higher)
export function playStartSequence(onComplete: () => void) {
  playBeep(440, 0.15); // First beep
  setTimeout(() => playBeep(440, 0.15), 1000); // Second beep
  setTimeout(() => {
    playBeep(880, 0.2); // Higher boop
    onComplete();
  }, 2000);
}

// Long tone for stop (2 seconds)
export function playStopTone() {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = 330;
  oscillator.type = 'square';

  gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.25, ctx.currentTime + 1.8);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 2);
}

// Countdown beep (for the 10 second get ready)
export function playCountdownBeep() {
  playBeep(220, 0.1);
}

// Resume audio context (needed after user interaction)
export function resumeAudio() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}
