import { useState, type CSSProperties } from "react";
import styles from "./SplitFields.module.css";

const FIELDS = [
  { label: "Name", value: "Ada Lin" },
  { label: "Email", value: "ada@example.com" },
  { label: "Role", value: "Product designer" },
  { label: "Company", value: "Northwind" },
];

const RADIUS = "var(--radius-xl)";
const GAP = "0.625rem";

export default function SplitFields() {
  const [values, setValues] = useState(FIELDS);
  const [focused, setFocused] = useState<number | null>(null);
  const last = values.length - 1;

  const shape = (index: number): CSSProperties => {
    const split = focused !== null;
    const opens = index === 0 || (split && (index === focused || index === focused + 1));
    const closes =
      index === last || (split && (index === focused || index === focused - 1));

    return {
      borderStartStartRadius: opens ? RADIUS : 0,
      borderStartEndRadius: opens ? RADIUS : 0,
      borderEndStartRadius: closes ? RADIUS : 0,
      borderEndEndRadius: closes ? RADIUS : 0,
      marginBlockStart: index > 0 && opens ? GAP : 0,
    };
  };

  return (
    <div className={styles.root}>
      <form
        className={styles.group}
        onSubmit={(event) => event.preventDefault()}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(null);
          }
        }}
      >
        {values.map((field, index) => (
          <label
            key={field.label}
            className={styles.row}
            data-focused={focused === index || undefined}
            style={shape(index)}
            onMouseDown={(event) => {
              const input = event.currentTarget.querySelector("input");
              if (!input || event.target === input) return;
              event.preventDefault();
              input.focus();
            }}
          >
            <span className={styles.label}>{field.label}</span>
            <input
              className={styles.input}
              value={field.value}
              autoComplete="off"
              spellCheck={false}
              onFocus={() => setFocused(index)}
              onChange={(event) =>
                setValues((current) =>
                  current.map((row, i) =>
                    i === index ? { ...row, value: event.target.value } : row,
                  ),
                )
              }
            />
          </label>
        ))}
      </form>

    </div>
  );
}
