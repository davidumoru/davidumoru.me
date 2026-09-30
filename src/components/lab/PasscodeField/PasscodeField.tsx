import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./PasscodeField.module.css";

const LENGTH = 6;
const CODE = "123456";
const CHECK_MS = 700;
const HOLD_MS = 1800;
const WRONG_MS = 1000;
const TRAIL_MS = 440;
const STAGGER_MS = 46;

const INSTANT: Transition = { duration: 0 };
const RING: Transition = { type: "spring", duration: 0.3, bounce: 0.18 };
const RING_SWEEP: Transition = { type: "spring", duration: 0.42, bounce: 0.18 };
const DIGIT_SPRING: Transition = { type: "spring", duration: 0.3, bounce: 0.2 };
const FADE: Transition = { duration: 0.2 };
const SHAKE: Transition = { duration: 0.34 };

const DIGIT = {
  hidden: {
    opacity: 0,
    transform: "translateY(6px) rotateX(-35deg)",
    filter: "blur(2px)",
  },
  shown: {
    opacity: 1,
    transform: "translateY(0px) rotateX(0deg)",
    filter: "blur(0px)",
  },
  gone: {
    opacity: 0,
    transform: "translateY(-2px) rotateX(15deg)",
    filter: "blur(2px)",
  },
};

type Status = "idle" | "checking" | "ok" | "bad";
type Sweep = { id: number; from: number; to: number; tone: "paste" };
type Box = { x: number; width: number };

export default function PasscodeField() {
  const [value, setValue] = useState("");
  const [range, setRange] = useState<[number, number] | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [sweep, setSweep] = useState<Sweep | null>(null);
  const [box, setBox] = useState<Box | null>(null);

  const input = useRef<HTMLInputElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const sweepId = useRef(0);
  const reduce = useReducedMotion() ?? false;

  const locked = status === "checking" || status === "ok";

  const syncRange = () => {
    const element = input.current;
    if (!element || document.activeElement !== element) {
      setRange(null);
      return;
    }
    const start = element.selectionStart ?? 0;
    const end = element.selectionEnd ?? start;
    if (start === end) {
      setRange([Math.min(start, LENGTH - 1), Math.min(start, LENGTH - 1)]);
    } else {
      setRange([start, Math.max(start, end - 1)]);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (locked) return;
    const next = event.target.value.replace(/\D/g, "").slice(0, LENGTH);
    const grew = next.length - value.length;
    setValue(next);
    if (!reduce && grew > 1) {
      sweepId.current += 1;
      setSweep({
        id: sweepId.current,
        from: value.length,
        to: next.length,
        tone: "paste",
      });
    }
    if (status === "bad") setStatus("idle");
  };

  useEffect(() => {
    if (value.length === LENGTH && status === "idle") setStatus("checking");
  }, [value, status]);

  useEffect(() => {
    syncRange();
  }, [value]);

  useEffect(() => {
    if (status !== "checking") return;
    const timer = window.setTimeout(
      () => setStatus(value === CODE ? "ok" : "bad"),
      CHECK_MS,
    );
    return () => window.clearTimeout(timer);
  }, [status, value]);

  useEffect(() => {
    if (status === "ok") {
      const timer = window.setTimeout(() => {
        setValue("");
        setStatus("idle");
      }, HOLD_MS);
      return () => window.clearTimeout(timer);
    }
    if (status === "bad") {
      const timer = window.setTimeout(() => {
        setValue("");
        setStatus("idle");
        input.current?.focus();
      }, WRONG_MS);
      return () => window.clearTimeout(timer);
    }
  }, [status, reduce]);

  useEffect(() => {
    if (!sweep) return;
    const span = TRAIL_MS + STAGGER_MS * (sweep.to - sweep.from);
    const timer = window.setTimeout(() => setSweep(null), span);
    return () => window.clearTimeout(timer);
  }, [sweep]);

  useLayoutEffect(() => {
    if (!range || !row.current) {
      setBox(null);
      return;
    }
    const measure = () => {
      const head = slots.current[range[0]];
      const tail = slots.current[range[1]];
      if (!head || !tail || !row.current) return;
      const origin = row.current.getBoundingClientRect();
      const from = head.getBoundingClientRect();
      const to = tail.getBoundingClientRect();
      setBox({ x: from.left - origin.left, width: to.right - from.left });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row.current);
    return () => observer.disconnect();
  }, [range]);

  const ring = reduce ? INSTANT : sweep ? RING_SWEEP : RING;

  return (
    <div className={styles.root}>
      <motion.div
        ref={row}
        className={styles.row}
        data-status={status}
        style={
          {
            "--trail": `${TRAIL_MS}ms`,
            "--stagger": `${STAGGER_MS}ms`,
          } as React.CSSProperties
        }
        animate={
          status === "bad" && !reduce
            ? { x: [0, -6, 5, -3, 0] }
            : { x: 0 }
        }
        transition={SHAKE}
        onClick={() => input.current?.focus()}
      >
        {Array.from({ length: LENGTH }, (_, index) => {
          const char = value[index];
          const swept =
            sweep !== null && index >= sweep.from && index < sweep.to;

          return (
            <div key={index} className={styles.cell}>
              <div
                ref={(node) => {
                  slots.current[index] = node;
                }}
                className={styles.slot}
                data-filled={char ? true : undefined}
                style={
                  {
                    "--i": swept && sweep ? index - sweep.from : 0,
                    "--n": index,
                  } as React.CSSProperties
                }
              >
                {swept && sweep && (
                  <span
                    key={`${sweep.id}-${index}`}
                    aria-hidden="true"
                    className={styles.trail}
                    data-tone={sweep.tone}
                  />
                )}

                <span aria-hidden="true" className={styles.ghost}>
                  0
                </span>

                <AnimatePresence initial={false}>
                  {char && (
                    <motion.span
                      key={`${index}-${char}`}
                      className={styles.digit}
                      variants={DIGIT}
                      initial={reduce ? false : "hidden"}
                      animate="shown"
                      exit={reduce ? { opacity: 0 } : "gone"}
                      transition={reduce ? INSTANT : DIGIT_SPRING}
                    >
                      {char}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {index === LENGTH / 2 - 1 && (
                <span className={styles.dash} aria-hidden="true" />
              )}
            </div>
          );
        })}

        <motion.span
          aria-hidden="true"
          className={styles.ring}
          initial={false}
          animate={{
            x: box?.x ?? 0,
            width: box?.width ?? 0,
            opacity: box && status === "idle" ? 1 : 0,
          }}
          transition={{
            x: ring,
            width: ring,
            opacity: reduce ? INSTANT : FADE,
          }}
        />

        <input
          ref={input}
          className={styles.input}
          value={value}
          onChange={onChange}
          onSelect={syncRange}
          onKeyUp={syncRange}
          onClick={syncRange}
          onFocus={syncRange}
          onBlur={() => setRange(null)}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={LENGTH}
          spellCheck={false}
          aria-label="Passcode"
          aria-invalid={status === "bad" || undefined}
          disabled={locked}
        />
      </motion.div>

      <p className={styles.hint}>
        The code is {CODE}
      </p>

      <p className="sr-only" role="status">
        {status === "checking"
          ? "Checking the code"
          : status === "ok"
            ? "Code verified"
            : status === "bad"
              ? "That code is wrong"
              : ""}
      </p>
    </div>
  );
}
