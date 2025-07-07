import { useEffect, useRef } from 'react';

interface WaveformAnimationProps {
  className?: string;
  color?: string;
  height?: number;
  bars?: number;
}

const WaveformAnimation = ({
  className = '',
  color = '#00ff8f',
  height = 60,
  bars = 24
}: WaveformAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const barWidth = canvas.offsetWidth / bars;
    const centerY = height / 2;

    let animationTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, height);

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, '#00ffe1');

      ctx.fillStyle = gradient;

      for (let i = 0; i < bars; i++) {
        const x = i * barWidth + barWidth / 4;
        const barHeight = Math.sin(animationTime * 0.02 + i * 0.5) * 20 +
        Math.sin(animationTime * 0.03 + i * 0.3) * 15 +
        Math.sin(animationTime * 0.01 + i * 0.7) * 10;

        const rectHeight = Math.abs(barHeight) + 2;
        const y = centerY - rectHeight / 2;

        ctx.fillRect(x, y, barWidth / 2, rectHeight);

        // Add glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, barWidth / 2, rectHeight);
        ctx.shadowBlur = 0;
      }

      animationTime += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, height, bars]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full ${className}`}
      style={{ height: `${height}px` }} />);


};

export default WaveformAnimation;