import { useState, type CSSProperties, type PointerEvent } from "react";

const demo: CSSProperties = {
  position: "relative",
  display: "grid",
  placeItems: "center",
  overflow: "hidden",
};

const label: CSSProperties = {
  position: "relative",
  color: "var(--text-subtle)",
  fontSize: "var(--fs-sm)",
};

export default function Spotlight() {
  const [pos, setPos] = useState({ x: "50%", y: "50%" });

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const r = event.currentTarget.getBoundingClientRect();
    setPos({
      x: `${event.clientX - r.left}px`,
      y: `${event.clientY - r.top}px`,
    });
  };

  const mask = `radial-gradient(150px circle at ${pos.x} ${pos.y}, #000 0%, transparent 72%)`;

  const grid: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(var(--border-strong) 1px, transparent 1px)",
    backgroundSize: "22px 22px",
    WebkitMaskImage: mask,
    maskImage: mask,
  };

  return (
    <div style={demo} onPointerMove={onMove}>
      <div style={grid} />
      <span style={label}>Move your cursor</span>
    </div>
  );
}
