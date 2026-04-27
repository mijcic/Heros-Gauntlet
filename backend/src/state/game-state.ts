import { GameState } from "../models/game-state";
import { monsters } from "../data/monsters";

export const gameState: GameState = {
  hero: {
    hp: 100,
    attack: 10,
    defense: 5,
    magic: 5
  },
  monsters: monsters,
  currentMonsterIndex: 0
};