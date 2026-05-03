import { Move } from "../models/move";
import { moves } from "./moves";

export interface HeroClass {
  id: string;
  name: string;
  description: string;
  sprite: string;
  baseStats: {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    magic: number;
  };
  statGains: {
    attack: number;
    defense: number;
    magic: number;
    maxHp: number;
  };
  defaultMoves: Move[];
}

// Mage moves
const arcaneBolt: Move = {
  name: "Arcane Bolt",
  type: "magic",
  effect: "damage",
  value: 14,
  description: "Magic damage. Scales off Magic."
};

const manaShield: Move = {
  name: "Mana Shield",
  type: "magic",
  effect: "buff",
  stat: "defense",
  value: 5,
  duration: 2,
  description: "Raises your Defense for 2 turns."
};

const empower: Move = {
  name: "Empower",
  type: "magic",
  effect: "buff",
  stat: "magic",
  value: 5,
  duration: 2,
  description: "Raises your Magic for 2 turns."
};

const healingLight: Move = {
  name: "Healing Light",
  type: "magic",
  effect: "heal",
  value: 15,
  description: "Heals for a moderate amount. Scales off Magic."
};

// Rogue moves
const quickStrike: Move = {
  name: "Quick Strike",
  type: "physical",
  effect: "damage",
  value: 11,
  description: "Fast physical attack. Scales off Attack."
};

const sharpenBlades: Move = {
  name: "Sharpen Blades",
  type: "physical",
  effect: "buff",
  stat: "attack",
  value: 6,
  duration: 2,
  description: "Raises your Attack for 2 turns."
};

const cripple: Move = {
  name: "Cripple",
  type: "physical",
  effect: "debuff",
  stat: "defense",
  value: 4,
  duration: 2,
  secondaryDamage: 5,
  description: "Light damage and lowers target's Defense for 2 turns."
};

const bandage: Move = {
  name: "Bandage",
  type: "magic",
  effect: "heal",
  value: 10,
  description: "Quick self-heal. Scales off Magic."
};

export const heroClasses: HeroClass[] = [
  {
    id: "knight",
    name: "Knight",
    description: "Balanced warrior. Good defense and survivability.",
    sprite: "/assets/pictures/heroes/knight.png",
    baseStats: { hp: 110, maxHp: 110, attack: 10, defense: 7, magic: 5 },
    statGains: { attack: 3, defense: 3, magic: 3, maxHp: 15 },
    defaultMoves: [moves.slash, moves.shieldUp, moves.battleCry, moves.secondWind]
  },
  {
    id: "mage",
    name: "Mage",
    description: "Glass cannon. High magic damage but fragile.",
    sprite: "/assets/pictures/heroes/mage.png",
    baseStats: { hp: 90, maxHp: 90, attack: 5, defense: 4, magic: 12 },
    statGains: { attack: 2, defense: 2, magic: 5, maxHp: 10 },
    defaultMoves: [arcaneBolt, manaShield, empower, healingLight]
  },
  {
    id: "rogue",
    name: "Rogue",
    description: "Damage dealer. Strong physical attacks but low HP.",
    sprite: "/assets/pictures/heroes/rogue.png",
    baseStats: { hp: 95, maxHp: 95, attack: 14, defense: 5, magic: 3 },
    statGains: { attack: 5, defense: 2, magic: 1, maxHp: 10 },
    defaultMoves: [quickStrike, sharpenBlades, cripple, bandage]
  }
];

export function getHeroClass(id: string): HeroClass {
  return heroClasses.find(c => c.id === id) || heroClasses[0];
}