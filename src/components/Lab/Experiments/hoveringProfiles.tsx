import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const profileData = [
  {
    id: "p1",
    image: "https://i.pravatar.cc/80?u=p1",
    message: "Just brainstorming ideas.",
  },
  {
    id: "p2",
    image: "https://i.pravatar.cc/80?u=p2",
    message: "man its super cold out here, careful",
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
    Math.sin((index / (profileData.length - 1)) * Math.PI) * 20;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        transform: `translateY(${curveFactor}px)`,
      }}
    >
      <motion.div
        className="hp-profile-item"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={profile.image}
          alt={`Profile of ${profile.id}`}
          className="hp-profile-image"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "15px",
            objectFit: "cover",
            cursor: "pointer",
            transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
            border: "1px solid transparent",
          }}
        />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="hp-speech-bubble"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 12px)",
                backgroundColor: "var(--hp-speech-bubble-bg)",
                color: "var(--hp-speech-bubble-text)",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.12)",
                zIndex: 10,
                pointerEvents: "none",
                maxWidth: "280px",
                width: "max-content",
                textAlign: "center",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              {profile.message}
              <div
                className="hp-speech-bubble-arrow"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "7px solid var(--hp-speech-bubble-arrow-border)",
                }}
              ></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const HoveringProfiles: React.FC = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      :root {
        --hp-speech-bubble-bg: #282828;
        --hp-speech-bubble-text: #f0f0f0;
        --hp-speech-bubble-arrow-border: #282828;
      }
      [data-theme="light"] {
        --hp-speech-bubble-bg: #ffffff;
        --hp-speech-bubble-text: #333333;
        --hp-speech-bubble-arrow-border: #ffffff;
      }
      .hp-profile-item:hover .hp-profile-image {
        transform: scale(1.08);
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div
      className="hp-list-container"
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "flex-end",
        padding: "40px 0",
        justifyContent: "center",
        flexWrap: "nowrap",
      }}
    >
      {profileData.map((profile, index) => (
        <ProfileEntry key={profile.id} profile={profile} index={index} />
      ))}
    </div>
  );
};

export default HoveringProfiles;
