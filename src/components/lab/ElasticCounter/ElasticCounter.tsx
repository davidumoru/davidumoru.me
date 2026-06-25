import { useState } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import styles from "./ElasticCounter.module.css";

const SPRING: Transition = { type: "spring", duration: 0.4, bounce: 0.2 };

export default function ElasticCounter() {
  const [value, setValue] = useState(0);
  const [dir, setDir] = useState(1);

  const step = (d: number) => {
    setDir(d);
    setValue((v) => v + d);
  };

  const digits = Math.abs(value).toString().split("");
  const columns = [
    ...(value < 0 ? [{ key: "sign", char: "−" }] : []),
    ...digits.map((char, i) => ({ key: `d${digits.length - 1 - i}`, char })),
  ];

  return (
    <div className={styles.stage}>
      <div className={styles.display}>
        <AnimatePresence mode="popLayout" initial={false}>
          {columns.map((col) => (
            <motion.span
              key={col.key}
              layout
              className={styles.col}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
            >
              <span className={styles.window}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={col.char}
                    className={styles.digit}
                    initial={{ y: dir > 0 ? "100%" : "-100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: dir > 0 ? "-100%" : "100%" }}
                    transition={SPRING}
                  >
                    {col.char}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => step(-1)}
          aria-label="Decrement"
        >
          −
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => step(1)}
          aria-label="Increment"
        >
          +
        </button>
      </div>
    </div>
  );
}
