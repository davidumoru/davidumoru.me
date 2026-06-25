import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import styles from "./StatusMorph.module.css";

const MORPH: Transition = { duration: 0.6, ease: [0.41, 1.03, 0.6, 1.03] };

const ICON_SPRING: Transition = {
  type: "spring",
  mass: 4,
  stiffness: 800,
  damping: 80,
  restDelta: 0.0001,
};

function Spinner() {
  return (
    <svg width="22" height="22" viewBox="0 0 23 23" fill="none">
      <g className={styles.spinner}>
        <path
          d="M21.313 11.4062C21.313 16.8775 16.8777 21.3128 11.4065 21.3128"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          opacity="0.1"
          d="M11.4065 21.313C16.8777 21.313 21.313 16.8777 21.313 11.4065C21.313 5.93529 16.8777 1.5 11.4065 1.5C5.93529 1.5 1.5 5.93529 1.5 11.4065C1.5 16.8777 5.93529 21.313 11.4065 21.313Z"
          stroke="currentColor"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
      <path
        d="M20.9016 10.4508C20.9016 4.67899 16.2226 0 10.4508 0C4.67899 0 0 4.67899 0 10.4508C0 16.2226 4.67899 20.9016 10.4508 20.9016C16.2226 20.9016 20.9016 16.2226 20.9016 10.4508Z"
        fill="currentColor"
      />
      <path
        d="M6.09631 10.9828L8.83539 13.6439L14.8053 7.83789"
        stroke="black"
        strokeOpacity="0.85"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const states: { label: string; color: string; icon: ReactNode }[] = [
  { label: "Saving Changes", color: "var(--blue-9)", icon: <Spinner /> },
  { label: "Changes Saved", color: "var(--green-9)", icon: <Check /> },
];

function TextMorph({
  children,
  className,
  transition,
}: {
  children: string;
  className?: string;
  transition: Transition;
}) {
  const chars = useMemo(() => {
    const counts: Record<string, number> = {};
    return Array.from(children).map((char) => {
      const n = (counts[char] = (counts[char] ?? 0) + 1);
      return { key: `${char}__${n}`, char };
    });
  }, [children]);

  return (
    <span className={className}>
      <span className={styles.morph}>
        <AnimatePresence mode="popLayout" initial={false}>
          {chars.map(({ key, char }) => (
            <motion.span
              key={key}
              layout
              className={styles.char}
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={transition}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
    </span>
  );
}

export default function StatusMorph() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % states.length),
      2200,
    );
    return () => clearInterval(id);
  }, []);

  const state = states[index];

  return (
    <div className={styles.root}>
      <motion.div layout className={styles.action} transition={MORPH}>
        <span className={styles.iconWrapper}>
          <AnimatePresence initial={false}>
            <motion.span
              key={index}
              className={styles.icon}
              style={{ color: state.color }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6, transition: ICON_SPRING }}
              transition={{ delay: 0.1, ...ICON_SPRING }}
            >
              {state.icon}
            </motion.span>
          </AnimatePresence>
        </span>
        <TextMorph className={styles.label} transition={MORPH}>
          {state.label}
        </TextMorph>
      </motion.div>
    </div>
  );
}
