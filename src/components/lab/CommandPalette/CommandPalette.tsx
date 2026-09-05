import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./CommandPalette.module.css";

const COMMANDS = [
  { label: "Toggle dark mode", group: "Theme" },
  { label: "New post", group: "Write" },
  { label: "Open lab", group: "Go to" },
  { label: "Copy current URL", group: "Share" },
  { label: "Search bookmarks", group: "Go to" },
  { label: "Toggle sound", group: "Theme" },
  { label: "Open guestbook", group: "Go to" },
  { label: "Clear draft", group: "Write" },
];

const layoutSpring = { type: "spring", stiffness: 520, damping: 44 } as const;

function highlight(label: string, query: string): ReactNode {
  if (!query) return label;

  const at = label.toLowerCase().indexOf(query.toLowerCase());
  if (at === -1) return label;

  return (
    <>
      {label.slice(0, at)}
      <mark className={styles.mark}>{label.slice(at, at + query.length)}</mark>
      {label.slice(at + query.length)}
    </>
  );
}

export default function CommandPalette() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [ran, setRan] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const results = useMemo(
    () =>
      COMMANDS.filter((command) =>
        command.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => () => clearTimeout(timer.current), []);

  function run(label: string) {
    setRan(label);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setRan(null), 1400);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(Math.min(activeIndex + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      run(results[activeIndex].label);
    } else if (event.key === "Escape") {
      setQuery("");
      setActive(0);
    }
  }

  return (
    <div className={styles.root}>
      <motion.div layout className={styles.panel} transition={layoutSpring}>
        <div className={styles.field}>
          <svg className={styles.search} viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="4.25" />
            <path d="M10.2 10.2 13.5 13.5" />
          </svg>
          <input
            className={styles.input}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Type a command"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={
              results[activeIndex] ? `palette-${activeIndex}` : undefined
            }
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <motion.ul
          layout
          id="palette-list"
          role="listbox"
          className={styles.list}
          transition={layoutSpring}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((command, index) => (
              <motion.li
                key={command.label}
                layout="position"
                id={`palette-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={styles.row}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ layout: layoutSpring, duration: 0.14 }}
                onPointerMove={() => setActive(index)}
                onClick={() => run(command.label)}
              >
                {index === activeIndex && (
                  <motion.div
                    layoutId="palette-cursor"
                    className={styles.cursor}
                    transition={layoutSpring}
                  />
                )}
                <span className={styles.label}>
                  {highlight(command.label, query.trim())}
                </span>
                <span className={styles.group}>{command.group}</span>
              </motion.li>
            ))}

            {results.length === 0 && (
              <motion.li
                key="empty"
                layout="position"
                className={styles.empty}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No commands match that
              </motion.li>
            )}
          </AnimatePresence>
        </motion.ul>

        <motion.div layout className={styles.footer} transition={layoutSpring}>
          <AnimatePresence mode="wait" initial={false}>
            {ran ? (
              <motion.span
                key={ran}
                className={styles.ran}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
              >
                Ran {ran}
              </motion.span>
            ) : (
              <motion.span
                key="hints"
                className={styles.hints}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                <kbd>↑</kbd>
                <kbd>↓</kbd> to move
                <kbd>↵</kbd> to run
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
