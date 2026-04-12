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

  const effectiveTransition = shouldReduceMotion
    ? { duration: 0 }
    : transitionProps;

  const togglePill = (pill: string) => {
    setSelected((prev) =>
      prev.includes(pill) ? prev.filter((p) => p !== pill) : [...prev, pill],
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
                backgroundColor: isSelected ? "oklch(0.332 0.049 172.436)" : "oklch(0.27 0.008 240.249)",
              }}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      backgroundColor: isSelected ? "oklch(0.332 0.049 172.436)" : "oklch(0.372 0.039 257.298)",
                    }
              }
              whileTap={
                shouldReduceMotion
                  ? {}
                  : {
                      backgroundColor: isSelected ? "oklch(0.257 0.036 170.95)" : "oklch(0.279 0.037 260.039)",
                    }
              }
              transition={{
                ...effectiveTransition,
                backgroundColor: { duration: shouldReduceMotion ? 0 : 0.1 },
              }}
              className={`
                inline-flex items-center overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-base font-medium ring-1 ring-inset focus:outline-none
                ${
                  isSelected
                    ? "text-[oklch(0.785_0.133_181.954)] ring-[oklch(0.785_0.133_181.954/0.18)]"
                    : "text-[oklch(0.793_0.012_261.309)] ring-[oklch(0.931_0.01_261/0.06)]"
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
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        ease: [0.175, 0.885, 0.32, 1.275],
                        duration: 0.3,
                      }
                }
              >
                <span>{pill}</span>
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { scale: 0, opacity: 0 }
                      }
                      animate={{ scale: 1, opacity: 1 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { scale: 0, opacity: 0 }
                      }
                      transition={effectiveTransition}
                      className="absolute right-0 flex items-center justify-center"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.785_0.133_181.954)] shadow-md">
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="oklch(0.332 0.049 172.436)"
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
