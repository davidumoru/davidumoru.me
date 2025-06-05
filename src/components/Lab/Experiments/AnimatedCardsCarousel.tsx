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
    const updateTheme = () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
      setTheme(currentTheme);
    };

    updateTheme();

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          updateTheme();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!document.documentElement.hasAttribute("data-theme")) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="relative flex h-[200px] w-full flex-col items-center justify-center">
      <div className="absolute top-[-96px] flex flex-col items-center justify-center">
        <motion.div
          initial={false}
          className="flex justify-start gap-4"
          animate={{ x: -currentIndex * (200 + 16) + 432 }}
          transition={transition}
        >
          {ITEMS.map(({ image, name }, index) => (
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
              className={`h-[200px] w-[200px] overflow-hidden rounded-xl 
                         ${
                           theme === "dark" ? "bg-stone-700" : "bg-gray-200/60"
                         } 
                         ${
                           currentIndex === index ? "shadow-2xl" : "shadow-md"
                         }`}
            >
              <img
                src={image}
                alt={name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 ease-in-out"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://placehold.co/200x200/${
                    theme === "dark" ? "292524" : "E5E7EB"
                  }/A8A29E?text=${name}`;
                }}
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
                className={`flex cursor-pointer select-none items-center justify-center rounded-full 
                           text-sm font-medium border-none p-0
                           ${
                             theme === "dark"
                               ? "bg-stone-700 text-stone-400"
                               : "bg-gray-200 text-stone-400"
                           }`}
                animate={{
                  width: currentIndex === index ? 68 : 12,
                  height: currentIndex === index ? 26 : 12,
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
