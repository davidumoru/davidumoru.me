import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./StackedToasts.module.css";

type Toast = { id: number; text: string };

const MESSAGES = [
  "Saved to library",
  "Link copied",
  "Message sent",
  "Changes published",
  "Added to queue",
];

const MAX = 3;
const GAP = 14;
const PEEK = 16;
const DURATION = 4000;
const SWIPE_DISTANCE = 45;
const SWIPE_VELOCITY = 0.11;

const INSTANT: Transition = { duration: 0 };
const SPRING: Transition = { type: "spring", stiffness: 350, damping: 30 };
const FADE: Transition = { duration: 0.2, ease: "easeOut" };

function useDocumentHidden() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return hidden;
}

function ToastItem({
  toast,
  depth,
  expanded,
  height,
  paused,
  reduce,
  onDismiss,
  onMeasure,
}: {
  toast: Toast;
  depth: number;
  expanded: boolean;
  height: number;
  paused: boolean;
  reduce: boolean;
  onDismiss: (id: number) => void;
  onMeasure?: (h: number) => void;
}) {
  const remaining = useRef(DURATION);
  const swipe = useMotionValue(0);
  const drag = useRef<{ y: number; time: number } | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [swiped, setSwiped] = useState(false);

  useEffect(() => {
    if (paused || swiping) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(
      () => onDismiss(toast.id),
      remaining.current,
    );
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [paused, swiping, toast.id, onDismiss]);

  const y = expanded ? -depth * (height + GAP) : -depth * PEEK;
  const scale = expanded ? 1 : 1 - depth * 0.05;
  const motionTransition = reduce ? INSTANT : SPRING;

  const exit = swiped
    ? { y: y + height, opacity: 0, transition: reduce ? INSTANT : FADE }
    : depth > 0
      ? { opacity: 0, transition: reduce ? INSTANT : FADE }
      : { y: 24, opacity: 0, transition: motionTransition };

  return (
    <motion.div
      className={styles.slot}
      initial={{ y: 24, opacity: 0, scale: 0.9 }}
      animate={{ y, scale, opacity: 1 }}
      exit={exit}
      transition={motionTransition}
    >
      <motion.div
        className={styles.toast}
        ref={(node) => {
          if (node && onMeasure) onMeasure(node.offsetHeight);
        }}
        style={{ y: swipe }}
        data-swiping={swiping || undefined}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { y: event.clientY, time: Date.now() };
          setSwiping(true);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const delta = event.clientY - drag.current.y;
          swipe.set(delta >= 0 ? delta : -Math.sqrt(-delta) * 2);
        }}
        onPointerUp={() => {
          if (!drag.current) return;
          const distance = swipe.get();
          const velocity =
            distance / Math.max(Date.now() - drag.current.time, 1);
          drag.current = null;
          setSwiping(false);
          if (distance >= SWIPE_DISTANCE || velocity > SWIPE_VELOCITY) {
            setSwiped(true);
            onDismiss(toast.id);
          } else {
            animate(swipe, 0, motionTransition);
          }
        }}
        onPointerCancel={() => {
          drag.current = null;
          setSwiping(false);
          animate(swipe, 0, motionTransition);
        }}
      >
        {toast.text}
      </motion.div>
    </motion.div>
  );
}

export default function StackedToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(56);
  const counter = useRef(0);
  const hidden = useDocumentHidden();
  const reduce = useReducedMotion() ?? false;

  const add = () => {
    const id = ++counter.current;
    const text = MESSAGES[id % MESSAGES.length];
    setToasts((t) => [...t, { id, text }].slice(-MAX));
  };

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const count = toasts.length;
  const regionHeight =
    count === 0
      ? 0
      : expanded
        ? height + (count - 1) * (height + GAP)
        : height + (count - 1) * PEEK;

  return (
    <div className={styles.stage}>
      <button type="button" className={styles.add} onClick={add}>
        Add toast
      </button>
      <div
        className={styles.region}
        style={{ height: regionHeight }}
        role="status"
        aria-live="polite"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <AnimatePresence>
          {toasts.map((toast, i) => {
            const depth = count - 1 - i;
            return (
              <ToastItem
                key={toast.id}
                toast={toast}
                depth={depth}
                expanded={expanded}
                height={height}
                paused={expanded || hidden}
                reduce={reduce}
                onDismiss={dismiss}
                onMeasure={depth === 0 ? setHeight : undefined}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
