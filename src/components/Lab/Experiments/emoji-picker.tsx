import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "🔥", "👏"];

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😋",
      "😛",
      "🤪",
      "😎",
      "🤩",
      "🥳",
      "😏",
      "😔",
      "😢",
    ],
  },
  {
    name: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👊",
      "✊",
      "🤛",
      "🤜",
      "👏",
      "🙌",
      "👐",
      "🤲",
      "🤝",
      "🙏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "👌",
      "🤌",
      "👈",
      "👉",
      "👆",
      "👇",
      "☝️",
      "✋",
    ],
  },
  {
    name: "Hearts",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❤️‍🔥",
      "❤️‍🩹",
      "💖",
      "💗",
      "💓",
      "💞",
      "💕",
      "💟",
      "❣️",
      "💌",
      "🫶",
      "🫀",
      "💘",
      "💝",
    ],
  },
  {
    name: "Objects",
    emojis: [
      "🔥",
      "✨",
      "⭐",
      "🌟",
      "💫",
      "🎉",
      "🎊",
      "🎁",
      "🏆",
      "🥇",
      "🎯",
      "💡",
      "🔮",
      "🎨",
      "🎬",
      "🎤",
      "🎧",
      "🎵",
      "🎶",
      "💰",
      "💎",
      "🚀",
      "⚡",
      "💥",
    ],
  },
];

// Animation configs
const transition = {
  expand: { type: "spring" as const, bounce: 0.25, duration: 0.5 },
  collapse: { type: "spring" as const, bounce: 0.3, duration: 0.4 },
  content: { type: "spring" as const, bounce: 0.25, duration: 0.4 },
  button: { type: "spring" as const, bounce: 0.25, duration: 0.35 },
  emoji: { type: "spring" as const, bounce: 0.2, duration: 0.3 },
};

export default function EmojiSelector() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    setTimeout(() => setSelectedEmoji(null), 150);
  };

  return (
    <div className="flex items-center justify-center min-h-[28rem] py-8">
      <LayoutGroup>
        <motion.div
          layout
          initial={false}
          animate={{
            borderRadius: isExpanded ? 16 : 24,
          }}
          transition={isExpanded ? transition.expand : transition.collapse}
          className={`
            bg-[#1A1A1A]
            border border-[#2A2A2A]
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            overflow-hidden
            w-80
            ${isExpanded ? "p-4" : "px-2 py-1.5"}
          `}
        >
          {/* Quick Access Row */}
          <motion.div
            layout
            transition={isExpanded ? transition.expand : transition.collapse}
            className="flex items-center justify-center gap-0.5"
          >
            {QUICK_EMOJIS.map((emoji) => (
              <motion.button
                key={emoji}
                layout
                whileTap={{ scale: 0.85 }}
                onClick={() => handleEmojiClick(emoji)}
                transition={transition.emoji}
                className={`
                  text-[22px] p-2 rounded-lg
                  hover:bg-white/8
                  active:bg-white/12
                  transition-colors duration-150
                  ${selectedEmoji === emoji ? "bg-white/12" : ""}
                `}
              >
                {emoji}
              </motion.button>
            ))}

            {/* Expand Button */}
            <motion.button
              layout
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              transition={transition.button}
              className="
                w-9 h-9 ml-0.5
                rounded-lg
                flex items-center justify-center
                text-white/40 hover:text-white/70
                hover:bg-white/8
                active:bg-white/12
                transition-all duration-150
              "
            >
              <motion.svg
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={transition.button}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </motion.svg>
            </motion.button>
          </motion.div>

          {/* Expanded Content */}
          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
                transition={transition.content}
                className="mt-3"
              >
                {/* Search */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transition.content, delay: 0.05 }}
                  className="relative mb-3"
                >
                  <input
                    type="text"
                    placeholder="Search"
                    className="
                      w-full
                      bg-white/6
                      border border-white/8
                      rounded-lg
                      px-3 py-2
                      text-sm text-white/90
                      placeholder:text-white/30
                      outline-none
                      focus:border-white/20
                      focus:bg-white/8
                      transition-all duration-150
                    "
                  />
                </motion.div>

                {/* Categories */}
                <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide">
                  {EMOJI_CATEGORIES.map((category, categoryIndex) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        ...transition.content,
                        delay: 0.08 + categoryIndex * 0.04,
                      }}
                    >
                      <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider mb-2 px-1">
                        {category.name}
                      </p>
                      <div className="grid grid-cols-8 gap-0.5">
                        {category.emojis.map((emoji, emojiIndex) => (
                          <motion.button
                            key={`${category.name}-${emojiIndex}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleEmojiClick(emoji)}
                            transition={transition.emoji}
                            className={`
                              text-xl p-1.5 rounded-lg
                              hover:bg-white/8
                              active:bg-white/12
                              transition-colors duration-100
                              ${selectedEmoji === emoji ? "bg-white/12" : ""}
                            `}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
