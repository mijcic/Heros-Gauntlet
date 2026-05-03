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