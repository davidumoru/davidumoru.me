import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";

const DECK = [
  { id: 1, label: "Flick me away" },
  { id: 2, label: "Then the next" },
  { id: 3, label: "Keep going" },
  { id: 4, label: "Last one" },
];

const stage: CSSProperties = {
  position: "relative",
  display: "grid",
  placeItems: "center",
  touchAction: "none",
};

const cardStyle: CSSProperties = {
  position: "absolute",
  width: "16rem",
  height: "10rem",
  display: "grid",
  placeItems: "center",
  borderRadius: "var(--radius-2xl)",
  border: "1px solid var(--border)",
  background: "var(--background)",
  boxShadow: "var(--shadow-lg)",
  fontFamily: "var(--font-instrument-serif), Georgia, serif",
  fontSize: "var(--fs-xl)",
  color: "var(--text)",
  cursor: "grab",
  userSelect: "none",
};

const resetBtn: CSSProperties = {
  padding: "var(--space-sm) var(--space-lg)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-2xl)",
  background: "var(--background)",
  color: "var(--text)",
  font: "inherit",
  cursor: "pointer",
};

export default function SwipeDeck() {
  const [cards, setCards] = useState(DECK);
  const [direction, setDirection] = useState(1);

  const dismiss = (id: number) =>
    setCards((cs) => cs.filter((c) => c.id !== id));
  const reset = () => setCards(DECK);

  return (
    <div style={stage}>
      <AnimatePresence custom={direction}>
        {cards.map((card, i) => {
          const depth = i;
          const isTop = depth === 0;
          return (
            <motion.div
              key={card.id}
              custom={direction}
              style={{ ...cardStyle, zIndex: cards.length - depth }}
              initial={{ scale: 0.9, y: 24, opacity: 0 }}
              animate={{ scale: 1 - depth * 0.04, y: depth * -12, opacity: 1 }}
              variants={{
                exit: (dir: number) => ({
                  x: dir * 340,
                  opacity: 0,
                  transition: { duration: 0.25 },
                }),
              }}
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              whileDrag={{ cursor: "grabbing" }}
              onDragEnd={(_event, info: PanInfo) => {
                if (info.offset.x > 120) {
                  setDirection(1);
                  dismiss(card.id);
                } else if (info.offset.x < -120) {
                  setDirection(-1);
                  dismiss(card.id);
                }
              }}
            >
              {card.label}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {cards.length === 0 && (
        <button style={resetBtn} onClick={reset}>
          Reset deck
        </button>
      )}
    </div>
  );
}
