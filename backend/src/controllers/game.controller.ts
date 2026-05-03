import type { Request, Response } from "express";
import { Monster } from "../models/monster";
import { Move } from "../models/move";
import { BattleState } from "../models/game-state";
import { defaultBattleState, gameState } from "../state/game-state";
import { db } from "../database/db";
import { environments } from "../data/environments";
import { heroClasses, getHeroClass } from "../data/hero-classes";

function getXpForMonster(monster: Monster): number {
    const xpTable: Record<string, number> = {
        "Goblin Warrior":   30,
        "Skeleton Warrior": 40,
        "Goblin Mage":      55,
        "Dire Wolf":        70,
        "Witch":            85,
        "Giant Spider":     100,
        "Demon":            120,
        "Dragon":           150
    };
    return xpTable[monster.name] ?? 30;
}

function getXpForNextLevel(level: number): number {
    return 50 + level * 25;
}

function levelUp(hero: any) {
    hero.level++;
    hero.hp = hero.maxHp;
}

function addXp(hero: any, amount: number): boolean {
    let leveledUp = false;
    hero.xp += amount;

    while (hero.xp >= getXpForNextLevel(hero.level)) {
        hero.xp -= getXpForNextLevel(hero.level);
        levelUp(hero);
        leveledUp = true;
    }

    return leveledUp;
}

function getEffectiveStats(side: 'hero' | 'monster', bs: BattleState, base: { attack: number, defense: number, magic: number }) {
    if (side === 'hero') {
        return {
            attack:  base.attack  + bs.heroAttackMod,
            defense: base.defense + bs.heroDefenseMod,
            magic:   base.magic   + bs.heroMagicMod
        };
    } else {
        return {
            attack:  base.attack  + bs.monsterAttackMod,
            defense: base.defense + bs.monsterDefenseMod,
            magic:   base.magic   + bs.monsterMagicMod
        };
    }
}

function calcDamage(move: Move, value: number, attackerStats: { attack: number, magic: number }, defenderDefense: number): number {
    const dmgMult = getEnvironmentMultiplier(move, 'damage');
    const defMult = getDefenseMultiplier();
    const adjustedDefense = defenderDefense * defMult;

    let baseDmg: number;
    if (move.type === 'physical') {
        baseDmg = value + attackerStats.attack - adjustedDefense;
    } 
    else {
        baseDmg = value + attackerStats.magic;
    }

    return Math.max(1, Math.round(baseDmg * dmgMult));
}

function applyStatMod(side: 'hero' | 'monster', stat: 'attack' | 'defense' | 'magic', amount: number, duration: number, bs: BattleState) {
    const key = `${side}${stat.charAt(0).toUpperCase() + stat.slice(1)}Mod` as keyof BattleState;
    const turnsKey = `${key}Turns` as keyof BattleState;
    (bs as any)[key] = amount;
    (bs as any)[turnsKey] = duration;
}

function getEnvironmentMultiplier(move: Move, type: 'damage' | 'heal'): number {
    const env = gameState.currentEnvironment;
    if (!env) return 1;

    if (type === 'damage') {
        let mult = env.effects.damageMultiplier || 1;
        
        if (move.type === 'physical' && env.effects.physicalDamageMultiplier) {
            mult *= env.effects.physicalDamageMultiplier;
        }
        if (move.type === 'magic' && env.effects.magicDamageMultiplier) {
            mult *= env.effects.magicDamageMultiplier;
        }
        return mult;
    }

    if (type === 'heal') {
        return env.effects.healMultiplier || 1;
    }

    return 1;
}

function getDefenseMultiplier(): number {
    return gameState.currentEnvironment?.effects.defenseMultiplier || 1;
}

function applyMove(
    move: Move,
    attackerSide: 'hero' | 'monster',
    attacker: { hp: number, maxHp: number, attack: number, defense: number, magic: number },
    defender: { hp: number, maxHp: number, attack: number, defense: number, magic: number },
    bs: BattleState
): { damageDealt: number, healAmount: number, selfHpCost: number } {
    const defenderSide = attackerSide === 'hero' ? 'monster' : 'hero';
    const attackerStats = getEffectiveStats(attackerSide, bs, attacker);
    const defenderStats = getEffectiveStats(defenderSide, bs, defender);

    let damageDealt = 0;
    let healAmount = 0;
    let selfHpCost = 0;

    if (move.effect === 'damage') {
        damageDealt = calcDamage(move, move.value, attackerStats, defenderStats.defense);
        defender.hp = Math.max(0, defender.hp - damageDealt);
    } 
    else if (move.effect === 'heal') {
        const healMult = getEnvironmentMultiplier(move, 'heal');
        healAmount = Math.round((move.value + attackerStats.magic) * healMult);
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
    } 
    else if (move.effect === 'buff' && move.stat) {
        applyStatMod(attackerSide, move.stat, move.value, move.duration ?? 2, bs);
    } 
    else if (move.effect === 'debuff' && move.stat) {
        applyStatMod(defenderSide, move.stat, -move.value, move.duration ?? 2, bs);
    }

    if (move.secondaryDamage) {
        const extraDamage = calcDamage(move, move.secondaryDamage, attackerStats, defenderStats.defense);
        defender.hp = Math.max(0, defender.hp - extraDamage);
        damageDealt += extraDamage;
    }

    if (move.selfHpCost) {
        selfHpCost = move.selfHpCost;
        attacker.hp = Math.max(0, attacker.hp - move.selfHpCost);
    }

    return { damageDealt, healAmount, selfHpCost };
}

function tickModifiers(bs: BattleState) {
    const sides: ('hero' | 'monster')[] = ['hero', 'monster'];
    const stats: ('Attack' | 'Defense' | 'Magic')[] = ['Attack', 'Defense', 'Magic'];

    for (const side of sides) {
        for (const stat of stats) {
            const turnsKey = `${side}${stat}ModTurns` as keyof BattleState;
            const modKey = `${side}${stat}Mod` as keyof BattleState;

            if ((bs as any)[turnsKey] > 0) {
                (bs as any)[turnsKey]--;
                if ((bs as any)[turnsKey] === 0) {
                    (bs as any)[modKey] = 0;
                }
            }
        }
    }
}

export const getRunConfig = (req: Request, res: Response) => {
    const multiplier = Number(req.query.multiplier) || 1;
    
    const scaledMonsters = gameState.monsters.map((m: any) => ({
        ...m,
        hp: Math.round(m.hp * multiplier),
        maxHp: Math.round(m.maxHp * multiplier),
        attack: Math.round(m.attack * multiplier),
        defense: Math.round(m.defense * multiplier),
        magic: Math.round(m.magic * multiplier)
    }));
    
    res.json({ monsters: scaledMonsters });
};

export const getMonsterMove = (req: Request, res: Response) => {
    if (!gameState.currentMonster) {
        res.status(400).json({ error: "No monster" });
        return;
    }

    const monster = gameState.currentMonster;
    const hero = gameState.hero;
    const bs = gameState.battleState;

    let chosenMove: Move | undefined;
    if (monster.hp < monster.maxHp * 0.4) {
        chosenMove = monster.moves.find(m => m.effect === 'heal');
    }
    if (!chosenMove) {
        chosenMove = monster.moves[Math.floor(Math.random() * monster.moves.length)];
    }

    const result = applyMove(chosenMove, 'monster', monster, hero, bs);

    tickModifiers(bs);

    res.json({
        move: chosenMove,
        hero,
        monster,
        damageDealt: result.damageDealt,
        healAmount: result.healAmount,
        selfHpCost: result.selfHpCost
    });
};

export const playerAttack = async (req: Request, res: Response) => {
    if (!gameState.currentMonster) {
        res.status(400).json({ error: "No monster in battle" });
        return;
    }

    const monster = gameState.currentMonster;
    const hero = gameState.hero;
    const bs = gameState.battleState;
    const move: Move = req.body.move;
    const userId = (req as any).userId;

    const result = applyMove(move, 'hero', hero, monster, bs);

    tickModifiers(bs);

    let leveledUp = false;

    if (monster.hp <= 0) {
        monster.hp = 0;
        leveledUp = addXp(hero, getXpForMonster(monster));
        gameState.currentMonsterIndex++;

        if (userId) {
            const [heroRows]: any = await db.execute(
                'SELECT id, unlocked_index FROM heroes WHERE user_id = ?',
                [userId]
            );
            const currentUnlocked = heroRows[0].unlocked_index;

            await db.execute(
                `UPDATE heroes SET 
                    hp = ?, max_hp = ?, attack = ?, defense = ?,
                    magic = ?, level = ?, xp = ?, unlocked_index = ?
                WHERE user_id = ?`,
                [
                    hero.hp, hero.maxHp, hero.attack, hero.defense,
                    hero.magic, hero.level, hero.xp,
                    Math.max(currentUnlocked, gameState.currentMonsterIndex),
                    userId
                ]
            );
        }
    }

    res.json({
        hero,
        monster,
        leveledUp,
        damage: result.damageDealt,
        healAmount: result.healAmount,
        selfHpCost: result.selfHpCost
    });
};

export const getHero = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    if (userId) {
        const [heroRows]: any = await db.execute(
            'SELECT * FROM heroes WHERE user_id = ?',
            [userId]
        );
        const hero = heroRows[0];

        const [moveRows]: any = await db.execute(
            'SELECT * FROM learned_moves WHERE hero_id = ?',
            [hero.id]
        );

        const heroClass = getHeroClass(hero.hero_class || 'knight');

        res.json({
            name: heroClass.name,
            sprite: heroClass.sprite,
            heroClass: heroClass.id,
            hp: hero.hp,
            maxHp: hero.max_hp,
            attack: hero.attack,
            defense: hero.defense,
            magic: hero.magic,
            level: hero.level,
            xp: hero.xp,
            unlockedIndex: hero.unlocked_index,
            runsCompleted: hero.runs_completed || 0,
            moves: heroClass.defaultMoves,
            learnedMoves: moveRows
        });
    } 
    else {
        res.json({
            ...gameState.hero,
            heroClass: 'knight',
            unlockedIndex: 0,
            learnedMoves: []
        });
    }
};

export const setCurrentMonster = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const monster = req.body.monster;
    const resume = req.body.resume === true;
    const heroState = req.body.hero;

    if (!monster) {
        res.status(400).json({ error: "Monster missing in request body" });
        return;
    }

    gameState.currentMonster = {
        ...monster,
        hp: resume ? monster.hp : monster.maxHp
    };

    gameState.battleState = defaultBattleState();

    if (userId) {
        const [rows]: any = await db.execute(
            'SELECT * FROM heroes WHERE user_id = ?',
            [userId]
        );

        if (rows.length === 0) {
            if (resume && heroState) {
                gameState.hero = { ...gameState.hero, ...heroState };
            } 
            else {
                gameState.hero.hp = gameState.hero.maxHp;
            }
            res.json({ ok: true });
            return;
        }

        const dbHero = rows[0];
        const heroClass = getHeroClass(dbHero.hero_class || 'knight');

        gameState.hero = {
            ...gameState.hero,
            name: heroClass.name,
            sprite: heroClass.sprite,
            hp: resume && heroState ? heroState.hp : dbHero.max_hp,
            maxHp: dbHero.max_hp,
            attack: dbHero.attack,
            defense: dbHero.defense,
            magic: dbHero.magic,
            level: dbHero.level,
            xp: dbHero.xp
        };
    } 
    else {
        if (resume && heroState) {
            gameState.hero.hp = heroState.hp;
        } 
        else {
            gameState.hero.hp = gameState.hero.maxHp;
        }
    }

    res.json({ ok: true });
};

export const saveLearnedMove = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const move = req.body.move;

    if (!userId) {
        res.json({ ok: true }); 
        return;
    }

    const [heroRows]: any = await db.execute(
        'SELECT id FROM heroes WHERE user_id = ?',
        [userId]
    );
    const heroId = heroRows[0].id;

    await db.execute(
        'INSERT INTO learned_moves (hero_id, name, type, effect, value, duration) VALUES (?, ?, ?, ?, ?, ?)',
        [heroId, move.name, move.type, move.effect, move.value, move.duration ?? null]
    );

    res.json({ ok: true });
};

export const chooseStat = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { stat } = req.body;

    const hero = gameState.hero;

    let classId = 'knight';
    if (userId) {
        const [rows]: any = await db.execute(
            'SELECT hero_class FROM heroes WHERE user_id = ?',
            [userId]
        );
        if (rows.length > 0) classId = rows[0].hero_class || 'knight';
    }
    const gains = getHeroClass(classId).statGains;

    if (stat === 'attack') hero.attack += gains.attack;
    else if (stat === 'defense') hero.defense += gains.defense;
    else if (stat === 'maxHp') { 
        hero.maxHp += gains.maxHp; 
        hero.hp = hero.maxHp; 
    }
    else if (stat === 'magic') hero.magic += gains.magic;

    if (userId) {
        await db.execute(
            `UPDATE heroes SET hp = ?, max_hp = ?, attack = ?, defense = ?, magic = ? WHERE user_id = ?`,
            [hero.hp, hero.maxHp, hero.attack, hero.defense, hero.magic, userId]
        );
    }

    res.json({ hero });
};

export const resetHero = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    if (!userId) {
        gameState.hero = {
            ...gameState.hero,
            hp: 110,
            maxHp: 110,
            attack: 10,
            defense: 7,
            magic: 5,
            level: 1,
            xp: 0
        };
        gameState.currentMonsterIndex = 0;
        res.json({ ok: true });
        return;
    }

    await db.execute(
        `UPDATE heroes SET 
            hp = 110, max_hp = 110, attack = 10, defense = 7,
            magic = 5, level = 1, xp = 0, unlocked_index = 0,
            runs_completed = 0
        WHERE user_id = ?`,
        [userId]
    );

    const [heroRows]: any = await db.execute(
        'SELECT id FROM heroes WHERE user_id = ?',
        [userId]
    );
    if (heroRows.length > 0) {
        await db.execute('DELETE FROM learned_moves WHERE hero_id = ?', [heroRows[0].id]);
    }

    gameState.currentMonsterIndex = 0;
    res.json({ ok: true });
};

export const continueFighting = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    if (!userId) {
        gameState.currentMonsterIndex = 0;
        gameState.hero.hp = gameState.hero.maxHp;
        res.json({ ok: true });
        return;
    }

    await db.execute(
        `UPDATE heroes SET 
            runs_completed = runs_completed + 1,
            unlocked_index = 0,
            hp = max_hp
        WHERE user_id = ?`,
        [userId]
    );

    const [rows]: any = await db.execute(
        'SELECT runs_completed FROM heroes WHERE user_id = ?',
        [userId]
    );

    gameState.currentMonsterIndex = 0;
    gameState.hero.hp = gameState.hero.maxHp;

    res.json({ ok: true, runsCompleted: rows[0].runs_completed });
};

export const getEnvironments = (req: Request, res: Response) => {
    res.json({ environments });
};

export const setEnvironment = (req: Request, res: Response) => {
    const { environmentId } = req.body;
    const env = environments.find(e => e.id === environmentId);
    
    if (!env) {
        res.status(400).json({ error: "Invalid environment" });
        return;
    }

    gameState.currentEnvironment = env;
    res.json({ ok: true, environment: env });
};

export const getHeroClasses = (req: Request, res: Response) => {
    res.json({ classes: heroClasses });
};

export const selectHeroClass = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { classId } = req.body;
    
    const heroClass = getHeroClass(classId);
    if (!heroClass) {
        res.status(400).json({ error: "Invalid hero class" });
        return;
    }

    gameState.hero = {
        name: heroClass.name,
        sprite: heroClass.sprite,
        hp: heroClass.baseStats.hp,
        maxHp: heroClass.baseStats.maxHp,
        attack: heroClass.baseStats.attack,
        defense: heroClass.baseStats.defense,
        magic: heroClass.baseStats.magic,
        level: 1,
        xp: 0,
        moves: heroClass.defaultMoves
    };
    gameState.currentMonsterIndex = 0;

    if (userId) {
        await db.execute(
            `UPDATE heroes SET 
                hp = ?, max_hp = ?, attack = ?, defense = ?,
                magic = ?, level = 1, xp = 0, unlocked_index = 0,
                runs_completed = 0, hero_class = ?
            WHERE user_id = ?`,
            [
                heroClass.baseStats.hp, heroClass.baseStats.maxHp,
                heroClass.baseStats.attack, heroClass.baseStats.defense,
                heroClass.baseStats.magic, heroClass.id, userId
            ]
        );

        const [heroRows]: any = await db.execute(
            'SELECT id FROM heroes WHERE user_id = ?',
            [userId]
        );
        if (heroRows.length > 0) {
            await db.execute('DELETE FROM learned_moves WHERE hero_id = ?', [heroRows[0].id]);
        }
    }

    res.json({ ok: true, hero: gameState.hero, heroClass });
};