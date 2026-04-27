import { Monster } from "./monster";
import { Hero } from "./hero";

export interface GameState {
  hero: Hero;
  monsters: Monster[];
  currentMonsterIndex: number;
}