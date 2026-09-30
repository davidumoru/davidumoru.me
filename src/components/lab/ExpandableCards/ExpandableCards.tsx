import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./ExpandableCards.module.css";

type Stop = { code: string; city: string; time: string };

type Flight = {
  id: string;
  date: string;
  duration: string;
  from: Stop;
  to: Stop;
  details: [string, string][];
};

const FLIGHTS: Flight[] = [
  {
    id: "los-lhr",
    date: "Fri, 3 Oct",
    duration: "6h 15m",
    from: { code: "LOS", city: "Lagos", time: "23:15" },
    to: { code: "LHR", city: "London", time: "05:30" },
    details: [
      ["Terminal", "2"],
      ["Gate", "E14"],
      ["Boarding", "22:35"],
      ["Seat", "32A"],
    ],
  },
  {
    id: "lhr-ams",
    date: "Mon, 6 Oct",
    duration: "1h 25m",
    from: { code: "LHR", city: "London", time: "09:40" },
    to: { code: "AMS", city: "Amsterdam", time: "12:05" },
    details: [
      ["Terminal", "4"],
      ["Gate", "11"],
      ["Boarding", "09:05"],
      ["Seat", "8C"],
    ],
  },
  {
    id: "ams-los",
    date: "Thu, 9 Oct",
    duration: "6h 25m",
    from: { code: "AMS", city: "Amsterdam", time: "10:25" },
    to: { code: "LOS", city: "Lagos", time: "16:50" },
    details: [
      ["Terminal", "3"],
      ["Gate", "F7"],
      ["Boarding", "09:40"],
      ["Seat", "21F"],
    ],
  },
];

const RADIUS = 14;

const INSTANT: Transition = { duration: 0 };
const LAYOUT: Transition = { type: "spring", duration: 0.5, bounce: 0.08 };
const REVEAL: Transition = { duration: 0.25, delay: 0.15, ease: "easeOut" };
const HIDE: Transition = { duration: 0.12, ease: "easeOut" };

function Route({ flight, reduce }: { flight: Flight; reduce: boolean }) {
  const layout = reduce ? INSTANT : LAYOUT;
  return (
    <>
      <motion.div
        layoutId={`route-${flight.id}`}
        layout="position"
        className={styles.route}
        transition={layout}
      >
        <span className={styles.code}>{flight.from.code}</span>
        <span className={styles.line} aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
          </svg>
        </span>
        <span className={styles.code}>{flight.to.code}</span>
      </motion.div>
      <motion.div
        layoutId={`meta-${flight.id}`}
        layout="position"
        className={styles.meta}
        transition={layout}
      >
        <span>{flight.from.city}</span>
        <span className={styles.date}>{flight.date}</span>
        <span>{flight.to.city}</span>
      </motion.div>
    </>
  );
}

export default function ExpandableCards() {
  const [id, setId] = useState<string | null>(null);
  const [lifted, setLifted] = useState<string | null>(null);
  const reduce = useReducedMotion() ?? false;
  const active = FLIGHTS.find((flight) => flight.id === id);
  const layout = reduce ? INSTANT : LAYOUT;

  function close() {
    setLifted(id);
    setId(null);
  }

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className={styles.root}>
      <ul className={styles.list} data-dimmed={active ? "" : undefined}>
        {FLIGHTS.map((flight) => (
          <li
            key={flight.id}
            className={styles.item}
            data-active={id === flight.id || undefined}
            data-lifted={lifted === flight.id || undefined}
          >
            <motion.button
              type="button"
              layoutId={`card-${flight.id}`}
              className={styles.card}
              style={{ borderRadius: RADIUS }}
              transition={layout}
              onClick={() => setId(flight.id)}
              onLayoutAnimationComplete={() => {
                if (!id) setLifted(null);
              }}
              aria-label={`${flight.from.city} to ${flight.to.city}, ${flight.date}`}
            >
              <Route flight={flight} reduce={reduce} />
            </motion.button>
          </li>
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
              transition={reduce ? INSTANT : { duration: 0.25 }}
              onClick={close}
            />
            <motion.div
              layoutId={`card-${active.id}`}
              className={`${styles.card} ${styles.expanded}`}
              style={{ borderRadius: RADIUS }}
              transition={layout}
              role="dialog"
              aria-modal="true"
              aria-label={`${active.from.city} to ${active.to.city}`}
            >
              <Route flight={active} reduce={reduce} />
              <motion.div
                className={styles.more}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: reduce ? INSTANT : REVEAL,
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(4px)",
                  transition: reduce ? INSTANT : HIDE,
                }}
              >
                <div className={styles.times}>
                  <span>{active.from.time}</span>
                  <span className={styles.duration}>{active.duration}</span>
                  <span>{active.to.time}</span>
                </div>
                <dl className={styles.details}>
                  {active.details.map(([term, value]) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={close}
                    autoFocus
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className={styles.primary}
                    onClick={close}
                  >
                    Check in
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
