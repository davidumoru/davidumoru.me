import {
  LayoutGroup,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import * as React from "react";
const { useState, Children, useMemo } = React;

const springConfig = {
  damping: 15,
  stiffness: 180,
  mass: 0.15,
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function lerp(start: number, end: number, progress: number) {
  const easedProgress = easeOutCubic(progress);
  return start + (end - start) * easedProgress;
}

function SwipeableCard({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="w-40 sm:w-50 aspect-square rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <img
        src={`${imageUrl}?f_auto,q_auto`}
        alt="Card image"
        className="w-full h-full object-cover pointer-events-none select-none"
        draggable={false}
      />
    </div>
  );
}

function SwipeableCardItem({
  card,
  i,
  xInput,
  moveToEnd,
}: {
  card: React.ReactElement;
  i: number;
  xInput: MotionValue<number>;
  moveToEnd: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const x = useMemo(() => 15 * i, [i]);
  const y = useMemo(() => 0, [i]);
  const scale = useMemo(() => 1 - i * 0.1, [i]);
  const zIndex = useMemo(() => 2 - i, [i]);
  const rotate = useMemo(() => i * -2.5, [i]);

  const scaleInput = useTransform(xInput, (latest: number) => {
    const distance = Math.min(Math.abs(latest), 120) / 120;
    const start = 1 - i * 0.1;
    const end = start + 0.1;
    const progress = Math.min(distance, 1);
    return lerp(start, end, Math.pow(progress, i));
  });

  const rotateInput = useTransform(xInput, (latest: number) => {
    const distance = Math.min(Math.abs(latest), 100) / 100;
    const start = i * -2.5;
    const end = start + 2.5;
    const progress = Math.min(distance, 1);
    return lerp(start, end, Math.pow(progress, i));
  });

  const effectiveSpringConfig = shouldReduceMotion
    ? { duration: 0 }
    : springConfig;
  const rotateVal = useSpring(rotateInput, effectiveSpringConfig);
  const scaleVal = useSpring(scaleInput, effectiveSpringConfig);

  return (
    <motion.div
      title="Drag me"
      layoutId={card.key || undefined}
      drag={i === 0 && !shouldReduceMotion ? "x" : false}
      dragSnapToOrigin
      className="cursor-pointer"
      dragConstraints={{ left: -100, right: 100 }}
      onDrag={(_, info) => {
        xInput.set(info.offset.x);
      }}
      onDragEnd={(_, info) => {
        xInput.set(0);
        if (Math.abs(info.offset.x) > 100) {
          moveToEnd();
        }
      }}
      whileDrag={shouldReduceMotion ? {} : { cursor: "grabbing" }}
      style={{
        gridColumn: "1 / 4",
        gridRow: "1",
        scale: scaleVal,
        rotate: rotateVal,
        transformOrigin: "center center",
      }}
      animate={{
        x,
        y,
        zIndex,
        scale,
        rotate,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              ...springConfig,
              layout: {
                type: "spring",
                ...springConfig,
              },
            }
      }
    >
      {card}
    </motion.div>
  );
}

function SwipeableCardStack({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<React.ReactElement[]>(
    Children.toArray(children) as React.ReactElement[],
  );
  const xInput = useMotionValue(0);

  const moveToEnd = () => {
    setCards((prevCards: React.ReactElement[]) => {
      const cp = [...prevCards];
      const lastItem = cp.shift();
      if (lastItem) {
        cp.push(lastItem);
      }
      return cp;
    });
  };

  return (
    <div className="grid">
      <LayoutGroup>
        {cards.map((card: React.ReactElement, i) => (
          <SwipeableCardItem
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

export default function SwipeableCardsDemo() {
  const imageUrls = [
    "https://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/United_States_xom8ae",
    "https://res.cloudinary.com/deha0jqdf/image/upload/v1747352588/China_vp3tox",
    "https://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/United_Kingdom_aog0xm",
  ];

  return (
    <div className="relative py-8 grid place-items-center w-full">
      <SwipeableCardStack>
        {imageUrls.map((url, index) => (
          <SwipeableCard key={`card-${index}`} imageUrl={url} />
        ))}
      </SwipeableCardStack>
    </div>
  );
}
