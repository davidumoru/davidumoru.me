import { useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
} from "motion/react";
import styles from "./HoldToConfirm.module.css";

const HOLD_MS = 1300;

function LockIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export default function HoldToConfirm() {
  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const [done, setDone] = useState(false);

  const start = () => {
    controls.current = animate(progress, 1, {
      duration: HOLD_MS / 1000,
      ease: "linear",
      onComplete: () => setDone(true),
    });
  };

  const cancel = () => {
    if (done) return;
    controls.current?.stop();
    animate(progress, 0, { duration: 0.3, ease: "easeOut" });
  };

  const onDown = () => {
    if (done) {
      setDone(false);
      progress.set(0);
      return;
    }
    start();
  };

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.button}
        data-done={done}
        onPointerDown={onDown}
        onPointerUp={cancel}
        onPointerLeave={cancel}
      >
        <svg className={styles.ring} viewBox="0 0 100 100" aria-hidden="true">
          <circle className={styles.track} cx="50" cy="50" r="46" />
          <motion.circle
            className={styles.progress}
            cx="50"
            cy="50"
            r="46"
            style={{ pathLength: progress }}
          />
        </svg>
        <span className={styles.icon}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={done ? "check" : "lock"}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {done ? <CheckIcon /> : <LockIcon />}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </div>
  );
}
