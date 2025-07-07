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
    aiModel: string;
    uniqueId: string;
  };
}

// Advanced EDM Sound Bank
const EDM_SOUND_BANK = {
  synths: {
    supersaw: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.1, decay: 0.3, sustain: 0.5, release: 0.8 } },
    pluck: { oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.5 } },
    pad: { oscillator: { type: 'sine' }, envelope: { attack: 0.8, decay: 0.5, sustain: 0.7, release: 1.2 } },
    bass: { oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.3 } },
    lead: { oscillator: { type: 'square' }, envelope: { attack: 0.05, decay: 0.1, sustain: 0.6, release: 0.4 } },
    arp: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.3 } }
  },
  scales: {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    harmonic: [0, 2, 3, 5, 7, 8, 11],
    pentatonic: [0, 2, 4, 7, 9]
  },
  chordProgressions: {
    'progressive-house': [
      ['vi', 'IV', 'I', 'V'],
      ['I', 'vi', 'IV', 'V'],
      ['vi', 'V', 'I', 'IV'],
      ['I', 'V', 'vi', 'IV']
    ],
    'future-bass': [
      ['vi', 'IV', 'I', 'V'],
      ['I', 'vi', 'ii', 'V'],
      ['vi', 'ii', 'V', 'I'],
      ['I', 'V', 'vi', 'iii']
    ],
    'techno': [
      ['i', 'iv', 'VI', 'VII'],
      ['i', 'VI', 'III', 'VII'],
      ['i', 'v', 'i', 'v'],
      ['i', 'iv', 'v', 'i']
    ],
    'trance': [
      ['vi', 'IV', 'I', 'V'],
      ['I', 'vi', 'IV', 'V'],
      ['vi', 'V', 'I', 'IV'],
      ['I', 'V', 'vi', 'IV']
    ],
    'dubstep': [
      ['i', 'VI', 'III', 'VII'],
      ['i', 'iv', 'VI', 'v'],
      ['i', 'v', 'VI', 'iv'],
      ['i', 'VII', 'VI', 'v']
    ],
    'hardstyle': [
      ['i', 'VI', 'III', 'VII'],
      ['i', 'iv', 'v', 'i'],
      ['i', 'v', 'VI', 'iv'],
      ['i', 'VII', 'VI', 'v']
    ]
  }
};

export class AudioGenerationService {
  private synths: { [key: string]: Tone.Synth } = {};
  private drums: { [key: string]: Tone.MembraneSynth } = {};
  private effects: { [key: string]: any } = {};
  private isInitialized = false;
  private currentSeed = 0;

  constructor() {
    this.initializeSynths();
    this.initializeDrums();
    this.initializeEffects();
  }

  private initializeSynths() {
    Object.entries(EDM_SOUND_BANK.synths).forEach(([name, config]) => {
      this.synths[name] = new Tone.Synth(config).toDestination();
    });
  }

  private initializeDrums() {
    this.drums.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
    }).toDestination();

    this.drums.snare = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 2,
      oscillator: { type: 'square' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.2 }
    }).toDestination();

    this.drums.hihat = new Tone.MembraneSynth({
      pitchDecay: 0.001,
      octaves: 1,
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0.01, release: 0.1 }
    }).toDestination();
  }

  private initializeEffects() {
    this.effects.reverb = new Tone.Reverb(2);
    this.effects.delay = new Tone.PingPongDelay(0.2, 0.1);
    this.effects.chorus = new Tone.Chorus(4, 2.5, 0.5);
    this.effects.distortion = new Tone.Distortion(0.8);
    this.effects.filter = new Tone.Filter(800, 'lowpass');
  }

  async initialize() {
    if (this.isInitialized) return;
    await Tone.start();
    this.isInitialized = true;
  }

  private generateSeed(options: AudioGenerationOptions): number {
    const str = options.genre + options.mood + options.prompt + Date.now();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  async generateAudio(options: AudioGenerationOptions): Promise<GeneratedAudio> {
    await this.initialize();

    const duration = options.duration || 30;
    this.currentSeed = this.generateSeed(options);
    
    const bpm = this.getBPMForGenre(options.genre);
    const key = this.getKeyForMood(options.mood);
    const uniqueId = `edm_${this.currentSeed}_${Date.now()}`;

    // Set transport BPM with slight variation
    const bpmVariation = Math.floor(this.seededRandom(this.currentSeed) * 10) - 5;
    Tone.Transport.bpm.value = bpm + bpmVariation;

    // Generate unique sequence based on seed
    const sequence = this.generateAdvancedSequence(options);

    // Create recorder
    const recorder = new Tone.Recorder();

    // Connect synthesizers to recorder with effects
    this.connectSynthsToRecorder(recorder, options.genre);

    // Start recording
    recorder.start();

    // Start transport and play the sequence
    Tone.Transport.start();

    // Schedule the advanced sequence
    this.scheduleAdvancedSequence(sequence, duration);

    // Wait for the duration
    await new Promise((resolve) => setTimeout(resolve, duration * 1000));

    // Stop recording and transport
    Tone.Transport.stop();
    const recording = await recorder.stop();

    // Convert to ArrayBuffer
    const audioBuffer = await recording.arrayBuffer();

    return {
      audioBuffer,
      duration,
      metadata: {
        bpm: bpm + bpmVariation,
        key,
        genre: options.genre,
        mood: options.mood,
        aiModel: 'AIVA Neural Engine v3.2',
        uniqueId
      }
    };
  }

  private connectSynthsToRecorder(recorder: Tone.Recorder, genre: string) {
    // Connect synths based on genre
    switch (genre) {
      case 'progressive-house':
        this.synths.supersaw.chain(this.effects.reverb, this.effects.chorus, recorder);
        this.synths.bass.chain(this.effects.filter, recorder);
        this.synths.pluck.chain(this.effects.delay, recorder);
        break;
      case 'future-bass':
        this.synths.lead.chain(this.effects.chorus, this.effects.delay, recorder);
        this.synths.bass.chain(this.effects.distortion, recorder);
        this.synths.pad.chain(this.effects.reverb, recorder);
        break;
      case 'techno':
        this.synths.bass.chain(this.effects.filter, recorder);
        this.synths.lead.chain(this.effects.distortion, recorder);
        this.synths.arp.chain(this.effects.delay, recorder);
        break;
      case 'trance':
        this.synths.supersaw.chain(this.effects.reverb, this.effects.chorus, recorder);
        this.synths.arp.chain(this.effects.delay, recorder);
        this.synths.pad.chain(this.effects.reverb, recorder);
        break;
      case 'dubstep':
        this.synths.bass.chain(this.effects.distortion, this.effects.filter, recorder);
        this.synths.lead.chain(this.effects.distortion, recorder);
        break;
      default:
        Object.values(this.synths).forEach(synth => {
          synth.chain(this.effects.reverb, recorder);
        });
    }

    // Connect drums
    Object.values(this.drums).forEach(drum => {
      drum.connect(recorder);
    });
  }

  private getBPMForGenre(genre: string): number {
    const bpmRanges: { [key: string]: [number, number] } = {
      'progressive-house': [124, 134],
      'future-bass': [140, 160],
      'big-room': [126, 132],
      'techno': [120, 150],
      'trance': [130, 140],
      'dubstep': [140, 150],
      'trap': [140, 180],
      'hardstyle': [150, 160],
      'deep-house': [120, 125],
      'electro': [126, 132]
    };

    const range = bpmRanges[genre] || [128, 128];
    const randomBPM = range[0] + Math.floor(this.seededRandom(this.currentSeed + 1) * (range[1] - range[0]));
    return randomBPM;
  }

  private getKeyForMood(mood: string): string {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const modes = ['major', 'minor', 'dorian', 'phrygian'];
    
    const moodKeyMappings: { [key: string]: string[] } = {
      'uplifting': ['C major', 'G major', 'D major', 'A major'],
      'dark': ['A minor', 'E minor', 'B minor', 'F# minor'],
      'chill': ['F major', 'Bb major', 'Eb major', 'Ab major'],
      'energetic': ['E major', 'B major', 'F# major', 'C# major'],
      'ethereal': ['F# major', 'C# major', 'G# major', 'D# major'],
      'aggressive': ['D minor', 'G minor', 'C minor', 'F minor']
    };

    const possibleKeys = moodKeyMappings[mood] || moodKeyMappings['uplifting'];
    const randomIndex = Math.floor(this.seededRandom(this.currentSeed + 2) * possibleKeys.length);
    return possibleKeys[randomIndex];
  }

  private generateAdvancedSequence(options: AudioGenerationOptions) {
    const genre = options.genre;
    const mood = options.mood;
    const prompt = options.prompt.toLowerCase();

    // Get chord progression based on genre
    const progressions = EDM_SOUND_BANK.chordProgressions[genre] || EDM_SOUND_BANK.chordProgressions['progressive-house'];
    const selectedProgression = progressions[Math.floor(this.seededRandom(this.currentSeed + 3) * progressions.length)];

    // Generate melody based on prompt analysis
    const melody = this.generateMelodyFromPrompt(prompt, mood);
    
    // Generate bass line
    const bassLine = this.generateBassLine(genre, selectedProgression);
    
    // Generate drum pattern
    const drumPattern = this.generateDrumPattern(genre, mood);
    
    // Generate arpeggio
    const arpeggio = this.generateArpeggio(selectedProgression);

    return {
      chords: selectedProgression,
      melody,
      bassLine,
      drumPattern,
      arpeggio,
      effects: this.selectEffectsForGenre(genre)
    };
  }

  private generateMelodyFromPrompt(prompt: string, mood: string): string[] {
    const melodyPatterns = {
      'spacey': ['C4', 'F4', 'G4', 'C5', 'Bb4', 'F4', 'G4', 'C4'],
      'anthem': ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6', 'G5'],
      'drop': ['C5', 'C5', 'C5', 'C5', 'Bb4', 'A4', 'G4', 'F4'],
      'uplifting': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
      'dark': ['A3', 'C4', 'E4', 'A4', 'G4', 'E4', 'C4', 'A3'],
      'chill': ['C4', 'E4', 'G4', 'B4', 'C5', 'B4', 'G4', 'E4'],
      'energetic': ['E4', 'G4', 'B4', 'E5', 'D5', 'B4', 'G4', 'E4'],
      'ethereal': ['F#4', 'A4', 'C#5', 'F#5', 'E5', 'C#5', 'A4', 'F#4']
    };

    // Analyze prompt for keywords
    let selectedPattern = melodyPatterns[mood] || melodyPatterns['uplifting'];
    
    for (const [keyword, pattern] of Object.entries(melodyPatterns)) {
      if (prompt.includes(keyword)) {
        selectedPattern = pattern;
        break;
      }
    }

    // Add variation based on seed
    const variations = this.createMelodyVariations(selectedPattern);
    const variationIndex = Math.floor(this.seededRandom(this.currentSeed + 4) * variations.length);
    
    return variations[variationIndex];
  }

  private createMelodyVariations(baseMelody: string[]): string[][] {
    const variations = [baseMelody];
    
    // Octave shift variation
    variations.push(baseMelody.map(note => {
      const noteName = note.slice(0, -1);
      const octave = parseInt(note.slice(-1));
      return `${noteName}${octave + 1}`;
    }));
    
    // Reverse variation
    variations.push([...baseMelody].reverse());
    
    // Skip pattern variation
    const skipPattern = [];
    for (let i = 0; i < baseMelody.length; i += 2) {
      skipPattern.push(baseMelody[i]);
      if (i + 1 < baseMelody.length) {
        skipPattern.push(baseMelody[i + 1]);
      }
    }
    variations.push(skipPattern);
    
    return variations;
  }

  private generateBassLine(genre: string, chords: string[]): string[] {
    const bassPatterns = {
      'progressive-house': ['C2', 'C2', 'F2', 'F2', 'G2', 'G2', 'A2', 'A2'],
      'future-bass': ['C2', 'C3', 'F2', 'F3', 'G2', 'G3', 'A2', 'A3'],
      'techno': ['C2', 'C2', 'C2', 'C2', 'F2', 'F2', 'F2', 'F2'],
      'trance': ['C2', 'E2', 'G2', 'C3', 'F2', 'A2', 'C3', 'F3'],
      'dubstep': ['C1', 'C2', 'C1', 'C2', 'F1', 'F2', 'F1', 'F2'],
      'hardstyle': ['C2', 'C2', 'C2', 'C2', 'F2', 'F2', 'G2', 'G2']
    };

    const basePattern = bassPatterns[genre] || bassPatterns['progressive-house'];
    
    // Create variations
    const variations = [
      basePattern,
      basePattern.map(note => {
        const noteName = note.slice(0, -1);
        const octave = parseInt(note.slice(-1));
        return `${noteName}${octave - 1}`;
      }),
      basePattern.reverse()
    ];

    const variationIndex = Math.floor(this.seededRandom(this.currentSeed + 5) * variations.length);
    return variations[variationIndex];
  }

  private generateDrumPattern(genre: string, mood: string): { [key: string]: string[] } {
    const drumPatterns = {
      'progressive-house': {
        kick: ['x', '.', '.', '.', 'x', '.', '.', '.'],
        snare: ['.', '.', 'x', '.', '.', '.', 'x', '.'],
        hihat: ['.', 'x', '.', 'x', '.', 'x', '.', 'x']
      },
      'future-bass': {
        kick: ['x', '.', 'x', '.', 'x', '.', '.', '.'],
        snare: ['.', '.', '.', '.', 'x', '.', '.', '.'],
        hihat: ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x']
      },
      'techno': {
        kick: ['x', '.', '.', '.', 'x', '.', '.', '.'],
        snare: ['.', '.', 'x', '.', '.', '.', 'x', '.'],
        hihat: ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x']
      },
      'trance': {
        kick: ['x', '.', '.', '.', 'x', '.', '.', '.'],
        snare: ['.', '.', 'x', '.', '.', '.', 'x', '.'],
        hihat: ['.', 'x', '.', 'x', '.', 'x', '.', 'x']
      },
      'dubstep': {
        kick: ['x', '.', '.', '.', '.', '.', '.', '.'],
        snare: ['.', '.', '.', '.', 'x', '.', '.', '.'],
        hihat: ['x', '.', 'x', '.', 'x', '.', 'x', '.']
      },
      'hardstyle': {
        kick: ['x', '.', '.', '.', 'x', '.', '.', '.'],
        snare: ['.', '.', 'x', '.', '.', '.', 'x', '.'],
        hihat: ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x']
      }
    };

    const basePattern = drumPatterns[genre] || drumPatterns['progressive-house'];
    
    // Modify pattern based on mood
    if (mood === 'aggressive') {
      basePattern.kick = basePattern.kick.map(hit => hit === 'x' ? 'x' : (Math.random() < 0.2 ? 'x' : '.'));
    } else if (mood === 'chill') {
      basePattern.hihat = basePattern.hihat.map(hit => hit === 'x' ? (Math.random() < 0.7 ? 'x' : '.') : '.');
    }

    return basePattern;
  }

  private generateArpeggio(chords: string[]): string[] {
    const arpeggioPatterns = [
      ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4', 'E4'],
      ['C4', 'G4', 'C5', 'E5', 'C5', 'G4', 'E4', 'C4'],
      ['C4', 'E4', 'G4', 'E4', 'C4', 'G4', 'E4', 'G4'],
      ['C5', 'G4', 'E4', 'C4', 'E4', 'G4', 'C5', 'G4']
    ];

    const patternIndex = Math.floor(this.seededRandom(this.currentSeed + 6) * arpeggioPatterns.length);
    return arpeggioPatterns[patternIndex];
  }

  private selectEffectsForGenre(genre: string): string[] {
    const effectsMap = {
      'progressive-house': ['reverb', 'chorus', 'delay'],
      'future-bass': ['chorus', 'delay', 'distortion'],
      'techno': ['filter', 'distortion', 'delay'],
      'trance': ['reverb', 'chorus', 'delay'],
      'dubstep': ['distortion', 'filter'],
      'hardstyle': ['distortion', 'reverb']
    };

    return effectsMap[genre] || ['reverb'];
  }

  private scheduleAdvancedSequence(sequence: any, duration: number) {
    const patternLength = '8n';
    const totalBars = Math.ceil(duration / (60 / Tone.Transport.bpm.value * 4));

    // Schedule drums
    Object.entries(sequence.drumPattern).forEach(([drumType, pattern]) => {
      const drumPart = new Tone.Sequence((time, hit) => {
        if (hit === 'x') {
          switch (drumType) {
            case 'kick':
              this.drums.kick.triggerAttackRelease('C2', '8n', time);
              break;
            case 'snare':
              this.drums.snare.triggerAttackRelease('C3', '8n', time);
              break;
            case 'hihat':
              this.drums.hihat.triggerAttackRelease('C4', '16n', time);
              break;
          }
        }
      }, pattern as string[], patternLength);

      drumPart.start(0);
      setTimeout(() => {
        drumPart.stop();
        drumPart.dispose();
      }, duration * 1000);
    });

    // Schedule bass line
    const bassPart = new Tone.Sequence((time, note) => {
      this.synths.bass.triggerAttackRelease(note, '8n', time);
    }, sequence.bassLine, patternLength);

    // Schedule melody
    const melodyPart = new Tone.Sequence((time, note) => {
      this.synths.lead.triggerAttackRelease(note, '8n', time);
    }, sequence.melody, patternLength);

    // Schedule arpeggio
    const arpPart = new Tone.Sequence((time, note) => {
      this.synths.arp.triggerAttackRelease(note, '16n', time);
    }, sequence.arpeggio, '16n');

    // Start all parts
    bassPart.start(0);
    melodyPart.start(0);
    arpPart.start(0);

    // Schedule stops
    setTimeout(() => {
      [bassPart, melodyPart, arpPart].forEach(part => {
        part.stop();
        part.dispose();
      });
    }, duration * 1000);
  }

  createAudioBlob(audioBuffer: ArrayBuffer, mimeType: string = 'audio/wav'): Blob {
    return new Blob([audioBuffer], { type: mimeType });
  }

  createDownloadUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  dispose() {
    Object.values(this.synths).forEach(synth => synth.dispose());
    Object.values(this.drums).forEach(drum => drum.dispose());
    Object.values(this.effects).forEach(effect => effect.dispose());
  }
}

export default AudioGenerationService;