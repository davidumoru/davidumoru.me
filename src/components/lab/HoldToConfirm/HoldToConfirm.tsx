import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./HoldToConfirm.module.css";

const HOLD_MS = 1600;
const RESET_MS = 1600;

const INSTANT: Transition = { duration: 0 };
const SWAP: Transition = { type: "spring", duration: 0.3, bounce: 0 };

const HOLD_LABEL = "Hold to delete";
const DONE_LABEL = "Deleted";

export default function HoldToConfirm() {
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), RESET_MS);
    return () => clearTimeout(id);
  }, [done]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function start() {
    if (done || holding) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      setHolding(false);
      setDone(true);
    }, HOLD_MS);
  }

  function cancel() {
    clearTimeout(timer.current);
    setHolding(false);
  }

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.button}
        style={{ "--hold": `${HOLD_MS}ms` } as CSSProperties}
        data-holding={holding || undefined}
        data-done={done || undefined}
        aria-label={done ? DONE_LABEL : HOLD_LABEL}
        onPointerDown={(event) => event.button === 0 && start()}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onKeyDown={(event) => {
          if ((event.key === " " || event.key === "Enter") && !event.repeat) {
            event.preventDefault();
            start();
          }
        }}
        onKeyUp={(event) => {
          if (event.key === " " || event.key === "Enter") cancel();
        }}
        onBlur={cancel}
        onContextMenu={(event) => event.preventDefault()}
      >
        <span aria-hidden="true">{HOLD_LABEL}</span>
        <span className={styles.fill} aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={done ? "done" : "hold"}
              initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={reduce ? INSTANT : SWAP}
            >
              {done ? DONE_LABEL : HOLD_LABEL}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </div>
  );
}
