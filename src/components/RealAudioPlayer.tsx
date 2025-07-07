import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download, Volume2, Music, Loader2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface RealAudioPlayerProps {
  audioBlob?: Blob;
  title?: string;
  className?: string;
  onDownload?: () => void;
  metadata?: {
    bpm?: number;
    key?: string;
    genre?: string;
    mood?: string;
  };
}

const RealAudioPlayer = ({ 
  audioBlob, 
  title = 'Generated Track', 
  className = '',
  onDownload,
  metadata
}: RealAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioBlob]);

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

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      setAudioData();
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      toast.error('Unable to load generated audio');
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplaythrough', handleLoadedData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplaythrough', handleLoadedData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) {
      toast.error('No audio available to play');
      return;
    }

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio play error:', error);
      setIsPlaying(false);
      toast.error('Unable to play audio');
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const newTime = (value[0] / 100) * duration;
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
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Download started!');
      onDownload?.();
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

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-gray-900 rounded-lg p-6 border border-green-500/20 ${className}`}>
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Music className="w-5 h-5 text-green-400" />
            {title}
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
              LIVE
            </span>
          </h3>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-400 text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
            {metadata && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {metadata.bpm && <span>{metadata.bpm} BPM</span>}
                {metadata.key && <span>• {metadata.key}</span>}
                {metadata.genre && <span>• {metadata.genre}</span>}
              </div>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={!audioBlob}
          className="border-green-500 text-green-400 hover:bg-green-500/20"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Waveform Visualization */}
      <div className="mb-4 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="flex items-center gap-1">
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={i}
              className={`w-1 bg-gradient-to-t from-green-500 to-cyan-500 rounded-full transition-all duration-150 ${
                isPlaying ? 'animate-pulse' : ''
              }`}
              style={{
                height: `${Math.random() * 40 + 10}px`,
                opacity: i < (progress / 100) * 40 ? 1 : 0.3
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
          disabled={!audioUrl || isLoading}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          onClick={togglePlayPause}
          size="lg"
          disabled={!audioUrl || isLoading}
          className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-semibold"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>

        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <div className="w-24">
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              disabled={!audioUrl}
            />
          </div>
        </div>
      </div>

      {metadata && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-300">
            <div className="flex items-center gap-4 flex-wrap">
              {metadata.genre && (
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  {metadata.genre}
                </span>
              )}
              {metadata.mood && (
                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                  {metadata.mood}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealAudioPlayer;
