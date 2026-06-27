import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import styles from "./MorphingIcons.module.css";

const MORPH: Transition = { type: "spring", duration: 0.4, bounce: 0 };

type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity?: number;
};

const P: Line = { x1: 10, y1: 10, x2: 10, y2: 10, opacity: 0 };

const ICONS: { name: string; lines: [Line, Line, Line] }[] = [
  {
    name: "menu",
    lines: [
      { x1: 3, y1: 6, x2: 17, y2: 6 },
      { x1: 3, y1: 10, x2: 17, y2: 10 },
      { x1: 3, y1: 14, x2: 17, y2: 14 },
    ],
  },
  {
    name: "close",
    lines: [
      { x1: 5, y1: 5, x2: 15, y2: 15 },
      { x1: 15, y1: 5, x2: 5, y2: 15 },
      P,
    ],
  },
  {
    name: "plus",
    lines: [
      { x1: 10, y1: 4, x2: 10, y2: 16 },
      { x1: 4, y1: 10, x2: 16, y2: 10 },
      P,
    ],
  },
  {
    name: "minus",
    lines: [P, { x1: 4, y1: 10, x2: 16, y2: 10 }, P],
  },
  {
    name: "check",
    lines: [
      { x1: 4, y1: 11, x2: 8, y2: 15 },
      { x1: 8, y1: 15, x2: 16, y2: 5 },
      P,
    ],
  },
  {
    name: "arrow",
    lines: [
      { x1: 4, y1: 10, x2: 16, y2: 10 },
      { x1: 11, y1: 5, x2: 16, y2: 10 },
      { x1: 11, y1: 15, x2: 16, y2: 10 },
    ],
  },
];

export default function MorphingIcons() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const icon = ICONS[index];

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setIndex((v) => (v + 1) % ICONS.length)}
        aria-label={`${icon.name} icon, tap to morph`}
      >
        <svg viewBox="0 0 20 20" className={styles.icon} fill="none">
          {icon.lines.map((line, k) => (
            <motion.line
              key={k}
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              initial={false}
              animate={{
                x1: line.x1,
                y1: line.y1,
                x2: line.x2,
                y2: line.y2,
                opacity: line.opacity ?? 1,
              }}
              transition={reduceMotion ? { duration: 0 } : MORPH}
            />
          ))}
        </svg>
      </button>
    </div>
  );
}
