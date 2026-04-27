export type MoveType = 'physical' | 'magic';
export type MoveEffect = 'damage' | 'heal' | 'buff' | 'debuff';

export interface Move {
  name: string;
  type: MoveType;
  effect: MoveEffect;
  value: number;
  duration?: number;
}