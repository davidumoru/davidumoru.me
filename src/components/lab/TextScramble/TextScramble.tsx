import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./TextScramble.module.css";

const CHARS = "!<>-_\\/[]{}=+*^?#";
const TEXT = "Design Engineer";

const STAGGER_MS = 45;
const JITTER_MS = 160;
const LEAD_MS = 120;
const TICK_MS = 45;
const START_DELAY_MS = 450;

const noise = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export default function TextScramble() {
  const [display, setDisplay] = useState(TEXT);
  const reduce = useReducedMotion() ?? false;
  const raf = useRef(0);

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (reduce) {
      setDisplay(TEXT);
      return;
    }

    const chars = [...TEXT];
    const settleAt = chars.map(
      (_, i) => LEAD_MS + i * STAGGER_MS + Math.random() * JITTER_MS,
    );
    const noiseFor = chars.map(noise);
    const start = performance.now();
    let lastTick = -Infinity;

    const frame = (now: number) => {
      const elapsed = now - start;
      if (elapsed - lastTick >= TICK_MS) {
        lastTick = elapsed;
        chars.forEach((char, i) => {
          if (char !== " " && elapsed < settleAt[i]) noiseFor[i] = noise();
        });
      }

      let done = true;
      const out = chars
        .map((char, i) => {
          if (char === " " || elapsed >= settleAt[i]) return char;
          done = false;
          return noiseFor[i];
        })
        .join("");

      setDisplay(out);
      if (!done) raf.current = requestAnimationFrame(frame);
    };

    raf.current = requestAnimationFrame(frame);
  }, [reduce]);

  useEffect(() => {
    const timer = window.setTimeout(run, START_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [run]);

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.word}
        aria-label={TEXT}
        onPointerEnter={run}
        onFocus={run}
        onClick={run}
      >
        <span aria-hidden="true">{display}</span>
      </button>
    </div>
  );
}
