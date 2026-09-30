import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import styles from "./ThreadMap.module.css";

type Message = { id: number; mine: boolean; text: string };

const THREAD: Message[] = [
  {
    id: 1,
    mine: true,
    text: "My sourdough starter sighs at night. His name is Gerald.",
  },
  {
    id: 2,
    mine: false,
    text: "Gerald is fine, and honestly so is the name. That sigh is carbon dioxide escaping as the yeast works through the flour, which means he's alive and doing exactly what a starter should. A quiet starter is the one to worry about. How often are you feeding him, and how warm is your kitchen?",
  },
  {
    id: 3,
    mine: true,
    text: "Twice a day. This morning he was touching the toaster.",
  },
  {
    id: 4,
    mine: false,
    text: "That's warmth plus enthusiasm. A well fed starter can double in size within a few hours, and if the jar is too small he'll simply leave. Move him into something at least twice as big, loosen the lid so the gas has somewhere to go, and keep him away from anything that heats up. He isn't plotting. He's just thriving in the wrong direction.",
  },
  {
    id: 5,
    mine: true,
    text: "My flatmate thinks I love Gerald more than her.",
  },
  {
    id: 6,
    mine: false,
    text: "You named a jar of flour and water and came here to ask about his feelings, so she may have a point. The good news is this is very fixable. Bake a proper loaf with him, slice it while it's still warm, and offer her the first piece. Nobody has ever stayed annoyed at someone holding fresh bread.",
  },
  {
    id: 7,
    mine: true,
    text: "The loaf is so dense she uses it as a doorstop.",
  },
  {
    id: 8,
    mine: false,
    text: "A crumb that dense almost always means the dough was under-proofed, so the yeast never had time to fill it with air. Next time, let it rise somewhere warm until it has grown by about half and springs back slowly when you poke it. Warm, for the record, still does not mean next to the toaster.",
  },
  {
    id: 9,
    mine: true,
    text: "If I go away for a week, will he survive?",
  },
  {
    id: 10,
    mine: false,
    text: "He'll survive. Give him a big feed, put the lid on and put him straight in the fridge, where the cold slows the yeast right down and he'll sleep through the whole week. When you're back, feed him twice at room temperature and he'll be bubbling again within a day. Gerald will be fine. The toaster, I'm less sure about.",
  },
];

export default function ThreadMap() {
  const [open, setOpen] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);
  const thread = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | "auto">("auto");
  const rows = useRef(new Map<number, HTMLElement>());
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduce = useReducedMotion() ?? false;

  const spring: Transition = reduce
    ? { duration: 0 }
    : { type: "spring", stiffness: 420, damping: 40 };

  useLayoutEffect(() => {
    const element = thread.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  useLayoutEffect(() => {
    if (label.current) setWidth(label.current.offsetWidth);
  }, [open]);

  const jump = (id: number) => {
    const element = thread.current;
    const row = rows.current.get(id);
    if (element && row) {
      element.scrollTop =
        row.offsetTop - (element.clientHeight - row.offsetHeight) / 2;
    }
    setOpen(false);
    setLanded(id);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLanded(null), 1800);
  };

  const mine = THREAD.filter((message) => message.mine);

  return (
    <div
      className={styles.root}
      data-open={open || undefined}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <motion.div
        ref={thread}
        layoutScroll
        className={styles.thread}
        aria-hidden={open || undefined}
      >
        {THREAD.map((message) => (
          <div
            key={message.id}
            ref={(node) => {
              if (node) rows.current.set(message.id, node);
              else rows.current.delete(message.id);
            }}
            className={styles.line}
            data-mine={message.mine || undefined}
          >
            {message.mine && !open ? (
              <motion.p
                layoutId={`bubble-${message.id}`}
                className={styles.bubble}
                data-landed={landed === message.id || undefined}
                transition={spring}
              >
                {message.text}
              </motion.p>
            ) : (
              <p
                className={styles.bubble}
                style={message.mine ? { visibility: "hidden" } : undefined}
              >
                {message.text}
              </p>
            )}
          </div>
        ))}
      </motion.div>

      {open && (
        <div className={styles.overlay}>
          <ul className={styles.stack} aria-label="Your messages">
            {mine.map((message) => (
              <li key={message.id} className={styles.line} data-mine>
                <motion.button
                  type="button"
                  layoutId={`bubble-${message.id}`}
                  className={`${styles.bubble} ${styles.pick}`}
                  transition={spring}
                  onClick={() => jump(message.id)}
                >
                  {message.text}
                </motion.button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <motion.button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        initial={false}
        animate={{ width }}
        transition={
          reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 42 }
        }
        onClick={() => setOpen((current) => !current)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={open ? "back" : "jump"}
            ref={label}
            className={styles.toggleLabel}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            {open ? "Back to the thread" : "Jump to a message"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
