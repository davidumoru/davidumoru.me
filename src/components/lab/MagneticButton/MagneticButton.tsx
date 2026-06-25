import { useRef, type CSSProperties, type PointerEvent } from "react";
import { animate, motion, useMotionValue } from "motion/react";

const demo: CSSProperties = {
  display: "grid",
  placeItems: "center",
};

const magnet: CSSProperties = {
  padding: "var(--space-sm) var(--space-lg)",
  border: "none",
  borderRadius: "var(--radius-2xl)",
  background: "var(--primary)",
  color: "#fff",
  fontFamily: "var(--font-inter)",
  fontSize: "var(--fs-base)",
  fontWeight: 500,
  cursor: "pointer",
};

const STRENGTH = 0.2;
const RADIUS = 100;

export default function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const reset = () => {
    animate(x, 0, { type: "spring", stiffness: 220, damping: 20 });
    animate(y, 0, { type: "spring", stiffness: 220, damping: 20 });
  };

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const btn = ref.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const dx = event.clientX - (r.left + r.width / 2);
    const dy = event.clientY - (r.top + r.height / 2);

    if (Math.hypot(dx, dy) < RADIUS) {
      const spring = { type: "spring" as const, stiffness: 350, damping: 22 };
      animate(x, dx * STRENGTH, spring);
      animate(y, dy * STRENGTH, spring);
    } else {
      reset();
    }
  };

  return (
    <div style={demo} onPointerMove={onMove} onPointerLeave={reset}>
      <motion.button ref={ref} type="button" style={{ ...magnet, x, y }}>
        Hover me
      </motion.button>
    </div>
  );
}
