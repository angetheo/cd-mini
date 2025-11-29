import React from 'react';
import { GameLog } from '../types';
import { TrendingDown, TrendingUp, X } from 'lucide-react';

interface HistoryViewProps {
  logs: GameLog[];
  onClose: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ logs, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col p-4 animate-pop">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Battle Log</h2>
        <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {logs.length === 0 && (
          <div className="text-center text-gray-500 mt-20">No battles recorded yet.</div>
        )}
        {[...logs].reverse().map((log) => (
          <div 
            key={log.id} 
            className={`p-4 rounded-xl border border-gray-700 flex justify-between items-center ${
              log.deficit > 0 ? 'bg-green-900/20' : 'bg-red-900/20'
            }`}
          >
            <div>
              <div className="text-sm text-gray-400">{new Date(log.date).toLocaleDateString()}</div>
              <div className="font-semibold text-white">
                {log.caloriesConsumed} kcal consumed
              </div>
            </div>
            <div className={`flex items-center gap-2 font-bold text-xl ${
              log.deficit > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {log.deficit > 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
              {Math.abs(log.deficit)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};