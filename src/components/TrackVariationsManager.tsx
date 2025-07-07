import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Download,
  Shuffle,
  Copy,
  Heart,
  BarChart3,
  Music,
  Zap,
  TrendingUp,
  Star } from
'lucide-react';
import RealAudioPlayer from '@/components/RealAudioPlayer';
import AudioAnalysisDisplay from '@/components/AudioAnalysisDisplay';
import { toast } from 'sonner';

interface TrackVariation {
  id: string;
  audioBlob: Blob;
  metadata: {
    bpm: number;
    key: string;
    genre: string;
    mood: string;
    aiModel: string;
    uniqueId: string;
    complexity: string;
    arrangement: string[];
    effectsChain: string[];
    frequencyAnalysis: {
      bassEnergy: number;
      midEnergy: number;
      highEnergy: number;
      dynamicRange: number;
    };
  };
  variationNumber: number;
  title: string;
  rating?: number;
  isFavorite?: boolean;
}

interface TrackVariationsManagerProps {
  variations: TrackVariation[];
  isGenerating?: boolean;
  onRegenerateVariation?: (variationNumber: number) => void;
  onSaveVariation?: (variation: TrackVariation) => void;
  onRateVariation?: (variationId: string, rating: number) => void;
  onToggleFavorite?: (variationId: string) => void;
  className?: string;
}

const TrackVariationsManager = ({
  variations = [],
  isGenerating = false,
  onRegenerateVariation,
  onSaveVariation,
  onRateVariation,
  onToggleFavorite,
  className = ''
}: TrackVariationsManagerProps) => {
  const [selectedVariation, setSelectedVariation] = useState<TrackVariation | null>(null);
  const [playingVariation, setPlayingVariation] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'number' | 'rating' | 'complexity'>('number');

  useEffect(() => {
    if (variations.length > 0 && !selectedVariation) {
      setSelectedVariation(variations[0]);
    }
  }, [variations, selectedVariation]);

  const handleVariationSelect = (variation: TrackVariation) => {
    setSelectedVariation(variation);
    setPlayingVariation(null);
  };

  const handlePlayVariation = (variationId: string) => {
    if (playingVariation === variationId) {
      setPlayingVariation(null);
    } else {
      setPlayingVariation(variationId);
    }
  };

  const handleDownloadVariation = (variation: TrackVariation) => {
    try {
      const url = URL.createObjectURL(variation.audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${variation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${variation.variationNumber}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Variation ${variation.variationNumber} downloaded!`);
      onSaveVariation?.(variation);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download variation');
    }
  };

  const handleRating = (variation: TrackVariation, rating: number) => {
    onRateVariation?.(variation.id, rating);
    toast.success(`Rated variation ${variation.variationNumber}: ${rating} stars`);
  };

  const handleToggleFavorite = (variation: TrackVariation) => {
    onToggleFavorite?.(variation.id);
    toast.success(
      variation.isFavorite ?
      `Removed variation ${variation.variationNumber} from favorites` :
      `Added variation ${variation.variationNumber} to favorites`
    );
  };

  const sortedVariations = [...variations].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'complexity':
        const complexityOrder = { simple: 1, medium: 2, complex: 3, experimental: 4 };
        return complexityOrder[b.metadata.complexity as keyof typeof complexityOrder] -
        complexityOrder[a.metadata.complexity as keyof typeof complexityOrder];
      default:
        return a.variationNumber - b.variationNumber;
    }
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':return 'border-blue-500 text-blue-400';
      case 'medium':return 'border-green-500 text-green-400';
      case 'complex':return 'border-orange-500 text-orange-400';
      case 'experimental':return 'border-red-500 text-red-400';
      default:return 'border-gray-500 text-gray-400';
    }
  };

  const getEnergyColor = (energy: number) => {
    if (energy > 0.8) return 'text-red-400';
    if (energy > 0.6) return 'text-orange-400';
    if (energy > 0.4) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className={`bg-gray-900 border-green-500/20 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Shuffle className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Track Variations</h3>
            <Badge variant="outline" className="border-green-500 text-green-400">
              {variations.length} Generated
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-1">

              <option value="number">Sort by Number</option>
              <option value="rating">Sort by Rating</option>
              <option value="complexity">Sort by Complexity</option>
            </select>
          </div>
        </div>

        {isGenerating &&
        <div className="text-center py-8 mb-6">
            <motion.div
            className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>

              <Zap className="w-8 h-8 text-green-400" />
            </motion.div>
            <p className="text-green-400 font-semibold">Generating Multiple Variations...</p>
            <p className="text-gray-400 text-sm mt-1">Creating unique EDM tracks with different arrangements</p>
          </div>
        }

        {variations.length === 0 && !isGenerating &&
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400">No variations generated yet</p>
            <p className="text-gray-500 text-sm mt-2">Generate multiple variations to compare different arrangements</p>
          </div>
        }

        {variations.length > 0 &&
        <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="grid" className="data-[state=active]:bg-green-500/20">
                Grid View
              </TabsTrigger>
              <TabsTrigger value="detailed" className="data-[state=active]:bg-green-500/20">
                Detailed View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {sortedVariations.map((variation, index) =>
                <motion.div
                  key={variation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gray-800 rounded-lg p-4 border-2 transition-all cursor-pointer hover:border-green-500/50 ${
                  selectedVariation?.id === variation.id ?
                  'border-green-500' :
                  'border-gray-700'}`
                  }
                  onClick={() => handleVariationSelect(variation)}>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">
                            V{variation.variationNumber}
                          </span>
                          <Badge
                        variant="outline"
                        className={getComplexityColor(variation.metadata.complexity)}>

                            {variation.metadata.complexity}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(variation);
                        }}
                        className={`h-8 w-8 p-0 ${variation.isFavorite ? 'text-red-400' : 'text-gray-400'}`}>

                            <Heart
                          className={`w-4 h-4 ${variation.isFavorite ? 'fill-current' : ''}`} />

                          </Button>
                        </div>
                      </div>

                      {/* Mini frequency analysis */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Bass</div>
                          <div className={`text-sm font-medium ${getEnergyColor(variation.metadata.frequencyAnalysis.bassEnergy)}`}>
                            {Math.round(variation.metadata.frequencyAnalysis.bassEnergy * 100)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Mid</div>
                          <div className={`text-sm font-medium ${getEnergyColor(variation.metadata.frequencyAnalysis.midEnergy)}`}>
                            {Math.round(variation.metadata.frequencyAnalysis.midEnergy * 100)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400">High</div>
                          <div className={`text-sm font-medium ${getEnergyColor(variation.metadata.frequencyAnalysis.highEnergy)}`}>
                            {Math.round(variation.metadata.frequencyAnalysis.highEnergy * 100)}%
                          </div>
                        </div>
                      </div>

                      {/* Track info */}
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">BPM:</span>
                          <span className="text-white">{variation.metadata.bpm}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Key:</span>
                          <span className="text-white">{variation.metadata.key}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayVariation(variation.id);
                        }}
                        className="border-green-500 text-green-400 hover:bg-green-500/20">

                            {playingVariation === variation.id ?
                        <Pause className="w-3 h-3" /> :

                        <Play className="w-3 h-3" />
                        }
                          </Button>
                          
                          <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadVariation(variation);
                        }}
                        className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20">

                            <Download className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Rating stars */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) =>
                      <button
                        key={star}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRating(variation, star);
                        }}
                        className={`w-3 h-3 ${
                        star <= (variation.rating || 0) ?
                        'text-yellow-400' :
                        'text-gray-600'}`
                        }>

                              <Star
                          className={`w-3 h-3 ${
                          star <= (variation.rating || 0) ? 'fill-current' : ''}`
                          } />

                            </button>
                      )}
                        </div>
                      </div>
                    </motion.div>
                )}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="mt-6">
              {selectedVariation &&
            <div className="grid lg:grid-cols-2 gap-6">
                  {/* Audio Player */}
                  <div>
                    <RealAudioPlayer
                  audioBlob={selectedVariation.audioBlob}
                  title={`${selectedVariation.title} - Variation ${selectedVariation.variationNumber}`}
                  metadata={selectedVariation.metadata}
                  onDownload={() => handleDownloadVariation(selectedVariation)} />

                    
                    {/* Variation Controls */}
                    <Card className="bg-gray-800 border-gray-700 mt-4">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium text-white">Variation Controls</h4>
                          <div className="flex items-center gap-2">
                            <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleFavorite(selectedVariation)}
                          className={`border-red-500 ${
                          selectedVariation.isFavorite ?
                          'bg-red-500/20 text-red-400' :
                          'text-red-400 hover:bg-red-500/20'}`
                          }>

                              <Heart
                            className={`w-4 h-4 mr-1 ${selectedVariation.isFavorite ? 'fill-current' : ''}`} />

                              {selectedVariation.isFavorite ? 'Favorited' : 'Favorite'}
                            </Button>
                            
                            {onRegenerateVariation &&
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRegenerateVariation(selectedVariation.variationNumber)}
                          className="border-blue-500 text-blue-400 hover:bg-blue-500/20">

                                <Shuffle className="w-4 h-4 mr-1" />
                                Regenerate
                              </Button>
                        }
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Rate this variation:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) =>
                        <button
                          key={star}
                          onClick={() => handleRating(selectedVariation, star)}
                          className={`w-5 h-5 transition-colors ${
                          star <= (selectedVariation.rating || 0) ?
                          'text-yellow-400' :
                          'text-gray-600 hover:text-yellow-300'}`
                          }>

                                <Star
                            className={`w-5 h-5 ${
                            star <= (selectedVariation.rating || 0) ? 'fill-current' : ''}`
                            } />

                              </button>
                        )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Audio Analysis */}
                  <div>
                    <AudioAnalysisDisplay
                  frequencyData={selectedVariation.metadata.frequencyAnalysis}
                  metadata={selectedVariation.metadata} />

                    
                    {/* Arrangement & Effects */}
                    <Card className="bg-gray-800 border-gray-700 mt-4">
                      <CardContent className="p-4">
                        <h4 className="text-md font-medium text-white mb-3">Composition Details</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Arrangement:</div>
                            <div className="flex flex-wrap gap-1">
                              {selectedVariation.metadata.arrangement.map((section, index) =>
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-purple-500 text-purple-400 text-xs">

                                  {section}
                                </Badge>
                          )}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Effects Chain:</div>
                            <div className="flex flex-wrap gap-1">
                              {selectedVariation.metadata.effectsChain.map((effect, index) =>
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-cyan-500 text-cyan-400 text-xs">

                                  {effect}
                                </Badge>
                          )}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400 mb-1">AI Model:</div>
                            <div className="text-xs text-green-400 font-mono">
                              {selectedVariation.metadata.aiModel}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
            }
            </TabsContent>
          </Tabs>
        }
      </CardContent>
    </Card>);

};

export default TrackVariationsManager;