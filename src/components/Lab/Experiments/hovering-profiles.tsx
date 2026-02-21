import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const profileData = [
  {
    id: "p1",
    image: "https://i.pravatar.cc/100?u=p1",
    message: "Just brainstorming ideas.",
  },
  {
    id: "p2",
    image: "https://i.pravatar.cc/100?u=p2",
    message: "Super cold out here",
  },
  {
    id: "p3",
    image: "https://i.pravatar.cc/100?u=p3",
    message: "Feeling great today!",
  },
  {
    id: "p4",
    image: "https://i.pravatar.cc/100?u=p4",
    message: "Meow. Food now?",
  },
];

interface Profile {
  id: string;
  image: string;
  message: string;
}

const ProfileEntry: React.FC<{ profile: Profile; index: number }> = ({
  profile,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const curveFactor =
    Math.sin((index / (profileData.length - 1)) * Math.PI) * 20;

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: curveFactor,
        transition: shouldReduceMotion
          ? { duration: 0 }
          : {
              delay: index * 0.1,
              duration: 0.4,
              type: "spring",
            },
      }}
      style={{ zIndex: isHovered ? 50 : 0 }}
    >
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group flex flex-col items-center"
        whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative overflow-hidden rounded-full">
          <img
            src={profile.image}
            alt={`Profile of ${profile.id}`}
            className="h-20 w-20 cursor-pointer object-cover"
            style={{
              border: "4px solid var(--gray-2)",
            }}
          />
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 8, scale: 0.95 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 4, scale: 0.98 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 300, damping: 25 }
              }
              className="pointer-events-none absolute bottom-[calc(100%+16px)] z-10 w-max max-w-50 wrap-break-word text-center"
            >
              <div
                className="relative rounded-xl px-4 py-2 text-xs font-semibold shadow-xl"
                style={{
                  backgroundColor: "var(--gray-12)",
                  color: "var(--gray-1)",
                }}
              >
                {profile.message}
                <div
                  className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform"
                  style={{
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid var(--gray-12)",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const HoveringProfiles: React.FC = () => {
  return (
    <div className="flex flex-nowrap items-end justify-center gap-4 py-20">
      {profileData.map((profile, index) => (
        <ProfileEntry key={profile.id} profile={profile} index={index} />
      ))}
    </div>
  );
};

export default HoveringProfiles;
