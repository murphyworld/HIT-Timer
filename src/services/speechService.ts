class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private volume: number = 1.0;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  speak(text: string, priority: boolean = false) {
    if (!this.synth || !this.enabled) return;

    if (priority) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.volume;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to get a good English voice
    const voices = this.synth.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en') && v.localService
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    this.synth.speak(utterance);
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isSupported(): boolean {
    return this.synth !== null;
  }
}

export const speechService = new SpeechService();
