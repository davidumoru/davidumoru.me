import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./StatusMorph.module.css";

type Status = "idle" | "saving" | "saved";

const LABELS: Record<Status, string> = {
  idle: "Save changes",
  saving: "Saving changes",
  saved: "Changes saved",
};

const SAVING_MS = 1400;
const SAVED_MS = 1600;
const ICON = 16;
const ICON_GAP = 8;

const INSTANT: Transition = { duration: 0 };
const GLIDE: Transition = { duration: 0.4, ease: [0.19, 1, 0.22, 1] };
const ENTER_FADE: Transition = { duration: 0.2, delay: 0.1 };
const EXIT_FADE: Transition = { duration: 0.1 };
const SWAP: Transition = { type: "spring", duration: 0.35, bounce: 0 };

function Spinner() {
  return (
    <svg
      width={ICON}
      height={ICON}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <path
        className={styles.spinner}
        d="M14.5 8A6.5 6.5 0 0 1 8 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Check({ reduce }: { reduce: boolean }) {
  return (
    <svg
      width={ICON}
      height={ICON}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <motion.path
        d="M5.25 8.25 7.25 10.25 10.75 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={reduce ? INSTANT : { duration: 0.3, delay: 0.1 }}
      />
    </svg>
  );
}

type Glyph = { id: number; char: string };

function lcs(a: string[], b: string[]): Map<number, number> {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array<number>(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const pairs = new Map<number, number>();
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) pairs.set(j++, i++);
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

function TextMorph({
  children,
  reduce,
}: {
  children: string;
  reduce: boolean;
}) {
  const previous = useRef<Glyph[]>([]);
  const next = useRef(0);

  const glyphs = useMemo(() => {
    const before = previous.current;
    const chars = Array.from(children);
    const pairs = lcs(
      before.map((glyph) => glyph.char),
      chars,
    );
    return chars.map((char, index) => {
      const match = pairs.get(index);
      return {
        id: match === undefined ? next.current++ : before[match].id,
        char,
      };
    });
  }, [children]);

  useEffect(() => {
    previous.current = glyphs;
  }, [glyphs]);

  return (
    <span className={styles.morph} aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        {glyphs.map(({ id, char }) => (
          <motion.span
            key={id}
            layout="position"
            className={styles.glyph}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: reduce ? INSTANT : { ...GLIDE, opacity: ENTER_FADE },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: reduce ? INSTANT : { ...GLIDE, opacity: EXIT_FADE },
            }}
            transition={reduce ? INSTANT : GLIDE}
          >
            {char === " " ? "\u00a0" : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

export default function StatusMorph() {
  const [status, setStatus] = useState<Status>("idle");
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (status === "idle") return;
    const id = setTimeout(
      () => setStatus(status === "saving" ? "saved" : "idle"),
      status === "saving" ? SAVING_MS : SAVED_MS,
    );
    return () => clearTimeout(id);
  }, [status]);

  const busy = status !== "idle";
  const morph = reduce ? INSTANT : GLIDE;
  const swap = reduce ? INSTANT : SWAP;

  return (
    <div className={styles.root}>
      <motion.button
        layout
        type="button"
        className={styles.button}
        style={{ borderRadius: 8 }}
        transition={morph}
        aria-disabled={busy || undefined}
        onClick={() => !busy && setStatus("saving")}
      >
        <motion.span
          className={styles.iconSlot}
          initial={false}
          animate={{
            width: busy ? ICON : 0,
            marginInlineEnd: busy ? ICON_GAP : 0,
          }}
          transition={morph}
        >
          <AnimatePresence initial={false}>
            {busy && (
              <motion.span
                key={status}
                className={styles.icon}
                initial={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }}
                transition={swap}
              >
                {status === "saving" ? <Spinner /> : <Check reduce={reduce} />}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
        <TextMorph reduce={reduce}>{LABELS[status]}</TextMorph>
        <span className={styles.srOnly}>{LABELS[status]}</span>
      </motion.button>
      <span className={styles.srOnly} aria-live="polite">
        {status === "saving" ? "Saving" : status === "saved" ? "Saved" : ""}
      </span>
    </div>
  );
}
