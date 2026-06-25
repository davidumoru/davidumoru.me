import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";

const demo: CSSProperties = {
  display: "grid",
  placeItems: "center",
};

const trackBase: CSSProperties = {
  position: "relative",
  width: "60px",
  height: "34px",
  padding: 0,
  border: "1px solid var(--border)",
  borderRadius: "999px",
  cursor: "pointer",
  transition: "background var(--duration-normal) var(--ease-out)",
};

const knob: CSSProperties = {
  position: "absolute",
  insetBlockStart: "3px",
  insetInlineStart: "3px",
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "var(--shadow-sm)",
};

export default function SpringToggle() {
  const [on, setOn] = useState(false);

  return (
    <div style={demo}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((o) => !o)}
        style={{
          ...trackBase,
          background: on ? "var(--primary)" : "var(--surface-active)",
          borderColor: on ? "transparent" : "var(--border)",
        }}
      >
        <motion.span
          style={knob}
          animate={{ x: on ? 28 : 0 }}
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        />
      </button>
    </div>
  );
}
