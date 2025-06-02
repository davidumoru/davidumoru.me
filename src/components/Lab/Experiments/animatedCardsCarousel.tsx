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
    <div
      style={{
        position: "relative",
        display: "flex",
        height: "200px",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-96px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={false}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "16px",
          }}
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
              style={{
                height: "200px",
                width: "200px",
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: itemBgColor,
                boxShadow:
                  currentIndex === index
                    ? "0 8px 24px rgba(0,0,0,0.2)"
                    : "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            height: "32px",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {ITEMS.map(({ name }, index) => (
            <div key={index} onClick={() => setCurrentIndex(index)}>
              <motion.button
                layout
                initial={false}
                style={{
                  display: "flex",
                  cursor: "pointer",
                  userSelect: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  backgroundColor: buttonBgColor,
                  fontSize: "0.875rem",
                  color: buttonTextColor,
                  border: "none",
                  padding: "0",
                }}
                animate={{
                  width: currentIndex === index ? 68 : 12,
                  height: currentIndex === index ? 26 : 12,
                }}
                transition={transition}
              >
                <motion.span
                  layout
                  initial={false}
                  style={{
                    display: "block",
                    whiteSpace: "nowrap",
                    padding: "4px 12px",
                  }}
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
