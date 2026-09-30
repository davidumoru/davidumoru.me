import {
  Children,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  LayoutGroup,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import styles from "./CardStack.module.css";

const springConfig = { damping: 15, stiffness: 180, mass: 0.15 };
const INSTANT = { duration: 0 };

const FAN = 15;
const DRAG_LIMIT = 100;
const THROW_DISTANCE = 80;
const THROW_VELOCITY = 500;

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
  const reduce = useReducedMotion() ?? false;
  const dragX = useMotionValue(0);
  const transition = reduce ? INSTANT : springConfig;

  const scaleInput = useTransform(xInput, (latest: number) => {
    const distance = Math.min(Math.abs(latest), 120) / 120;
    const start = 1 - i * 0.1;
    return lerp(start, start + 0.1, Math.pow(distance, i));
  });

  const rotateInput = useTransform(xInput, (latest: number) => {
    const distance = Math.min(Math.abs(latest), 100) / 100;
    const start = i * -2.5;
    return lerp(start, start + 2.5, Math.pow(distance, i));
  });

  const rotate = useSpring(rotateInput, transition);
  const scale = useSpring(scaleInput, transition);

  return (
    <motion.div
      layoutId={card.key || undefined}
      className={styles.slot}
      style={{ scale, rotate, zIndex: 2 - i }}
      animate={{ x: FAN * i, scale: 1 - i * 0.1, rotate: i * -2.5 }}
      transition={
        reduce
          ? INSTANT
          : {
              type: "spring",
              ...springConfig,
              layout: { type: "spring", ...springConfig },
            }
      }
    >
      <motion.div
        className={styles.item}
        style={{ x: dragX }}
        drag={i === 0 ? "x" : false}
        dragConstraints={{ left: -DRAG_LIMIT, right: DRAG_LIMIT }}
        dragMomentum={false}
        onDrag={() => xInput.set(dragX.get())}
        onDragEnd={(_, info) => {
          xInput.set(0);
          const thrown =
            Math.abs(info.offset.x) > THROW_DISTANCE ||
            Math.abs(info.velocity.x) > THROW_VELOCITY;
          if (thrown) moveToEnd();
          animate(
            dragX,
            0,
            reduce ? INSTANT : { type: "spring", ...springConfig },
          );
        }}
        whileDrag={{ cursor: "grabbing" }}
      >
        {card}
      </motion.div>
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

  function onKeyDown(event: KeyboardEvent) {
    if (["Enter", " ", "ArrowRight", "ArrowLeft"].includes(event.key)) {
      event.preventDefault();
      moveToEnd();
    }
  }

  return (
    <div
      className={styles.stack}
      style={{ translate: `${(-(cards.length - 1) * FAN) / 2}px 0` }}
      tabIndex={0}
      role="group"
      aria-roledescription="card stack"
      aria-label="Drag the top card aside, or press Enter, to send it to the back"
      onKeyDown={onKeyDown}
    >
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
