import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Zap, Upload, Play } from 'lucide-react';
import Navigation from '@/components/Navigation';
import FileUpload from '@/components/FileUpload';
import ProgressBar from '@/components/ProgressBar';
import AudioPlayer from '@/components/AudioPlayer';
import { toast } from 'sonner';

const StudioPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<string | null>(null);

  const genres = [
  { value: 'progressive-house', label: 'Progressive House' },
  { value: 'future-bass', label: 'Future Bass' },
  { value: 'big-room', label: 'Big Room' },
  { value: 'techno', label: 'Techno' },
  { value: 'trance', label: 'Trance' },
  { value: 'dubstep', label: 'Dubstep' },
  { value: 'trap', label: 'Trap' },
  { value: 'hardstyle', label: 'Hardstyle' }];


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
    toast.success('Starting remix generation...');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Set as demo mode - the AudioPlayer will handle the demo state
      setGeneratedTrack('demo-mode');
      toast.success('Your EDM remix is ready!');
    }, 3000);
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
                EDM Remix Studio
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Upload your track and let our AI transform it into a festival-ready EDM remix
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
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Generating Remix...
                    </> :

                  <>
                      <Play className="w-5 h-5 mr-2" />
                      Generate EDM Remix
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
                      </div>
                    }

                    {generatedTrack && !isLoading &&
                    <div className="space-y-4">
                        <AudioPlayer
                        audioUrl={generatedTrack}
                        title="Your EDM Remix" />

                        <div className="text-center">
                          <p className="text-green-400 font-semibold">✨ Remix Generated Successfully!</p>
                          <p className="text-gray-400 text-sm">Your festival-ready EDM track is ready to download</p>
                        </div>
                      </div>
                    }

                    {!isLoading && !generatedTrack &&
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Music className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400">Your generated remix will appear here</p>
                      </div>
                    }
                  </CardContent>
                </Card>

                {/* Tips Card */}
                <Card className="bg-gradient-to-br from-green-900/20 to-cyan-900/20 border-green-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Pro Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Use clear, descriptive prompts for better results</li>
                      <li>• Upload high-quality audio files (320kbps+)</li>
                      <li>• Try different genres to find your perfect style</li>
                      <li>• Experiment with energy levels and moods</li>
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