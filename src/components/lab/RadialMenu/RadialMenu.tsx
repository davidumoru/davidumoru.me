import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon, type IconName } from "../../ui/Icon/Icon.tsx";
import styles from "./RadialMenu.module.css";

const RADIUS = 96;

const ACTIONS: { name: IconName; label: string }[] = [
  { name: "copy", label: "Duplicate" },
  { name: "link", label: "Copy link" },
  { name: "star", label: "Favourite" },
  { name: "mail", label: "Send" },
  { name: "lock", label: "Lock" },
];

// A half turn, so the fan opens upward and never lands under the button.
const angleFor = (index: number) =>
  ((180 + (index * 180) / (ACTIONS.length - 1)) * Math.PI) / 180;

const spring = { type: "spring", stiffness: 460, damping: 30 } as const;

export default function RadialMenu() {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        {ACTIONS.map((action, index) => {
          const angle = angleFor(index);

          return (
            <motion.button
              key={action.label}
              type="button"
              className={styles.action}
              aria-label={action.label}
              tabIndex={open ? 0 : -1}
              initial={false}
              animate={{
                x: open ? Math.cos(angle) * RADIUS : 0,
                y: open ? Math.sin(angle) * RADIUS : 0,
                scale: open ? 1 : 0.4,
                opacity: open ? 1 : 0,
              }}
              transition={{
                ...spring,
                delay: shouldReduceMotion
                  ? 0
                  : (open ? index : ACTIONS.length - 1 - index) * 0.035,
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name={action.name} size={18} />
            </motion.button>
          );
        })}

        <motion.button
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-label={open ? "Close actions" : "Open actions"}
          onClick={() => setOpen((current) => !current)}
          animate={{ rotate: open ? 135 : 0 }}
          transition={spring}
          whileTap={{ scale: 0.94 }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
