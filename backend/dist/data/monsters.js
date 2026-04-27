"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monsters = void 0;
var moves_1 = require("./moves");
exports.monsters = [
    {
        name: "Witch",
        hp: 70,
        maxHp: 70,
        attack: 5,
        defense: 4,
        magic: 15,
        sprite: "/assets/pictures/witch.png",
        moves: [moves_1.moves.shadowBolt, moves_1.moves.drainLife, moves_1.moves.curse, moves_1.moves.darkPact]
    },
    {
        name: "Giant Spider",
        hp: 65,
        maxHp: 65,
        attack: 11,
        defense: 6,
        magic: 2,
        sprite: "/assets/pictures/spider.png",
        moves: [moves_1.moves.bite, moves_1.moves.webThrow, moves_1.moves.pounce, moves_1.moves.skitter]
    },
    {
        name: "Dragon",
        hp: 120,
        maxHp: 120,
        attack: 15,
        defense: 10,
        magic: 18,
        sprite: "/assets/pictures/dragon.png",
        moves: [moves_1.moves.flameBreath, moves_1.moves.clawSwipe, moves_1.moves.intimidate, moves_1.moves.dragonScales]
    },
    {
        name: "Goblin Warrior",
        hp: 60,
        maxHp: 60,
        attack: 10,
        defense: 5,
        magic: 2,
        sprite: "/assets/pictures/goblin.png",
        moves: [moves_1.moves.rustyBlade, moves_1.moves.dirtyKick, moves_1.moves.frenzy, moves_1.moves.headbutt]
    },
    {
        name: "Goblin Mage",
        hp: 55,
        maxHp: 55,
        attack: 4,
        defense: 3,
        magic: 12,
        sprite: "/assets/pictures/goblin_mage.png",
        moves: [moves_1.moves.firebolt, moves_1.moves.arcaneSurge, moves_1.moves.manaDrain, moves_1.moves.hexShield]
    }
];
