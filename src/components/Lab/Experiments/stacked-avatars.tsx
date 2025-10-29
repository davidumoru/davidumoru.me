import { useEffect } from "react";
import { motion } from "framer-motion";

interface Avatar {
  id: string;
  src: string;
  alt: string;
  name: string;
}

const avatars: Avatar[] = [
  {
    id: "1",
    src: "https://i.pravatar.cc/100?u=52",
    alt: "John Doe",
    name: "John Doe",
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
    src: "https://i.pravatar.cc/100?u=60",
    alt: "Providenci Altenwerth",
    name: "Providenci Altenwerth",
  },
];

const StackedAvatars: React.FC = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      :root {
        --sa-tooltip-bg: #1f2937;
        --sa-tooltip-text: #ffffff;
        --sa-tooltip-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        --sa-avatar-ring: #ffffff;
      }
      [data-theme="light"] {
        --sa-tooltip-bg: #ffffff;
        --sa-tooltip-text: #1f2937;
        --sa-tooltip-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        --sa-avatar-ring: #ffffff;
      }
      [data-theme="dark"] {
        --sa-tooltip-bg: #1f2937;
        --sa-tooltip-text: #ffffff;
        --sa-tooltip-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        --sa-avatar-ring: #1f2937;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  return (
    <div className="flex items-center justify-center">
      <div className="group flex justify-center py-16">
        {avatars.map((avatar, index) => (
          <motion.div
            key={avatar.id}
            className={`relative flex items-center justify-center transition-all duration-500 ease-out ${
              index === 0 ? "ml-0" : "-ml-6 sm:-ml-8"
            } group-hover:ml-1 sm:group-hover:ml-2`}
            style={{ zIndex: avatars.length - index }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="peer relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 transition-all duration-500 ease-out group-hover:h-18 group-hover:w-18 sm:group-hover:h-22 sm:group-hover:w-22 md:group-hover:h-26 md:group-hover:w-26">
              <img
                src={avatar.src}
                alt={avatar.alt}
                className="w-full h-full rounded-full object-cover shadow-lg"
                style={{
                  border: "4px solid var(--sa-avatar-ring)",
                }}
              />
            </div>
            <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 peer-hover:opacity-100 peer-hover:-translate-y-1">
              <div className="relative">
                <div
                  className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: "var(--sa-tooltip-bg)",
                    color: "var(--sa-tooltip-text)",
                    boxShadow: "var(--sa-tooltip-shadow)",
                  }}
                >
                  {avatar.name}
                </div>
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "5px solid var(--sa-tooltip-bg)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StackedAvatars;
