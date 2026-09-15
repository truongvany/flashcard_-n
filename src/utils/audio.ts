// Audio synthesizer and speech pronunciation utilities for Memora

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Soft flip swoosh
  playFlip() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(430, now + 0.09);

      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore audio failure
    }
  }

  playModalOpen() {
    if (!this.enabled) return;
    this.playChord([392.0, 523.25], 0.12, 0.025, 0.02);
  }

  playModalClose() {
    if (!this.enabled) return;
    this.playChord([523.25, 392.0], 0.1, 0.022, 0.03);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.playChord([523.25, 659.25, 783.99], 0.16, 0.03, 0.02);
  }

  playProgress() {
    if (!this.enabled) return;
    this.playChord([261.63, 329.63, 392.0], 0.12, 0.022, 0.025);
  }

  // Spaced repetition button feedback
  playRating(rating: 'again' | 'hard' | 'good' | 'easy') {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (rating === 'again') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(195, now + 0.12);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (rating === 'hard') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.setValueAtTime(380, now + 0.07);
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (rating === 'good') {
        this.playChord([523.25, 659.25], 0.14, 0.03, 0.02);
      } else {
        this.playChord([523.25, 659.25, 783.99, 1046.5], 0.18, 0.035, 0.02);
      }
    } catch {
      // Ignore
    }
  }

  private playChord(freqs: number[], duration: number, volume: number, offset: number = 0.02) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * offset);

      gain.gain.setValueAtTime(volume, now + idx * offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration + idx * offset);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * offset);
      osc.stop(now + duration + idx * offset);
    });
  }
}

export const sounds = new SoundEffects();

// Speech synthesis pronunciation helper
export function speakWord(text: string, lang: string = 'en-US', rate: number = 0.9) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis unavailable:', err);
  }
}
