export interface Monster {
  id: number;
  name: string;
  totalHp: number;
  description: string;
  image: string; // Emoji or Lucide icon name mapping
  color: string;
}

export interface GameLog {
  id: string;
  date: string;
  caloriesConsumed: number;
  deficit: number;
  monsterId: number;
}

export interface GameState {
  currentMonsterIndex: number;
  currentMonsterHp: number;
  totalDeficit: number; // Lifetime damage dealt
  logs: GameLog[];
  lastLogin: string;
}

export const BattleEffect = {
  NONE: 'NONE',
  HIT: 'HIT',
  CRIT: 'CRIT',
  HEAL: 'HEAL'
} as const;

export type BattleEffect = typeof BattleEffect[keyof typeof BattleEffect];