import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./CardCarousel.module.css";

const TRANSITION: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 26,
  mass: 1.2,
};
const INSTANT: Transition = { duration: 0 };

const COUNT = 5;
const GAP = 16;
const LIFT = 32;
const FLICK = 0.3;
const DRAG_SLOP = 5;
const EDGE_RESISTANCE = 0.35;

export default function CardCarousel() {
  const [active, setActive] = useState(0);
  const [card, setCard] = useState(240);
  const reduce = useReducedMotion() ?? false;
  const items = Array.from({ length: COUNT });

  const viewport = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const drag = useRef<{ start: number; base: number; time: number } | null>(
    null,
  );
  const moved = useRef(false);

  const step = card + GAP;
  const target = (index: number) => -(index * step + card / 2);

  useLayoutEffect(() => {
    const element = first.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setCard(element.offsetWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const placed = useRef(false);

  useLayoutEffect(() => {
    if (placed.current) return;
    placed.current = true;
    x.set(target(active));
  });

  const shown = useRef(active);

  useEffect(() => {
    if (drag.current) return;
    if (shown.current === active) {
      x.set(target(active));
      return;
    }
    shown.current = active;
    const controls = animate(x, target(active), reduce ? INSTANT : TRANSITION);
    return () => controls.stop();
  }, [active, card]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    drag.current = { start: event.clientX, base: x.get(), time: Date.now() };
    moved.current = false;
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const delta = event.clientX - drag.current.start;
    if (!moved.current && Math.abs(delta) > DRAG_SLOP) {
      moved.current = true;
      viewport.current?.setPointerCapture(event.pointerId);
    }
    if (!moved.current) return;
    let next = drag.current.base + delta;
    const min = target(COUNT - 1);
    const max = target(0);
    if (next > max) next = max + (next - max) * EDGE_RESISTANCE;
    if (next < min) next = min + (next - min) * EDGE_RESISTANCE;
    x.set(next);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    drag.current = null;
    if (!current || !moved.current) return;
    const delta = event.clientX - current.start;
    const velocity = delta / Math.max(Date.now() - current.time, 1);
    let next = Math.round(-(x.get() + card / 2) / step);
    if (Math.abs(velocity) > FLICK && next === active) {
      next = active + (velocity < 0 ? 1 : -1);
    }
    next = Math.min(COUNT - 1, Math.max(0, next));
    if (next === active) {
      animate(x, target(active), reduce ? INSTANT : TRANSITION);
    }
    setActive(next);
  }

  return (
    <div
      className={styles.root}
      role="region"
      aria-roledescription="carousel"
      aria-label="Cards"
    >
      <div
        ref={viewport}
        className={styles.viewport}
        style={{ "--lift": `${LIFT}px` } as React.CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(event) => {
          if (moved.current) {
            event.preventDefault();
            event.stopPropagation();
            moved.current = false;
          }
        }}
      >
        <motion.div className={styles.row} style={{ x, gap: GAP }}>
          {items.map((_, i) => (
            <motion.button
              type="button"
              key={i}
              ref={i === 0 ? first : undefined}
              className={styles.card}
              data-active={active === i}
              aria-roledescription="slide"
              aria-current={active === i || undefined}
              initial={false}
              animate={{
                y: active === i ? 0 : -LIFT,
                scale: active === i ? 1 : 0.9,
                opacity: active === i ? 1 : 0.6,
              }}
              transition={reduce ? INSTANT : TRANSITION}
              onClick={() => setActive(i)}
              aria-label={`${i + 1} of ${COUNT}`}
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
            transition={reduce ? INSTANT : TRANSITION}
            onClick={() => setActive(i)}
            aria-label={`Go to card ${i + 1}`}
            aria-current={active === i || undefined}
          />
        ))}
      </div>
      <span className={styles.srOnly} aria-live="polite">
        {`Card ${active + 1} of ${COUNT}`}
      </span>
    </div>
  );
}
