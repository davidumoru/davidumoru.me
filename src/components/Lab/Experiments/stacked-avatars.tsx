import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const avatars = [
  {
    id: "1",
    src: "https://i.pravatar.cc/100?u=52",
    name: "Elias.",
    viewed: "3h ago",
  },
  {
    id: "2",
    src: "https://i.pravatar.cc/100?u=13",
    name: "Clara Leighton",
    viewed: "1h ago",
  },
  {
    id: "3",
    src: "https://i.pravatar.cc/100?u=24",
    name: "Dorian Hale",
    viewed: "2d ago",
  },
  {
    id: "4",
    src: "https://i.pravatar.cc/100?u=52",
    name: "Marcus Kenley",
    viewed: "10m ago",
  },
];

export default function StackedAvatars() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex h-64 items-center justify-center">
      <div
        className="flex items-center rounded-full border px-3 py-3 shadow-sm"
        style={{
          backgroundColor: "var(--gray-1)",
          borderColor: "var(--gray-3)",
        }}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div className="flex items-center">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className="relative -ml-3 first:ml-0"
              onMouseEnter={() => setHoveredId(avatar.id)}
            >
              <AnimatePresence>
                {hoveredId === avatar.id && (
                  <motion.div
                    layoutId="tooltip"
                    className="absolute bottom-[140%] left-1/2 z-50 w-max -translate-x-1/2 rounded-xl px-2.5 py-1.5 shadow-xl"
                    style={{
                      backgroundColor: "var(--gray-12)",
                    }}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
                    transition={shouldReduceMotion ? { duration: 0 } : {
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    <div className="flex flex-col items-center leading-none">
                      <span
                        className="text-xs font-bold"
                        style={{ color: "var(--gray-1)" }}
                      >
                        {avatar.name}
                      </span>
                      <span
                        className="mt-0.5 text-[10px] font-medium opacity-80"
                        style={{ color: "var(--gray-1)" }}
                      >
                        Viewed {avatar.viewed}
                      </span>
                    </div>
                    <div className="absolute left-1/2 top-full -mt-px -translate-x-1/2">
                      <svg
                        width="12"
                        height="6"
                        viewBox="0 0 24 12"
                        fill="var(--gray-12)"
                      >
                        <path d="M12 12L0 0H24L12 12Z" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="relative z-0 h-14 w-14 overflow-hidden rounded-full border-[3px]"
                style={{
                  borderColor: "var(--gray-1)",
                }}
                animate={{
                  scale: hoveredId === avatar.id ? (shouldReduceMotion ? 1 : 1.15) : 1,
                  zIndex: hoveredId === avatar.id ? 50 : 0,
                }}
                transition={shouldReduceMotion ? { duration: 0 } : {
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              >
                <img
                  src={avatar.src}
                  alt={avatar.name}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
