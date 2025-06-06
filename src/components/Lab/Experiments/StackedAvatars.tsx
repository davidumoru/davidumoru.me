import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Avatar {
  id: string;
  src?: string;
  initials?: string;
  alt: string;
  name: string;
  isOnline?: boolean;
}

const StackedAvatars: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const avatars: Avatar[] = [
    {
      id: "1",
      src: "https://i.pravatar.cc/100?u=1",
      alt: "John Doe",
      name: "John Doe",
    },
    {
      id: "2",
      initials: "A.J",
      alt: "Alice Johnson",
      name: "Alice Johnson",
    },
    {
      id: "3",
      src: "https://i.pravatar.cc/100?u=13",
      alt: "Jane Smith",
      name: "Jane Smith",
    },
    {
      id: "4",
      src: "https://i.pravatar.cc/100?u=24",
      alt: "Mike Wilson",
      name: "Mike Wilson",
    },
    {
      id: "5",
      src: "https://i.pravatar.cc/100?u=52",
      alt: "Sarah Connor",
      name: "Sarah Connor",
    },
    {
      id: "6",
      src: "https://i.pravatar.cc/100?u=6",
      alt: "Providenci Altenwerth",
      name: "Providenci Altenwerth",
    },
    {
      id: "7",
      src: "https://i.pravatar.cc/100?u=7",
      alt: "Anastasia Cruick",
      name: "Anastasia Cruick",
    },
    {
      id: "8",
      src: "https://i.pravatar.cc/100?u=8",
      alt: "Friedrich Oberbrunner",
      name: "Friedrich Oberbrunner",
      isOnline: true,
    },
    {
      id: "9",
      src: "https://i.pravatar.cc/100?u=9",
      alt: "Rosemarie Satter",
      name: "Rosemarie Satter",
    },
    {
      id: "10",
      src: "https://i.pravatar.cc/100?u=10",
      alt: "Well Stiedemann",
      name: "Well Stiedemann",
    },
  ];

  const visibleAvatars = avatars.slice(0, 5);
  const hiddenAvatars = avatars.slice(5);
  const remainingCount = hiddenAvatars.length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (id: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    const index = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex -space-x-2 justify-center">
        {visibleAvatars.map((avatar, index) => (
          <motion.div
            key={avatar.id}
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-medium text-white relative"
            style={{ zIndex: visibleAvatars.length - index }}
            whileHover={{ scale: 1.1, zIndex: 50 }}
            transition={{ duration: 0.2 }}
          >
            {avatar.src ? (
              <img
                src={avatar.src}
                alt={avatar.alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${getRandomColor(
                  avatar.id
                )}`}
              >
                {avatar.initials || getInitials(avatar.alt)}
              </div>
            )}
          </motion.div>
        ))}

        {remainingCount > 0 && (
          <motion.button
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-medium text-gray-600 relative cursor-pointer"
            style={{ zIndex: 1 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            +{remainingCount}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-[240px] z-50 ml-auto md:ml-0"
            style={{
              // Only apply the calculated margin on medium screens and up
              marginLeft: window.innerWidth >= 768 ? "184px" : "auto",
            }}
          >
            {hiddenAvatars.map((avatar, index) => (
              <motion.div
                key={avatar.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-medium text-white text-xs">
                    {avatar.src ? (
                      <img
                        src={avatar.src}
                        alt={avatar.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${getRandomColor(
                          avatar.id
                        )}`}
                      >
                        {avatar.initials || getInitials(avatar.name)}
                      </div>
                    )}
                  </div>
                  {avatar.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {avatar.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default StackedAvatars;
