import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
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
const SPRING: Transition = { type: "spring", stiffness: 350, damping: 30 };

function ToastItem({
  toast,
  depth,
  expanded,
  height,
  paused,
  onDismiss,
  onMeasure,
}: {
  toast: Toast;
  depth: number;
  expanded: boolean;
  height: number;
  paused: boolean;
  onDismiss: (id: number) => void;
  onMeasure?: (h: number) => void;
}) {
  useEffect(() => {
    if (paused) return;
    const tm = window.setTimeout(() => onDismiss(toast.id), DURATION);
    return () => window.clearTimeout(tm);
  }, [paused, toast.id, onDismiss]);

  const y = expanded ? -depth * (height + GAP) : -depth * PEEK;
  const scale = expanded ? 1 : 1 - depth * 0.05;

  return (
    <motion.div
      className={styles.toast}
      ref={(node) => {
        if (node && onMeasure) onMeasure(node.offsetHeight);
      }}
      initial={{ y: 24, opacity: 0, scale: 0.9 }}
      animate={{ y, scale, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={SPRING}
    >
      {toast.text}
    </motion.div>
  );
}

export default function StackedToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(56);
  const counter = useRef(0);

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
                paused={expanded}
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
