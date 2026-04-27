"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moves = void 0;
exports.moves = {
    // KNIGHT MOVES
    slash: {
        name: "Slash",
        type: "physical",
        effect: "damage",
        value: 10
    },
    shieldUp: {
        name: "Shield Up",
        type: "physical",
        effect: "buff",
        value: 5,
        duration: 2
    },
    battleCry: {
        name: "Battle Cry",
        type: "physical",
        effect: "buff",
        value: 5,
        duration: 2
    },
    secondWind: {
        name: "Second Wind",
        type: "magic",
        effect: "heal",
        value: 10
    },
    // WITCH
    shadowBolt: {
        name: "Shadow Bolt",
        type: "magic",
        effect: "damage",
        value: 14
    },
    drainLife: {
        name: "Drain Life",
        type: "magic",
        effect: "heal",
        value: 8
    },
    curse: {
        name: "Curse",
        type: "magic",
        effect: "debuff",
        value: 3,
        duration: 2
    },
    darkPact: {
        name: "Dark Pact",
        type: "magic",
        effect: "buff",
        value: 6,
        duration: 2
    },
    // SPIDER
    bite: {
        name: "Bite",
        type: "physical",
        effect: "damage",
        value: 9
    },
    webThrow: {
        name: "Web Throw",
        type: "physical",
        effect: "debuff",
        value: 4,
        duration: 2
    },
    pounce: {
        name: "Pounce",
        type: "physical",
        effect: "damage",
        value: 15
    },
    skitter: {
        name: "Skitter",
        type: "physical",
        effect: "buff",
        value: 4,
        duration: 2
    },
    // DRAGON
    flameBreath: {
        name: "Flame Breath",
        type: "magic",
        effect: "damage",
        value: 18
    },
    clawSwipe: {
        name: "Claw Swipe",
        type: "physical",
        effect: "damage",
        value: 12
    },
    intimidate: {
        name: "Intimidate",
        type: "physical",
        effect: "debuff",
        value: 3,
        duration: 2
    },
    dragonScales: {
        name: "Dragon Scales",
        type: "physical",
        effect: "buff",
        value: 5,
        duration: 2
    },
    // GOBLIN WARRIOR
    rustyBlade: {
        name: "Rusty Blade",
        type: "physical",
        effect: "damage",
        value: 10
    },
    dirtyKick: {
        name: "Dirty Kick",
        type: "physical",
        effect: "debuff",
        value: 3,
        duration: 2
    },
    frenzy: {
        name: "Frenzy",
        type: "physical",
        effect: "buff",
        value: 6,
        duration: 2
    },
    headbutt: {
        name: "Headbutt",
        type: "physical",
        effect: "damage",
        value: 16
    },
    // GOBLIN MAGE
    firebolt: {
        name: "Firebolt",
        type: "magic",
        effect: "damage",
        value: 12
    },
    arcaneSurge: {
        name: "Arcane Surge",
        type: "magic",
        effect: "buff",
        value: 5,
        duration: 2
    },
    manaDrain: {
        name: "Mana Drain",
        type: "magic",
        effect: "debuff",
        value: 3,
        duration: 2
    },
    hexShield: {
        name: "Hex Shield",
        type: "magic",
        effect: "buff",
        value: 5,
        duration: 2
    }
};
