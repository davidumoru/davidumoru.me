import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./LikeButton.module.css";

const HEART_POP: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 15,
  mass: 0.7,
};

const HEART =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const COLORS = [
  "var(--red-9)",
  "var(--tomato-9)",
  "var(--pink-9)",
  "var(--amber-9)",
  "var(--orange-9)",
];

const RINGS = [
  { count: 6, radius: 26, size: 6 },
  { count: 8, radius: 40, size: 4 },
];

const PARTICLES = RINGS.flatMap((ring, r) =>
  Array.from({ length: ring.count }, (_, i) => {
    const angle =
      (i / ring.count) * Math.PI * 2 + (r ? Math.PI / ring.count : 0);
    return {
      x: Math.cos(angle) * ring.radius,
      y: Math.sin(angle) * ring.radius,
      size: ring.size,
      color: COLORS[(i + r) % COLORS.length],
    };
  }),
);

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(128);
  const [pulse, setPulse] = useState(0);
  const reduceMotion = useReducedMotion();

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    if (next) setPulse((p) => p + 1);
  };

  return (
    <div className={styles.root}>
      <motion.button
        type="button"
        className={styles.button}
        data-liked={liked}
        onClick={toggle}
        aria-pressed={liked}
        aria-label="Like"
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <span className={styles.heartWrap}>
          <svg
            className={styles.outline}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d={HEART}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>

          <motion.svg
            className={styles.fill}
            viewBox="0 0 24 24"
            aria-hidden="true"
            initial={false}
            animate={{ scale: liked ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : HEART_POP}
          >
            <path d={HEART} fill="currentColor" />
          </motion.svg>

          {liked && !reduceMotion && (
            <span className={styles.burst} key={pulse} aria-hidden="true">
              <motion.span
                className={styles.halo}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              {PARTICLES.map((p, i) => (
                <motion.span
                  key={i}
                  className={styles.particle}
                  style={{ width: p.size, height: p.size, background: p.color }}
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{ x: p.x, y: p.y, scale: [0, 1, 0] }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    times: [0, 0.35, 1],
                  }}
                />
              ))}
            </span>
          )}
        </span>

        <span className={styles.countWrap}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={count}
              className={styles.count}
              initial={
                reduceMotion ? false : { y: liked ? 12 : -12, opacity: 0 }
              }
              animate={{ y: 0, opacity: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { y: liked ? -12 : 12, opacity: 0 }
              }
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
    </div>
  );
}
