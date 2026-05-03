import { Move } from "./move";

export interface Hero {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  magic: number;
  level: number;
  xp: number;
  moves: Move[];
  sprite: string;
}