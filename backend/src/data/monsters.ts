import { Monster } from "../models/monster";
import { moves } from "./moves";

export const monsters: Monster[] = [
  {
    name: "Witch",
    hp: 70,
    maxHp: 70,
    attack: 5,
    defense: 4,
    magic: 15,
    sprite: "/assets/pictures/witch.png",
    moves: [moves.shadowBolt, moves.drainLife, moves.curse, moves.darkPact]
  },
  {
    name: "Giant Spider",
    hp: 65,
    maxHp: 65,
    attack: 11,
    defense: 6,
    magic: 2,
    sprite: "/assets/pictures/spider.png",
    moves: [moves.bite, moves.webThrow, moves.pounce, moves.skitter]
  },
  {
    name: "Dragon",
    hp: 120,
    maxHp: 120,
    attack: 15,
    defense: 10,
    magic: 18,
    sprite: "/assets/pictures/dragon.png",
    moves: [moves.flameBreath, moves.clawSwipe, moves.intimidate, moves.dragonScales]
  },
  {
    name: "Goblin Warrior",
    hp: 60,
    maxHp: 60,
    attack: 10,
    defense: 5,
    magic: 2,
    sprite: "/assets/pictures/goblin.png",
    moves: [moves.rustyBlade, moves.dirtyKick, moves.frenzy, moves.headbutt]
  },
  {
    name: "Goblin Mage",
    hp: 55,
    maxHp: 55,
    attack: 4,
    defense: 3,
    magic: 12,
    sprite: "/assets/pictures/goblin_mage.png",
    moves: [moves.firebolt, moves.arcaneSurge, moves.manaDrain, moves.hexShield]
  }
];