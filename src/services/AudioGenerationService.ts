import * as Tone from 'tone';

export interface AudioGenerationOptions {
  genre: string;
  mood: string;
  prompt: string;
  duration?: number;
}

export interface GeneratedAudio {
  audioBuffer: ArrayBuffer;
  duration: number;
  metadata: {
    bpm: number;
    key: string;
    genre: string;
    mood: string;
  };
}

export class AudioGenerationService {
  private synth: Tone.Synth;
  private drum: Tone.MembraneSynth;
  private bass: Tone.MonoSynth;
  private isInitialized = false;

  constructor() {
    this.synth = new Tone.Synth().toDestination();
    this.drum = new Tone.MembraneSynth().toDestination();
    this.bass = new Tone.MonoSynth().toDestination();
  }

  async initialize() {
    if (this.isInitialized) return;
    
    await Tone.start();
    this.isInitialized = true;
  }

  async generateAudio(options: AudioGenerationOptions): Promise<GeneratedAudio> {
    await this.initialize();
    
    const duration = options.duration || 30; // Default 30 seconds
    const bpm = this.getBPMForGenre(options.genre);
    const key = this.getKeyForMood(options.mood);
    
    // Set transport BPM
    Tone.Transport.bpm.value = bpm;
    
    // Generate musical content based on options
    const sequence = this.generateSequence(options);
    
    // Create a recorder to capture audio
    const recorder = new Tone.Recorder();
    
    // Connect all instruments to the recorder
    this.synth.connect(recorder);
    this.drum.connect(recorder);
    this.bass.connect(recorder);
    
    // Start recording
    recorder.start();
    
    // Start transport and play the sequence
    Tone.Transport.start();
    
    // Schedule the sequence
    this.scheduleSequence(sequence, duration);
    
    // Wait for the duration
    await new Promise(resolve => setTimeout(resolve, duration * 1000));
    
    // Stop recording and transport
    Tone.Transport.stop();
    const recording = await recorder.stop();
    
    // Convert to ArrayBuffer
    const audioBuffer = await recording.arrayBuffer();
    
    return {
      audioBuffer,
      duration,
      metadata: {
        bpm,
        key,
        genre: options.genre,
        mood: options.mood
      }
    };
  }

  private getBPMForGenre(genre: string): number {
    const genreBPMs: { [key: string]: number } = {
      'progressive-house': 128,
      'future-bass': 150,
      'big-room': 128,
      'techno': 140,
      'trance': 138,
      'dubstep': 140,
      'trap': 160,
      'hardstyle': 150
    };
    
    return genreBPMs[genre] || 128;
  }

  private getKeyForMood(mood: string): string {
    const moodKeys: { [key: string]: string } = {
      'uplifting': 'C major',
      'dark': 'A minor',
      'chill': 'G major',
      'energetic': 'E major',
      'ethereal': 'F# major',
      'aggressive': 'D minor'
    };
    
    return moodKeys[mood] || 'C major';
  }

  private generateSequence(options: AudioGenerationOptions) {
    const genre = options.genre;
    const mood = options.mood;
    
    // Generate different patterns based on genre
    switch (genre) {
      case 'progressive-house':
        return this.generateProgressiveHouseSequence(mood);
      case 'future-bass':
        return this.generateFutureBassSequence(mood);
      case 'techno':
        return this.generateTechnoSequence(mood);
      case 'trance':
        return this.generateTranceSequence(mood);
      case 'dubstep':
        return this.generateDubstepSequence(mood);
      default:
        return this.generateDefaultSequence(mood);
    }
  }

  private generateProgressiveHouseSequence(mood: string) {
    const chords = mood === 'dark' ? ['Am', 'F', 'C', 'G'] : ['C', 'Am', 'F', 'G'];
    const bassPattern = ['C2', 'C2', 'F2', 'F2'];
    
    return {
      chords,
      bassPattern,
      drumPattern: ['kick', 'hihat', 'snare', 'hihat'],
      leadMelody: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
    };
  }

  private generateFutureBassSequence(mood: string) {
    const chords = mood === 'energetic' ? ['Em', 'C', 'G', 'D'] : ['Am', 'C', 'F', 'G'];
    
    return {
      chords,
      bassPattern: ['E2', 'E2', 'C2', 'C2'],
      drumPattern: ['kick', 'kick', 'snare', 'hihat'],
      leadMelody: ['E4', 'G4', 'B4', 'D5', 'C5', 'A4', 'G4', 'E4']
    };
  }

  private generateTechnoSequence(mood: string) {
    const bassPattern = mood === 'aggressive' ? ['C2', 'C2', 'Eb2', 'Eb2'] : ['C2', 'F2', 'Ab2', 'Bb2'];
    
    return {
      chords: ['Cm', 'Fm', 'Ab', 'Bb'],
      bassPattern,
      drumPattern: ['kick', 'kick', 'kick', 'kick'], // 4/4 kick pattern
      leadMelody: ['C4', 'Eb4', 'F4', 'Ab4', 'Bb4', 'C5']
    };
  }

  private generateTranceSequence(mood: string) {
    const chords = mood === 'ethereal' ? ['F#m', 'A', 'E', 'D'] : ['Am', 'F', 'C', 'G'];
    
    return {
      chords,
      bassPattern: ['A2', 'A2', 'E2', 'E2'],
      drumPattern: ['kick', 'hihat', 'snare', 'hihat'],
      leadMelody: ['A4', 'C#5', 'E5', 'F#5', 'A5', 'G#5', 'E5', 'C#5']
    };
  }

  private generateDubstepSequence(mood: string) {
    const bassPattern = mood === 'aggressive' ? ['C1', 'C1', 'F1', 'F1'] : ['C2', 'Eb2', 'F2', 'Ab2'];
    
    return {
      chords: ['Cm', 'Fm', 'Ab', 'Bb'],
      bassPattern,
      drumPattern: ['kick', 'snare', 'kick', 'snare'],
      leadMelody: ['C4', 'Eb4', 'G4', 'Bb4', 'C5']
    };
  }

  private generateDefaultSequence(mood: string) {
    const chords = mood === 'dark' ? ['Am', 'F', 'C', 'G'] : ['C', 'F', 'G', 'Am'];
    
    return {
      chords,
      bassPattern: ['C2', 'F2', 'G2', 'A2'],
      drumPattern: ['kick', 'hihat', 'snare', 'hihat'],
      leadMelody: ['C4', 'E4', 'G4', 'C5']
    };
  }

  private scheduleSequence(sequence: any, duration: number) {
    const patternLength = '4n'; // Quarter note pattern
    const totalBars = Math.ceil(duration / (60 / Tone.Transport.bpm.value * 4));
    
    // Schedule drum pattern
    const drumPart = new Tone.Sequence((time, note) => {
      if (note === 'kick') {
        this.drum.triggerAttackRelease('C2', '8n', time);
      } else if (note === 'snare') {
        this.drum.triggerAttackRelease('C3', '8n', time);
      } else if (note === 'hihat') {
        this.drum.triggerAttackRelease('C4', '16n', time);
      }
    }, sequence.drumPattern, patternLength);
    
    // Schedule bass pattern
    const bassPart = new Tone.Sequence((time, note) => {
      this.bass.triggerAttackRelease(note, '8n', time);
    }, sequence.bassPattern, patternLength);
    
    // Schedule lead melody
    const leadPart = new Tone.Sequence((time, note) => {
      this.synth.triggerAttackRelease(note, '8n', time);
    }, sequence.leadMelody, patternLength);
    
    // Start all parts
    drumPart.start(0);
    bassPart.start(0);
    leadPart.start(0);
    
    // Stop after duration
    setTimeout(() => {
      drumPart.stop();
      bassPart.stop();
      leadPart.stop();
      drumPart.dispose();
      bassPart.dispose();
      leadPart.dispose();
    }, duration * 1000);
  }

  // Convert audio buffer to blob for download
  createAudioBlob(audioBuffer: ArrayBuffer, mimeType: string = 'audio/wav'): Blob {
    return new Blob([audioBuffer], { type: mimeType });
  }

  // Create download URL
  createDownloadUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  // Clean up resources
  dispose() {
    this.synth.dispose();
    this.drum.dispose();
    this.bass.dispose();
  }
}

export default AudioGenerationService;
