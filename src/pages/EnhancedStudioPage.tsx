import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Music,
  Zap,
  Upload,
  Play,
  Loader2,
  Settings,
  Shuffle,
  BarChart3,
  Layers,
  Volume2,
  Sliders } from
'lucide-react';
import Navigation from '@/components/Navigation';
import FileUpload from '@/components/FileUpload';
import ProgressBar from '@/components/ProgressBar';
import TrackVariationsManager from '@/components/TrackVariationsManager';
import AudioAnalysisDisplay from '@/components/AudioAnalysisDisplay';
import EDMPresetManager from '@/components/EDMPresetManager';
import EnhancedAudioGenerationService, {
  type AdvancedAudioGenerationOptions,
  type GeneratedAudioVariation } from
'@/services/EnhancedAudioGenerationService';
import { toast } from 'sonner';

const EnhancedStudioPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('energetic');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex' | 'experimental'>('medium');
  const [mixingStyle, setMixingStyle] = useState<'clean' | 'compressed' | 'saturated' | 'vintage'>('clean');
  const [arrangeStyle, setArrangeStyle] = useState<'intro-buildup-drop-outro' | 'verse-chorus' | 'continuous-mix' | 'experimental'>('intro-buildup-drop-outro');
  const [bpm, setBpm] = useState([128]);
  const [variations, setVariations] = useState([3]);
  const [duration, setDuration] = useState([60]);
  const [effects, setEffects] = useState<string[]>(['reverb', 'chorus']);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedVariations, setGeneratedVariations] = useState<TrackVariation[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string>('');

  interface TrackVariation {
    id: string;
    audioBlob: Blob;
    metadata: any;
    variationNumber: number;
    title: string;
    rating?: number;
    isFavorite?: boolean;
  }

  const genres = [
  { value: 'progressive-house', label: 'Progressive House' },
  { value: 'future-bass', label: 'Future Bass' },
  { value: 'big-room', label: 'Big Room' },
  { value: 'techno', label: 'Techno' },
  { value: 'trance', label: 'Trance' },
  { value: 'dubstep', label: 'Dubstep' },
  { value: 'trap', label: 'Trap' },
  { value: 'hardstyle', label: 'Hardstyle' },
  { value: 'deep-house', label: 'Deep House' },
  { value: 'electro', label: 'Electro House' }];


  const moods = [
  { value: 'uplifting', label: 'Uplifting & Euphoric' },
  { value: 'dark', label: 'Dark & Mysterious' },
  { value: 'chill', label: 'Chill & Relaxed' },
  { value: 'energetic', label: 'High Energy' },
  { value: 'ethereal', label: 'Ethereal & Dreamy' },
  { value: 'aggressive', label: 'Aggressive & Intense' }];


  const complexityOptions = [
  { value: 'simple', label: 'Simple', description: 'Basic structure with essential elements' },
  { value: 'medium', label: 'Medium', description: 'Balanced complexity with multiple layers' },
  { value: 'complex', label: 'Complex', description: 'Rich arrangement with advanced elements' },
  { value: 'experimental', label: 'Experimental', description: 'Cutting-edge with experimental sounds' }];


  const mixingStyles = [
  { value: 'clean', label: 'Clean', description: 'Pristine, unprocessed sound' },
  { value: 'compressed', label: 'Compressed', description: 'Radio-ready with compression' },
  { value: 'saturated', label: 'Saturated', description: 'Warm, analog-style saturation' },
  { value: 'vintage', label: 'Vintage', description: 'Retro processing and character' }];


  const arrangementStyles = [
  { value: 'intro-buildup-drop-outro', label: 'Intro → Buildup → Drop → Outro' },
  { value: 'verse-chorus', label: 'Verse → Chorus Structure' },
  { value: 'continuous-mix', label: 'Continuous DJ Mix Style' },
  { value: 'experimental', label: 'Experimental Structure' }];


  const availableEffects = [
  'reverb', 'delay', 'chorus', 'distortion', 'filter', 'compressor',
  'phaser', 'tremolo', 'autoWah', 'bitcrusher', 'feedbackDelay', 'pitchShift'];


  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleLoadPreset = (preset: any) => {
    setGenre(preset.genre);
    setMood(preset.mood);
    setBpm([preset.bpm]);
    setComplexity(preset.complexity);
    setMixingStyle(preset.mixingStyle);
    setArrangeStyle(preset.arrangeStyle);
    setEffects(preset.effects);
    toast.success(`Loaded preset: ${preset.name}`);
  };

  const getCurrentSettings = () => ({
    genre,
    mood,
    bpm: bpm[0],
    complexity,
    mixingStyle,
    arrangeStyle,
    effects
  });

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast.error('Please upload an audio file first');
      return;
    }

    if (!genre) {
      toast.error('Please select an EDM genre');
      return;
    }

    setIsLoading(true);
    setGeneratedVariations([]);
    setCurrentAnalysis(null);

    const newSessionId = `session_${Date.now()}`;
    setSessionId(newSessionId);

    toast.success('🎵 Starting advanced EDM generation with multiple variations...');

    try {
      const audioService = new EnhancedAudioGenerationService();

      const options: AdvancedAudioGenerationOptions = {
        genre,
        mood,
        prompt: prompt || `Transform this track into a powerful ${genre} remix with ${mood} vibes`,
        duration: duration[0],
        bpm: bpm[0],
        complexity,
        variations: variations[0],
        effects,
        mixingStyle,
        arrangeStyle
      };

      // Start generation session tracking
      const sessionData = {
        user_id: 'current_user', // Replace with actual user ID
        session_id: newSessionId,
        input_prompt: options.prompt,
        variations_generated: 0,
        total_duration: 0,
        ai_model_used: 'AIVA Neural Engine v4.0',
        processing_time: 0,
        session_data: JSON.stringify({
          originalFile: selectedFile.name,
          options
        })
      };

      const startTime = Date.now();

      // Generate multiple variations
      const generatedData = await audioService.generateAdvancedAudio(options);

      const processingTime = (Date.now() - startTime) / 1000;

      // Convert to TrackVariation format
      const trackVariations: TrackVariation[] = generatedData.map((variation: GeneratedAudioVariation) => {
        const audioBlob = audioService.createAudioBlob(variation.audioBuffer);

        return {
          id: variation.metadata.uniqueId,
          audioBlob,
          metadata: variation.metadata,
          variationNumber: variation.variationNumber,
          title: `${selectedFile.name} - ${genre} Remix`,
          rating: 0,
          isFavorite: false
        };
      });

      setGeneratedVariations(trackVariations);

      // Set analysis data from first variation
      if (trackVariations.length > 0) {
        setCurrentAnalysis({
          frequencyData: trackVariations[0].metadata.frequencyAnalysis,
          metadata: trackVariations[0].metadata
        });
      }

      // Save session data
      try {
        await window.ezsite.apis.tableCreate(25682, {
          ...sessionData,
          variations_generated: generatedData.length,
          total_duration: generatedData.reduce((total, v) => total + v.duration, 0),
          processing_time: processingTime
        });
      } catch (dbError) {
        console.error('Database session save error:', dbError);
      }

      // Save individual tracks
      for (const variation of trackVariations) {
        try {
          const trackData = {
            title: variation.title,
            prompt: options.prompt,
            genre: options.genre,
            mood: options.mood,
            duration: variation.metadata ? duration[0] : 0,
            generation_type: 'enhanced-remix',
            parameters: JSON.stringify({
              originalFile: selectedFile.name,
              variationNumber: variation.variationNumber,
              ...variation.metadata,
              sessionId: newSessionId
            }),
            status: 'completed'
          };

          await window.ezsite.apis.tableCreate(25665, trackData);
        } catch (trackError) {
          console.error('Track save error:', trackError);
        }
      }

      toast.success(`🎵 Generated ${generatedData.length} unique EDM variations successfully!`);
      audioService.dispose();

    } catch (error) {
      console.error('Advanced audio generation error:', error);
      toast.error('Failed to generate audio variations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateVariation = async (variationNumber: number) => {
    toast.info(`Regenerating variation ${variationNumber}...`);
    // Implementation for regenerating specific variation
  };

  const handleSaveVariation = async (variation: TrackVariation) => {
    try {
      // Update track analytics
      await window.ezsite.apis.tableCreate(25684, {
        track_id: 0, // This should be the actual track ID
        download_count: 1,
        last_played_at: new Date().toISOString(),
        peak_frequency_data: JSON.stringify(variation.metadata.frequencyAnalysis)
      });

      toast.success('Variation analytics updated');
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const handleRateVariation = (variationId: string, rating: number) => {
    setGeneratedVariations((prev) =>
    prev.map((variation) =>
    variation.id === variationId ?
    { ...variation, rating } :
    variation
    )
    );
  };

  const handleToggleFavorite = (variationId: string) => {
    setGeneratedVariations((prev) =>
    prev.map((variation) =>
    variation.id === variationId ?
    { ...variation, isFavorite: !variation.isFavorite } :
    variation
    )
    );
  };

  const toggleEffect = (effect: string) => {
    setEffects((prev) =>
    prev.includes(effect) ?
    prev.filter((e) => e !== effect) :
    [...prev, effect]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Advanced EDM Production Studio
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Professional-grade AI-powered EDM creation with multiple variations, real-time analysis, and advanced presets
              </p>
            </div>

            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-900 mb-8">
                <TabsTrigger value="create" className="data-[state=active]:bg-green-500/20">
                  <Music className="w-4 h-4 mr-2" />
                  Create & Generate
                </TabsTrigger>
                <TabsTrigger value="presets" className="data-[state=active]:bg-green-500/20">
                  <Settings className="w-4 h-4 mr-2" />
                  Presets & Settings
                </TabsTrigger>
                <TabsTrigger value="variations" className="data-[state=active]:bg-green-500/20">
                  <Layers className="w-4 h-4 mr-2" />
                  Variations & Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column - Input & Controls */}
                  <div className="space-y-6">
                    {/* File Upload */}
                    <Card className="bg-gray-900 border-green-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Upload className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-semibold text-white">Upload Your Track</h3>
                        </div>
                        <FileUpload
                          onFileSelect={handleFileSelect}
                          selectedFile={selectedFile || undefined} />

                      </CardContent>
                    </Card>

                    {/* Basic Settings */}
                    <Card className="bg-gray-900 border-green-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Music className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-semibold text-white">Basic Settings</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Genre</label>
                            <Select value={genre} onValueChange={setGenre}>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Choose EDM genre" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                {genres.map((g) =>
                                <SelectItem key={g.value} value={g.value} className="text-white">
                                    {g.label}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Mood</label>
                            <Select value={mood} onValueChange={setMood}>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select mood" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                {moods.map((m) =>
                                <SelectItem key={m.value} value={m.value} className="text-white">
                                    {m.label}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Advanced Controls */}
                    <Card className="bg-gray-900 border-green-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Sliders className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-semibold text-white">Advanced Controls</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {/* BPM */}
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-sm text-gray-400">BPM</label>
                              <span className="text-sm text-white">{bpm[0]}</span>
                            </div>
                            <Slider
                              value={bpm}
                              onValueChange={setBpm}
                              max={200}
                              min={80}
                              step={1}
                              className="w-full" />

                          </div>

                          {/* Duration */}
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-sm text-gray-400">Duration (seconds)</label>
                              <span className="text-sm text-white">{duration[0]}s</span>
                            </div>
                            <Slider
                              value={duration}
                              onValueChange={setDuration}
                              max={180}
                              min={30}
                              step={15}
                              className="w-full" />

                          </div>

                          {/* Variations */}
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-sm text-gray-400">Variations to Generate</label>
                              <span className="text-sm text-white">{variations[0]}</span>
                            </div>
                            <Slider
                              value={variations}
                              onValueChange={setVariations}
                              max={6}
                              min={1}
                              step={1}
                              className="w-full" />

                          </div>

                          {/* Complexity */}
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Complexity</label>
                            <div className="grid grid-cols-2 gap-2">
                              {complexityOptions.map((option) =>
                              <button
                                key={option.value}
                                onClick={() => setComplexity(option.value as any)}
                                className={`p-3 rounded-lg border transition-all text-left ${
                                complexity === option.value ?
                                'border-green-500 bg-green-500/20' :
                                'border-gray-700 bg-gray-800 hover:border-gray-600'}`
                                }>

                                  <div className="font-medium text-white">{option.label}</div>
                                  <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Creative Prompt */}
                    <Card className="bg-gray-900 border-green-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Zap className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-semibold text-white">Creative Prompt</h3>
                        </div>
                        <Textarea
                          placeholder="Describe your vision for this remix (e.g., 'Transform this into an explosive festival anthem with massive drops and euphoric breakdowns')"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="min-h-[100px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" />

                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Effects & Generation */}
                  <div className="space-y-6">
                    {/* Effects Selection */}
                    <Card className="bg-gray-900 border-green-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Volume2 className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-semibold text-white">Effects Chain</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {availableEffects.map((effect) =>
                          <button
                            key={effect}
                            onClick={() => toggleEffect(effect)}
                            className={`p-2 rounded text-sm transition-all ${
                            effects.includes(effect) ?
                            'bg-green-500/20 border border-green-500 text-green-400' :
                            'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'}`
                            }>

                              {effect}
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Style Settings */}
                    <Card className="bg-gray-900 border-green-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Settings className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-semibold text-white">Production Style</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Mixing Style</label>
                            <Select value={mixingStyle} onValueChange={(value: any) => setMixingStyle(value)}>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                {mixingStyles.map((style) =>
                                <SelectItem key={style.value} value={style.value} className="text-white">
                                    <div>
                                      <div>{style.label}</div>
                                      <div className="text-xs text-gray-400">{style.description}</div>
                                    </div>
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Arrangement Style</label>
                            <Select value={arrangeStyle} onValueChange={(value: any) => setArrangeStyle(value)}>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                {arrangementStyles.map((style) =>
                                <SelectItem key={style.value} value={style.value} className="text-white">
                                    {style.label}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Generation Controls */}
                    <Card className="bg-gray-900 border-green-500/20">
                      <CardContent className="p-6">
                        <Button
                          onClick={handleGenerate}
                          disabled={isLoading || !selectedFile || !genre}
                          className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-semibold text-lg py-6 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300">

                          {isLoading ?
                          <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Generating {variations[0]} Variations...
                            </> :

                          <>
                              <Shuffle className="w-5 h-5 mr-2" />
                              Generate {variations[0]} EDM Variations
                            </>
                          }
                        </Button>

                        {isLoading &&
                        <div className="mt-4">
                            <ProgressBar isLoading={isLoading} />
                            <p className="text-green-400 mt-2 text-center text-sm">
                              Creating multiple unique arrangements and effect chains...
                            </p>
                          </div>
                        }
                      </CardContent>
                    </Card>

                    {/* Current Analysis */}
                    {currentAnalysis &&
                    <AudioAnalysisDisplay
                      frequencyData={currentAnalysis.frequencyData}
                      metadata={currentAnalysis.metadata}
                      isAnalyzing={isLoading} />

                    }
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="presets">
                <EDMPresetManager
                  currentSettings={getCurrentSettings()}
                  onLoadPreset={handleLoadPreset}
                  onSavePreset={(preset) => {
                    toast.success(`Preset "${preset.name}" saved!`);
                  }} />

              </TabsContent>

              <TabsContent value="variations">
                <TrackVariationsManager
                  variations={generatedVariations}
                  isGenerating={isLoading}
                  onRegenerateVariation={handleRegenerateVariation}
                  onSaveVariation={handleSaveVariation}
                  onRateVariation={handleRateVariation}
                  onToggleFavorite={handleToggleFavorite} />

              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>);

};

export default EnhancedStudioPage;