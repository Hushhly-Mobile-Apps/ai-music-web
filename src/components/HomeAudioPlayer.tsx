import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, Download, Heart, Share2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import EnhancedAudioGenerationService from '@/services/EnhancedAudioGenerationService';
import * as Tone from 'tone';

interface RemixCard {
  id: number;
  remix_title: string;
  genre: string;
  user_id: number;
  cover_image_id: number | null;
  likes_count: number;
  plays_count: number;
  created_at: string;
  audio_file_id: number;
  prompt_text: string;
  duration: number;
}

interface HomeAudioPlayerProps {
  remix: RemixCard;
  isPlaying: boolean;
  onPlayPause: (id: number) => void;
  onLike: (id: number) => void;
  onShare: (remix: RemixCard) => void;
  isLiked: boolean;
}

const HomeAudioPlayer: React.FC<HomeAudioPlayerProps> = ({
  remix,
  isPlaying,
  onPlayPause,
  onLike,
  onShare,
  isLiked
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioService = useRef<EnhancedAudioGenerationService>(new EnhancedAudioGenerationService());

  useEffect(() => {
    // Cleanup audio URL when component unmounts or audio changes
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const setAudioData = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      }
    };

    const setAudioTime = () => {
      if (audio.currentTime && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      onPlayPause(remix.id);
      setCurrentTime(0);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, remix.id, onPlayPause]);

  const generateAudio = async () => {
    setIsGenerating(true);
    try {
      await Tone.start();
      
      // Map genre to more specific options
      const genreMapping: { [key: string]: string } = {
        'Pop': 'progressive-house',
        'EDM Remix': 'future-bass',
        'Hip-Hop': 'trap',
        'Synthwave': 'trance',
        'Electronic Rock': 'dubstep',
        'Chill Lo-Fi': 'deep-house'
      };

      const mappedGenre = genreMapping[remix.genre] || 'progressive-house';

      const options = {
        genre: mappedGenre,
        mood: 'uplifting',
        prompt: remix.prompt_text,
        duration: 30, // Short preview
        bpm: 128,
        complexity: 'medium' as const,
        variations: 1,
        mixingStyle: 'compressed' as const,
        arrangeStyle: 'intro-buildup-drop-outro' as const
      };

      const result = await audioService.current.generateAdvancedAudio(options);
      
      if (result && result.length > 0) {
        const blob = audioService.current.createAudioBlob(result[0].audioBuffer);
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        toast.success('Audio generated successfully!');
      }
    } catch (error) {
      console.error('Audio generation error:', error);
      toast.error('Failed to generate audio');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = async () => {
    if (!audioUrl && !isGenerating) {
      await generateAudio();
      return;
    }

    if (!audioUrl || isGenerating) {
      toast.error('Audio is still generating...');
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
      onPlayPause(remix.id);
    } catch (error) {
      console.error('Audio play error:', error);
      toast.error('Unable to play audio');
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const newTime = value[0] / 100 * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume / 100;
    setVolume(newVolume);
  };

  const handleDownload = () => {
    if (!audioBlob) {
      toast.error('No audio available to download');
      return;
    }

    try {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${remix.remix_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download audio');
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? currentTime / duration * 100 : 0;

  return (
    <div className="group">
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          preload="metadata"
        />
      )}
      
      {/* Main play button */}
      <Button
        size="icon"
        onClick={handlePlayPause}
        disabled={isGenerating}
        className={`w-12 h-12 rounded-full ${
          isPlaying
            ? 'bg-cyan-500 hover:bg-cyan-600'
            : 'bg-white/20 hover:bg-white/30'
        }`}
      >
        {isGenerating ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </Button>

      {/* Progress bar - only show when audio is loaded */}
      {audioUrl && (
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="px-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full h-1"
            />
          </div>
        </div>
      )}

      {/* Action buttons - show on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
        <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-2 text-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onLike(remix.id)}
              className={`flex items-center gap-1 ${
                isLiked ? 'text-red-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </button>
            {audioBlob && (
              <button 
                onClick={handleDownload}
                className="text-gray-300 hover:text-white flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <div className="w-16">
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="h-1"
              />
            </div>
            <button 
              onClick={() => onShare(remix)}
              className="text-gray-300 hover:text-white"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAudioPlayer;