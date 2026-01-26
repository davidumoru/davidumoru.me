import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const pills = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Theta",
  "Lambda",
  "Sigma",
  "Omega",
];

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
} as const;

export default function PillSelector() {
  const [selected, setSelected] = useState<string[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const effectiveTransition = shouldReduceMotion ? { duration: 0 } : transitionProps;

  const togglePill = (pill: string) => {
    setSelected((prev) =>
      prev.includes(pill) ? prev.filter((p) => p !== pill) : [...prev, pill]
    );
  };

  return (
    <div className="flex w-full justify-center p-6">
      <motion.div
        className="flex flex-wrap justify-center gap-3 overflow-visible"
        layout
        transition={effectiveTransition}
      >
        {pills.map((pill) => {
          const isSelected = selected.includes(pill);
          return (
            <motion.button
              key={pill}
              onClick={() => togglePill(pill)}
              layout
              initial={false}
              animate={{
                backgroundColor: isSelected ? "#163e33" : "#23272a",
              }}
              whileHover={shouldReduceMotion ? {} : {
                backgroundColor: isSelected ? "#163e33" : "#334155",
              }}
              whileTap={shouldReduceMotion ? {} : {
                backgroundColor: isSelected ? "#0f2921" : "#1e293b",
              }}
              transition={{
                ...effectiveTransition,
                backgroundColor: { duration: shouldReduceMotion ? 0 : 0.1 },
              }}
              className={`
                inline-flex items-center overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-base font-medium ring-1 ring-inset focus:outline-none
                ${
                  isSelected
                    ? "text-[#2dd4bf] ring-[hsla(172,70%,50%,0.18)]"
                    : "text-slate-300 ring-[hsla(220,13%,91%,0.06)]"
                }
              `}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <motion.div
                className="relative flex items-center"
                animate={{
                  width: isSelected ? "auto" : "100%",
                  paddingRight: isSelected ? "1.7rem" : "0",
                }}
                transition={shouldReduceMotion ? { duration: 0 } : {
                  ease: [0.175, 0.885, 0.32, 1.275],
                  duration: 0.3,
                }}
              >
                <span>{pill}</span>
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                      transition={effectiveTransition}
                      className="absolute right-0 flex items-center justify-center"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2dd4bf] shadow-md">
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="#163e33"
                          strokeWidth={2.2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="5 11 9 15 15 7" />
                        </svg>
                      </div>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
