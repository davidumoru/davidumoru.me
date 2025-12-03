import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const transition = {
  type: "spring",
  stiffness: 240,
  damping: 26,
  mass: 1.2,
};

const ITEMS = [
  {
    name: "US",
    image:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/United_States_xom8ae.jpg",
  },
  {
    name: "Canada",
    image:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352587/Canada_wkha0g.jpg",
  },
  {
    name: "Brazil",
    image:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352582/Brazil_hy5ct1.jpg",
  },
  {
    name: "Japan",
    image:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352592/Japan_eqqjo0.jpg",
  },
  {
    name: "Italy",
    image:
      "http://res.cloudinary.com/deha0jqdf/image/upload/v1747352593/Italy_qjn12f.jpg",
  },
];

export default function AnimatedCardsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const newTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      if (newTheme !== theme) setTheme(newTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [theme]);

  const itemBgColor = theme === "dark" ? "#292524" : "rgba(229, 231, 235, 0.6)";
  const buttonBgColor = theme === "dark" ? "#292524" : "#e5e7eb";
  const buttonTextColor = "#a8a29e";

  return (
    <div className="relative flex h-[200px] w-full flex-col items-center justify-center">
      <div className="absolute -top-24 flex flex-col items-center justify-center">
        <motion.div
          initial={false}
          className="flex justify-start gap-4"
          animate={{ x: -currentIndex * (200 + 16) + 432 }}
          transition={transition}
        >
          {ITEMS.map(({ image }, index) => (
            <motion.div
              key={index}
              layout
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{
                y: currentIndex === index ? 0 : -32,
                scale: currentIndex === index ? 1 : 0.9,
                opacity: currentIndex === index ? 1 : 0.6,
              }}
              whileHover={{
                scale: 1.05,
              }}
              transition={transition}
              className={`h-[200px] w-[200px] rounded-xl overflow-hidden ${
                currentIndex === index
                  ? "shadow-lg shadow-black/20"
                  : "shadow-sm shadow-black/10"
              }`}
              style={{ backgroundColor: itemBgColor }}
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 ease-in-out"
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 flex h-8 items-center justify-center gap-2">
          {ITEMS.map(({ name }, index) => (
            <div key={index} onClick={() => setCurrentIndex(index)}>
              <motion.button
                layout
                initial={false}
                className="flex cursor-pointer select-none items-center justify-center rounded-full border-none p-0"
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                  fontSize: "13px",
                }}
                animate={{
                  width: currentIndex === index ? 68 : 12,
                  height: currentIndex === index ? 28 : 12,
                }}
                transition={transition}
              >
                <motion.span
                  layout
                  initial={false}
                  className="block whitespace-nowrap px-3 py-1"
                  animate={{
                    opacity: currentIndex === index ? 1 : 0,
                    scale: currentIndex === index ? 1 : 0,
                    filter: currentIndex === index ? "blur(0)" : "blur(4px)",
                  }}
                  transition={transition}
                >
                  {name}
                </motion.span>
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
