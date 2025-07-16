import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navigationItems = [
  { id: "home", title: "Home" },
  { id: "about", title: "About" },
  { id: "services", title: "Services" },
  { id: "contact", title: "Contact" },
];

export default function AnimatedTabs() {
  const [currentTab, setCurrentTab] = useState(navigationItems[0].id);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      :root {
        --tab-bg-active: #e5e7eb;
        --tab-text-active: #111827;
        --tab-text-inactive: #6b7280;
        --tab-text-hover: #374151;
      }

      [data-theme="dark"] {
        --tab-bg-active: #374151;
        --tab-text-active: #f9fafb;
        --tab-text-inactive: #9ca3af;
        --tab-text-hover: #f3f4f6;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center py-4">
      <nav className="flex items-center gap-[2px] sm:gap-2  max-w-full scale-[0.9] sm:scale-100">
        {navigationItems.map((item) => {
          const isActive = currentTab === item.id;

          return (
            <motion.button
              key={item.id}
              layout
              onClick={() => setCurrentTab(item.id)}
              className={`
                relative px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm font-semibold rounded-full whitespace-nowrap
                transition-colors duration-200 ease-out bg-transparent
                focus:outline-none focus-visible:ring focus-visible:ring-offset-2
                focus-visible:ring-[color:var(--tab-bg-active)]
              `}
              style={{
                color: isActive
                  ? "var(--tab-text-active)"
                  : "var(--tab-text-inactive)",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.color = "var(--tab-text-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.color = "var(--tab-text-inactive)";
              }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--tab-bg-active)" }}
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10 select-none">{item.title}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
