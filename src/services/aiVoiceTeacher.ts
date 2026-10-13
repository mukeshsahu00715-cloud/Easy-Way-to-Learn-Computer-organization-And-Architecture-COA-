/**
 * AI Voice Teacher Service
 * Manages line-by-line Web Speech API synthesis, speech events, speed, and sentence splitting.
 */

export interface SpeechVoiceOption {
  id: string;
  name: string;
  lang: string;
  genderHint?: 'female' | 'male';
}

export type VoiceStateListener = (state: {
  isPlaying: boolean;
  isPaused: boolean;
  currentLineIndex: number;
  totalLines: number;
  currentLineText: string;
  speed: number;
}) => void;

class AIVoiceTeacherService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private lines: string[] = [];
  private currentLineIdx: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private speed: number = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private listeners: Set<VoiceStateListener> = new Set();
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    this.availableVoices = this.synth.getVoices();
    // Default to an English voice that sounds natural
    if (!this.selectedVoice && this.availableVoices.length > 0) {
      const preferred = this.availableVoices.find(v => 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen') || v.lang.startsWith('en'))
      );
      this.selectedVoice = preferred || this.availableVoices[0];
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.availableVoices.length === 0 && this.synth) {
      this.availableVoices = this.synth.getVoices();
    }
    return this.availableVoices.filter(v => v.lang.startsWith('en'));
  }

  public setVoice(voiceName: string) {
    const found = this.availableVoices.find(v => v.name === voiceName);
    if (found) {
      this.selectedVoice = found;
      if (this.isPlaying) {
        // Restart current line with new voice
        this.speakCurrentLine();
      }
    }
  }

  public subscribe(listener: VoiceStateListener): () => void {
    this.listeners.add(listener);
    this.notify();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentLineIndex: this.currentLineIdx,
      totalLines: this.lines.length,
      currentLineText: this.lines[this.currentLineIdx] || '',
      speed: this.speed,
    };
    this.listeners.forEach(fn => fn(state));
  }

  /**
   * Loads a script of text and breaks it down into clear, teachable sentences/lines.
   */
  public loadLesson(textOrLines: string | string[]): string[] {
    this.stop();
    if (Array.isArray(textOrLines)) {
      this.lines = textOrLines
        .flatMap(item => this.splitIntoTeachableLines(item))
        .filter(line => line.trim().length > 0);
    } else {
      this.lines = this.splitIntoTeachableLines(textOrLines).filter(line => line.trim().length > 0);
    }
    this.currentLineIdx = 0;
    this.notify();
    return this.lines;
  }

  private splitIntoTeachableLines(raw: string): string[] {
    // Clean bullet points, headers, or extra punctuation
    const clean = raw
      .replace(/^[•\-*#\d.]+\s*/gm, '') // remove markdown list markers
      .replace(/\n+/g, ' ')
      .trim();

    if (!clean) return [];

    // Split by sentence terminators (. ! ?) while preserving formulas
    const sentenceRegex = /([^.!?]+[.!?]+(?:\s|$)|[^.!?]+$)/g;
    const matches = clean.match(sentenceRegex);
    if (!matches) return [clean];

    return matches
      .map(s => s.trim())
      .filter(s => s.length > 2);
  }

  public setSpeed(speed: number) {
    this.speed = speed;
    this.notify();
    if (this.isPlaying && !this.isPaused) {
      this.speakCurrentLine();
    }
  }

  public play() {
    if (!this.synth) return;
    if (this.lines.length === 0) return;

    if (this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.isPlaying = true;
      this.notify();
      return;
    }

    this.isPlaying = true;
    this.isPaused = false;
    this.speakCurrentLine();
  }

  public pause() {
    if (!this.synth) return;
    this.synth.pause();
    this.isPaused = true;
    this.notify();
  }

  public stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.isPlaying = false;
    this.isPaused = false;
    this.notify();
  }

  public jumpToLine(index: number) {
    if (index >= 0 && index < this.lines.length) {
      this.currentLineIdx = index;
      if (this.isPlaying) {
        this.speakCurrentLine();
      } else {
        this.notify();
      }
    }
  }

  public nextLine() {
    if (this.currentLineIdx < this.lines.length - 1) {
      this.currentLineIdx++;
      if (this.isPlaying) {
        this.speakCurrentLine();
      } else {
        this.notify();
      }
    } else {
      this.stop();
    }
  }

  public previousLine() {
    if (this.currentLineIdx > 0) {
      this.currentLineIdx--;
      if (this.isPlaying) {
        this.speakCurrentLine();
      } else {
        this.notify();
      }
    }
  }

  public replayCurrentLine() {
    this.speakCurrentLine();
  }

  private speakCurrentLine() {
    if (!this.synth) return;
    this.synth.cancel();

    if (this.currentLineIdx >= this.lines.length) {
      this.stop();
      return;
    }

    const lineText = this.lines[this.currentLineIdx];
    if (!lineText) {
      this.stop();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(lineText);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.speed;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (this.isPlaying && !this.isPaused) {
        // Automatically progress to the next line
        if (this.currentLineIdx < this.lines.length - 1) {
          this.currentLineIdx++;
          this.speakCurrentLine();
        } else {
          this.stop();
        }
      }
    };

    utterance.onerror = (e) => {
      // If cancelled manually, ignore
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    this.notify();
  }

  public getCurrentLineText(): string {
    return this.lines[this.currentLineIdx] || '';
  }

  public getLines(): string[] {
    return this.lines;
  }
}

export const aiVoiceTeacher = new AIVoiceTeacherService();
