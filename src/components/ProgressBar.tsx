import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import WaveformAnimation from './WaveformAnimation';

interface ProgressBarProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const ProgressBar = ({ isLoading, onComplete }: ProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete?.();
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Creating Your EDM Remix...
        </h3>
        <p className="text-gray-400 text-sm">
          Our AI is analyzing your track and applying EDM magic
        </p>
      </div>
      
      <div className="space-y-2">
        <Progress 
          value={progress} 
          className="h-2"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Processing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 border border-green-500/20">
        <WaveformAnimation height={40} bars={20} />
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          This usually takes 30-60 seconds
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;