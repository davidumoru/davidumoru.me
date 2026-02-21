import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const navigationItems = [
  { id: "home", title: "Home" },
  { id: "about", title: "About" },
  { id: "services", title: "Now" },
  { id: "contact", title: "Contact" },
];

export default function AnimatedTabs() {
  const [selected, setSelected] = useState(navigationItems[0].id);
  const [hovered, setHovered] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 30 };

  const springTransitionSlow = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <div className="flex w-full items-center justify-center py-4">
      <nav
        className="flex max-w-full scale-90 items-center gap-1 rounded-full p-1 sm:scale-100 sm:gap-2"
        onMouseLeave={() => setHovered(null)}
      >
        {navigationItems.map((item) => {
          const isSelected = selected === item.id;
          const isHovered = hovered === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              className="relative cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold outline-none focus-visible:ring-2 sm:px-4 sm:py-2 sm:text-sm"
              style={{
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {isHovered && !isSelected && (
                <motion.div
                  layoutId="nav-item-hover"
                  className="absolute inset-0 z-0 rounded-full"
                  style={{ backgroundColor: "var(--gray-4)" }}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, scale: 0.95 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.95 }
                  }
                  transition={springTransition}
                />
              )}

              {isSelected && (
                <motion.div
                  layoutId="nav-item-active"
                  className="absolute inset-0 z-0 rounded-full"
                  style={{ backgroundColor: "var(--gray-12)" }}
                  transition={springTransitionSlow}
                />
              )}

              <motion.span
                className="relative z-10 block"
                initial={false}
                animate={{
                  color: isSelected
                    ? "var(--gray-1)"
                    : isHovered
                      ? "var(--gray-12)"
                      : "var(--gray-10)",
                }}
                transition={springTransitionSlow}
              >
                {item.title}
              </motion.span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
