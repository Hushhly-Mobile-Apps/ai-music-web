
import * as Tone from 'tone';

export interface EDMTemplate {
  id: number;
  template_name: string;
  genre: string;
  sub_genre: string;
  bpm: number;
  key_signature: string;
  energy_level: number;
  mood: string;
  instruments: string[];
  effects: string[];
  template_data: any;
  popularity_score: number;
}

export interface GenerationOptions {
  prompt: string;
  genre?: string;
  bpm?: number;
  duration?: number;
  energy_level?: number;
  mood?: string;
}

export class EDMVariationService {
  private static instance: EDMVariationService;
  private templates: EDMTemplate[] = [];
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): EDMVariationService {
    if (!EDMVariationService.instance) {
      EDMVariationService.instance = new EDMVariationService();
    }
    return EDMVariationService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await this.loadTemplates();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize EDM Variation Service:', error);
    }
  }

  private async loadTemplates(): Promise<void> {
    try {
      const response = await window.ezsite.apis.tablePage(25686, {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: "popularity_score",
        IsAsc: false,
        Filters: []
      });

      if (response.error) {
        console.error('Error loading templates:', response.error);
        this.generateDefaultTemplates();
      } else {
        this.templates = response.data.List;
        if (this.templates.length === 0) {
          this.generateDefaultTemplates();
        }
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      this.generateDefaultTemplates();
    }
  }

  private generateDefaultTemplates(): void {
    const genres = [
      'House', 'Techno', 'Dubstep', 'Trance', 'Progressive House',
      'Electro House', 'Future Bass', 'Trap', 'Drum & Bass', 'Ambient',
      'Hardstyle', 'Minimal Techno', 'Deep House', 'Tech House', 'Breakbeat',
      'Garage', 'Psytrance', 'Hardcore', 'Synthwave', 'Chillstep'
    ];

    const moods = [
      'Energetic', 'Relaxed', 'Dark', 'Uplifting', 'Mysterious',
      'Romantic', 'Aggressive', 'Dreamy', 'Nostalgic', 'Euphoric',
      'Melancholic', 'Powerful', 'Serene', 'Intense', 'Playful'
    ];

    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const bpms = [110, 115, 120, 125, 128, 130, 135, 140, 145, 150, 155, 160, 170, 180];

    // Generate 1000 unique templates
    for (let i = 0; i < 1000; i++) {
      const genre = genres[Math.floor(Math.random() * genres.length)];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      const key = keys[Math.floor(Math.random() * keys.length)];
      const bpm = bpms[Math.floor(Math.random() * bpms.length)];
      const energy = Math.floor(Math.random() * 10) + 1;

      const template: EDMTemplate = {
        id: i + 1,
        template_name: `${genre} ${mood} ${i + 1}`,
        genre,
        sub_genre: this.generateSubGenre(genre),
        bpm,
        key_signature: key,
        energy_level: energy,
        mood,
        instruments: this.generateInstruments(genre, energy),
        effects: this.generateEffects(genre, energy),
        template_data: this.generateTemplateData(genre, bpm, key, energy),
        popularity_score: Math.floor(Math.random() * 100)
      };

      this.templates.push(template);
    }
  }

  private generateSubGenre(genre: string): string {
    const subGenres: { [key: string]: string[] } = {
      'House': ['Deep House', 'Tech House', 'Progressive House', 'Tropical House', 'Electro House'],
      'Techno': ['Minimal Techno', 'Detroit Techno', 'Acid Techno', 'Hard Techno', 'Melodic Techno'],
      'Dubstep': ['Melodic Dubstep', 'Riddim', 'Future Riddim', 'Experimental Dubstep', 'Chillstep'],
      'Trance': ['Progressive Trance', 'Uplifting Trance', 'Psytrance', 'Vocal Trance', 'Acid Trance'],
      'Trap': ['Future Trap', 'Hybrid Trap', 'Chill Trap', 'Hard Trap', 'Melodic Trap']
    };

    const options = subGenres[genre] || [genre];
    return options[Math.floor(Math.random() * options.length)];
  }

  private generateInstruments(genre: string, energy: number): string[] {
    const allInstruments = [
      'Kick', 'Snare', 'Hi-Hat', 'Crash', 'Ride', 'Bass', 'Sub Bass',
      'Lead Synth', 'Pad', 'Arp', 'Pluck', 'Strings', 'Brass',
      'Vocal Chops', 'FX', 'White Noise', 'Risers', 'Impacts'
    ];

    const genreInstruments: { [key: string]: string[] } = {
      'House': ['Kick', 'Hi-Hat', 'Snare', 'Bass', 'Pad', 'Vocal Chops'],
      'Techno': ['Kick', 'Hi-Hat', 'Snare', 'Acid Bass', 'Lead Synth', 'FX'],
      'Dubstep': ['Kick', 'Snare', 'Sub Bass', 'Lead Synth', 'Vocal Chops', 'FX'],
      'Trance': ['Kick', 'Hi-Hat', 'Bass', 'Lead Synth', 'Pad', 'Arp', 'Strings']
    };

    const baseInstruments = genreInstruments[genre] || allInstruments.slice(0, 6);
    const count = Math.min(energy + 2, 8);
    
    return baseInstruments.slice(0, count);
  }

  private generateEffects(genre: string, energy: number): string[] {
    const allEffects = [
      'Reverb', 'Delay', 'Distortion', 'Filter', 'Chorus', 'Phaser',
      'Flanger', 'Compressor', 'Limiter', 'EQ', 'Bitcrusher', 'Saturation'
    ];

    const count = Math.min(energy + 1, 6);
    return allEffects.slice(0, count);
  }

  private generateTemplateData(genre: string, bpm: number, key: string, energy: number): any {
    return {
      structure: {
        intro: 16,
        verse: 32,
        chorus: 32,
        bridge: 16,
        outro: 16
      },
      chords: this.generateChordProgression(key),
      melody: this.generateMelodyPattern(key, energy),
      rhythm: this.generateRhythmPattern(genre, bpm),
      synthesis: {
        oscillators: this.generateOscillatorSettings(genre),
        filters: this.generateFilterSettings(energy),
        envelopes: this.generateEnvelopeSettings(energy)
      }
    };
  }

  private generateChordProgression(key: string): string[] {
    const progressions = [
      ['I', 'V', 'vi', 'IV'],
      ['vi', 'IV', 'I', 'V'],
      ['I', 'vi', 'IV', 'V'],
      ['vi', 'V', 'I', 'IV'],
      ['I', 'bVII', 'IV', 'I']
    ];

    return progressions[Math.floor(Math.random() * progressions.length)];
  }

  private generateMelodyPattern(key: string, energy: number): number[] {
    const pattern = [];
    const length = energy * 4;
    
    for (let i = 0; i < length; i++) {
      pattern.push(Math.floor(Math.random() * 12) + 60); // MIDI notes
    }
    
    return pattern;
  }

  private generateRhythmPattern(genre: string, bpm: number): number[] {
    const patterns: { [key: string]: number[] } = {
      'House': [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      'Techno': [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      'Dubstep': [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
      'Trance': [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    };

    return patterns[genre] || patterns['House'];
  }

  private generateOscillatorSettings(genre: string): any {
    const settings: { [key: string]: any } = {
      'House': { type: 'sawtooth', detune: 0, phase: 0 },
      'Techno': { type: 'square', detune: 7, phase: 0 },
      'Dubstep': { type: 'sawtooth', detune: -7, phase: 0 },
      'Trance': { type: 'sine', detune: 0, phase: 0 }
    };

    return settings[genre] || settings['House'];
  }

  private generateFilterSettings(energy: number): any {
    return {
      type: 'lowpass',
      frequency: 800 + (energy * 200),
      Q: 1 + (energy * 0.5),
      gain: 0
    };
  }

  private generateEnvelopeSettings(energy: number): any {
    return {
      attack: 0.1 / energy,
      decay: 0.2,
      sustain: 0.3 + (energy * 0.1),
      release: 0.5 + (energy * 0.2)
    };
  }

  public async generateRemix(options: GenerationOptions): Promise<{
    audioBuffer: AudioBuffer;
    template: EDMTemplate;
    metadata: any;
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const template = this.selectTemplate(options);
    const audioBuffer = await this.synthesizeAudio(template, options);
    
    const metadata = {
      title: `${template.genre} Remix`,
      genre: template.genre,
      bpm: template.bpm,
      key: template.key_signature,
      mood: template.mood,
      energy: template.energy_level,
      duration: options.duration || 180,
      prompt: options.prompt
    };

    return {
      audioBuffer,
      template,
      metadata
    };
  }

  private selectTemplate(options: GenerationOptions): EDMTemplate {
    let filteredTemplates = this.templates;

    if (options.genre) {
      filteredTemplates = filteredTemplates.filter(t => 
        t.genre.toLowerCase().includes(options.genre!.toLowerCase())
      );
    }

    if (options.bpm) {
      filteredTemplates = filteredTemplates.filter(t => 
        Math.abs(t.bpm - options.bpm!) <= 10
      );
    }

    if (options.energy_level) {
      filteredTemplates = filteredTemplates.filter(t => 
        Math.abs(t.energy_level - options.energy_level!) <= 2
      );
    }

    if (options.mood) {
      filteredTemplates = filteredTemplates.filter(t => 
        t.mood.toLowerCase().includes(options.mood!.toLowerCase())
      );
    }

    if (filteredTemplates.length === 0) {
      filteredTemplates = this.templates;
    }

    // Select random template from filtered results
    const randomIndex = Math.floor(Math.random() * filteredTemplates.length);
    return filteredTemplates[randomIndex];
  }

  private async synthesizeAudio(template: EDMTemplate, options: GenerationOptions): Promise<AudioBuffer> {
    const duration = options.duration || 180;
    const sampleRate = 44100;
    const channels = 2;
    
    const audioBuffer = new AudioBuffer({
      numberOfChannels: channels,
      length: sampleRate * duration,
      sampleRate: sampleRate
    });

    // Generate audio based on template
    await this.generateAudioFromTemplate(audioBuffer, template, options);
    
    return audioBuffer;
  }

  private async generateAudioFromTemplate(
    audioBuffer: AudioBuffer, 
    template: EDMTemplate, 
    options: GenerationOptions
  ): Promise<void> {
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    
    // Generate different instruments based on template
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = audioBuffer.getChannelData(1);
    
    // Generate kick drum pattern
    this.generateKickDrum(leftChannel, rightChannel, template, sampleRate);
    
    // Generate bass line
    this.generateBassLine(leftChannel, rightChannel, template, sampleRate);
    
    // Generate lead synth
    this.generateLeadSynth(leftChannel, rightChannel, template, sampleRate);
    
    // Generate hi-hats
    this.generateHiHats(leftChannel, rightChannel, template, sampleRate);
    
    // Add effects
    this.applyEffects(leftChannel, rightChannel, template);
  }

  private generateKickDrum(
    left: Float32Array, 
    right: Float32Array, 
    template: EDMTemplate, 
    sampleRate: number
  ): void {
    const bpm = template.bpm;
    const beatDuration = (60 / bpm) * sampleRate;
    const kickPattern = template.template_data.rhythm;
    
    for (let i = 0; i < left.length; i++) {
      const beatPosition = Math.floor(i / (beatDuration / 4)) % kickPattern.length;
      
      if (kickPattern[beatPosition] === 1) {
        const kickSample = this.generateKickSample(i, sampleRate);
        left[i] += kickSample * 0.8;
        right[i] += kickSample * 0.8;
      }
    }
  }

  private generateKickSample(position: number, sampleRate: number): number {
    const t = position / sampleRate;
    const freq = 60 * Math.exp(-t * 10);
    return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 5);
  }

  private generateBassLine(
    left: Float32Array, 
    right: Float32Array, 
    template: EDMTemplate, 
    sampleRate: number
  ): void {
    const bpm = template.bpm;
    const beatDuration = (60 / bpm) * sampleRate;
    
    for (let i = 0; i < left.length; i++) {
      const t = i / sampleRate;
      const freq = 55 + Math.sin(t * 0.5) * 20; // Varying bass frequency
      const bassSample = Math.sin(2 * Math.PI * freq * t) * 0.3;
      
      left[i] += bassSample;
      right[i] += bassSample;
    }
  }

  private generateLeadSynth(
    left: Float32Array, 
    right: Float32Array, 
    template: EDMTemplate, 
    sampleRate: number
  ): void {
    const melody = template.template_data.melody;
    const bpm = template.bpm;
    const noteDuration = (60 / bpm) * sampleRate / 4;
    
    for (let i = 0; i < left.length; i++) {
      const noteIndex = Math.floor(i / noteDuration) % melody.length;
      const midiNote = melody[noteIndex];
      const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
      
      const t = (i % noteDuration) / sampleRate;
      const leadSample = Math.sin(2 * Math.PI * freq * t) * 0.2 * Math.exp(-t * 2);
      
      left[i] += leadSample;
      right[i] += leadSample;
    }
  }

  private generateHiHats(
    left: Float32Array, 
    right: Float32Array, 
    template: EDMTemplate, 
    sampleRate: number
  ): void {
    const bpm = template.bpm;
    const beatDuration = (60 / bpm) * sampleRate / 4;
    
    for (let i = 0; i < left.length; i++) {
      if (i % Math.floor(beatDuration / 2) === 0) {
        const hihatSample = (Math.random() - 0.5) * 0.1 * Math.exp(-((i % beatDuration) / beatDuration) * 10);
        left[i] += hihatSample;
        right[i] += hihatSample;
      }
    }
  }

  private applyEffects(left: Float32Array, right: Float32Array, template: EDMTemplate): void {
    // Apply reverb effect
    const reverbAmount = 0.3;
    const delayTime = 0.1;
    const delaySamples = Math.floor(delayTime * 44100);
    
    for (let i = delaySamples; i < left.length; i++) {
      left[i] += left[i - delaySamples] * reverbAmount;
      right[i] += right[i - delaySamples] * reverbAmount;
    }
    
    // Apply filter sweep
    const filterFreq = template.template_data.synthesis.filters.frequency;
    const filterQ = template.template_data.synthesis.filters.Q;
    
    // Simple lowpass filter simulation
    for (let i = 1; i < left.length; i++) {
      const alpha = 0.1;
      left[i] = alpha * left[i] + (1 - alpha) * left[i - 1];
      right[i] = alpha * right[i] + (1 - alpha) * right[i - 1];
    }
  }

  public async saveRemix(remixData: {
    title: string;
    genre: string;
    promptText: string;
    templateId: number;
    audioBuffer: AudioBuffer;
    coverImage?: File;
    userId: number;
  }): Promise<{ success: boolean; error?: string; remixId?: number }> {
    try {
      // Convert audio buffer to blob
      const audioBlob = await this.audioBufferToBlob(remixData.audioBuffer);
      
      // Upload audio file
      const audioUpload = await window.ezsite.apis.upload({
        filename: `${remixData.title}.wav`,
        file: audioBlob as File
      });

      if (audioUpload.error) {
        return { success: false, error: audioUpload.error };
      }

      let coverImageId = null;
      if (remixData.coverImage) {
        const coverUpload = await window.ezsite.apis.upload({
          filename: `${remixData.title}_cover.jpg`,
          file: remixData.coverImage
        });

        if (!coverUpload.error) {
          coverImageId = coverUpload.data;
        }
      }

      // Save remix to database
      const remixRecord = await window.ezsite.apis.tableCreate(25687, {
        user_id: remixData.userId,
        remix_title: remixData.title,
        genre: remixData.genre,
        prompt_text: remixData.promptText,
        template_id: remixData.templateId,
        audio_file_id: audioUpload.data,
        cover_image_id: coverImageId,
        duration: Math.floor(remixData.audioBuffer.duration),
        bpm: 128, // Default BPM
        is_public: true,
        likes_count: 0,
        plays_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (remixRecord.error) {
        return { success: false, error: remixRecord.error };
      }

      return { success: true, remixId: remixRecord.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async audioBufferToBlob(audioBuffer: AudioBuffer): Promise<Blob> {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    // Write audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i];
        const intSample = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, intSample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  public async getRecentRemixes(userId?: number, limit: number = 12): Promise<any[]> {
    try {
      const filters = userId ? [{ name: "user_id", op: "Equal", value: userId }] : [];
      
      const response = await window.ezsite.apis.tablePage(25687, {
        PageNo: 1,
        PageSize: limit,
        OrderByField: "created_at",
        IsAsc: false,
        Filters: filters
      });

      if (response.error) {
        console.error('Error fetching recent remixes:', response.error);
        return [];
      }

      return response.data.List || [];
    } catch (error) {
      console.error('Error fetching recent remixes:', error);
      return [];
    }
  }

  public async getPopularTemplates(limit: number = 10): Promise<EDMTemplate[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.templates
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, limit);
  }
}

export default EDMVariationService;
