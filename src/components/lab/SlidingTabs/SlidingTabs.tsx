import { useState } from "react";
import { motion } from "motion/react";
import styles from "./SlidingTabs.module.css";

const TABS = ["Overview", "Activity", "Members", "Settings"];

export default function SlidingTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.stage}>
      <div className={styles.bar}>
        {TABS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            className={styles.tab}
            data-active={i === active}
          >
            {i === active && (
              <motion.span
                layoutId="sliding-tabs-pill"
                className={styles.pill}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
