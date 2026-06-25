import styles from "./Marquee.module.css";

const items = [
  "Springs",
  "Easing",
  "Optical alignment",
  "OKLCH",
  "Tabular nums",
  "Hairlines",
  "Grain",
  "Squircles",
];

export default function Marquee() {
  return (
    <div className={styles.demo}>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {items.map((item, i) => (
            <span key={i} className={styles.chip}>
              {item}
            </span>
          ))}
          {items.map((item, i) => (
            <span key={`dup-${i}`} className={styles.chip} aria-hidden="true">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
