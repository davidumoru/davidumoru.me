import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import styles from "./StepFlow.module.css";

const STEPS = [
  {
    title: "Your details",
    body: "Name and email, nothing else. You can change either of them later.",
    fields: ["Full name", "Email"],
  },
  {
    title: "Pick a plan",
    body: "Monthly or yearly. Yearly is two months cheaper and easier to forget about.",
    fields: ["Plan", "Billing address", "VAT number"],
  },
  {
    title: "Confirm",
    body: "That is everything. Nothing is charged until you press the button.",
    fields: ["Card"],
  },
];

const SHIFT = 44;

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? SHIFT : -SHIFT,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -SHIFT : SHIFT,
    opacity: 0,
  }),
};

const spring = { type: "spring", stiffness: 460, damping: 42 } as const;

export default function StepFlow() {
  const [[step, direction], setStep] = useState([0, 0]);

  function go(next: number) {
    setStep([next, next > step ? 1 : -1]);
  }

  const current = STEPS[step];

  return (
    <div className={styles.root}>
      <motion.div layout className={styles.panel} transition={spring}>
        <div className={styles.dots}>
          {STEPS.map((item, index) => (
            <span
              key={item.title}
              className={styles.dot}
              data-state={
                index === step ? "current" : index < step ? "done" : "todo"
              }
            />
          ))}
        </div>

        <motion.div layout className={styles.stage} transition={spring}>
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={spring}
            >
              <h3 className={styles.title}>{current.title}</h3>
              <p className={styles.body}>{current.body}</p>
              <div className={styles.fields}>
                {current.fields.map((field) => (
                  <div key={field} className={styles.field}>
                    {field}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div layout className={styles.actions} transition={spring}>
          <button
            type="button"
            className={styles.ghost}
            onClick={() => go(step - 1)}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            type="button"
            className={styles.primary}
            onClick={() => go(step === STEPS.length - 1 ? 0 : step + 1)}
          >
            {step === STEPS.length - 1 ? "Start over" : "Continue"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
