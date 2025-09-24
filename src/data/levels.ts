export type BrickSpec = {
  x: number;
  y: number;
  hits: number;
  color?: string;
  powerup?: "multi" | "big" | "sticky" | "laser" | null;
  image?: string;
};

export type Level = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Normal" | "Hard" | "Insane";
  thumbnail: string;
  bricks: BrickSpec[];
};

const randomImg = (seed: number) => `https://picsum.photos/800/300?random=${seed}`;

const POWERUPS = ["multi", "big", "sticky", "laser"] as const;
type PU = (typeof POWERUPS)[number];

export const levels: Level[] = [
  {
    id: "1",
    title: "Sunrise Break",
    description:
      "A gentle introduction—low density bricks and slow ball speed. Great for warming up, with bright golden bricks.",
    difficulty: "Easy",
    thumbnail: randomImg(101),
    bricks: (() => {
      const bricks: BrickSpec[] = [];
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 8; col++) {
          bricks.push({
            x: col,
            y: row,
            hits: 1,
            color: ["#FDE68A", "#FCA5A5", "#FBCFE8", "#C7F9CC"][row % 4],
            powerup: Math.random() < 0.06 ? (POWERUPS[Math.floor(Math.random() * POWERUPS.length)] as PU) : null,
            image: randomImg(201 + row * 8 + col),
          });
        }
      }
      return bricks;
    })(),
  },
  {
    id: "2",
    title: "Cobalt Formation",
    description:
      "Bricks sit in staggered rows with some two-hit bricks. Watch out for narrow lanes.",
    difficulty: "Normal",
    thumbnail: randomImg(102),
    bricks: (() => {
      const bricks: BrickSpec[] = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 9; col++) {
          if ((row + col) % 2 === 0) {
            bricks.push({
              x: col,
              y: row,
              hits: Math.random() < 0.25 ? 2 : 1,
              color: ["#93C5FD", "#7DD3FC", "#60A5FA"][row % 3],
              powerup: Math.random() < 0.07 ? (POWERUPS[Math.floor(Math.random() * POWERUPS.length)] as PU) : null,
            });
          }
        }
      }
      return bricks;
    })(),
  },
  {
    id: "3",
    title: "Emerald Labyrinth",
    description:
      "A denser layout with several 3-hit bricks; precise aiming required.",
    difficulty: "Hard",
    thumbnail: randomImg(103),
    bricks: (() => {
      const bricks: BrickSpec[] = [];
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 10; col++) {
          bricks.push({
            x: col,
            y: row,
            hits: row % 3 === 0 ? 3 : row % 2 === 0 ? 2 : 1,
            color: ["#BBF7D0", "#86EFAC", "#4ADE80"][row % 3],
            powerup: Math.random() < 0.06 ? (Math.random() < 0.5 ? ("sticky" as PU) : ("laser" as PU)) : null,
          });
        }
      }
      return bricks;
    })(),
  },
  {
    id: "4",
    title: "Neon Grid",
    description:
      "Bright neon bricks arranged in a challenging grid with narrow gaps.",
    difficulty: "Normal",
    thumbnail: randomImg(104),
    bricks: (() => {
      const bricks: BrickSpec[] = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 11; col++) {
          if (col % 2 === 0 || row % 2 === 0) {
            bricks.push({
              x: col,
              y: row,
              hits: Math.random() < 0.15 ? 2 : 1,
              color: ["#F472B6", "#60A5FA", "#FDE68A"][col % 3],
              powerup: Math.random() < 0.05 ? (POWERUPS[Math.floor(Math.random() * POWERUPS.length)] as PU) : null,
            });
          }
        }
      }
      return bricks;
    })(),
  },
  {
    id: "5",
    title: "Volcanic Core",
    description:
      "Aggressive layout with several hard bricks and sporadic powerups—fast ball recommended.",
    difficulty: "Hard",
    thumbnail: randomImg(105),
    bricks: (() => {
      const bricks: BrickSpec[] = [];
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 9; col++) {
          bricks.push({
            x: col,
            y: row,
            hits: Math.random() < 0.2 ? 3 : Math.random() < 0.25 ? 2 : 1,
            color: ["#F97316", "#FB923C", "#EF4444"][row % 3],
            powerup: Math.random() < 0.07 ? (Math.random() < 0.5 ? ("laser" as PU) : ("multi" as PU)) : null,
          });
        }
      }
      return bricks;
    })(),
  },
  {
    id: "6",
    title: "Crystal Cascade",
    description:
      "A cascading formation requiring multi-ball strategies and careful paddle control.",
    difficulty: "Normal",
    thumbnail: randomImg(106),
    bricks: (() => {
      const bricks: BrickSpec[] = [];
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 12; col++) {
          if (col > row && col < 11 - row) {
            bricks.push({
              x: col,
              y: row,
              hits: Math.random() < 0.12 ? 2 : 1,
              color: ["#C7D2FE", "#A7F3D0", "#FDE68A"][row % 3],
              powerup: Math.random() < 0.06 ? (POWERUPS[Math.floor(Math.random() * POWERUPS.length)] as PU) : null,
            });
          }
        }
      }
      return bricks;
    })(),
  },
  {
    id: "7",
    title: "Midnight Fortress",
    description:
      "Tough bricks form walls and champions—use laser powerups to thin the defense.",
    difficulty: "Insane",
    thumbnail: randomImg(107),
    bricks: (() => {
      const bricks: BrickSpec[] = [];
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 13; col++) {
          const hits = Math.random() < 0.35 ? 3 : Math.random() < 0.3 ? 2 : 1;
          bricks.push({
            x: col,
            y: row,
            hits,
            color: ["#94A3B8", "#475569", "#0F172A"][row % 3],
            powerup: Math.random() < 0.05 ? ("laser" as PU) : null,
          });
        }
      }
      return bricks;
    })(),
  },
  {
    id: "8",
    title: "Aurora Finale",
    description:
      "A beautiful but demanding finale combining all mechanics—precision and powerups win the day.",
    difficulty: "Insane",
    thumbnail: randomImg(108),
    bricks: (() => {
      const bricks: BrickSpec[] = [];
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 14; col++) {
          if ((row + col) % 3 !== 0) {
            bricks.push({
              x: col,
              y: row,
              hits: Math.random() < 0.25 ? 3 : Math.random() < 0.25 ? 2 : 1,
              color: ["#A78BFA", "#60A5FA", "#34D399"][col % 3],
              powerup: Math.random() < 0.06 ? (POWERUPS[Math.floor(Math.random() * POWERUPS.length)] as PU) : null,
            });
          }
        }
      }
      return bricks;
    })(),
  },
];

export default levels;