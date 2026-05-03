import { Move } from "../models/move";

export const moves: Record<string, Move> = {
  // KNIGHT
  slash: {
    name: "Slash",
    type: "physical",
    effect: "damage",
    value: 12,
    description: "Physical attack that scales off Attack, reduced by target's Defense."
  },
  shieldUp: {
    name: "Shield Up",
    type: "physical",
    effect: "buff",
    stat: "defense",
    value: 6,
    duration: 2,
    description: "Raises your Defense for 2 turns."
  },
  battleCry: {
    name: "Battle Cry",
    type: "physical",
    effect: "buff",
    stat: "attack",
    value: 6,
    duration: 2,
    description: "Raises your Attack for 2 turns."
  },
  secondWind: {
    name: "Second Wind",
    type: "magic",
    effect: "heal",
    value: 22,
    description: "Heals for a moderate amount. Scales off Magic."
  },

  // GOBLIN WARRIOR
  rustyBlade: {
    name: "Rusty Blade",
    type: "physical",
    effect: "damage",
    value: 8,
    description: "Moderate physical damage. Scales off Attack, reduced by Defense."
  },
  dirtyKick: {
    name: "Dirty Kick",
    type: "physical",
    effect: "debuff",
    stat: "defense",
    value: 2,
    duration: 2,
    secondaryDamage: 4,
    description: "Light physical damage and lowers target's Defense for 2 turns."
  },
  frenzy: {
    name: "Frenzy",
    type: "physical",
    effect: "buff",
    stat: "attack",
    value: 4,
    duration: 2,
    description: "Raises Attack for 2 turns."
  },
  headbutt: {
    name: "Headbutt",
    type: "physical",
    effect: "damage",
    value: 12,
    description: "Heavy physical damage. Scales off Attack, reduced by Defense."
  },

  // GOBLIN MAGE
  firebolt: {
    name: "Firebolt",
    type: "magic",
    effect: "damage",
    value: 8,
    description: "Moderate magic damage. Scales off Magic."
  },
  arcaneSurge: {
    name: "Arcane Surge",
    type: "magic",
    effect: "buff",
    stat: "magic",
    value: 4,
    duration: 2,
    description: "Raises Magic for 2 turns."
  },
  manaDrain: {
    name: "Mana Drain",
    type: "magic",
    effect: "debuff",
    stat: "magic",
    value: 2,
    duration: 2,
    secondaryDamage: 4,
    description: "Light magic damage and lowers target's Magic for 2 turns."
  },
  hexShield: {
    name: "Hex Shield",
    type: "magic",
    effect: "buff",
    stat: "defense",
    value: 4,
    duration: 2,
    description: "Raises Defense for 2 turns."
  },

  // WITCH 
  shadowBolt: {
    name: "Shadow Bolt",
    type: "magic",
    effect: "damage",
    value: 11,
    description: "Heavy magic damage. Scales off Magic."
  },
  drainLife: {
    name: "Drain Life",
    type: "magic",
    effect: "heal",
    value: 5,
    secondaryDamage: 5,
    description: "Deals light damage and heals for the same amount. Scales off Magic."
  },
  curse: {
    name: "Curse",
    type: "magic",
    effect: "debuff",
    stat: "attack",
    value: 3,
    duration: 2,
    description: "Lowers the target's Attack for 2 turns."
  },
  darkPact: {
    name: "Dark Pact",
    type: "magic",
    effect: "buff",
    stat: "magic",
    value: 5,
    duration: 2,
    selfHpCost: 8,
    description: "Raises Magic for 2 turns at the cost of some HP."
  },

  // GIANT SPIDER
  bite: {
    name: "Bite",
    type: "physical",
    effect: "damage",
    value: 11,
    description: "Moderate physical damage. Scales off Attack, reduced by Defense."
  },
  webThrow: {
    name: "Web Throw",
    type: "physical",
    effect: "debuff",
    stat: "defense",
    value: 4,
    duration: 2,
    secondaryDamage: 5,
    description: "Light physical damage and lowers target's Defense for 2 turns."
  },
  pounce: {
    name: "Pounce",
    type: "physical",
    effect: "damage",
    value: 16,
    description: "Heavy physical damage. Scales off Attack, reduced by Defense."
  },
  skitter: {
    name: "Skitter",
    type: "physical",
    effect: "buff",
    stat: "defense",
    value: 5,
    duration: 2,
    description: "Raises Defense for 2 turns."
  },

  // DRAGON
  flameBreath: {
    name: "Flame Breath",
    type: "magic",
    effect: "damage",
    value: 11,
    description: "Heavy magic damage. Scales off Magic."
  },
  clawSwipe: {
    name: "Claw Swipe",
    type: "physical",
    effect: "damage",
    value: 12,
    description: "Moderate physical damage. Scales off Attack, reduced by Defense."
  },
  intimidate: {
    name: "Intimidate",
    type: "physical",
    effect: "debuff",
    stat: "attack",
    value: 4,
    duration: 2,
    description: "Lowers the target's Attack for 2 turns."
  },
  dragonScales: {
    name: "Dragon Scales",
    type: "physical",
    effect: "buff",
    stat: "defense",
    value: 6,
    duration: 2,
    description: "Raises Defense for 2 turns."
  },
  // SKELETON
  boneCrush: {
    name: "Bone Crush",
    type: "physical",
    effect: "damage",
    value: 10,
    description: "Heavy bone-shattering blow. Scales off Attack."
  },
  rattlingHowl: {
    name: "Rattling Howl",
    type: "physical",
    effect: "debuff",
    stat: "attack",
    value: 3,
    duration: 2,
    description: "Frightening howl that lowers target's Attack for 2 turns."
  },
  reanimate: {
    name: "Reanimate",
    type: "magic",
    effect: "heal",
    value: 12,
    description: "Dark magic restores some HP. Scales off Magic."
  },
  rustyArmor: {
    name: "Rusty Armor",
    type: "physical",
    effect: "buff",
    stat: "defense",
    value: 4,
    duration: 2,
    description: "Raises Defense for 2 turns."
  },

  // DIRE WOLF
  fangBite: {
    name: "Fang Bite",
    type: "physical",
    effect: "damage",
    value: 12,
    description: "Sharp fanged bite. Scales off Attack."
  },
  howlOfTheWild: {
    name: "Howl of the Wild",
    type: "physical",
    effect: "buff",
    stat: "attack",
    value: 5,
    duration: 2,
    description: "Primal howl that raises Attack for 2 turns."
  },
  hamstring: {
    name: "Hamstring",
    type: "physical",
    effect: "debuff",
    stat: "defense",
    value: 3,
    duration: 2,
    secondaryDamage: 6,
    description: "Tendon-cutting bite. Light damage and lowers target's Defense for 2 turns."
  },
  packTactics: {
    name: "Pack Tactics",
    type: "physical",
    effect: "debuff",
    stat: "attack",
    value: 4,
    duration: 2,
    description: "Strategic positioning. Lowers target's Attack for 2 turns."
  },

  // DEMON
  hellfire: {
    name: "Hellfire",
    type: "magic",
    effect: "damage",
    value: 13,
    description: "Burning hellfire engulfs the target. Scales off Magic."
  },
  demonicFrenzy: {
    name: "Demonic Frenzy",
    type: "physical",
    effect: "buff",
    stat: "attack",
    value: 6,
    duration: 2,
    description: "Demonic rage raises Attack for 2 turns."
  },
  searingMark: {
    name: "Searing Mark",
    type: "magic",
    effect: "debuff",
    stat: "defense",
    value: 3,
    duration: 2,
    secondaryDamage: 6,
    description: "Burning mark deals damage and lowers target's Defense for 2 turns."
  },
  infernalPact: {
    name: "Infernal Pact",
    type: "magic",
    effect: "buff",
    stat: "magic",
    value: 5,
    duration: 2,
    selfHpCost: 6,
    description: "Sacrifice HP to raise Magic for 2 turns at the cost of some HP."
  }
};