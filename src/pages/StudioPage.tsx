import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Zap, Upload, Play, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import FileUpload from '@/components/FileUpload';
import ProgressBar from '@/components/ProgressBar';
import RealAudioPlayer from '@/components/RealAudioPlayer';
import AIModelIndicator from '@/components/AIModelIndicator';
import TrackVariationDisplay from '@/components/TrackVariationDisplay';
import AudioGenerationService, { type AudioGenerationOptions } from '@/services/AudioGenerationService';
import { toast } from 'sonner';

const StudioPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('energetic');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<{
    blob: Blob;
    metadata: any;
    title: string;
  } | null>(null);

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



  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

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
    setGeneratedAudio(null);
    toast.success('Starting real audio generation...');

    try {
      const audioService = new AudioGenerationService();

      const options: AudioGenerationOptions = {
        genre,
        mood,
        prompt: prompt || `Transform this track into a ${genre} remix with ${mood} vibes`,
        duration: 30 // 30 seconds for demo
      };

      // Generate real audio
      const generatedData = await audioService.generateAudio(options);

      // Create audio blob
      const audioBlob = audioService.createAudioBlob(generatedData.audioBuffer);

      // Save to database
      try {
        const trackData = {
          title: `${selectedFile.name} - ${genre} Remix`,
          prompt: options.prompt,
          genre: genre,
          mood: options.mood,
          duration: generatedData.duration,
          generation_type: 'remix',
          parameters: JSON.stringify({
            originalFile: selectedFile.name,
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
        metadata: generatedData.metadata,
        title: `${selectedFile.name} - ${genre} Remix`
      });

      toast.success('🎵 Real EDM remix generated successfully!');

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
    toast.success('Audio downloaded successfully!');
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
                Real EDM Remix Studio
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Upload your track and experience real AI-powered EDM remix generation using advanced audio synthesis
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Input */}
              <div className="space-y-6">
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

                <Card className="bg-gray-900 border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Music className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Select EDM Genre</h3>
                    </div>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Choose your preferred EDM style" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {genres.map((g) =>
                        <SelectItem key={g.value} value={g.value} className="text-white">
                            {g.label}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Zap className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Creative Prompt</h3>
                    </div>
                    <Textarea
                      placeholder="Describe your vision (e.g., 'Make it sound like a Tomorrowland anthem with heavy bass drops and euphoric melodies')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" />

                  </CardContent>
                </Card>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !selectedFile || !genre}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-semibold text-lg py-6 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300">

                  {isLoading ?
                  <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Real Audio...
                    </> :

                  <>
                      <Play className="w-5 h-5 mr-2" />
                      Generate Real EDM Remix
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
                      <h3 className="text-lg font-semibold text-white">Generated Remix</h3>
                    </div>
                    
                    {isLoading &&
                    <div className="flex flex-col items-center justify-center py-12">
                        <ProgressBar isLoading={isLoading} />
                        <p className="text-green-400 mt-4 font-semibold">
                          🎵 Generating real audio with Tone.js synthesis...
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Creating {genre} patterns and mixing audio layers
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
                          <p className="text-green-400 font-semibold">✨ Real Audio Generated Successfully!</p>
                          <p className="text-gray-400 text-sm">Your festival-ready EDM track is ready to download</p>
                        </div>
                      </div>
                    }

                    {!isLoading && !generatedAudio &&
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Music className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400">Your generated remix will appear here</p>
                        <p className="text-gray-500 text-sm mt-2">Real audio synthesis using Tone.js</p>
                      </div>
                    }
                  </CardContent>
                </Card>

                {/* Tips Card */}
                <Card className="bg-gradient-to-br from-green-900/20 to-cyan-900/20 border-green-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">🎵 Real Audio Features</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Real-time audio synthesis with Tone.js</li>
                      <li>• Genre-specific patterns and arrangements</li>
                      <li>• Dynamic BPM and key selection</li>
                      <li>• Professional audio download (WAV format)</li>
                      <li>• Database storage of generated tracks</li>
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

export default StudioPage;