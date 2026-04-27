import { moves } from "./moves";

export const hero = {
  name: "Knight",
  hp: 100,
  maxHp: 100,
  attack: 10,
  defense: 8,
  magic: 5,
  sprite: "/assets/pictures/hero.png",
  moves: [
    moves.slash,
    moves.shieldUp,
    moves.battleCry,
    moves.secondWind
  ]
};