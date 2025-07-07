import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Music, Play, Sparkles, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProgressBar from '@/components/ProgressBar';
import RealAudioPlayer from '@/components/RealAudioPlayer';
import AIModelIndicator from '@/components/AIModelIndicator';
import TrackVariationDisplay from '@/components/TrackVariationDisplay';
import AudioGenerationService, { type AudioGenerationOptions } from '@/services/AudioGenerationService';
import { toast } from 'sonner';

const TextToRemixPage = () => {
  const [prompt, setPrompt] = useState('');
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<{
    blob: Blob;
    metadata: any;
    title: string;
  } | null>(null);

  const moods = [
  { value: 'uplifting', label: 'Uplifting', color: 'bg-yellow-500' },
  { value: 'dark', label: 'Dark', color: 'bg-purple-500' },
  { value: 'chill', label: 'Chill', color: 'bg-blue-500' },
  { value: 'energetic', label: 'Energetic', color: 'bg-red-500' },
  { value: 'ethereal', label: 'Ethereal', color: 'bg-cyan-500' },
  { value: 'aggressive', label: 'Aggressive', color: 'bg-orange-500' }];


  const examplePrompts = [
    "Spacey trance with hard drop and cosmic vibes",
    "Future bass with anime-inspired melodies and vocal chops",
    "Dark techno with industrial sounds and acid basslines",
    "Tropical house with summer festival energy and steel drums",
    "Hardstyle with epic orchestral elements and reverse bass",
    "Progressive house with emotional breakdown and uplifting plucks",
    "Dubstep with filthy growls and screechy lead synths",
    "Big room house with festival anthem drops and crowd chants",
    "Psytrance with twisted arpeggios and psychedelic effects",
    "Electro house with funky basslines and retro synths"
  ];


  const handlePromptClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  const detectGenreFromPrompt = (prompt: string): string => {
    const genreKeywords = {
      'trance': ['trance', 'uplifting', 'ethereal', 'cosmic', 'psychedelic', 'psytrance'],
      'future-bass': ['future bass', 'anime', 'melodic', 'emotional', 'vocal chop', 'chops'],
      'techno': ['techno', 'industrial', 'minimal', 'underground', 'acid'],
      'progressive-house': ['progressive', 'house', 'breakdown', 'build', 'pluck'],
      'hardstyle': ['hardstyle', 'hardcore', 'orchestral', 'epic', 'reverse bass'],
      'dubstep': ['dubstep', 'bass', 'drop', 'wobble', 'growl', 'filthy', 'screechy'],
      'trap': ['trap', 'hip hop', 'urban'],
      'big-room': ['festival', 'big room', 'anthem', 'crowd', 'chant'],
      'electro': ['electro', 'funky', 'retro'],
      'deep-house': ['deep', 'soulful', 'groove']
    };

    const lowerPrompt = prompt.toLowerCase();

    for (const [genre, keywords] of Object.entries(genreKeywords)) {
      if (keywords.some((keyword) => lowerPrompt.includes(keyword))) {
        return genre;
      }
    }

    return 'progressive-house'; // Default genre
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a creative prompt');
      return;
    }

    if (!mood) {
      toast.error('Please select a mood');
      return;
    }

    setIsLoading(true);
    setGeneratedAudio(null);
    toast.success('Creating your AI EDM track with real synthesis...');

    try {
      const audioService = new AudioGenerationService();

      // Auto-detect genre from prompt
      const detectedGenre = detectGenreFromPrompt(prompt);

      const options: AudioGenerationOptions = {
        genre: detectedGenre,
        mood,
        prompt,
        duration: 45 // Longer duration for text-to-audio
      };

      // Generate real audio
      const generatedData = await audioService.generateAudio(options);

      // Create audio blob
      const audioBlob = audioService.createAudioBlob(generatedData.audioBuffer);

      // Save to database
      try {
        const trackData = {
          title: `AI Generated - ${detectedGenre} (${mood})`,
          prompt: prompt,
          genre: detectedGenre,
          mood: mood,
          duration: generatedData.duration,
          generation_type: 'text-to-audio',
          parameters: JSON.stringify({
            detectedGenre,
            ...generatedData.metadata
          }),
          status: 'completed'
        };

        const { error } = await window.ezsite.apis.tableCreate(25665, trackData);
        if (error) {
          console.error('Database save error:', error);
          toast.error('Generated audio but failed to save to database');
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }

      setGeneratedAudio({
        blob: audioBlob,
        metadata: {
          ...generatedData.metadata,
          detectedGenre
        },
        title: `AI Generated - ${detectedGenre} (${mood})`
      });

      toast.success(`🎵 Real ${detectedGenre} track generated successfully!`);

      // Cleanup
      audioService.dispose();

    } catch (error) {
      console.error('Audio generation error:', error);
      toast.error('Failed to generate audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    toast.success('AI-generated track downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Real Text-to-Remix Studio
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Describe your vision and watch our AI create real, playable EDM tracks from scratch using advanced synthesis
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Input */}
              <div className="space-y-6">
                <Card className="bg-gray-900 border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Zap className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Creative Prompt</h3>
                    </div>
                    <Textarea
                      placeholder="Describe your dream EDM track in detail..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" />

                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Try these examples:</p>
                      <div className="flex flex-wrap gap-2">
                        {examplePrompts.map((example, index) =>
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer border-green-500/50 text-green-400 hover:bg-green-500/20 transition-colors"
                          onClick={() => handlePromptClick(example)}>

                            {example}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Sparkles className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Mood & Energy</h3>
                    </div>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select the mood for your track" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {moods.map((m) =>
                        <SelectItem key={m.value} value={m.value} className="text-white">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${m.color}`} />
                              <span>{m.label}</span>
                            </div>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim() || !mood}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-semibold text-lg py-6 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300">

                  {isLoading ?
                  <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Real AI Track...
                    </> :

                  <>
                      <Play className="w-5 h-5 mr-2" />
                      Create Real AI EDM Track
                    </>
                  }
                </Button>
              </div>

              {/* Right Column - Output */}
              <div className="space-y-6">
                <Card className="bg-gray-900 border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Music className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Generated Track</h3>
                    </div>
                    
                    {isLoading &&
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <ProgressBar isLoading={isLoading} />
                        <AIModelIndicator model="AIVA Neural Engine v3.2" isGenerating={true} />
                        <p className="text-green-400 mt-4 font-semibold">
                          🎵 Analyzing prompt and generating real audio...
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Auto-detecting genre and creating synthesis patterns
                        </p>
                      </div>
                    }

                    {generatedAudio && !isLoading &&
                    <div className="space-y-4">
                        <RealAudioPlayer
                        audioBlob={generatedAudio.blob}
                        title={generatedAudio.title}
                        metadata={generatedAudio.metadata}
                        onDownload={handleDownload} />

                        <div className="text-center">
                          <p className="text-green-400 font-semibold">🎵 Real AI Track Created Successfully!</p>
                          <p className="text-gray-400 text-sm">Your original EDM track is ready to download</p>
                          {generatedAudio.metadata.detectedGenre &&
                        <p className="text-cyan-400 text-sm mt-1">
                              Auto-detected genre: {generatedAudio.metadata.detectedGenre}
                            </p>
                        }
                        </div>
                      </div>
                    }

                    {!isLoading && !generatedAudio &&
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Music className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400">Your AI-generated track will appear here</p>
                        <p className="text-gray-500 text-sm mt-2">Real synthesis with genre auto-detection</p>
                      </div>
                    }
                  </CardContent>
                </Card>

                {/* Advanced Options */}
                <Card className="bg-gradient-to-br from-green-900/20 to-cyan-900/20 border-green-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">✨ AI Features</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Automatic genre detection from prompts</li>
                      <li>• Real-time audio synthesis with Tone.js</li>
                      <li>• Mood-based musical key selection</li>
                      <li>• Dynamic pattern generation</li>
                      <li>• Professional audio export (WAV)</li>
                      <li>• Database tracking of all generations</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

};

export default TextToRemixPage;