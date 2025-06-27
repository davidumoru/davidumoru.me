"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

export default function PillSelector() {
  const [selected, setSelected] = useState<string[]>([]);

  const togglePill = (pill: string) => {
    setSelected((prev) =>
      prev.includes(pill) ? prev.filter((p) => p !== pill) : [...prev, pill]
    );
  };

  return (
    <div className="w-full p-6 flex justify-center">
      <motion.div
        className="flex flex-wrap gap-3 overflow-visible justify-center"
        layout
        transition={transitionProps}
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
              whileHover={{
                backgroundColor: isSelected ? "#163e33" : "#334155",
              }}
              whileTap={{
                backgroundColor: isSelected ? "#0f2921" : "#1e293b",
              }}
              transition={{
                ...transitionProps,
                backgroundColor: { duration: 0.1 },
              }}
              className={`
                inline-flex items-center px-4 py-2 rounded-full text-base font-medium
                whitespace-nowrap overflow-hidden ring-1 ring-inset
                ${
                  isSelected
                    ? "text-[#2dd4bf] ring-[hsla(172,70%,50%,0.18)]"
                    : "text-slate-300 ring-[hsla(220,13%,91%,0.06)]"
                }
              `}
            >
              <motion.div
                className="relative flex items-center"
                animate={{
                  width: isSelected ? "auto" : "100%",
                  paddingRight: isSelected ? "1.7rem" : "0",
                }}
                transition={{
                  ease: [0.175, 0.885, 0.32, 1.275],
                  duration: 0.3,
                }}
              >
                <span>{pill}</span>
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={transitionProps}
                      className="absolute right-0"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#2dd4bf] flex items-center justify-center shadow-md">
                        <svg
                          className="w-3.5 h-3.5"
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
