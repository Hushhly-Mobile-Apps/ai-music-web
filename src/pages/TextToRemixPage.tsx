import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Music, Play, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProgressBar from '@/components/ProgressBar';
import AudioPlayer from '@/components/AudioPlayer';
import { toast } from 'sonner';

const TextToRemixPage = () => {
  const [prompt, setPrompt] = useState('');
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<string | null>(null);

  const moods = [
    { value: 'uplifting', label: 'Uplifting', color: 'bg-yellow-500' },
    { value: 'dark', label: 'Dark', color: 'bg-purple-500' },
    { value: 'chill', label: 'Chill', color: 'bg-blue-500' },
    { value: 'energetic', label: 'Energetic', color: 'bg-red-500' },
    { value: 'ethereal', label: 'Ethereal', color: 'bg-cyan-500' },
    { value: 'aggressive', label: 'Aggressive', color: 'bg-orange-500' }
  ];

  const examplePrompts = [
    "Spacey trance with hard drop and cosmic vibes",
    "Future bass with anime-inspired melodies",
    "Dark techno with industrial sounds",
    "Tropical house with summer festival energy",
    "Hardstyle with epic orchestral elements",
    "Progressive house with emotional breakdown"
  ];

  const handlePromptClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
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
    toast.success('Creating your AI EDM track...');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setGeneratedTrack('demo-track.mp3');
      toast.success('Your AI EDM track is ready!');
    }, 4000);
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
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Text-to-Remix Studio
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Describe your vision and watch our AI create an original EDM track from scratch
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
                      className="min-h-[120px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    />
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Try these examples:</p>
                      <div className="flex flex-wrap gap-2">
                        {examplePrompts.map((example, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer border-green-500/50 text-green-400 hover:bg-green-500/20 transition-colors"
                            onClick={() => handlePromptClick(example)}
                          >
                            {example}
                          </Badge>
                        ))}
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
                        {moods.map((m) => (
                          <SelectItem key={m.value} value={m.value} className="text-white">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${m.color}`} />
                              <span>{m.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim() || !mood}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-semibold text-lg py-6 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Creating AI Track...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Create AI EDM Track
                    </>
                  )}
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
                    
                    {isLoading && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <ProgressBar isLoading={isLoading} />
                      </div>
                    )}

                    {generatedTrack && !isLoading && (
                      <div className="space-y-4">
                        <AudioPlayer
                          audioUrl={generatedTrack}
                          title="AI Generated EDM Track"
                        />
                        <div className="text-center">
                          <p className="text-green-400 font-semibold">🎵 AI Track Created Successfully!</p>
                          <p className="text-gray-400 text-sm">Your original EDM track is ready to download</p>
                        </div>
                      </div>
                    )}

                    {!isLoading && !generatedTrack && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Music className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400">Your AI-generated track will appear here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Advanced Options */}
                <Card className="bg-gradient-to-br from-green-900/20 to-cyan-900/20 border-green-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">✨ AI Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Be specific about instruments and sounds</li>
                      <li>• Mention tempo, energy levels, and drops</li>
                      <li>• Reference artists or festivals for style</li>
                      <li>• Include emotions and atmosphere you want</li>
                      <li>• Try combining multiple genres</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TextToRemixPage;