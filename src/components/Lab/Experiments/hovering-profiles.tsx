import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const profileData = [
  {
    id: "p1",
    image: "https://i.pravatar.cc/100?u=p1",
    message: "Just brainstorming ideas.",
  },
  {
    id: "p2",
    image: "https://i.pravatar.cc/100?u=p2",
    message: "super cold out here",
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

  const curveFactor =
    Math.sin((index / (profileData.length - 1)) * Math.PI) * 20;

  return (
    <motion.div
      className="flex flex-col items-center relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: curveFactor,
        transition: {
          delay: index * 0.1,
          duration: 0.4,
        },
      }}
    >
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="flex flex-col items-center group"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={profile.image}
            alt={`Profile of ${profile.id}`}
            className="w-20 h-20 object-cover cursor-pointer"
          />
        </motion.div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-[calc(100%+12px)] z-10 max-w-[220px] w-max text-center whitespace-normal break-words pointer-events-none"
            >
              <div
                className="relative px-3 py-2 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: "var(--hp-speech-bubble-bg)",
                  color: "var(--hp-speech-bubble-text)",
                  boxShadow: "var(--hp-speech-bubble-shadow)",
                }}
              >
                {profile.message}
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "5px solid var(--hp-speech-bubble-bg)",
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
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      :root {
        --hp-speech-bubble-bg: #1f2937;
        --hp-speech-bubble-text: #ffffff;
        --hp-speech-bubble-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      [data-theme="light"] {
        --hp-speech-bubble-bg: #ffffff;
        --hp-speech-bubble-text: #1f2937;
        --hp-speech-bubble-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="flex gap-4 items-end justify-center py-10 flex-nowrap">
      {profileData.map((profile, index) => (
        <ProfileEntry key={profile.id} profile={profile} index={index} />
      ))}
    </div>
  );
};

export default HoveringProfiles;
