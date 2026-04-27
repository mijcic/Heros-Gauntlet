"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameState = void 0;
var monsters_1 = require("../data/monsters");
exports.gameState = {
    hero: {
        hp: 100,
        attack: 10,
        defense: 5,
        magic: 5
    },
    monsters: monsters_1.monsters,
    currentMonsterIndex: 0
};
