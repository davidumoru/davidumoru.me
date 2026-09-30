import { useRef, useState, type KeyboardEvent } from "react";
import { Reorder, useReducedMotion, type Transition } from "motion/react";
import styles from "./ReorderList.module.css";

const INITIAL = ["Research", "Design", "Prototype", "Build", "Ship"];

const INSTANT: Transition = { duration: 0 };
const SETTLE: Transition = { type: "spring", duration: 0.35, bounce: 0.15 };
const LIFT = {
  scale: 1.03,
  boxShadow: "0 0 0 1px rgb(0 0 0 / 0.06), 0 12px 24px -8px rgb(0 0 0 / 0.18)",
};

export default function ReorderList() {
  const [items, setItems] = useState(INITIAL);
  const [dragging, setDragging] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const list = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion() ?? false;

  function move(item: string, by: number) {
    const from = items.indexOf(item);
    const to = from + by;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    next.splice(from, 1);
    next.splice(to, 0, item);
    setItems(next);
    setAnnouncement(`${item} moved to position ${to + 1} of ${items.length}`);
  }

  function onKeyDown(event: KeyboardEvent, item: string) {
    if (!event.altKey) return;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      move(item, -1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      move(item, 1);
    }
  }

  return (
    <div className={styles.root}>
      <Reorder.Group
        ref={list}
        axis="y"
        values={items}
        onReorder={setItems}
        className={styles.list}
        aria-label="Project steps"
      >
        {items.map((item, index) => (
          <Reorder.Item
            key={item}
            value={item}
            className={styles.item}
            data-dragging={dragging === item || undefined}
            tabIndex={0}
            aria-roledescription="sortable item"
            aria-description="Hold Alt and use the arrow keys to move"
            dragConstraints={list}
            dragElastic={0.12}
            transition={reduce ? INSTANT : SETTLE}
            whileDrag={reduce ? undefined : LIFT}
            onDragStart={() => setDragging(item)}
            onDragEnd={() => setDragging(null)}
            onKeyDown={(event) => onKeyDown(event, item)}
          >
            <span className={styles.index}>{index + 1}</span>
            <span className={styles.label}>{item}</span>
            <svg className={styles.grip} viewBox="0 0 10 16" aria-hidden="true">
              {[3, 8, 13].flatMap((y) =>
                [3, 7].map((x) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" />
                )),
              )}
            </svg>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <span className={styles.srOnly} aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
