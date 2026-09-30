import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import styles from "./MagnifyingDock.module.css";

const ITEMS = [
  "color-mix(in oklch, var(--gray-12) 78%, var(--background))",
  "color-mix(in oklch, var(--gray-12) 90%, var(--background))",
  "color-mix(in oklch, var(--gray-12) 72%, var(--background))",
  "color-mix(in oklch, var(--gray-12) 86%, var(--background))",
  "color-mix(in oklch, var(--gray-12) 75%, var(--background))",
  "color-mix(in oklch, var(--gray-12) 82%, var(--background))",
];

export default function MagnifyingDock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className={styles.root}>
      <div
        className={styles.dock}
        onPointerMove={(e) => mouseX.set(e.clientX)}
        onPointerLeave={() => mouseX.set(Infinity)}
      >
        {ITEMS.map((color, i) => (
          <DockItem key={i} mouseX={mouseX} color={color} />
        ))}
      </div>
    </div>
  );
}

function DockItem({
  mouseX,
  color,
}: {
  mouseX: MotionValue<number>;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeRaw = useTransform(distance, [-120, 0, 120], [44, 80, 44]);
  const size = useSpring(sizeRaw, { stiffness: 300, damping: 22, mass: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={styles.item}
      style={{ width: size, height: size, background: color }}
    />
  );
}
