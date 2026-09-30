import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./CommandPalette.module.css";

type Command = {
  id: string;
  label: string;
  group: string;
  keys: string[];
  d: string[];
};

const COMMANDS: Command[] = [
  {
    id: "lab",
    label: "Open the lab",
    group: "Navigate",
    keys: ["G", "L"],
    d: [
      "M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.6a1 1 0 0 0 .9 1.4h12.8a1 1 0 0 0 .9-1.4l-5.1-10.2a2 2 0 0 1-.2-.9V2",
      "M8.5 2h7",
      "M7 16h10",
    ],
  },
  {
    id: "guestbook",
    label: "Open the guestbook",
    group: "Navigate",
    keys: ["G", "B"],
    d: [
      "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",
      "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
    ],
  },
  {
    id: "bookmarks",
    label: "Search bookmarks",
    group: "Navigate",
    keys: ["/"],
    d: ["m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"],
  },
  {
    id: "theme",
    label: "Toggle dark mode",
    group: "Appearance",
    keys: ["⇧", "D"],
    d: ["M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"],
  },
  {
    id: "sound",
    label: "Toggle sound",
    group: "Appearance",
    keys: ["⇧", "S"],
    d: [
      "M11 5 6 9H2v6h4l5 4V5z",
      "M15.5 8.5a5 5 0 0 1 0 7",
      "M19 5a10 10 0 0 1 0 14",
    ],
  },
  {
    id: "post",
    label: "New post",
    group: "Actions",
    keys: ["N"],
    d: ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],
  },
  {
    id: "link",
    label: "Copy current link",
    group: "Actions",
    keys: ["⌘", "⇧", "C"],
    d: [
      "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7",
      "M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
    ],
  },
  {
    id: "clear",
    label: "Clear draft",
    group: "Actions",
    keys: ["⌫"],
    d: [
      "m7 21-4.3-4.3a2.4 2.4 0 0 1 0-3.4l9.6-9.6a2.4 2.4 0 0 1 3.4 0l5.6 5.6a2.4 2.4 0 0 1 0 3.4L13 21",
      "M22 21H7",
      "m5 11 9 9",
    ],
  },
];

const GROUPS = ["Navigate", "Appearance", "Actions"];
const RADIUS = 16;

const INSTANT: Transition = { duration: 0 };
const SHELL: Transition = { type: "spring", duration: 0.36, bounce: 0.12 };
const CURSOR: Transition = { type: "spring", duration: 0.24, bounce: 0 };
const REVEAL: Transition = { duration: 0.16, delay: 0.1 };
const HIDE: Transition = { duration: 0.08 };

function Glyph({ d, size = 16 }: { d: string[]; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

function highlight(label: string, query: string): ReactNode {
  if (!query) return label;
  const at = label.toLowerCase().indexOf(query.toLowerCase());
  if (at === -1) return label;
  return (
    <>
      {label.slice(0, at)}
      <span className={styles.match}>
        {label.slice(at, at + query.length)}
      </span>
      {label.slice(at + query.length)}
    </>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion() ?? false;

  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const inView = useRef(false);

  const needle = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      COMMANDS.filter((command) => command.label.toLowerCase().includes(needle)),
    [needle],
  );
  const index = Math.min(active, Math.max(results.length - 1, 0));
  const current = results[index];

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!inView.current) return;
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      input.current?.focus({ preventScroll: true });
    } else {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    const box = list.current;
    const row = current && box?.querySelector<HTMLElement>(`#cmd-${current.id}`);
    if (!box || !row) return;
    const top = row.offsetTop - box.offsetTop;
    if (top < box.scrollTop) box.scrollTop = top - 28;
    else if (top + row.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = top + row.offsetHeight - box.clientHeight + 8;
    }
  }, [current]);

  function run() {
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const last = results.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(index >= last ? 0 : index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(index <= 0 ? last : index - 1);
    } else if (event.key === "Enter" && current) {
      event.preventDefault();
      run();
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const shell = reduce ? INSTANT : SHELL;

  return (
    <div ref={root} className={styles.root}>
      <AnimatePresence mode="popLayout" initial={false}>
        {!open ? (
          <motion.button
            key="trigger"
            type="button"
            layoutId="palette"
            className={styles.trigger}
            style={{ borderRadius: RADIUS }}
            transition={shell}
            onClick={() => setOpen(true)}
          >
            <motion.span layout="position" className={styles.idle}>
              Open command menu
              <span className={styles.keys}>
                <kbd className={styles.key}>⌘</kbd>
                <kbd className={styles.key}>K</kbd>
              </span>
            </motion.span>
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            layoutId="palette"
            className={styles.panel}
            style={{ borderRadius: RADIUS }}
            transition={shell}
          >
            <motion.div
              className={styles.inner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: reduce ? INSTANT : REVEAL }}
              exit={{ opacity: 0, transition: reduce ? INSTANT : HIDE }}
            >
              <div className={styles.field}>
                <span className={styles.search}>
                  <Glyph d={["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z", "m21 21-4.3-4.3"]} />
                </span>
                <input
                  ref={input}
                  className={styles.input}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search commands"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="cmd-list"
                  aria-activedescendant={current ? `cmd-${current.id}` : undefined}
                  aria-autocomplete="list"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div ref={list} id="cmd-list" role="listbox" className={styles.list}>
                {results.length === 0 ? (
                  <p className={styles.empty}>No commands match “{query.trim()}”</p>
                ) : (
                  GROUPS.map((group) => {
                    const items = results.filter((command) => command.group === group);
                    if (items.length === 0) return null;
                    return (
                      <div key={group} role="group" aria-label={group}>
                        <p className={styles.heading} aria-hidden="true">
                          {group}
                        </p>
                        {items.map((command) => {
                          const selected = command === current;
                          return (
                            <div
                              key={command.id}
                              id={`cmd-${command.id}`}
                              role="option"
                              aria-selected={selected}
                              className={styles.row}
                              data-active={selected || undefined}
                              onPointerMove={() => setActive(results.indexOf(command))}
                              onClick={run}
                            >
                              {selected && (
                                <motion.span
                                  layoutId="palette-cursor"
                                  className={styles.cursor}
                                  transition={reduce ? INSTANT : CURSOR}
                                />
                              )}
                              <span className={styles.icon}>
                                <Glyph d={command.d} />
                              </span>
                              <span className={styles.label}>
                                {highlight(command.label, query.trim())}
                              </span>
                              <span className={styles.shortcut} aria-hidden="true">
                                {command.keys.map((key) => (
                                  <kbd key={key} className={styles.chip}>
                                    {key}
                                  </kbd>
                                ))}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              <div className={styles.footer} aria-hidden="true">
                <span className={styles.hint}>
                  <kbd className={styles.chip}>↑</kbd>
                  <kbd className={styles.chip}>↓</kbd>
                  Navigate
                </span>
                <span className={styles.hint}>
                  <kbd className={styles.chip}>↵</kbd>
                  Run
                </span>
                <span className={`${styles.hint} ${styles.end}`}>
                  <kbd className={styles.chip}>esc</kbd>
                  Close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
