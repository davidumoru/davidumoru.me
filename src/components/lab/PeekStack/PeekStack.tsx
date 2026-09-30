import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import styles from "./PeekStack.module.css";

type Card = { id: number; title: string; body: string; action: string };

const CARDS: Card[] = [
  {
    id: 1,
    title: "Dark mode is here",
    body: "Easier on the eyes after sunset. Switch it on from settings.",
    action: "Try it",
  },
  {
    id: 2,
    title: "Your weekly recap",
    body: "Three new stamps and a mixtape landed while you were away.",
    action: "Take a look",
  },
  {
    id: 3,
    title: "Invite a friend",
    body: "Share your link and you both get a month on the house.",
    action: "Copy link",
  },
  {
    id: 4,
    title: "New in the lab",
    body: "A form that splits apart around whichever field you are in.",
    action: "Open it",
  },
];

const STEP = 11;
const HINT = 24;
const REVEAL = 42;
const STRIP = 26;
const FADE_MS = 280;
const RETURN_MS = 1400;

const INSTANT: Transition = { duration: 0 };
const MOVE: Transition = { type: "spring", duration: 0.42, bounce: 0.08 };
const LIFT: Transition = { duration: 0.2, ease: [0.23, 1, 0.32, 1] };
const FADE: Transition = { duration: FADE_MS / 1000, ease: "easeOut" };
const DROP: Transition = { duration: 0.22, ease: [0.55, 0, 1, 0.45] };

type Hover = "none" | "card" | "peek";

export default function PeekStack() {
  const [queue, setQueue] = useState(() => CARDS.map((card) => card.id));
  const [hover, setHover] = useState<Hover>("none");
  const [found, setFound] = useState(false);
  const [armed, setArmed] = useState(false);
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const lift =
    hover === "peek" ? REVEAL : hover === "card" && !found ? HINT : STEP;
  const offset = armed || gone ? 0 : lift;

  const advance = () => {
    if (leaving !== null || gone) return;
    setLeaving(queue[0]);
    setQueue(([first, ...rest]) => [...rest, first]);
    later(() => setLeaving(null), reduce ? 0 : FADE_MS);
  };

  const dismiss = () => {
    setArmed(false);
    setGone(true);
    later(() => setGone(false), RETURN_MS);
  };

  const peekTo = (next: Hover) => {
    setHover(next);
    if (next === "peek") setFound(true);
  };

  const next = CARDS.find((card) => card.id === queue[1]);

  return (
    <div className={styles.root}>
      <div
        className={styles.deck}
        onPointerLeave={() => {
          setHover("none");
          setFound(false);
        }}
      >
        {CARDS.map((card) => {
          const depth = queue.indexOf(card.id);
          const isLeaving = card.id === leaving;
          const front = depth === 0 && !isLeaving;

          let animate;
          let transition: Transition;

          if (isLeaving) {
            animate = { y: 0, marginLeft: 0, marginRight: 0, opacity: 0, scale: 1 };
            transition = reduce ? INSTANT : { opacity: FADE, default: INSTANT };
          } else if (gone) {
            animate = front
              ? { y: "110%", marginLeft: 0, marginRight: 0, opacity: 1, scale: 1 }
              : { y: 0, marginLeft: 0, marginRight: 0, opacity: 0, scale: 1 };
            transition = reduce ? INSTANT : front ? DROP : FADE;
          } else {
            const inset = Math.min(depth, 2) * STEP;
            const y =
              depth === 0
                ? 0
                : armed
                  ? 10
                  : depth === 1
                    ? -offset
                    : -2 * STEP;
            animate = {
              y,
              marginLeft: inset,
              marginRight: inset,
              opacity: depth <= 2 ? 1 : 0,
              scale: front && armed ? 0.96 : 1,
            };
            transition = reduce
              ? INSTANT
              : depth >= 3
                ? INSTANT
                : depth === 1 && leaving !== null
                  ? { ...MOVE, delay: 0.18 }
                  : depth === 1
                    ? { y: LIFT, default: MOVE }
                    : front
                      ? { scale: { ...LIFT, delay: armed ? 0.1 : 0 }, default: MOVE }
                      : MOVE;
          }

          return (
            <motion.article
              key={card.id}
              className={styles.card}
              data-depth={isLeaving ? "leaving" : Math.min(depth, 3)}
              data-reveal={depth === 1 && hover === "peek" && !armed ? true : undefined}
              aria-hidden={!front || undefined}
              style={{ zIndex: isLeaving ? 9 : 10 - depth }}
              initial={false}
              animate={animate}
              transition={transition}
              onPointerEnter={front ? () => peekTo("card") : undefined}
            >
              <button
                type="button"
                className={styles.close}
                aria-label="Dismiss all"
                tabIndex={front ? 0 : -1}
                onPointerEnter={() => setArmed(true)}
                onPointerLeave={() => setArmed(false)}
                onFocus={() => setArmed(true)}
                onBlur={() => setArmed(false)}
                onClick={dismiss}
              >
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <h3 className={styles.title}>{card.title}</h3>
              <p className={styles.body}>{card.body}</p>
              <button
                type="button"
                className={styles.action}
                tabIndex={front ? 0 : -1}
              >
                {card.action}
              </button>
            </motion.article>
          );
        })}

        {!gone && next && (
          <motion.button
            type="button"
            className={styles.hit}
            aria-label={`Show next: ${next.title}`}
            initial={false}
            animate={{ y: -(offset + STRIP), height: offset + STRIP }}
            transition={reduce ? INSTANT : LIFT}
            onPointerEnter={() => peekTo("peek")}
            onPointerLeave={() => setHover((current) => (current === "peek" ? "none" : current))}
            onFocus={() => peekTo("peek")}
            onBlur={() => setHover("none")}
            onClick={advance}
          />
        )}
      </div>
    </div>
  );
}
