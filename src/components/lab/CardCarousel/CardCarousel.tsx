import { useState } from "react";
import { motion, type Transition } from "motion/react";
import styles from "./CardCarousel.module.css";

const TRANSITION: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 26,
  mass: 1.2,
};

const COUNT = 5;
const CARD = 240;
const GAP = 16;
const STEP = CARD + GAP;

export default function CardCarousel() {
  const [active, setActive] = useState(0);
  const items = Array.from({ length: COUNT });

  return (
    <div className={styles.root}>
      <div className={styles.viewport}>
        <motion.div
          className={styles.row}
          initial={false}
          animate={{ x: -(active * STEP + CARD / 2) }}
          transition={TRANSITION}
        >
          {items.map((_, i) => (
            <motion.button
              type="button"
              key={i}
              className={styles.card}
              data-active={active === i}
              initial={false}
              animate={{
                y: active === i ? 0 : -32,
                scale: active === i ? 1 : 0.9,
                opacity: active === i ? 1 : 0.6,
              }}
              transition={TRANSITION}
              onClick={() => setActive(i)}
              aria-label={`Card ${i + 1}`}
            />
          ))}
        </motion.div>
      </div>

      <div className={styles.nav}>
        {items.map((_, i) => (
          <motion.button
            type="button"
            key={i}
            className={styles.dot}
            data-active={active === i}
            initial={false}
            animate={{ width: active === i ? 40 : 10 }}
            transition={TRANSITION}
            onClick={() => setActive(i)}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
