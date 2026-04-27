import { Move } from "./move";

export interface Monster {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  magic: number;
  moves: Move[];
  sprite: string;
}