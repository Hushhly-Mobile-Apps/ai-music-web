
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Waveform, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Heart, 
  RefreshCw,
  Sparkles,
  Music,
  Zap,
  Settings,
  Volume2
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProgressBar from '@/components/ProgressBar';
import RealAudioPlayer from '@/components/RealAudioPlayer';
import EDMVariationService, { GenerationOptions } from '@/services/EDMVariationService';
import { toast } from 'sonner';

interface GeneratedTrack {
  id: number;
  title: string;
  genre: string;
  duration: number;
  prompt: string;
  audioUrl: string;
  coverImage: string;
  bpm: number;
  key: string;
  energy: number;
  mood: string;
}

const TextToRemixPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedBPM, setSelectedBPM] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>([]);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());

  const genres = [
    'House', 'Techno', 'Dubstep', 'Trance', 'Progressive House',
    'Electro House', 'Future Bass', 'Trap', 'Drum & Bass', 'Ambient',
    'Hardstyle', 'Minimal Techno', 'Deep House', 'Tech House', 'Breakbeat'
  ];

  const moods = [
    'Energetic', 'Relaxed', 'Dark', 'Uplifting', 'Mysterious',
    'Romantic', 'Aggressive', 'Dreamy', 'Nostalgic', 'Euphoric'
  ];

  const bpmOptions = ['110', '120', '128', '130', '140', '150', '160', '170'];

  const quickPrompts = [
    "Uplifting summer anthem with tropical vibes",
    "Dark underground techno with heavy bass",
    "Emotional melodic dubstep with ethereal vocals",
    "High-energy festival banger with big drops",
    "Chill ambient house for relaxation",
    "Aggressive hardstyle with pounding kicks"
  ];

  useEffect(() => {
    // Initialize EDM service
    const initService = async () => {
      const edmService = EDMVariationService.getInstance();
      await edmService.initialize();
    };
    initService();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your track');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const edmService = EDMVariationService.getInstance();
      
      // Generate multiple variations
      const variations = [];
      for (let i = 0; i < 3; i++) {
        const options: GenerationOptions = {
          prompt: prompt,
          genre: selectedGenre || undefined,
          bpm: selectedBPM ? parseInt(selectedBPM) : undefined,
          energy_level: Math.floor(Math.random() * 10) + 1,
          mood: selectedMood || undefined,
          duration: 180
        };

        const result = await edmService.generateRemix(options);
        
        // Create audio URL from buffer
        const audioBlob = await audioBufferToBlob(result.audioBuffer);
        const audioUrl = URL.createObjectURL(audioBlob);

        const track: GeneratedTrack = {
          id: Date.now() + i,
          title: `${result.template.genre} ${result.metadata.mood} ${i + 1}`,
          genre: result.template.genre,
          duration: result.metadata.duration,
          prompt: prompt,
          audioUrl: audioUrl,
          coverImage: getRandomCoverImage(),
          bpm: result.template.bpm,
          key: result.template.key_signature,
          energy: result.template.energy_level,
          mood: result.template.mood
        };

        variations.push(track);
      }

      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setGeneratedTracks(variations);
        setIsGenerating(false);
        setProgress(0);
        toast.success(`Generated ${variations.length} unique EDM variations!`);
      }, 1000);

    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate track. Please try again.');
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const audioBufferToBlob = async (audioBuffer: AudioBuffer): Promise<Blob> => {
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
  };

  const getRandomCoverImage = (): string => {
    const images = [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1617953141905-b27fb1a88b56?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop"
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const handlePlayPause = (trackId: number) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  const handleLike = (trackId: number) => {
    const newLikedTracks = new Set(likedTracks);
    if (likedTracks.has(trackId)) {
      newLikedTracks.delete(trackId);
      toast.success('Removed from favorites');
    } else {
      newLikedTracks.add(trackId);
      toast.success('Added to favorites');
    }
    setLikedTracks(newLikedTracks);
  };

  const handleDownload = (track: GeneratedTrack) => {
    const link = document.createElement('a');
    link.href = track.audioUrl;
    link.download = `${track.title}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  const handleShare = (track: GeneratedTrack) => {
    navigator.clipboard.writeText(`Check out "${track.title}" - ${track.genre} track generated with AI!`);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Waveform className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Text-to-Audio Generation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Convert your text into AI-generated music with 1000+ unique EDM variations. 
            No two tracks will ever sound the same!
          </p>
        </motion.div>

        {/* Generation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Describe Your Track
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Prompt */}
              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  Track Description
                </label>
                <Textarea
                  placeholder="Describe the music you want to create... (e.g., 'High-energy festival EDM with uplifting melodies and massive drops')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 min-h-[100px] resize-none focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>

              {/* Quick Prompts */}
              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  Quick Prompts
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((quickPrompt, index) => (
                    <Button
                      key={index}
                      onClick={() => setPrompt(quickPrompt)}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-gray-300 hover:bg-slate-700 text-xs"
                    >
                      {quickPrompt}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Genre (Optional)
                  </label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Auto-detect" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre} className="text-white hover:bg-slate-700">
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Mood (Optional)
                  </label>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Auto-detect" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {moods.map((mood) => (
                        <SelectItem key={mood} value={mood} className="text-white hover:bg-slate-700">
                          {mood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    BPM (Optional)
                  </label>
                  <Select value={selectedBPM} onValueChange={setSelectedBPM}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Auto-detect" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {bpmOptions.map((bpm) => (
                        <SelectItem key={bpm} value={bpm} className="text-white hover:bg-slate-700">
                          {bpm} BPM
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating 3 Unique Variations...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate Audio Variations
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Bar */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <ProgressBar
              progress={progress}
              label="Generating unique EDM variations..."
              showWaveform={true}
            />
          </motion.div>
        )}

        {/* Generated Tracks */}
        {generatedTracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Generated Variations
              </h2>
              <p className="text-gray-400">
                Three unique EDM tracks generated from your prompt
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300 group">
                    {/* Cover Image */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-600/20">
                      <img
                        src={track.coverImage}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40"></div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="icon"
                          onClick={() => handlePlayPause(track.id)}
                          className={`w-16 h-16 rounded-full ${
                            playingTrack === track.id
                              ? 'bg-purple-500 hover:bg-purple-600'
                              : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                          } transition-all duration-300 group-hover:scale-110`}
                        >
                          {playingTrack === track.id ? 
                            <Pause className="w-8 h-8" /> : 
                            <Play className="w-8 h-8" />
                          }
                        </Button>
                      </div>

                      {/* Track Info Overlay */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-purple-500/80 text-white">
                          Variation {index + 1}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      {/* Track Details */}
                      <div className="mb-4">
                        <h3 className="text-white font-bold text-lg mb-1">{track.title}</h3>
                        <p className="text-gray-400 text-sm">{track.genre}</p>
                      </div>

                      {/* Track Specs */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Music className="w-3 h-3 text-cyan-400" />
                          <span className="text-gray-400">{track.bpm} BPM</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Settings className="w-3 h-3 text-cyan-400" />
                          <span className="text-gray-400">Key: {track.key}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span className="text-gray-400">Energy: {track.energy}/10</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-cyan-400" />
                          <span className="text-gray-400">{track.mood}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleLike(track.id)}
                            className={`w-8 h-8 ${
                              likedTracks.has(track.id) 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${likedTracks.has(track.id) ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleShare(track)}
                            className="w-8 h-8 text-gray-400 hover:text-white"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          onClick={() => handleDownload(track)}
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Generate More Button */}
            <div className="text-center mt-8">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate 3 More Variations
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TextToRemixPage;
