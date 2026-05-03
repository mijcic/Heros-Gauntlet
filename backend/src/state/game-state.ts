import { BattleState, GameState } from "../models/game-state";
import { monsters } from "../data/monsters";
import { moves } from "../data/moves";

export const defaultBattleState = (): BattleState => ({
  heroAttackMod: 0,
  heroDefenseMod: 0,
  heroMagicMod: 0,
  monsterAttackMod: 0,
  monsterDefenseMod: 0,
  monsterMagicMod: 0,
  heroAttackModTurns: 0,
  heroDefenseModTurns: 0,
  heroMagicModTurns: 0,
  monsterAttackModTurns: 0,
  monsterDefenseModTurns: 0,
  monsterMagicModTurns: 0,
});

export const gameState: GameState = {
  hero: {
    hp: 110,
    maxHp: 110,
    attack: 10,
    defense: 7,
    magic: 5,
    level: 1,
    xp: 0,
    moves: [
      moves.slash,
      moves.shieldUp,
      moves.battleCry,
      moves.secondWind
    ],
    name: "Hero",
    sprite: "/assets/pictures/heroes/knight.png"
  },
  monsters: JSON.parse(JSON.stringify(monsters)),
  currentMonsterIndex: 0,
  currentMonster: null,
  currentEnvironment: null,
  battleState: defaultBattleState()
};

