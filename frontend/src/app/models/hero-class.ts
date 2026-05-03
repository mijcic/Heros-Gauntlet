import { Move } from "./move";

export interface HeroClass {
  id: string;
  name: string;
  description: string;
  sprite: string;
  baseStats: {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    magic: number;
  };
  statGains: {
    attack: number;
    defense: number;
    magic: number;
    maxHp: number;
  };
  defaultMoves: Move[];
}