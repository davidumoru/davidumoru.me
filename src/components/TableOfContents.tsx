import { useEffect, useState, useRef, useCallback } from "react";
import "../style/tailwind/index.css";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

type TOCThumb = [top: number, height: number];

function calc(container: HTMLElement, active: string[]): TOCThumb {
  if (active.length === 0 || container.clientHeight === 0) {
    return [0, 0];
  }

  let upper = Number.MAX_VALUE;
  let lower = 0;

  const allTocItems = Array.from(container.querySelectorAll('a[href^="#"]'));

  for (const item of active) {
    const element = container.querySelector<HTMLElement>(`a[href="#${item}"]`);
    if (!element) continue;

    const itemIndex = allTocItems.indexOf(element);
    if (itemIndex === -1) continue;

    let cumulativeTop = 0;
    for (let i = 0; i < itemIndex; i++) {
      const prevElement = allTocItems[i] as HTMLElement;
      cumulativeTop += prevElement.clientHeight;
    }

    const styles = getComputedStyle(element);
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingBottom = parseFloat(styles.paddingBottom);
    const elementTop = cumulativeTop + paddingTop;
    const elementBottom = cumulativeTop + element.clientHeight - paddingBottom;

    upper = Math.min(upper, elementTop);
    lower = Math.max(lower, elementBottom);
  }

  return [upper, lower - upper];
}

function update(element: HTMLElement, info: TOCThumb): void {
  element.style.setProperty("--fd-top", `${info[0]}px`);
  element.style.setProperty("--fd-height", `${info[1]}px`);
}

function TocThumb({
  containerRef,
  activeItems,
  className = "",
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  activeItems: string[];
  className?: string;
}) {
  const thumbRef = useRef<HTMLDivElement>(null);

  const onResize = useCallback(() => {
    if (!containerRef.current || !thumbRef.current) return;
    const result = calc(containerRef.current, activeItems);
    update(thumbRef.current, result);
  }, [containerRef, activeItems]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    onResize();
    const observer = new ResizeObserver(onResize);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, onResize]);

  if (!containerRef.current) return null;

  return (
    <div
      ref={thumbRef}
      className={`absolute -left-1 w-4 bg-[var(--tomato-9)] transition-all duration-200 ${className}`}
      style={{
        top: "var(--fd-top, 0px)",
        height: "var(--fd-height, 0px)",
        minHeight: activeItems.length > 0 ? "2px" : "0px",
      }}
    />
  );
}

function getItemOffset(depth: number): number {
  if (depth <= 2) return 14;
  if (depth === 3) return 26;
  return 36;
}

function getLineOffset(depth: number): number {
  return depth >= 3 ? 10 : 0;
}

function TOCItem({
  item,
  upper = item.level,
  lower = item.level,
  isActive = false,
  onClick,
}: {
  item: TocItem;
  upper?: number;
  lower?: number;
  isActive?: boolean;
  onClick: () => void;
}) {
  const offset = getLineOffset(item.level);
  const upperOffset = getLineOffset(upper);
  const lowerOffset = getLineOffset(lower);

  return (
    <div className="relative">
      <a
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`relative block py-1.5 text-sm transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 ${
          isActive
            ? "text-[var(--tomato-9)] dark:text-[var(--tomato-9)]"
            : "text-neutral-600 dark:text-neutral-400"
        }`}
        style={{
          paddingLeft: `${getItemOffset(item.level)}px`,
        }}
      >
        {item.text}
      </a>
    </div>
  );
}

export default function TableOfContents({
  className = "",
}: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeItems, setActiveItems] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  }>();

  useEffect(() => {
    const headings = document.querySelectorAll(
      "article h2, article h3, article h4, article h5, article h6",
    );
    const tocItems: TocItem[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      let id = heading.id;

      if (!id) {
        id =
          heading.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `heading-${index}`;
        heading.id = id;
      }

      tocItems.push({
        id,
        text: heading.textContent || "",
        level,
      });
    });

    setToc(tocItems);
  }, []);

  useEffect(() => {
    if (!containerRef.current || toc.length === 0) return;
    const container = containerRef.current;

    function onResize(): void {
      if (container.clientHeight === 0) return;
      let w = 0;
      let h = 0;
      const d: string[] = [];

      let cumulativeTop = 0;

      for (let i = 0; i < toc.length; i++) {
        const element: HTMLElement | null = container.querySelector(
          `a[href="#${toc[i].id}"]`,
        );
        if (!element) continue;

        const styles = getComputedStyle(element);
        const offset = getLineOffset(toc[i].level) + 1,
          top = cumulativeTop + parseFloat(styles.paddingTop),
          bottom =
            cumulativeTop +
            element.clientHeight -
            parseFloat(styles.paddingBottom);

        w = Math.max(offset, w);
        h = Math.max(h, bottom);

        d.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
        d.push(`L${offset} ${bottom}`);

        cumulativeTop += element.clientHeight;
      }

      setSvg({
        path: d.join(" "),
        width: w + 1,
        height: h,
      });
    }

    const observer = new ResizeObserver(onResize);
    onResize();
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [toc]);

  useEffect(() => {
    if (toc.length === 0) return;

    const calculateActiveItems = () => {
      const windowHeight = window.innerHeight;
      const activeIds: string[] = [];

      for (const item of toc) {
        const element = document.getElementById(item.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top < windowHeight && rect.bottom > 0) {
          activeIds.push(item.id);
        }
      }

      if (activeIds.length === 0) {
        for (let i = toc.length - 1; i >= 0; i--) {
          const element = document.getElementById(toc[i].id);
          if (
            element &&
            element.getBoundingClientRect().top <= windowHeight * 0.5
          ) {
            activeIds.push(toc[i].id);
            break;
          }
        }
      }

      if (activeIds.length === 0 && toc.length > 0) {
        activeIds.push(toc[0].id);
      }

      setActiveItems(activeIds);
    };

    const handleScroll = () => {
      calculateActiveItems();
    };

    window.addEventListener("scroll", handleScroll);
    calculateActiveItems();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  if (toc.length <= 1) {
    return null;
  }

  return (
    <nav className={`table-of-contents ${className}`}>
      <div className="mb-3">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          On this page
        </p>
      </div>

      <div className="relative">
        {svg && (
          <div
            className="absolute top-0 left-0"
            style={{
              width: svg.width,
              height: svg.height,
              maskImage: `url("data:image/svg+xml,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="3" fill="none" /></svg>`,
              )}")`,
            }}
          >
            <div className="h-full bg-gray-300 dark:bg-gray-600" />

            <TocThumb
              containerRef={containerRef}
              activeItems={activeItems}
              className="bg-[var(--tomato-9)]"
            />
          </div>
        )}

        <div
          ref={containerRef}
          data-toc-container
          className="flex flex-col overflow-y-auto"
        >
          {toc.map((item, i) => (
            <TOCItem
              key={item.id}
              item={item}
              upper={toc[i - 1]?.level}
              lower={toc[i + 1]?.level}
              isActive={activeItems.includes(item.id)}
              onClick={() => {
                scrollToHeading(item.id);
              }}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
