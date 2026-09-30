import { useRef, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
  type Transition,
} from "motion/react";
import styles from "./SwipeDeck.module.css";

type Card = { id: number; label: string };

const DECK: Card[] = [
  { id: 1, label: "Flick me away" },
  { id: 2, label: "Then the next" },
  { id: 3, label: "Keep going" },
  { id: 4, label: "Last one" },
];

const DISTANCE = 100;
const VELOCITY = 500;
const FLY = 420;
const TILT = 12;

const INSTANT: Transition = { duration: 0 };
const SPRING: Transition = { type: "spring", stiffness: 300, damping: 30 };
const OUT: Transition = { duration: 0.3, ease: [0.23, 1, 0.32, 1] };

function DeckCard({
  card,
  depth,
  total,
  reduce,
  onDismiss,
}: {
  card: Card;
  depth: number;
  total: number;
  reduce: boolean;
  onDismiss: (direction: number) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-TILT, TILT]);
  const isTop = depth === 0;

  return (
    <motion.div
      className={styles.card}
      data-top={isTop || undefined}
      style={{ x, rotate, zIndex: total - depth }}
      initial={reduce ? false : { scale: 0.9, y: 24, opacity: 0 }}
      animate={{ scale: 1 - depth * 0.04, y: depth * -12, opacity: 1 }}
      variants={{
        exit: (direction: number) => ({
          x: direction * FLY,
          rotate: direction * TILT * 1.5,
          opacity: 0,
          transition: reduce ? INSTANT : OUT,
        }),
      }}
      exit="exit"
      transition={reduce ? INSTANT : SPRING}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={(_event, info: PanInfo) => {
        const flung =
          Math.abs(info.offset.x) > DISTANCE ||
          Math.abs(info.velocity.x) > VELOCITY;
        if (!flung) return;
        const direction =
          Math.abs(info.velocity.x) > VELOCITY
            ? Math.sign(info.velocity.x)
            : Math.sign(info.offset.x);
        onDismiss(direction || 1);
      }}
      aria-hidden={!isTop}
    >
      {card.label}
    </motion.div>
  );
}

export default function SwipeDeck() {
  const [cards, setCards] = useState(DECK);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion() ?? false;
  const deck = useRef<HTMLDivElement>(null);

  function dismiss(towards: number) {
    setDirection(towards);
    setCards((current) => current.slice(1));
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!cards.length) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      dismiss(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      dismiss(1);
    }
  }

  return (
    <div className={styles.stage}>
      <div
        ref={deck}
        className={styles.deck}
        tabIndex={cards.length ? 0 : -1}
        role="group"
        aria-roledescription="card deck"
        aria-label={
          cards.length
            ? `${cards[0].label}. ${cards.length} left. Swipe or use the arrow keys to dismiss.`
            : "Deck empty"
        }
        onKeyDown={onKeyDown}
      >
        <AnimatePresence custom={direction}>
          {cards.map((card, depth) => (
            <DeckCard
              key={card.id}
              card={card}
              depth={depth}
              total={cards.length}
              reduce={reduce}
              onDismiss={dismiss}
            />
          ))}
        </AnimatePresence>
      </div>

      {cards.length === 0 && (
        <button
          type="button"
          className={styles.reset}
          onClick={() => {
            setCards(DECK);
            deck.current?.focus();
          }}
        >
          Reset deck
        </button>
      )}
    </div>
  );
}
