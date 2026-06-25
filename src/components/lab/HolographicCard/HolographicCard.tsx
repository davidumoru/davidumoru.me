import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

const demo: CSSProperties = {
  display: "grid",
  placeItems: "center",
};

const cardBase: CSSProperties = {
  position: "relative",
  width: "14rem",
  aspectRatio: "3 / 4",
  borderRadius: "var(--radius-2xl)",
  background: "linear-gradient(145deg, var(--gray-3), var(--gray-1))",
  boxShadow: "var(--shadow-lg)",
  transformStyle: "preserve-3d",
  overflow: "hidden",
  cursor: "pointer",
};

const content: CSSProperties = {
  position: "absolute",
  inset: "auto var(--space-lg) var(--space-lg)",
  display: "flex",
  flexDirection: "column",
  fontFamily: "var(--font-instrument-serif), Georgia, serif",
  color: "var(--text)",
};

const label: CSSProperties = {
  fontSize: "var(--fs-sm)",
  color: "var(--text-subtle)",
};
const title: CSSProperties = { fontSize: "var(--fs-2xl)", lineHeight: 1.1 };

const MAX = 14;

export default function HolographicCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (event.clientX - r.left) / r.width;
    const py = (event.clientY - r.top) / r.height;
    setT({
      rx: (0.5 - py) * MAX,
      ry: (px - 0.5) * MAX,
      mx: px * 100,
      my: py * 100,
    });
  };

  const leave = () => {
    setActive(false);
    setT((v) => ({ ...v, rx: 0, ry: 0 }));
  };

  return (
    <div style={demo}>
      <div
        ref={ref}
        style={{
          ...cardBase,
          transform: `perspective(800px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transition: active
            ? "none"
            : "transform var(--duration-slow) var(--ease-out)",
        }}
        onPointerEnter={() => setActive(true)}
        onPointerMove={onMove}
        onPointerLeave={leave}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${t.mx}% ${t.my}%, rgb(255 255 255 / 0.45), transparent 45%)`,
            mixBlendMode: "soft-light",
            opacity: active ? 1 : 0,
            transition: "opacity var(--duration-normal) ease",
          }}
        />
        <div style={content}>
          <span style={label}>Design</span>
          <span style={title}>Engineer</span>
        </div>
      </div>
    </div>
  );
}
