import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Music, Zap, Palette, Waves } from 'lucide-react';

interface TrackVariationDisplayProps {
  metadata: {
    bpm: number;
    key: string;
    genre: string;
    mood: string;
    aiModel: string;
    uniqueId: string;
  };
  isGenerating?: boolean;
}

const TrackVariationDisplay: React.FC<TrackVariationDisplayProps> = ({ 
  metadata, 
  isGenerating 
}) => {
  const getVariationElements = () => {
    const elements = [];
    
    // Genre-specific elements
    const genreElements = {
      'progressive-house': ['Supersaw Lead', 'Progressive Pluck', 'Filtering Bass', 'Ethereal Pad'],
      'future-bass': ['Wobble Bass', 'Pitched Vocal', 'Trap Snare', 'Harmonic Pluck'],
      'techno': ['Acid Bass', 'Industrial Kick', 'Metallic Perc', 'Trance Gate'],
      'trance': ['Uplifting Arp', 'Emotional Pad', 'Psytrance Lead', 'Epic Breakdown'],
      'dubstep': ['Growl Bass', 'Filthy Drop', 'Screechy Lead', 'Glitch Perc'],
      'hardstyle': ['Reverse Bass', 'Euphoric Lead', 'Hardcore Kick', 'Pitched Vocal']
    };

    // Mood-specific elements
    const moodElements = {
      'uplifting': ['Major 7th Chords', 'Ascending Melody', 'Warm Reverb'],
      'dark': ['Minor Key', 'Distorted Bass', 'Haunting Pad'],
      'chill': ['Jazzy Chords', 'Smooth Filtering', 'Ambient Texture'],
      'energetic': ['Fast Arpeggios', 'Pumping Side Chain', 'Bright Harmonics'],
      'ethereal': ['Lush Reverb', 'Floating Melody', 'Crystalline Texture'],
      'aggressive': ['Heavy Distortion', 'Punchy Compression', 'Sharp Attacks']
    };

    elements.push(...(genreElements[metadata.genre] || []));
    elements.push(...(moodElements[metadata.mood] || []));
    
    return elements.slice(0, 6); // Show max 6 elements
  };

  const elements = getVariationElements();

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#00ff8f]" />
          Track Composition
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core Metadata */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-[#00ffe1]" />
            <span className="text-xs text-gray-400">BPM</span>
            <Badge variant="outline" className="text-[#00ff8f] border-[#00ff8f]/30">
              {metadata.bpm}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-3 h-3 text-[#00ffe1]" />
            <span className="text-xs text-gray-400">Key</span>
            <Badge variant="outline" className="text-[#00ff8f] border-[#00ff8f]/30">
              {metadata.key}
            </Badge>
          </div>
        </div>

        {/* Unique ID */}
        <div className="flex items-center gap-2">
          <Waves className="w-3 h-3 text-[#00ffe1]" />
          <span className="text-xs text-gray-400">Track ID</span>
          <code className="text-xs bg-gray-800 px-2 py-1 rounded text-[#00ff8f] font-mono">
            {metadata.uniqueId}
          </code>
        </div>

        {/* Generated Elements */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-400">Generated Elements</h4>
          <div className="flex flex-wrap gap-1">
            {elements.map((element, index) => (
              <motion.div
                key={element}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gradient-to-r from-[#00ff8f]/10 to-[#00ffe1]/10 border-[#00ff8f]/20 text-[#00ff8f]/90"
                >
                  {element}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Neural Processing Status */}
        {isGenerating && (
          <motion.div
            className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-[#00ff8f]/10 to-[#00ffe1]/10 border border-[#00ff8f]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-2 h-2 bg-[#00ff8f] rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity
              }}
            />
            <span className="text-xs text-[#00ff8f]/90">
              Neural synthesis in progress...
            </span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackVariationDisplay;