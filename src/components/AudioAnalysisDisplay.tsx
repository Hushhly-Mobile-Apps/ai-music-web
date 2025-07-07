import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BarChart3, Zap, Music, TrendingUp } from 'lucide-react';

interface AudioAnalysisProps {
  frequencyData?: {
    bassEnergy: number;
    midEnergy: number;
    highEnergy: number;
    dynamicRange: number;
  };
  metadata?: {
    bpm?: number;
    key?: string;
    genre?: string;
    mood?: string;
    complexity?: string;
    aiModel?: string;
  };
  isAnalyzing?: boolean;
  className?: string;
}

const AudioAnalysisDisplay = ({ 
  frequencyData, 
  metadata, 
  isAnalyzing = false,
  className = '' 
}: AudioAnalysisProps) => {
  const [animatedData, setAnimatedData] = useState(frequencyData);

  useEffect(() => {
    if (frequencyData && !isAnalyzing) {
      // Animate to final values
      setAnimatedData(frequencyData);
    }
  }, [frequencyData, isAnalyzing]);

  const getEnergyColor = (energy: number) => {
    if (energy > 0.8) return 'from-red-500 to-orange-500';
    if (energy > 0.6) return 'from-orange-500 to-yellow-500';
    if (energy > 0.4) return 'from-yellow-500 to-green-500';
    return 'from-green-500 to-blue-500';
  };

  const getEnergyLabel = (energy: number) => {
    if (energy > 0.8) return 'Very High';
    if (energy > 0.6) return 'High';
    if (energy > 0.4) return 'Medium';
    return 'Low';
  };

  const formatPercentage = (value: number) => Math.round(value * 100);

  return (
    <Card className={`bg-gray-900 border-green-500/20 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Real-Time Audio Analysis</h3>
          {isAnalyzing && (
            <Badge variant="outline" className="border-green-500 text-green-400 animate-pulse">
              Analyzing...
            </Badge>
          )}
        </div>

        {/* Frequency Analysis */}
        {(animatedData || isAnalyzing) && (
          <div className="space-y-4 mb-6">
            <h4 className="text-md font-medium text-gray-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Frequency Spectrum Analysis
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Bass Energy */}
              <div className="text-center">
                <div className="mb-2">
                  <div className="text-xs text-gray-400 mb-1">Bass</div>
                  <div className="relative h-24 bg-gray-800 rounded-lg overflow-hidden">
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getEnergyColor(animatedData?.bassEnergy || 0)}`}
                      initial={{ height: 0 }}
                      animate={{ 
                        height: isAnalyzing 
                          ? `${Math.random() * 80 + 20}%` 
                          : `${formatPercentage(animatedData?.bassEnergy || 0)}%` 
                      }}
                      transition={{ duration: isAnalyzing ? 0.5 : 1.2, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 flex items-end justify-center pb-2">
                      <span className="text-xs font-bold text-white">
                        {isAnalyzing ? '...' : `${formatPercentage(animatedData?.bassEnergy || 0)}%`}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {isAnalyzing ? 'Processing...' : getEnergyLabel(animatedData?.bassEnergy || 0)}
                  </div>
                </div>
              </div>

              {/* Mid Energy */}
              <div className="text-center">
                <div className="mb-2">
                  <div className="text-xs text-gray-400 mb-1">Mids</div>
                  <div className="relative h-24 bg-gray-800 rounded-lg overflow-hidden">
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getEnergyColor(animatedData?.midEnergy || 0)}`}
                      initial={{ height: 0 }}
                      animate={{ 
                        height: isAnalyzing 
                          ? `${Math.random() * 80 + 20}%` 
                          : `${formatPercentage(animatedData?.midEnergy || 0)}%` 
                      }}
                      transition={{ duration: isAnalyzing ? 0.7 : 1.4, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 flex items-end justify-center pb-2">
                      <span className="text-xs font-bold text-white">
                        {isAnalyzing ? '...' : `${formatPercentage(animatedData?.midEnergy || 0)}%`}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {isAnalyzing ? 'Processing...' : getEnergyLabel(animatedData?.midEnergy || 0)}
                  </div>
                </div>
              </div>

              {/* High Energy */}
              <div className="text-center">
                <div className="mb-2">
                  <div className="text-xs text-gray-400 mb-1">Highs</div>
                  <div className="relative h-24 bg-gray-800 rounded-lg overflow-hidden">
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getEnergyColor(animatedData?.highEnergy || 0)}`}
                      initial={{ height: 0 }}
                      animate={{ 
                        height: isAnalyzing 
                          ? `${Math.random() * 80 + 20}%` 
                          : `${formatPercentage(animatedData?.highEnergy || 0)}%` 
                      }}
                      transition={{ duration: isAnalyzing ? 0.9 : 1.6, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 flex items-end justify-center pb-2">
                      <span className="text-xs font-bold text-white">
                        {isAnalyzing ? '...' : `${formatPercentage(animatedData?.highEnergy || 0)}%`}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {isAnalyzing ? 'Processing...' : getEnergyLabel(animatedData?.highEnergy || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Range */}
            {animatedData?.dynamicRange && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Dynamic Range
                  </span>
                  <span className="text-sm font-medium text-white">
                    {formatPercentage(animatedData.dynamicRange)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${formatPercentage(animatedData.dynamicRange)}%` }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metadata Display */}
        {metadata && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-300 flex items-center gap-2">
              <Music className="w-4 h-4" />
              Track Information
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {metadata.bpm && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">BPM:</span>
                    <span className="text-sm font-medium text-white">{metadata.bpm}</span>
                  </div>
                )}
                
                {metadata.key && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Key:</span>
                    <span className="text-sm font-medium text-white">{metadata.key}</span>
                  </div>
                )}
                
                {metadata.complexity && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Complexity:</span>
                    <Badge variant="outline" className="border-cyan-500 text-cyan-400 text-xs">
                      {metadata.complexity}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {metadata.genre && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Genre:</span>
                    <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                      {metadata.genre}
                    </Badge>
                  </div>
                )}
                
                {metadata.mood && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Mood:</span>
                    <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
                      {metadata.mood}
                    </Badge>
                  </div>
                )}
                
                {metadata.aiModel && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">AI Model:</span>
                    <span className="text-xs text-cyan-400 font-mono">{metadata.aiModel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Waveform Visualization */}
        {isAnalyzing && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-300 mb-3">Live Processing</h4>
            <div className="flex items-center justify-center h-16 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-1">
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-green-500 to-cyan-500 rounded-full"
                    animate={{
                      height: [10, Math.random() * 40 + 10, 10],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {!animatedData && !isAnalyzing && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm">Audio analysis will appear here</p>
            <p className="text-gray-500 text-xs mt-1">Real-time frequency and dynamics data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioAnalysisDisplay;
