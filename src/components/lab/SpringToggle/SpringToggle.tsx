import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "motion/react";
import styles from "./SpringToggle.module.css";

const TRAVEL = 28;
const KNOB = 34;
const STRETCH = 12;

const INSTANT: Transition = { duration: 0 };
const LEAD: Transition = { type: "spring", duration: 0.34, bounce: 0.2 };
const TRAIL: Transition = { type: "spring", duration: 0.46, bounce: 0.16 };

export default function SpringToggle() {
  const [on, setOn] = useState(false);
  const [pressed, setPressed] = useState(false);
  const reduce = useReducedMotion() ?? false;

  const start = useMotionValue(0);
  const end = useMotionValue(KNOB);
  const width = useTransform(() => end.get() - start.get());

  useEffect(() => {
    const stretch = pressed && !reduce ? STRETCH : 0;
    const nextStart = on ? TRAVEL - stretch : 0;
    const nextEnd = on ? TRAVEL + KNOB : KNOB + stretch;
    const forward = nextEnd > end.get();
    const a = animate(
      start,
      nextStart,
      reduce ? INSTANT : forward ? TRAIL : LEAD,
    );
    const b = animate(end, nextEnd, reduce ? INSTANT : forward ? LEAD : TRAIL);
    return () => {
      a.stop();
      b.stop();
    };
  }, [on, pressed, reduce, start, end]);

  return (
    <div className={styles.root}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Spring toggle"
        className={styles.track}
        data-on={on || undefined}
        onClick={() => setOn((value) => !value)}
        onPointerDown={(event) => event.button === 0 && setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onKeyDown={(event) => event.key === " " && setPressed(true)}
        onKeyUp={() => setPressed(false)}
        onBlur={() => setPressed(false)}
      >
        <motion.span className={styles.knob} style={{ x: start, width }} />
      </button>
    </div>
  );
}
