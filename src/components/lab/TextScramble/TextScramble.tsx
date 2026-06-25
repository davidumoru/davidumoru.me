import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#";
const TEXT = "Design Engineer";

const demo: CSSProperties = {
  display: "grid",
  placeItems: "center",
};

const word: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "var(--fs-2xl)",
  color: "var(--text)",
  cursor: "pointer",
};

export default function TextScramble() {
  const [display, setDisplay] = useState(TEXT);
  const raf = useRef(0);

  const run = useCallback(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(TEXT);
      return;
    }
    cancelAnimationFrame(raf.current);
    let frame = 0;
    const queue = [...TEXT].map((char) => ({
      char,
      end: Math.floor(Math.random() * 28) + 8,
    }));

    const tick = () => {
      let out = "";
      let done = 0;
      for (const item of queue) {
        if (frame >= item.end) {
          out += item.char;
          done++;
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(out);
      if (done === queue.length) return;
      frame++;
      raf.current = requestAnimationFrame(tick);
    };

    tick();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(run, 450);
    return () => window.clearTimeout(timer);
  }, [run]);

  return (
    <div style={demo}>
      <span style={word} onPointerEnter={run}>
        {display}
      </span>
    </div>
  );
}
