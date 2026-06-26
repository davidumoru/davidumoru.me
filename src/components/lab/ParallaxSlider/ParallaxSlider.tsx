import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import styles from "./ParallaxSlider.module.css";

const IMAGES = [
  "https://images.unsplash.com/photo-1534748626724-c6256f106a08?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1609108974257-53a94846d5a6?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634685331716-79cad5e154d6?q=80&w=1528&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528120369764-0423708119ae?q=80&w=1288&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606914343270-759743aa2c4e?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1698557133610-b3cba700cfcb?q=80&w=1231&auto=format&fit=crop",
];

const CARD = 240;
const GAP = 16;
const COUNT = IMAGES.length;
const STEP = CARD + GAP;
const CONTENT = COUNT * CARD + (COUNT - 1) * GAP;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

function Slide({
  x,
  index,
  width,
  parallax,
  src,
}: {
  x: MotionValue<number>;
  index: number;
  width: number;
  parallax: number;
  src: string;
}) {
  const offset = index * STEP;

  const imageX = useTransform(x, (v) =>
    width ? (0.5 - (v + offset + CARD / 2) / width) * parallax : 0,
  );

  return (
    <div className={styles.slide}>
      <motion.img
        className={styles.image}
        style={{ x: imageX }}
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

export default function ParallaxSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [width, setWidth] = useState(0);
  const reduce = useReducedMotion();
  const parallax = reduce ? 0 : 80;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.offsetWidth);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const minX = Math.min(0, width - CONTENT);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Only claim horizontal intent — leave vertical scroll to the page.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      x.set(clamp(x.get() - e.deltaX, minX, 0));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [minX, x]);

  return (
    <div className={styles.root} ref={ref}>
      <motion.div
        className={styles.track}
        style={{ x }}
        drag="x"
        dragConstraints={{ left: minX, right: 0 }}
        dragElastic={0.12}
        dragMomentum={!reduce}
        whileDrag={{ cursor: "grabbing" }}
      >
        {IMAGES.map((src, i) => (
          <Slide
            key={i}
            x={x}
            index={i}
            width={width}
            parallax={parallax}
            src={src}
          />
        ))}
      </motion.div>
    </div>
  );
}
