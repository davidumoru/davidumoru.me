import { motion } from "framer-motion";
import { useState } from "react";

const transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
} as const;

const ITEMS = [
  {
    name: "US",
    image:
      "https://res.cloudinary.com/deha0jqdf/image/upload/f_auto,q_auto/v1747352582/United_States_xom8ae.jpg",
  },
  {
    name: "Canada",
    image:
      "https://res.cloudinary.com/deha0jqdf/image/upload/f_auto,q_auto/v1747352587/Canada_wkha0g.jpg",
  },
  {
    name: "Brazil",
    image:
      "https://res.cloudinary.com/deha0jqdf/image/upload/f_auto,q_auto/v1747352582/Brazil_hy5ct1.jpg",
  },
  {
    name: "Japan",
    image:
      "https://res.cloudinary.com/deha0jqdf/image/upload/f_auto,q_auto/v1747352592/Japan_eqqjo0.jpg",
  },
  {
    name: "Italy",
    image:
      "https://res.cloudinary.com/deha0jqdf/image/upload/f_auto,q_auto/v1747352593/Italy_qjn12f.jpg",
  },
];

export default function AnimatedCardsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{
                y: currentIndex === index ? 0 : -32,
                scale: currentIndex === index ? 1 : 0.9,
                opacity: currentIndex === index ? 1 : 0.6,
              }}
              transition={transition}
              className={`h-[200px] w-[200px] overflow-hidden rounded-xl ${
                currentIndex === index
                  ? "shadow-lg shadow-black/20"
                  : "shadow-sm shadow-black/10"
              }`}
              style={{ backgroundColor: "var(--gray-6)" }}
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
                className="flex cursor-pointer select-none items-center justify-center rounded-full border-none p-0 outline-none"
                style={{
                  backgroundColor:
                    currentIndex === index ? "var(--gray-12)" : "var(--gray-6)",
                  color:
                    currentIndex === index ? "var(--gray-1)" : "var(--gray-11)",
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
