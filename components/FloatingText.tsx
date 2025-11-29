import React, { useEffect, useState, useRef } from 'react';

interface FloatingTextProps {
  value: string;
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
  scale?: number;
}

export const FloatingText: React.FC<FloatingTextProps> = ({ value, x, y, color, onComplete, scale = 1 }) => {
  const [opacity, setOpacity] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const onCompleteRef = useRef(onComplete);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    let animationFrameId: number;

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const moveProgress = 1 - Math.pow(1 - progress, 3);
      
      setOffsetY(moveProgress * -150); // Move up 150px
      setOpacity(1 - Math.pow(progress, 3)); // Fade out slowly then fast

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (onCompleteRef.current) {
            onCompleteRef.current();
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, []); // Run only once on mount

  return (
    <div
      className={`fixed pointer-events-none font-black drop-shadow-lg z-50 ${color}`}
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, ${offsetY}px) scale(${scale})`,
        opacity: opacity,
        fontSize: '3rem',
        textShadow: '0 4px 10px rgba(0,0,0,0.5)'
      }}
    >
      {value}
    </div>
  );
};