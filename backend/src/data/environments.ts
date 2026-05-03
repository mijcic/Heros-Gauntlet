export interface Environment {
  id: string;
  name: string;
  description: string;
  sprite: string;
  effects: {
    physicalDamageMultiplier?: number;
    magicDamageMultiplier?: number;
    damageMultiplier?: number;       
    healMultiplier?: number;
    defenseMultiplier?: number;
  };
}

export const environments: Environment[] = [
  {
    id: "field",
    name: "Open Field",
    description: "Physical attacks +25%, magic -15%",
    sprite: "/assets/pictures/environments/field.jpg",
    effects: {
      physicalDamageMultiplier: 1.25,
      magicDamageMultiplier: 0.85
    }
  },
  {
    id: "forest",
    name: "Misty Forest",
    description: "Magic attacks +25%, physical -15%",
    sprite: "/assets/pictures/environments/forest.jpg",
    effects: {
      magicDamageMultiplier: 1.25,
      physicalDamageMultiplier: 0.85
    }
  },
  {
    id: "mountain",
    name: "Mountain Peak",
    description: "All damage +30%, healing reduced by 40%",
    sprite: "/assets/pictures/environments/mountain.jpg",
    effects: {
      damageMultiplier: 1.30,
      healMultiplier: 0.60
    }
  },
  {
    id: "cave",
    name: "Dark Cave",
    description: "Defense +25%, all damage -15%",
    sprite: "/assets/pictures/environments/cave.jpg",
    effects: {
      defenseMultiplier: 1.25,
      damageMultiplier: 0.85
    }
  },
  {
    id: "volcano",
    name: "Volcano",
    description: "All damage +30%, defense -20%",
    sprite: "/assets/pictures/environments/volcano.jpg",
    effects: {
      damageMultiplier: 1.30,
      defenseMultiplier: 0.80
    }
  },
  {
    id: "temple",
    name: "Sacred Temple",
    description: "Healing +50%, all damage -20%",
    sprite: "/assets/pictures/environments/temple.jpg",
    effects: {
      healMultiplier: 1.50,
      damageMultiplier: 0.80
    }
  }
];