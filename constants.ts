import { Monster } from './types';

export const DAILY_MAINTENANCE_CALORIES = 2200;

export const MONSTERS: Monster[] = [
  {
    id: 1,
    name: "Gluttonous Slime",
    totalHp: 2000,
    description: "A sticky blob formed from late-night snacks.",
    image: "droplet",
    color: "text-green-400"
  },
  {
    id: 2,
    name: "Sugar Goblin",
    totalHp: 3500,
    description: "Sneaky thief that steals your energy.",
    image: "ghost",
    color: "text-pink-400"
  },
  {
    id: 3,
    name: "Carb Wolf",
    totalHp: 5000,
    description: "Hunts in packs, usually found near bakeries.",
    image: "dog",
    color: "text-gray-400"
  },
  {
    id: 4,
    name: "Burger Orc",
    totalHp: 7500,
    description: "Heavy hitter with layers of cheese armor.",
    image: "hammer",
    color: "text-orange-500"
  },
  {
    id: 5,
    name: "Pizza Troll",
    totalHp: 10000,
    description: "Regenerates health if you eat just one more slice.",
    image: "frown",
    color: "text-yellow-500"
  },
  {
    id: 6,
    name: "Soda Dragon",
    totalHp: 14000,
    description: "Breathes fizzy syrup fire.",
    image: "flame",
    color: "text-red-500"
  },
  {
    id: 7,
    name: "The Lord of Excess",
    totalHp: 28000,
    description: "The final boss of metabolic resistance.",
    image: "skull",
    color: "text-purple-500"
  }
];

// Total HP = 70,000