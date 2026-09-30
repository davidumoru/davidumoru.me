import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import styles from "./SlidingTabs.module.css";

const TABS = ["Overview", "Activity", "Members", "Settings"];
const PILL_RADIUS = 12;

const INSTANT: Transition = { duration: 0 };
const SLIDE: Transition = { type: "spring", stiffness: 400, damping: 32 };

export default function SlidingTabs() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion() ?? false;
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const next = (index + TABS.length) % TABS.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: TABS.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]);
  }

  return (
    <div className={styles.stage}>
      <div
        className={styles.bar}
        role="tablist"
        aria-label="Project"
        onKeyDown={onKeyDown}
      >
        {TABS.map((label, i) => (
          <button
            key={label}
            ref={(node) => {
              tabs.current[i] = node;
            }}
            type="button"
            role="tab"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={styles.tab}
            data-active={i === active || undefined}
          >
            {i === active && (
              <motion.span
                layoutId="sliding-tabs-pill"
                className={styles.pill}
                style={{ borderRadius: PILL_RADIUS }}
                transition={reduce ? INSTANT : SLIDE}
              />
            )}
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
