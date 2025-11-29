import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  colorClass: string;
  label?: string;
  height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, colorClass, label, height = "h-4" }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  return (
    <div className="w-full relative">
      <div className={`w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700 ${height}`}>
        <div
          className={`${height} ${colorClass} transition-all duration-1000 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>
      {label && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md pointer-events-none">
          {label}
        </div>
      )}
    </div>
  );
};