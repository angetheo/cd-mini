import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameLog } from './types';
import { MONSTERS, DAILY_MAINTENANCE_CALORIES } from './constants';
import { MonsterVisual } from './components/MonsterVisual';
import { ProgressBar } from './components/ProgressBar';
import { FloatingText } from './components/FloatingText';
import { HistoryView } from './components/HistoryView';
import { Sword, Utensils, History as HistoryIcon, Trophy, Skull, X } from 'lucide-react';

const INITIAL_STATE: GameState = {
  currentMonsterIndex: 0,
  currentMonsterHp: MONSTERS[0].totalHp,
  totalDeficit: 0,
  logs: [],
  lastLogin: new Date().toISOString(),
};

export default function App() {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
        const saved = localStorage.getItem('deficit_slayer_state');
        if (!saved) return INITIAL_STATE;
        const parsed = JSON.parse(saved);
        // Merge with INITIAL_STATE to ensure new fields (like logs) exist in old saves
        return { 
          ...INITIAL_STATE, 
          ...parsed,
          logs: Array.isArray(parsed.logs) ? parsed.logs : [] 
        };
    } catch (e) {
        return INITIAL_STATE;
    }
  });

  const [inputCalories, setInputCalories] = useState<string>('');
  const [showInput, setShowInput] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);
  
  // Animation States
  const [isHit, setIsHit] = useState(false);
  const [isHealing, setIsHealing] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{id: number, value: string, x: number, y: number, color: string, scale: number}[]>([]);
  
  const monster = MONSTERS[gameState.currentMonsterIndex] || MONSTERS[MONSTERS.length - 1];
  
  // Save on change
  useEffect(() => {
    localStorage.setItem('deficit_slayer_state', JSON.stringify(gameState));
  }, [gameState]);

  // --- Actions ---

  const addFloatingText = (text: string, color: string, scale: number = 1) => {
    const id = Date.now() + Math.random();
    // Center of screen usually good for hits, maybe slightly random offset
    const x = window.innerWidth / 2 + (Math.random() * 40 - 20);
    const y = window.innerHeight / 3 + (Math.random() * 40 - 20);
    
    // Use 'value' instead of 'text' property
    setFloatingTexts(prev => [...prev, { id, value: text, x, y, color, scale }]);
  };

  const handleFloatingTextComplete = useCallback((id: number) => {
    setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
  }, []);

  const handleAttack = useCallback(() => {
    const consumed = parseInt(inputCalories);
    if (isNaN(consumed)) return;

    const deficit = DAILY_MAINTENANCE_CALORIES - consumed;
    const newLog: GameLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      caloriesConsumed: consumed,
      deficit: deficit,
      monsterId: monster.id
    };

    setShowInput(false);
    setInputCalories('');

    // Trigger Animations
    if (deficit > 0) {
      // Critical hit logic based on high deficits
      const isCrit = deficit > 800;
      
      setIsHit(true);
      setTimeout(() => setIsHit(false), 300);
      
      addFloatingText(`-${deficit}`, 'text-red-500', isCrit ? 1.5 : 1.0);
      if (isCrit) {
        setTimeout(() => addFloatingText("CRITICAL!", "text-yellow-400", 1.2), 200);
      }
    } else if (deficit < 0) {
      setIsHealing(true);
      setTimeout(() => setIsHealing(false), 500);
      addFloatingText(`+${Math.abs(deficit)}`, 'text-green-400');
    } else {
      addFloatingText("MISS", "text-gray-400");
    }

    // Update State
    setGameState(prev => {
      let newHp = prev.currentMonsterHp - deficit;
      
      // Prevent healing above max
      if (deficit < 0) {
        newHp = Math.min(newHp, MONSTERS[prev.currentMonsterIndex].totalHp);
      }

      return {
        ...prev,
        currentMonsterHp: newHp,
        totalDeficit: prev.totalDeficit + deficit,
        logs: [...(prev.logs || []), newLog]
      };
    });

  }, [inputCalories, monster]);

  // Check for death
  useEffect(() => {
    if (gameState.currentMonsterHp <= 0 && !showVictory && !showGameComplete) {
      const isLastMonster = gameState.currentMonsterIndex === MONSTERS.length - 1;
      
      if (isLastMonster) {
        setTimeout(() => setShowGameComplete(true), 1500);
      } else {
        setTimeout(() => setShowVictory(true), 1500);
      }
    }
  }, [gameState.currentMonsterHp, gameState.currentMonsterIndex, showVictory, showGameComplete]);

  const handleNextLevel = () => {
    setShowVictory(false);
    setGameState(prev => ({
      ...prev,
      currentMonsterIndex: prev.currentMonsterIndex + 1,
      currentMonsterHp: MONSTERS[prev.currentMonsterIndex + 1].totalHp
    }));
  };

  // --- Renders ---

  return (
    <div className="min-h-screen bg-game-bg text-white font-sans overflow-hidden select-none">
      {/* Floating Damage Numbers */}
      {floatingTexts.map(ft => (
        <FloatingText 
          key={ft.id} 
          {...ft} 
          onComplete={() => handleFloatingTextComplete(ft.id)} 
        />
      ))}

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 bg-gradient-to-b from-game-bg to-transparent">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Current Target</span>
          <h1 className={`text-2xl font-black ${monster.color} drop-shadow-md`}>{monster.name}</h1>
          <span className="text-sm text-gray-500 max-w-[200px] leading-tight">{monster.description}</span>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowHistory(true)}
                className="p-3 bg-game-surface rounded-xl border border-gray-700 hover:bg-gray-700 active:scale-95 transition-all shadow-lg"
            >
                <HistoryIcon size={20} className="text-gray-300" />
            </button>
        </div>
      </div>

      {/* Main Battle Arena */}
      <div className="relative h-screen flex flex-col items-center justify-center pb-24">
        
        {/* Monster Area */}
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md px-6">
            <div className="w-full mb-8">
                 <div className="flex justify-between text-xs font-bold text-gray-400 mb-1 uppercase">
                    <span>{monster.name} HP</span>
                    <span>{Math.max(0, gameState.currentMonsterHp).toLocaleString()} / {monster.totalHp.toLocaleString()}</span>
                 </div>
                 <ProgressBar 
                    current={gameState.currentMonsterHp} 
                    max={monster.totalHp} 
                    colorClass="bg-red-500" 
                    height="h-6"
                 />
            </div>

            <MonsterVisual 
                monster={monster} 
                isHit={isHit} 
                isDead={gameState.currentMonsterHp <= 0}
                isHealing={isHealing}
            />
            
            {/* Total Progress Stats */}
             <div className="mt-12 w-full bg-game-surface/50 p-4 rounded-2xl border border-gray-800 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm font-semibold flex items-center gap-2">
                        <Trophy size={14} className="text-gold" /> Total Burned
                    </span>
                    <span className="font-mono text-xl text-white">{gameState.totalDeficit.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-2">
                    <div 
                        className="bg-gold h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, (gameState.totalDeficit / 70000) * 100)}%` }}
                    ></div>
                </div>
                <div className="text-right text-[10px] text-gray-500 mt-1">Goal: 70,000</div>
             </div>
        </div>
      </div>

      {/* Action Bar (Sticky Bottom) */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-game-surface/90 border-t border-gray-700 backdrop-blur-md pb-8 z-20">
        <button
            onClick={() => setShowInput(true)}
            disabled={gameState.currentMonsterHp <= 0}
            className={`w-full group relative overflow-hidden bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black text-xl py-5 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
             <span className="relative z-10 flex items-center justify-center gap-3">
                <Sword className="group-hover:rotate-12 transition-transform" />
                LOG CALORIES
             </span>
             {/* Shine effect */}
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>

      {/* Input Modal */}
      {showInput && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center animate-pop backdrop-blur-sm">
            <div className="bg-game-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-gray-700 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Utensils size={20} className="text-gray-400"/> Daily Intake
                    </h3>
                    <button onClick={() => setShowInput(false)} className="text-gray-400 hover:text-white p-2">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="mb-6">
                    <label className="text-sm text-gray-400 block mb-2">Calories Consumed Today</label>
                    <input 
                        type="number" 
                        pattern="[0-9]*"
                        autoFocus
                        value={inputCalories}
                        onChange={(e) => setInputCalories(e.target.value)}
                        placeholder="e.g. 1800"
                        className="w-full bg-game-bg text-3xl font-mono text-white p-4 rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none placeholder-gray-700"
                    />
                    <div className="mt-2 text-right text-xs text-gray-500">
                        Goal Baseline: {DAILY_MAINTENANCE_CALORIES}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        <div className="text-xs text-gray-500 mb-1">Projected Damage</div>
                        <div className={`font-mono text-lg font-bold ${
                            (DAILY_MAINTENANCE_CALORIES - (parseInt(inputCalories) || 0)) > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {inputCalories ? (DAILY_MAINTENANCE_CALORIES - parseInt(inputCalories)) : '--'}
                        </div>
                    </div>
                     <button 
                        onClick={handleAttack}
                        disabled={!inputCalories}
                        className="bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl py-3 shadow-lg active:scale-95 disabled:opacity-50 transition-all"
                    >
                        CONFIRM
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Victory Modal */}
      {showVictory && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 text-center animate-pop backdrop-blur-md">
            <Trophy size={80} className="text-gold mb-6 animate-bounce" />
            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic transform -rotate-2">
                VICTORY!
            </h2>
            <p className="text-gray-400 mb-8 max-w-xs">
                You have defeated the {monster.name}! You are one step closer to your goal.
            </p>
            <button 
                onClick={handleNextLevel}
                className="bg-gold text-black font-black text-xl px-12 py-4 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.5)] hover:bg-yellow-300 transform transition hover:scale-105 active:scale-95"
            >
                NEXT MONSTER
            </button>
        </div>
      )}

      {/* Game Complete Modal */}
      {showGameComplete && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 to-black z-50 flex flex-col items-center justify-center p-6 text-center animate-pop">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-50 rounded-full"></div>
                <Skull size={100} className="text-white relative z-10" />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">
                LEGEND
            </h2>
            <p className="text-purple-200 text-lg mb-8 max-w-sm">
                You have slain the Lord of Excess. You have burned 70,000 calories. You have conquered yourself.
            </p>
            <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <div className="text-sm text-purple-200 uppercase tracking-widest mb-1">Total Deficit</div>
                <div className="text-4xl font-mono font-bold text-white">{gameState.totalDeficit.toLocaleString()}</div>
            </div>
        </div>
      )}

      {/* History Drawer */}
      {showHistory && (
          <HistoryView logs={gameState.logs || []} onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}