import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./LikeButton.module.css";

const HEART =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const INSTANT: Transition = { duration: 0 };
const POP: Transition = { type: "spring", duration: 0.45, bounce: 0.5 };
const DEFLATE: Transition = { type: "spring", duration: 0.25, bounce: 0 };
const ROLL: Transition = { type: "spring", duration: 0.35, bounce: 0.15 };
const HALO: Transition = { duration: 0.45, ease: [0.19, 1, 0.22, 1] };
const SPARK: Transition = { duration: 0.5, ease: [0.19, 1, 0.22, 1] };

const SPARKS = Array.from({ length: 7 }, (_, i) => {
  const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
  const reach = i % 2 ? 15 : 19;
  return {
    x: Math.cos(angle) * reach,
    y: Math.sin(angle) * reach,
    size: i % 2 ? 3 : 4,
  };
});

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(128);
  const [pulse, setPulse] = useState(0);
  const reduce = useReducedMotion() ?? false;

  function toggle() {
    const next = !liked;
    setLiked(next);
    setCount((value) => value + (next ? 1 : -1));
    if (next) setPulse((value) => value + 1);
  }

  const digits = count.toString().split("");
  const up = liked;

  return (
    <div className={styles.root}>
      <motion.button
        type="button"
        className={styles.button}
        data-liked={liked || undefined}
        onClick={toggle}
        aria-pressed={liked}
        aria-label={`Like, ${count} likes`}
        variants={{ pressed: { scale: 0.97 } }}
        whileTap={reduce ? undefined : "pressed"}
      >
        <motion.span
          className={styles.heart}
          variants={{ pressed: { scale: 0.8 } }}
        >
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
            transition={reduce ? INSTANT : liked ? POP : DEFLATE}
          >
            <path d={HEART} fill="currentColor" />
          </motion.svg>

          {liked && !reduce && (
            <span className={styles.burst} key={pulse} aria-hidden="true">
              <motion.span
                className={styles.halo}
                initial={{ scale: 0.4, opacity: 0.5 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={HALO}
              />
              {SPARKS.map((spark, index) => (
                <motion.span
                  key={index}
                  className={styles.spark}
                  style={{ width: spark.size, height: spark.size }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: spark.x,
                    y: spark.y,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ ...SPARK, delay: 0.05, times: [0, 0.4, 1] }}
                />
              ))}
            </span>
          )}
        </motion.span>

        <span className={styles.count} aria-hidden="true">
          {digits.map((char, index) => (
            <span
              key={`place-${digits.length - index}`}
              className={styles.window}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={char}
                  className={styles.digit}
                  initial={reduce ? false : { y: up ? "100%" : "-100%" }}
                  animate={{ y: "0%" }}
                  exit={reduce ? { opacity: 0 } : { y: up ? "-100%" : "100%" }}
                  transition={reduce ? INSTANT : ROLL}
                >
                  {char}
                </motion.span>
              </AnimatePresence>
            </span>
          ))}
        </span>
      </motion.button>
    </div>
  );
}
