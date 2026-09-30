import { useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import styles from "./StepFlow.module.css";

const STEPS = ["Details", "Plan", "Review"];

const PLANS = [
  { id: "hobby", name: "Hobby", note: "For side projects", price: "Free" },
  { id: "pro", name: "Pro", note: "For people who ship", price: "$12/mo" },
  { id: "team", name: "Team", note: "For five or more", price: "$32/mo" },
];

const SHIFT = 24;
const BUTTON_PAD = 32;

const INSTANT: Transition = { duration: 0 };
const SLIDE: Transition = { type: "spring", duration: 0.4, bounce: 0 };
const RESIZE: Transition = { type: "spring", duration: 0.44, bounce: 0.06 };
const SELECT: Transition = { type: "spring", duration: 0.3, bounce: 0.12 };
const LABEL: Transition = { duration: 0.16, ease: "easeOut" };
const BACK: Transition = { duration: 0.18, ease: "easeOut" };

const pane: Variants = {
  enter: (direction: number) => ({
    x: direction * SHIFT,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (direction: number) => ({
    x: direction * -SHIFT,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.18, ease: "easeOut" },
  }),
};

export default function StepFlow() {
  const [[step, direction], setStep] = useState([0, 0]);
  const [name, setName] = useState("Ada Lin");
  const [email, setEmail] = useState("ada@example.com");
  const [plan, setPlan] = useState("pro");
  const [height, setHeight] = useState<number | "auto">("auto");
  const [labelWidth, setLabelWidth] = useState<number | "auto">("auto");
  const reduce = useReducedMotion() ?? false;
  const content = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const last = step === STEPS.length - 1;
  const chosen = PLANS.find((item) => item.id === plan)!;
  const label = last ? "Create account" : "Continue";

  useLayoutEffect(() => {
    const element = content.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.borderBoxSize[0].blockSize);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (labelRef.current)
      setLabelWidth(labelRef.current.offsetWidth + BUTTON_PAD);
  }, [label]);

  function go(next: number) {
    setStep([next, next > step ? 1 : -1]);
  }

  const slide = reduce ? INSTANT : SLIDE;
  const canGoBack = step > 0;

  return (
    <div className={styles.root}>
      <form
        className={styles.card}
        onSubmit={(event) => {
          event.preventDefault();
          go(last ? 0 : step + 1);
        }}
      >
        <div className={styles.header}>
          <ol className={styles.progress} aria-label="Progress">
            {STEPS.map((item, index) => (
              <li
                key={item}
                className={styles.segment}
                data-filled={index <= step || undefined}
                aria-current={index === step ? "step" : undefined}
              >
                <span className={styles.srOnly}>{item}</span>
              </li>
            ))}
          </ol>
          <span className={styles.count} aria-hidden="true">
            {`Step ${step + 1} of ${STEPS.length}`}
          </span>
        </div>

        <motion.div
          className={styles.stage}
          initial={false}
          animate={{ height }}
          transition={reduce ? INSTANT : RESIZE}
        >
          <div ref={content} className={styles.content}>
            <AnimatePresence
              mode="popLayout"
              custom={direction}
              initial={false}
            >
              <motion.div
                key={step}
                custom={direction}
                variants={pane}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slide}
                className={styles.pane}
              >
                {step === 0 && (
                  <>
                    <h3 className={styles.title}>Create your account</h3>
                    <p className={styles.description}>
                      Just the basics. You can change these later.
                    </p>
                    <div className={styles.fields}>
                      <label className={styles.field}>
                        <span className={styles.label}>Name</span>
                        <input
                          className={styles.input}
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          autoComplete="off"
                          required
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>Email</span>
                        <input
                          className={styles.input}
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          autoComplete="off"
                          required
                        />
                      </label>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h3 className={styles.title}>Choose a plan</h3>
                    <p className={styles.description}>
                      Switch or cancel whenever.
                    </p>
                    <div
                      className={styles.plans}
                      role="radiogroup"
                      aria-label="Plan"
                    >
                      {PLANS.map((item) => {
                        const selected = item.id === plan;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            className={styles.plan}
                            data-selected={selected || undefined}
                            onClick={() => setPlan(item.id)}
                          >
                            {selected && (
                              <motion.span
                                layoutId="step-flow-plan"
                                className={styles.ring}
                                transition={reduce ? INSTANT : SELECT}
                              />
                            )}
                            <span className={styles.radio} />
                            <span className={styles.planText}>
                              <span className={styles.planName}>
                                {item.name}
                              </span>
                              <span className={styles.planNote}>
                                {item.note}
                              </span>
                            </span>
                            <span className={styles.price}>{item.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className={styles.title}>Review</h3>
                    <p className={styles.description}>
                      Make sure everything looks right.
                    </p>
                    <dl className={styles.summary}>
                      {[
                        { term: "Name", value: name, at: 0 },
                        { term: "Email", value: email, at: 0 },
                        {
                          term: "Plan",
                          value: `${chosen.name}, ${chosen.price}`,
                          at: 1,
                        },
                      ].map((row) => (
                        <div key={row.term} className={styles.line}>
                          <dt className={styles.term}>{row.term}</dt>
                          <dd className={styles.value}>{row.value}</dd>
                          <button
                            type="button"
                            className={styles.edit}
                            onClick={() => go(row.at)}
                            aria-label={`Edit ${row.term.toLowerCase()}`}
                          >
                            Edit
                          </button>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className={styles.footer}>
          <AnimatePresence initial={false}>
            {canGoBack && (
              <motion.button
                key="back"
                type="button"
                className={styles.outline}
                onClick={() => go(step - 1)}
                initial={{ opacity: 0, x: -6, filter: "blur(2px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -6, filter: "blur(2px)" }}
                transition={reduce ? INSTANT : BACK}
              >
                Back
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            type="submit"
            className={styles.primary}
            initial={false}
            animate={{ width: labelWidth }}
            transition={slide}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={label}
                ref={labelRef}
                className={styles.primaryLabel}
                initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
                transition={reduce ? INSTANT : LABEL}
              >
                {label}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
