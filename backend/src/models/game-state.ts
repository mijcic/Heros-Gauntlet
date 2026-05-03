import { Monster } from "./monster";
import { Hero } from "./hero";
import { Environment } from "../data/environments";

export interface GameState {
  hero: Hero;
  monsters: Monster[];
  currentMonsterIndex: number;
  currentMonster: Monster | null;
  currentEnvironment: Environment | null;
  battleState: BattleState;
}

export interface BattleState {
  heroAttackMod: number;
  heroDefenseMod: number;
  heroMagicMod: number;
  monsterAttackMod: number;
  monsterDefenseMod: number;
  monsterMagicMod: number;
  heroAttackModTurns: number;
  heroDefenseModTurns: number;
  heroMagicModTurns: number;
  monsterAttackModTurns: number;
  monsterDefenseModTurns: number;
  monsterMagicModTurns: number;
}