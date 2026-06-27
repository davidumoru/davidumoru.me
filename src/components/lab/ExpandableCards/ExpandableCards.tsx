import { useState } from "react";
import { motion, AnimatePresence, type Transition } from "motion/react";
import styles from "./ExpandableCards.module.css";

const LAYOUT: Transition = { type: "spring", duration: 0.32, bounce: 0.12 };

const CARDS = [
  {
    id: "spring",
    title: "Springs",
    sub: "Physics over duration",
    body: "Springs carry velocity, so a gesture interrupted halfway keeps its momentum instead of snapping back to the start.",
  },
  {
    id: "easing",
    title: "Easing",
    sub: "The shape of the motion",
    body: "Ease-out for things entering the screen, ease-in-out for things already on it. The curve is where the personality lives.",
  },
  {
    id: "layout",
    title: "Layout",
    sub: "Animate the unanimatable",
    body: "Layout animation tweens between two states of the DOM, so size, position, and order can move without hand-written keyframes.",
  },
];

export default function ExpandableCards() {
  const [id, setId] = useState<string | null>(null);
  const active = CARDS.find((c) => c.id === id);

  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        {CARDS.map((c) => (
          <motion.li
            key={c.id}
            layoutId={`card-${c.id}`}
            className={styles.card}
            onClick={() => setId(c.id)}
            transition={LAYOUT}
          >
            <motion.h3
              layoutId={`title-${c.id}`}
              className={styles.title}
              transition={LAYOUT}
            >
              {c.title}
            </motion.h3>
            <motion.p
              layoutId={`sub-${c.id}`}
              className={styles.sub}
              transition={LAYOUT}
            >
              {c.sub}
            </motion.p>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {active && (
          <div className={styles.overlay}>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setId(null)}
            />
            <motion.div
              layoutId={`card-${active.id}`}
              className={`${styles.card} ${styles.expanded}`}
              transition={LAYOUT}
            >
              <motion.h3
                layoutId={`title-${active.id}`}
                className={styles.title}
                transition={LAYOUT}
              >
                {active.title}
              </motion.h3>
              <motion.p
                layoutId={`sub-${active.id}`}
                className={styles.sub}
                transition={LAYOUT}
              >
                {active.sub}
              </motion.p>
              <motion.p
                className={styles.body}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {active.body}
              </motion.p>
              <button
                type="button"
                className={styles.close}
                onClick={() => setId(null)}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
