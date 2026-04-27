import type { Request, Response } from "express";
import { monsters } from "../data/monsters";
import { Monster } from "../models/monster";
import { gameState } from "../state/game-state";
import { hero } from "../data/hero";

export const getRunConfig = (req: Request, res: Response) => {
    res.json({ monsters });
};

export const getMonsterMove = (req: Request, res: Response) => {
    let monster: Monster = req.body.monster;
    let chosenMove;

    if (monster.hp < monster.maxHp * 0.4) {
        chosenMove = monster.moves.find((m) => m.effect === "heal");
    }

    if (!chosenMove) {
        chosenMove =
            monster.moves[Math.floor(Math.random() * monster.moves.length)];
    }

    res.json({ move: chosenMove });
};

export const playerAttack = (req: Request, res: Response) => {
    let monster = gameState.monsters[gameState.currentMonsterIndex];
    let { move } = req.body;
    let damage = 0;

    if (move.effect === "damage") {
        damage = move.value + gameState.hero.attack - monster.defense;
    }

    if (move.effect === "heal") {
        gameState.hero.hp += move.value;
    }

    monster.hp -= damage;

    if (monster.hp <= 0) {
        gameState.currentMonsterIndex++;
    }

    res.json({
        hero: gameState.hero,
        monster,
        nextMonsterIndex: gameState.currentMonsterIndex
    });
};

export const getHero = (req: Request, res: Response) => {
  res.json(hero);
};