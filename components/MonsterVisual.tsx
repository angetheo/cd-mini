import React from 'react';
import { 
  Droplets, 
  Ghost, 
  Dog, 
  Hammer, 
  Frown, 
  Flame, 
  Skull,
  Swords
} from 'lucide-react';
import { Monster } from '../types';

interface MonsterVisualProps {
  monster: Monster;
  isHit: boolean;
  isDead: boolean;
  isHealing: boolean;
}

const MonsterIcon = ({ name, size, className }: { name: string, size: number, className: string }) => {
  switch (name) {
    case 'droplet': return <Droplets size={size} className={className} />;
    case 'ghost': return <Ghost size={size} className={className} />;
    case 'dog': return <Dog size={size} className={className} />;
    case 'hammer': return <Hammer size={size} className={className} />;
    case 'frown': return <Frown size={size} className={className} />;
    case 'flame': return <Flame size={size} className={className} />;
    case 'skull': return <Skull size={size} className={className} />;
    default: return <Swords size={size} className={className} />;
  }
};

export const MonsterVisual: React.FC<MonsterVisualProps> = ({ monster, isHit, isDead, isHealing }) => {
  let animationClass = "animate-float";
  let colorFilter = "";

  if (isHit) {
    animationClass = "animate-shake text-red-500 brightness-150";
    colorFilter = "drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))";
  } else if (isHealing) {
    animationClass = "scale-110 duration-300 text-green-400";
    colorFilter = "drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))";
  } else if (isDead) {
    animationClass = "opacity-0 scale-50 rotate-180 duration-1000";
    colorFilter = "grayscale(100%)";
  }

  return (
    <div className="relative w-64 h-64 flex items-center justify-center mx-auto transition-all">
      <div 
        className={`transition-all duration-100 ${animationClass} ${monster.color}`}
        style={{ filter: colorFilter || 'drop-shadow(0 0 15px rgba(0,0,0,0.5))' }}
      >
        <MonsterIcon name={monster.image} size={180} className="stroke-[1.5px]" />
      </div>
      
      {/* Platform/Shadow */}
      <div className="absolute bottom-0 w-48 h-12 bg-black/40 blur-xl rounded-full -z-10 transform scale-y-50 translate-y-8"></div>
    </div>
  );
};