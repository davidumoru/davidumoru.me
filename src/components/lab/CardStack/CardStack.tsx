import {
  Children,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  LayoutGroup,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import styles from "./CardStack.module.css";

const springConfig = { damping: 15, stiffness: 180, mass: 0.15 };

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * easeOutCubic(progress);
}

function Card({ tone }: { tone: string }) {
  return <div className={styles.card} style={{ background: tone }} />;
}

function CardItem({
  card,
  i,
  xInput,
  moveToEnd,
}: {
  card: ReactElement;
  i: number;
  xInput: MotionValue<number>;
  moveToEnd: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const x = useMemo(() => 15 * i, [i]);
  const scale = useMemo(() => 1 - i * 0.1, [i]);
  const zIndex = useMemo(() => 2 - i, [i]);
  const rotate = useMemo(() => i * -2.5, [i]);

  const scaleInput = useTransform(xInput, (latest: number) => {
    const distance = Math.min(Math.abs(latest), 120) / 120;
    const start = 1 - i * 0.1;
    const end = start + 0.1;
    return lerp(start, end, Math.pow(Math.min(distance, 1), i));
  });

  const rotateInput = useTransform(xInput, (latest: number) => {
    const distance = Math.min(Math.abs(latest), 100) / 100;
    const start = i * -2.5;
    const end = start + 2.5;
    return lerp(start, end, Math.pow(Math.min(distance, 1), i));
  });

  const effectiveSpring = shouldReduceMotion ? { duration: 0 } : springConfig;
  const rotateVal = useSpring(rotateInput, effectiveSpring);
  const scaleVal = useSpring(scaleInput, effectiveSpring);

  return (
    <motion.div
      title="Drag me"
      layoutId={card.key || undefined}
      drag={i === 0 && !shouldReduceMotion ? "x" : false}
      dragSnapToOrigin
      className={styles.item}
      dragConstraints={{ left: -100, right: 100 }}
      onDrag={(_, info) => xInput.set(info.offset.x)}
      onDragEnd={(_, info) => {
        xInput.set(0);
        if (Math.abs(info.offset.x) > 100) moveToEnd();
      }}
      whileDrag={shouldReduceMotion ? {} : { cursor: "grabbing" }}
      style={{
        gridColumn: "1 / 4",
        gridRow: "1",
        scale: scaleVal,
        rotate: rotateVal,
        transformOrigin: "center center",
      }}
      animate={{ x, y: 0, zIndex, scale, rotate }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              ...springConfig,
              layout: { type: "spring", ...springConfig },
            }
      }
    >
      {card}
    </motion.div>
  );
}

function Stack({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<ReactElement[]>(
    Children.toArray(children) as ReactElement[],
  );
  const xInput = useMotionValue(0);

  const moveToEnd = () => {
    setCards((prev) => {
      const next = [...prev];
      const first = next.shift();
      if (first) next.push(first);
      return next;
    });
  };

  return (
    <div className={styles.stack}>
      <LayoutGroup>
        {cards.map((card, i) => (
          <CardItem
            key={card.key}
            card={card}
            i={i}
            xInput={xInput}
            moveToEnd={moveToEnd}
          />
        ))}
      </LayoutGroup>
    </div>
  );
}

export default function CardStack() {
  return (
    <div className={styles.root}>
      <Stack>
        <Card key="card-0" tone="var(--gray-4)" />
        <Card key="card-1" tone="var(--gray-6)" />
        <Card key="card-2" tone="var(--gray-8)" />
      </Stack>
    </div>
  );
}
