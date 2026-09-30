import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./ElasticCounter.module.css";

const MIN = 0;
const MAX = 99;
const HOLD_DELAY = 400;
const REPEAT_START = 140;
const REPEAT_MIN = 45;
const PULL = 10;

const INSTANT: Transition = { duration: 0 };
const ROLL: Transition = { type: "spring", duration: 0.4, bounce: 0.2 };
const SNAP: Transition = { type: "spring", duration: 0.5, bounce: 0.55 };

function Glyph({ plus }: { plus?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3.5 8h9" />
      {plus && <path d="M8 3.5v9" />}
    </svg>
  );
}

export default function ElasticCounter() {
  const [value, setValue] = useState(0);
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion() ?? false;
  const display = useAnimationControls();
  const repeat = useRef<ReturnType<typeof setTimeout>>(undefined);
  const current = useRef(value);
  current.current = value;

  useEffect(() => () => clearTimeout(repeat.current), []);

  function step(by: number) {
    const next = current.current + by;
    if (next < MIN || next > MAX) {
      stop();
      if (!reduce) {
        display.start({
          y: [0, -by * PULL, 0],
          scaleY: [1, 1.06, 1],
          transition: { ...SNAP, times: [0, 0.25, 1] },
        });
      }
      return;
    }
    setDir(by);
    setValue(next);
  }

  function start(by: number) {
    step(by);
    let delay = REPEAT_START;
    const tick = () => {
      step(by);
      delay = Math.max(REPEAT_MIN, delay * 0.85);
      repeat.current = setTimeout(tick, delay);
    };
    repeat.current = setTimeout(tick, HOLD_DELAY);
  }

  function stop() {
    clearTimeout(repeat.current);
  }

  const digits = value.toString().split("");
  const roll = reduce ? INSTANT : ROLL;

  const control = (by: number, label: string) => {
    const blocked = by < 0 ? value <= MIN : value >= MAX;
    return (
      <button
        type="button"
        className={styles.button}
        data-blocked={blocked || undefined}
        aria-label={label}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          start(by);
        }}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            step(by);
          }
        }}
        onContextMenu={(event) => event.preventDefault()}
      >
        <Glyph plus={by > 0} />
      </button>
    );
  };

  return (
    <div className={styles.root}>
      {control(-1, "Decrease")}
      <motion.div className={styles.display} animate={display}>
        <span className={styles.srOnly} role="status">
          {value}
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          {digits.map((char, index) => (
            <motion.span
              key={`place-${digits.length - index}`}
              layout
              className={styles.column}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={roll}
              aria-hidden="true"
            >
              <span className={styles.window}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={char}
                    className={styles.digit}
                    initial={{ y: dir > 0 ? "100%" : "-100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: dir > 0 ? "-100%" : "100%" }}
                    transition={roll}
                  >
                    {char}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.div>
      {control(1, "Increase")}
    </div>
  );
}
