import { useState } from "react";
import { motion, AnimatePresence, type Transition } from "motion/react";
import styles from "./Accordion.module.css";

const EASE: Transition = { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] };

const ITEMS = [
  {
    q: "What is this?",
    a: "A small accordion that animates its height open and closed, so panels never just snap into place.",
  },
  {
    q: "Can more than one open?",
    a: "Not here. Opening a panel closes the others, which keeps the layout settling somewhere calm.",
  },
  {
    q: "How does the height animate?",
    a: "Each panel grows from a height of zero to its natural height, measured on the fly as it expands.",
  },
];

export default function Accordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={styles.root}>
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className={styles.item} key={i}>
            <button
              type="button"
              className={styles.header}
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <motion.span
                className={styles.chevron}
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={EASE}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className={styles.panel}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={EASE}
                >
                  <p className={styles.answer}>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
