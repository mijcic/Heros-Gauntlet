"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hero = void 0;
var moves_1 = require("./moves");
exports.hero = {
    name: "Knight",
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 8,
    magic: 5,
    sprite: "/assets/pictures/hero.png",
    moves: [
        moves_1.moves.slash,
        moves_1.moves.shieldUp,
        moves_1.moves.battleCry,
        moves_1.moves.secondWind
    ]
};
