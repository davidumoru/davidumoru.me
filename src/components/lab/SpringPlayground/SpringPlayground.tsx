import { useRef, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import styles from "./SpringPlayground.module.css";

type Config = { stiffness: number; damping: number; mass: number };

export default function SpringPlayground() {
  const [cfg, setCfg] = useState<Config>({
    stiffness: 300,
    damping: 20,
    mass: 1,
  });
  const areaRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springBack = () => {
    const options = { type: "spring" as const, ...cfg };
    animate(x, 0, options);
    animate(y, 0, options);
  };

  return (
    <div className={styles.root}>
      <div ref={areaRef} className={styles.area}>
        <motion.div
          className={styles.ball}
          style={{ x, y }}
          drag
          dragConstraints={areaRef}
          dragElastic={0.6}
          whileDrag={{ cursor: "grabbing", scale: 1.05 }}
          onDragEnd={springBack}
        />
      </div>

      <div className={styles.controls}>
        <Slider
          label="Stiffness"
          min={20}
          max={1000}
          step={10}
          value={cfg.stiffness}
          onChange={(v) => setCfg((c) => ({ ...c, stiffness: v }))}
        />
        <Slider
          label="Damping"
          min={1}
          max={50}
          step={1}
          value={cfg.damping}
          onChange={(v) => setCfg((c) => ({ ...c, damping: v }))}
        />
        <Slider
          label="Mass"
          min={0.1}
          max={5}
          step={0.1}
          value={cfg.mass}
          onChange={(v) => setCfg((c) => ({ ...c, mass: v }))}
        />
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.row}>
      <span className={styles.label}>{label}</span>
      <input
        type="range"
        className={styles.range}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className={styles.value}>{value}</span>
    </label>
  );
}
