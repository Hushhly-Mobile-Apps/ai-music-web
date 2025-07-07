import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download, Volume2, AlertCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
  className?: string;
}

const AudioPlayer = ({ audioUrl, title = 'AI Generated Track', className = '' }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const setAudioData = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
        setHasError(false);
      }
    };

    const setAudioTime = () => {
      if (audio.currentTime && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      setAudioData();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
      toast.error('Unable to load audio file. This is a demo preview.');
    };

    const handleEnded = () => {
      setIsPlaying(false);
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
    if (!audio || hasError) {
      toast.error('This is a demo preview. Audio playback is not available.');
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
      setHasError(true);
      setIsPlaying(false);
      toast.error('Unable to play audio. This is a demo preview.');
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || hasError || !duration) return;

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
    if (!audioUrl || hasError) {
      toast.error('This is a demo preview. Download is not available.');
      return;
    }
    
    // In a real implementation, this would download the file
    toast.success('Download started! (Demo feature)');
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // For demo purposes, show a realistic demo track
  const demoTrack = !audioUrl || hasError;

  return (
    <div className={`bg-gray-900 rounded-lg p-4 border border-green-500/20 ${className}`}>
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            {title}
            {demoTrack && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                DEMO
              </span>
            )}
          </h3>
          <p className="text-gray-400 text-sm">
            {demoTrack ? '0:00 / 3:45' : `${formatTime(currentTime)} / ${formatTime(duration)}`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="border-green-500 text-green-400 hover:bg-green-500/20">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[demoTrack ? 0 : progress]}
          onValueChange={demoTrack ? undefined : handleSeek}
          max={100}
          step={1}
          className="w-full" 
          disabled={demoTrack}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          onClick={togglePlayPause}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-semibold">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
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
              disabled={demoTrack}
            />
          </div>
        </div>
      </div>

      {demoTrack && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>This is a demo preview. Real audio generation requires API integration.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;