export type MoveType = 'physical' | 'magic';
export type MoveEffect = 'damage' | 'heal' | 'buff' | 'debuff';
export type MoveStat = 'attack' | 'defense' | 'magic';

export interface Move {
  name: string;
  type: MoveType;
  effect: MoveEffect;
  value: number;
  duration?: number;
  description?: string;
  stat?: MoveStat;
  secondaryDamage?: number;
  selfHpCost?: number;
}