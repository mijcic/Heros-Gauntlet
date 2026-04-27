"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHero = exports.playerAttack = exports.getMonsterMove = exports.getRunConfig = void 0;
var monsters_1 = require("../data/monsters");
var game_state_1 = require("../state/game-state");
var hero_1 = require("../data/hero");
var getRunConfig = function (req, res) {
    res.json({ monsters: monsters_1.monsters });
};
exports.getRunConfig = getRunConfig;
var getMonsterMove = function (req, res) {
    var monster = req.body.monster;
    var chosenMove;
    if (monster.hp < monster.maxHp * 0.4) {
        chosenMove = monster.moves.find(function (m) { return m.effect === "heal"; });
    }
    if (!chosenMove) {
        chosenMove =
            monster.moves[Math.floor(Math.random() * monster.moves.length)];
    }
    res.json({ move: chosenMove });
};
exports.getMonsterMove = getMonsterMove;
var playerAttack = function (req, res) {
    var monster = game_state_1.gameState.monsters[game_state_1.gameState.currentMonsterIndex];
    var move = req.body.move;
    var damage = 0;
    if (move.effect === "damage") {
        damage = move.value + game_state_1.gameState.hero.attack - monster.defense;
    }
    if (move.effect === "heal") {
        game_state_1.gameState.hero.hp += move.value;
    }
    monster.hp -= damage;
    if (monster.hp <= 0) {
        game_state_1.gameState.currentMonsterIndex++;
    }
    res.json({
        hero: game_state_1.gameState.hero,
        monster: monster,
        nextMonsterIndex: game_state_1.gameState.currentMonsterIndex
    });
};
exports.playerAttack = playerAttack;
var getHero = function (req, res) {
    res.json(hero_1.hero);
};
exports.getHero = getHero;
