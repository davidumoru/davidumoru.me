import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./SelectionToolbar.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;
const ENTER: Transition = { duration: 0.25, ease: EASE };
const EXIT: Transition = { duration: 0.15, ease: [0.4, 0, 0.2, 1] };

const SETTLE = 250;
const EDGE = 12;
const GAP = 8;

const DOC_TITLE = "On unfinished work";
const DOC_BODY =
  "Most of what makes an interface feel considered never really announces itself. A list that settles instead of snapping, a label that just waits until you have stopped moving, a button that gives back a little when pressed. None of it survives a feature list, and so all of it is kind of the difference between software you tolerate and software you actually trust.";

const CHAR_MS = 14;
const THINK_MS = 700;

const FILLER = /\b(really|just|actually|basically|simply|very)\s+/gi;
const FORMAL: [RegExp, string][] = [
  [/\bkind of\b/gi, "somewhat"],
  [/\ba lot\b/gi, "considerably"],
  [/\bso\b/gi, "therefore"],
  [/\bbut\b/gi, "however"],
];
const tidy = (text: string) =>
  text
    .replace(FILLER, "")
    .replace(/\s{2,}/g, " ")
    .trim();

const EDITS = {
  Improve: (text: string) => {
    const out = tidy(text);
    return out.charAt(0).toUpperCase() + out.slice(1);
  },
  Shorten: (text: string) => {
    const words = tidy(text).split(/\s+/);
    const kept = words.slice(0, Math.max(4, Math.ceil(words.length * 0.6)));
    return kept.join(" ").replace(/[,;:]?$/, "") + ".";
  },
  Formal: (text: string) =>
    FORMAL.reduce((out, [from, to]) => out.replace(from, to), tidy(text)),
};

type EditName = keyof typeof EDITS;
const MORE: EditName[] = ["Improve", "Shorten", "Formal"];
const BUSY: Record<EditName, string> = {
  Improve: "Improving",
  Shorten: "Shortening",
  Formal: "Formalising",
};

type Patch = { node: HTMLElement; before: string; after: string };
type Edit = "idle" | "thinking" | "streaming" | "result";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const SPARKLE = [
  "M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z",
  "M20 3v4",
  "M22 5h-4",
];

function Glyph({ d }: { d: string[] }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      {d.map((path) => (
        <path key={path} d={path} {...stroke} />
      ))}
    </svg>
  );
}

const FORMATS = [
  {
    name: "Bold",
    command: "bold",
    tags: "b, strong",
    d: [
      "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",
    ],
  },
  {
    name: "Italic",
    command: "italic",
    tags: "i, em",
    d: ["M19 4h-9", "M14 20H5", "M15 4 9 20"],
  },
  {
    name: "Underline",
    command: "underline",
    tags: "u",
    d: ["M6 4v6a6 6 0 0 0 12 0V4", "M4 20h16"],
  },
  {
    name: "Strikethrough",
    command: "strikeThrough",
    tags: "s, strike, del",
    d: ["M16 4H9a3 3 0 0 0-2.83 4", "M14 12a4 4 0 0 1 0 8H6", "M4 12h16"],
  },
  {
    name: "Code",
    command: "code",
    tags: "code",
    d: ["m16 18 6-6-6-6", "M8 6l-6 6 6 6"],
  },
];

function format(command: string, tags: string) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;
  const range = selection.getRangeAt(0);
  const node = range.commonAncestorContainer;
  const element = node instanceof Element ? node : node.parentElement;
  const active = element?.closest(tags);

  if (active) {
    const first = active.firstChild;
    const last = active.lastChild;
    active.replaceWith(...Array.from(active.childNodes));
    if (first && last) {
      const next = document.createRange();
      next.setStartBefore(first);
      next.setEndAfter(last);
      selection.removeAllRanges();
      selection.addRange(next);
    }
    return;
  }

  if (command !== "code") {
    document.execCommand(command);
    return;
  }
  const code = document.createElement("code");
  code.appendChild(range.extractContents());
  range.insertNode(code);
  selection.removeAllRanges();
  const next = document.createRange();
  next.selectNodeContents(code);
  selection.addRange(next);
}

export default function SelectionToolbar() {
  const wrap = useRef<HTMLDivElement>(null);
  const prose = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const asking = useRef(false);
  const patch = useRef<Patch | null>(null);
  const frame = useRef(0);
  const fit = useRef<ResizeObserver | null>(null);

  const clamp = useCallback((element: HTMLElement) => {
    const bounds = wrap.current?.parentElement?.getBoundingClientRect();
    if (!bounds) return;
    element.style.translate = "-50% 0";
    const box = element.getBoundingClientRect();
    const anchor = element.parentElement?.getBoundingClientRect();
    const roomAbove = anchor ? anchor.top - GAP - box.height : box.top;
    if (roomAbove < bounds.top + EDGE) element.dataset.flip = "";
    else delete element.dataset.flip;
    const left = bounds.left + EDGE - box.left;
    const right = bounds.right - EDGE - box.right;
    const shift = left > 0 ? left : right < 0 ? right : 0;
    element.style.translate = `calc(-50% + ${shift}px) 0`;
  }, []);

  const liftRef = useCallback(
    (element: HTMLDivElement | null) => {
      fit.current?.disconnect();
      if (!element) return;
      fit.current = new ResizeObserver(() => clamp(element));
      fit.current.observe(element);
      clamp(element);
    },
    [clamp],
  );

  const [at, setAt] = useState<{ x: number; y: number; h: number } | null>(
    null,
  );
  const [askMode, setAskMode] = useState(false);
  const askRange = useRef<Range | null>(null);
  const shownAt = useRef(false);
  shownAt.current = at !== null;

  const show = useCallback(() => {
    const wrapEl = wrap.current;
    if (!wrapEl) return;
    let box: DOMRect;
    if (patch.current) {
      if (shownAt.current) return;
      box = patch.current.node.getBoundingClientRect();
    } else {
      const selection = window.getSelection();
      const proseEl = prose.current;
      if (
        !selection ||
        selection.isCollapsed ||
        !proseEl ||
        !proseEl.contains(selection.anchorNode) ||
        !proseEl.contains(selection.focusNode)
      ) {
        setAt(null);
        return;
      }
      box = selection.getRangeAt(0).getBoundingClientRect();
    }
    const origin = wrapEl.getBoundingClientRect();
    setAt({
      x: box.left + box.width / 2 - origin.left,
      y: box.top - origin.top,
      h: box.height,
    });
  }, []);

  const place = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(show);
  }, [show]);

  const lock = useCallback(() => {
    asking.current = true;
  }, []);

  const settle = useCallback((text: string) => {
    const current = patch.current;
    if (current) current.node.replaceWith(document.createTextNode(text));
    patch.current = null;
    asking.current = false;
    setAskMode(false);
    setAt(null);
  }, []);

  const enterAskMode = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      askRange.current = selection.getRangeAt(0).cloneRange();
      if ("highlights" in CSS) {
        CSS.highlights.set("lab-ask", new Highlight(askRange.current));
      }
    }
    asking.current = true;
    setAskMode(true);
  }, []);

  const exitAskMode = useCallback(() => {
    if ("highlights" in CSS) CSS.highlights.delete("lab-ask");
    const range = askRange.current;
    askRange.current = null;
    const selection = window.getSelection();
    if (range && selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    asking.current = false;
    setAskMode(false);
  }, []);

  useEffect(() => {
    let timer = 0;

    const onSelectionChange = () => {
      if (asking.current) return;
      window.clearTimeout(timer);
      const selection = window.getSelection();
      const selecting = selection && !selection.isCollapsed;
      if (shownAt.current && selecting && !dragging.current) {
        place();
        return;
      }
      setAt(null);
      if (!dragging.current) timer = window.setTimeout(show, SETTLE);
    };

    const onPointerDown = (event: PointerEvent) => {
      if ((event.target as Element).closest("[data-toolbar]")) return;
      if (patch.current) settle(patch.current.before);
      if ("highlights" in CSS) CSS.highlights.delete("lab-ask");
      asking.current = false;
      setAskMode(false);
      dragging.current = true;
      window.clearTimeout(timer);
      setAt(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (patch.current) settle(patch.current.before);
      if ("highlights" in CSS) CSS.highlights.delete("lab-ask");
      asking.current = false;
      setAskMode(false);
      setAt(null);
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) selection.collapseToEnd();
    };

    const onPointerUp = () => {
      if (asking.current) return;
      dragging.current = false;
      show();
    };

    const observer = new ResizeObserver(place);
    if (wrap.current) observer.observe(wrap.current);

    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", place);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame.current);
      observer.disconnect();
      window.removeEventListener("resize", place);
      if ("highlights" in CSS) CSS.highlights.delete("lab-ask");
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
    };
  }, [show, place, settle]);

  return (
    <div className={styles.root}>
      <div ref={wrap} className={styles.sheet}>
        <div
          ref={prose}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          role="textbox"
          aria-multiline="true"
          aria-label={DOC_TITLE}
          className={styles.prose}
        >
          <h3 className={styles.title}>{DOC_TITLE}</h3>
          <p className={styles.body}>{DOC_BODY}</p>
        </div>

        <p className={styles.nudge} aria-hidden="true">
          Select a sentence
        </p>

        <AnimatePresence>
          {at && (
            <motion.div
              key="toolbar"
              className={styles.anchor}
              style={
                {
                  left: at.x,
                  top: at.y,
                  "--h": `${at.h}px`,
                } as React.CSSProperties
              }
              initial={{ opacity: 0, scale: 0.96, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.99, y: 2, transition: EXIT }}
              transition={ENTER}
            >
              <div ref={liftRef} className={styles.lift}>
                <Toolbar
                  askMode={askMode}
                  onAsk={enterAskMode}
                  onExitAsk={exitAskMode}
                  patch={patch}
                  onLock={lock}
                  onSettle={settle}
                  onReflow={place}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Toolbar({
  askMode,
  onAsk,
  onExitAsk,
  patch,
  onLock,
  onSettle,
  onReflow,
}: {
  askMode: boolean;
  onAsk: () => void;
  onExitAsk: () => void;
  patch: React.RefObject<Patch | null>;
  onLock: () => void;
  onSettle: (text: string) => void;
  onReflow: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const lastWidth = useRef(0);
  const lastPhase = useRef("");
  const widthAnim = useRef<Animation | null>(null);
  const reduce = useReducedMotion() ?? false;

  const [expanded, setExpanded] = useState(false);
  const [edit, setEdit] = useState<Edit>("idle");
  const [action, setAction] = useState<EditName>("Improve");
  const [typed, setTyped] = useState(0);
  const [pressed, setPressed] = useState<Record<string, boolean>>({});

  const refresh = useCallback(() => {
    const selection = window.getSelection();
    const node = selection?.anchorNode;
    const element = node instanceof Element ? node : node?.parentElement;
    setPressed(
      Object.fromEntries(
        FORMATS.map((item) => [
          item.command,
          Boolean(element?.closest(item.tags)),
        ]),
      ),
    );
  }, []);

  useEffect(() => {
    refresh();
    document.addEventListener("selectionchange", refresh);
    return () => document.removeEventListener("selectionchange", refresh);
  }, [refresh]);

  const phase = edit !== "idle" ? edit : askMode ? "ask" : "idle";

  const run = (name: EditName) => {
    if (!patch.current) {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;
      const range = selection.getRangeAt(0);
      const before = range.toString();
      const node = document.createElement("span");
      node.className = styles.patch;
      node.textContent = before;
      range.deleteContents();
      range.insertNode(node);
      selection.removeAllRanges();
      patch.current = { node, before, after: before };
    } else {
      patch.current.node.textContent = patch.current.before;
    }
    patch.current.after = EDITS[name](patch.current.before);
    onLock();
    setAction(name);
    setExpanded(false);
    setTyped(0);
    setEdit("thinking");
    onReflow();
  };

  useEffect(() => {
    if (edit !== "thinking") return;
    const timer = window.setTimeout(
      () => {
        if (patch.current) patch.current.node.textContent = "";
        setEdit("streaming");
      },
      reduce ? 0 : THINK_MS,
    );
    return () => window.clearTimeout(timer);
  }, [edit, reduce, patch]);

  useEffect(() => {
    if (edit !== "streaming") return;
    const current = patch.current;
    if (!current) return;
    if (typed >= current.after.length) {
      setEdit("result");
      return;
    }
    const timer = window.setTimeout(
      () => {
        current.node.textContent = current.after.slice(0, typed + 1);
        setTyped((count) => count + 1);
        onReflow();
      },
      reduce ? 0 : CHAR_MS,
    );
    return () => window.clearTimeout(timer);
  }, [edit, typed, reduce, patch, onReflow]);

  useLayoutEffect(() => {
    const barEl = bar.current;
    const rowEl = row.current;
    if (!barEl || !rowEl) return;

    const next = Math.ceil(rowEl.scrollWidth);
    const previous =
      lastWidth.current || Math.ceil(barEl.getBoundingClientRect().width);

    if (!reduce && lastPhase.current && lastPhase.current !== phase) {
      widthAnim.current?.cancel();
      const animation = barEl.animate(
        [{ width: `${previous}px` }, { width: `${next}px` }],
        { duration: 320, easing: "cubic-bezier(0.23,1,0.32,1)" },
      );
      widthAnim.current = animation;
      animation.onfinish = () => {
        lastWidth.current = next;
        widthAnim.current = null;
      };
    } else {
      lastWidth.current = next;
    }
    lastPhase.current = phase;
    return () => widthAnim.current?.cancel();
  }, [phase, reduce]);

  useEffect(() => {
    const element = row.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      if (widthAnim.current?.playState === "running") return;
      lastWidth.current = Math.ceil(element.scrollWidth);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const submit = () => {
    if (input.current) {
      input.current.value = "";
      input.current.blur();
    }
    onExitAsk();
  };

  return (
    <div
      role="toolbar"
      aria-label="Selection"
      data-toolbar
      data-ask={askMode ? "" : undefined}
      onMouseDown={(event) => {
        if ((event.target as HTMLElement).tagName !== "INPUT") {
          event.preventDefault();
        }
      }}
      ref={bar}
      className={styles.bar}
    >
      <div ref={row} className={styles.row}>
        {edit !== "idle" ? (
          <>
            {edit !== "result" ? (
              <span className={styles.busy}>
                <span className={styles.spinner} aria-hidden="true" />
                <span
                  className={edit === "thinking" ? styles.shimmer : undefined}
                >
                  {BUSY[action]}…
                </span>
              </span>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.keep}
                  onClick={() => onSettle(patch.current?.after ?? "")}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className={styles.word}
                  onClick={() => onSettle(patch.current?.before ?? "")}
                >
                  Revert
                </button>
                <span className={styles.rule} />
                <button
                  type="button"
                  className={styles.icon}
                  aria-label="Try again"
                  onClick={() => run(action)}
                >
                  <Glyph d={["M20 11a8 8 0 1 0-2.3 5.7", "M20 5v6h-6"]} />
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className={styles.ask}
              onClick={() => {
                if (askMode) return;
                setExpanded(false);
                onAsk();
                input.current?.focus({ preventScroll: true });
              }}
            >
              <span
                className={styles.spark}
                data-stirring={askMode || undefined}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  {SPARKLE.map((path) => (
                    <path key={path} d={path} {...stroke} />
                  ))}
                </svg>
              </span>
              <span className={styles.out}>Ask</span>
            </button>

            <span className={`${styles.rule} ${styles.out}`} />

            {FORMATS.map((item) => (
              <button
                key={item.name}
                type="button"
                aria-label={item.name}
                aria-pressed={pressed[item.command] ?? false}
                className={`${styles.icon} ${styles.out}`}
                onClick={() => {
                  format(item.command, item.tags);
                  refresh();
                  onReflow();
                }}
              >
                <Glyph d={item.d} />
              </button>
            ))}

            <div
              className={`${styles.more} ${styles.out}`}
              data-open={expanded || undefined}
              aria-hidden={!expanded || undefined}
            >
              <span className={styles.rule} />
              {MORE.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={styles.word}
                  tabIndex={expanded ? 0 : -1}
                  onClick={() => run(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            <span className={`${styles.rule} ${styles.out}`} />
            <button
              type="button"
              className={`${styles.icon} ${styles.out}`}
              aria-expanded={expanded}
              aria-label={expanded ? "Fewer options" : "More options"}
              onClick={() => setExpanded((value) => !value)}
            >
              <span
                className={styles.chevron}
                data-open={expanded || undefined}
              >
                <Glyph d={["m9 6 6 6-6 6"]} />
              </span>
            </button>

            <div className={`${styles.field} ${styles.in}`}>
              <input
                ref={input}
                type="text"
                aria-label="Ask about the selection"
                placeholder="Ask about this…"
                className={styles.input}
                onKeyDown={(event) => event.key === "Enter" && submit()}
              />
              <button
                type="button"
                aria-label="Send"
                onClick={submit}
                className={styles.send}
              >
                <Glyph d={["M5 12h14", "M12 5l7 7-7 7"]} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
