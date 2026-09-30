import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import styles from "./RadialMenu.module.css";

const RADIUS = 88;
const STAGGER = 0.03;

const ACTIONS: { label: string; d: string[] }[] = [
  {
    label: "Duplicate",
    d: [
      "M10 8h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z",
      "M4 16a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2",
    ],
  },
  {
    label: "Copy link",
    d: [
      "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7",
      "M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
    ],
  },
  {
    label: "Favourite",
    d: [
      "m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9Z",
    ],
  },
  {
    label: "Send",
    d: [
      "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
      "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
    ],
  },
  {
    label: "Lock",
    d: [
      "M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z",
      "M7 11V7a5 5 0 0 1 10 0v4",
    ],
  },
];

const INSTANT: Transition = { duration: 0 };
const SPRING: Transition = { type: "spring", duration: 0.4, bounce: 0.2 };

const angleFor = (index: number) =>
  ((180 + (index * 180) / (ACTIONS.length - 1)) * Math.PI) / 180;

export default function RadialMenu() {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        {ACTIONS.map((action, index) => {
          const angle = angleFor(index);
          const order = open ? index : ACTIONS.length - 1 - index;
          return (
            <motion.button
              key={action.label}
              type="button"
              className={styles.action}
              aria-label={action.label}
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
              initial={false}
              animate={{
                x: open ? Math.cos(angle) * RADIUS : 0,
                y: open ? Math.sin(angle) * RADIUS : 0,
                scale: open ? 1 : 0.5,
                opacity: open ? 1 : 0,
                filter: open ? "blur(0px)" : "blur(4px)",
              }}
              transition={
                reduce ? INSTANT : { ...SPRING, delay: order * STAGGER }
              }
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {action.d.map((path) => (
                  <path key={path} d={path} />
                ))}
              </svg>
            </motion.button>
          );
        })}

        <button
          ref={trigger}
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-label={open ? "Close actions" : "Open actions"}
          onClick={() => setOpen((current) => !current)}
        >
          <motion.svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            initial={false}
            animate={{ rotate: open ? 45 : 0 }}
            transition={reduce ? INSTANT : SPRING}
          >
            <path d="M12 5v14M5 12h14" />
          </motion.svg>
        </button>
      </div>
    </div>
  );
}
