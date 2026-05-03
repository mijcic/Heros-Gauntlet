import { Monster } from "../models/monster";
import { moves } from "./moves";

export const monsters: Monster[] = [
  {
    name: "Goblin Warrior",
    hp: 55,
    maxHp: 55,
    attack: 6,
    defense: 3,
    magic: 2,
    sprite: "/assets/pictures/goblin.png",
    moves: [moves.rustyBlade, moves.dirtyKick, moves.frenzy, moves.headbutt]
  },
  {
    name: "Skeleton Warrior",
    hp: 65,
    maxHp: 65,
    attack: 8,
    defense: 5,
    magic: 4,
    sprite: "/assets/pictures/skeleton.png",
    moves: [moves.boneCrush, moves.rattlingHowl, moves.reanimate, moves.rustyArmor]
  },
  {
    name: "Goblin Mage",
    hp: 55,
    maxHp: 55,
    attack: 4,
    defense: 4,
    magic: 8,
    sprite: "/assets/pictures/goblin_mage.png",
    moves: [moves.firebolt, moves.arcaneSurge, moves.manaDrain, moves.hexShield]
  },
  {
    name: "Dire Wolf",
    hp: 70,
    maxHp: 70,
    attack: 10,
    defense: 5,
    magic: 3,
    sprite: "/assets/pictures/wolf.png",
    moves: [moves.fangBite, moves.howlOfTheWild, moves.hamstring, moves.packTactics]
  },
  {
    name: "Witch",
    hp: 60,
    maxHp: 60,
    attack: 4,
    defense: 4,
    magic: 7,
    sprite: "/assets/pictures/witch.png",
    moves: [moves.shadowBolt, moves.drainLife, moves.curse, moves.darkPact]
  },
  {
    name: "Giant Spider",
    hp: 80,
    maxHp: 80,
    attack: 9,
    defense: 6,
    magic: 3,
    sprite: "/assets/pictures/spider.png",
    moves: [moves.bite, moves.webThrow, moves.pounce, moves.skitter]
  },
  {
    name: "Demon",
    hp: 80,
    maxHp: 80,
    attack: 11,
    defense: 6,
    magic: 11,
    sprite: "/assets/pictures/demon.png",
    moves: [moves.hellfire, moves.demonicFrenzy, moves.searingMark, moves.infernalPact]
  },
  {
    name: "Dragon",
    hp: 120,
    maxHp: 120,
    attack: 15,
    defense: 10,
    magic: 16,
    sprite: "/assets/pictures/dragon.png",
    moves: [moves.flameBreath, moves.clawSwipe, moves.intimidate, moves.dragonScales]
  }
];