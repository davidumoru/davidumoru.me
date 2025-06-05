import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const profileData = [
  {
    id: "p1",
    image: "https://i.pravatar.cc/80?u=p1",
    message: "Yo, what's good?",
  },
  {
    id: "p2",
    image: "https://i.pravatar.cc/80?u=p2",
    message: "super cold out here",
  },
  {
    id: "p3",
    image: "https://i.pravatar.cc/80?u=p3",
    message: "Feeling great today!",
  },
  {
    id: "p4",
    image: "https://i.pravatar.cc/80?u=p4",
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
    Math.sin((index / (profileData.length - 1)) * Math.PI) * 35;
  const staggerDelay = index * 0.1;

  return (
    <motion.div
      className="flex flex-col items-center relative"
      style={{ transform: `translateY(${curveFactor}px)` }}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: staggerDelay,
        ease: [0.4, 0.0, 0.2, 1],
      }}
    >
      <motion.div
        className="flex flex-col items-center relative group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{
          scale: 1.05,
          rotate: [-1, 1, -0.5, 0],
          transition: {
            scale: { duration: 0.2 },
            rotate: { duration: 0.6, ease: "easeInOut" },
          },
        }}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl"
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <motion.img
            src={profile.image}
            alt={`Profile of ${profile.id}`}
            className="w-20 h-20 object-cover cursor-pointer border-2 border-transparent"
            whileHover={{
              scale: 1.1,
              filter: "brightness(1.1) contrast(1.05)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/80x80/ EEE/333?text=Img+${profile.id}`;
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute bottom-full mb-14 px-3 py-2 rounded-lg text-xs font-normal shadow-xl z-20 pointer-events-none max-w-[160px] w-max text-center backdrop-blur-sm border hp-speech-bubble-light"
              style={{
                fontSize: "11px",
                lineHeight: "1.3",
              }}
              initial={{
                opacity: 0,
                y: 15,
                scale: 0.85,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.9,
                filter: "blur(2px)",
              }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                duration: 0.3,
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {profile.message}
              </motion.div>

              <motion.div
                className="absolute top-full left-1/2 transform -translate-x-1/2 hp-arrow-light"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              />
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
      .hp-glass-bubble {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.18);
      }
     
      .hp-speech-bubble-light {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%) !important;
        color: #1e293b !important;
        border-color: rgba(0, 0, 0, 0.08) !important;
      }
      .hp-arrow-light {
        border-top-color: rgba(255, 255, 255, 0.98) !important;
      }
     
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  return (
    <motion.div
      className="flex gap-6 items-end py-12 justify-center flex-nowrap min-h-[200px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {profileData.map((profile, index) => (
        <ProfileEntry key={profile.id} profile={profile} index={index} />
      ))}
    </motion.div>
  );
};

export default HoveringProfiles;
