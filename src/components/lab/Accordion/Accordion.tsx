import { useId, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./Accordion.module.css";

const INSTANT: Transition = { duration: 0 };
const EASE: Transition = { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] };

const ITEMS = [
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrades apply straight away and you only pay the difference for the rest of the month. Downgrades kick in at your next billing date.",
  },
  {
    q: "What happens when my trial ends?",
    a: "Nothing is charged automatically. Your projects stay put, read-only, until you pick a plan.",
  },
  {
    q: "Do you offer refunds?",
    a: "Within 14 days of any payment, no questions asked. Reply to your receipt and we'll sort it.",
  },
  {
    q: "Can my team share one account?",
    a: "Invite them instead. Every plan includes three seats, and extra seats are billed monthly.",
  },
];

export default function Accordion() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion() ?? false;
  const base = useId();
  const transition = reduce ? INSTANT : EASE;

  return (
    <div className={styles.root}>
      {ITEMS.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${base}-button-${index}`;
        const panelId = `${base}-panel-${index}`;
        return (
          <div className={styles.item} key={item.q}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={buttonId}
                className={styles.header}
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span>{item.q}</span>
                <motion.span
                  className={styles.chevron}
                  initial={false}
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={transition}
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
                    aria-hidden="true"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={styles.panel}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transition}
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
