import { useState, useEffect, type FC } from "react";
import "../style/tailwind/index.css";
import { Icon } from "./Icon/Icon";

interface FilmEntry {
  title: string;
  year: string;
  link: string;
  posterUrl: string | null;
  rating: number | null;
  watchedDate: string;
  rewatch: boolean;
}

const ErrorIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return "★".repeat(full) + (half ? "½" : "");
}

function formatWatched(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(d.getFullYear() === now.getFullYear() ? {} : { year: "numeric" }),
  });
}

const Poster: FC<{ film: FilmEntry }> = ({ film }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={film.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex shrink-0 flex-col gap-1.5 w-20 sm:w-24 transition-transform duration-150 ease-out active:scale-[0.96]"
      title={`${film.title} (${film.year})${film.rating ? ` — ${renderStars(film.rating)}` : ""}`}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-md bg-(--gray-7) shadow-sm ring-1 ring-black/10 in-[.dark]:ring-white/10 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-md">
        {!loaded && film.posterUrl && (
          <div className="absolute inset-0 animate-pulse bg-(--gray-7)" />
        )}
        {film.posterUrl ? (
          <img
            src={film.posterUrl}
            alt={`Poster for ${film.title}`}
            loading="lazy"
            draggable={false}
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-(--gray-11)">
            {film.title}
          </div>
        )}
      </div>
      <div className="min-w-0 space-y-0.5">
        <p className="line-clamp-2 min-h-[2lh] text-xs font-medium leading-tight text-(--gray-12) text-pretty sm:text-sm">
          {film.title}
        </p>
        <p className="flex items-center gap-1 text-[0.7rem] text-(--gray-11) sm:text-xs tabular-nums">
          <span>{film.year}</span>
          {film.rating !== null && (
            <span className="text-(--tomato-9)">
              {renderStars(film.rating)}
            </span>
          )}
        </p>
      </div>
    </a>
  );
};

const Skeleton: FC = () => (
  <div className="w-full max-w-full rounded-[14px] bg-(--gray-4) p-1.5">
    <div className="rounded-lg border border-(--gray-6) bg-(--gray-2) p-3">
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shrink-0 w-20 sm:w-24 space-y-1.5">
            <div className="aspect-2/3 rounded-md bg-(--gray-7) ring-1 ring-black/10 in-[.dark]:ring-white/10" />
            <div className="space-y-1">
              <div className="h-3 rounded bg-(--gray-7)" />
              <div className="h-3 w-3/4 rounded bg-(--gray-7)" />
            </div>
            <div className="h-2 w-2/3 rounded bg-(--gray-7)" />
          </div>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-x-2 px-3 py-1.5">
      <div className="h-3 w-3 rounded-full bg-(--gray-7)" />
      <div className="h-3 w-40 rounded bg-(--gray-7)" />
    </div>
  </div>
);

const ErrorState: FC<{ message: string }> = ({ message }) => (
  <div className="w-full max-w-full overflow-x-auto rounded-xl border border-(--red-6) bg-(--red-3) p-4 text-sm text-(--red-11)">
    <div className="flex items-center gap-x-3">
      <ErrorIcon className="h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold text-pretty">
          Unable to load Letterboxd activity
        </p>
        <p className="mt-1 text-xs text-(--red-10) text-pretty">{message}</p>
      </div>
    </div>
  </div>
);

const Content: FC<{ films: FilmEntry[] }> = ({ films }) => {
  const latest = films[0];

  return (
    <div className="w-full max-w-full rounded-[14px] bg-(--gray-4) p-1.5">
      <div className="rounded-lg border border-(--gray-6) bg-(--gray-2) p-3">
        <div
          className="flex gap-3 overflow-x-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {films.map((film) => (
            <Poster key={film.link || film.title} film={film} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-x-2 px-3 py-1.5 text-sm text-(--gray-11)">
        <Icon icon="movie" size="16" />
        <span className="truncate tabular-nums">
          Last watched{" "}
          <a
            href={latest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--gray-12) underline decoration-(--gray-8) underline-offset-2 transition-colors hover:decoration-(--gray-11)"
          >
            {latest.title}
          </a>{" "}
          {formatWatched(latest.watchedDate)}
        </span>
      </div>
    </div>
  );
};

const LetterboxdWidget: FC = () => {
  const [films, setFilms] = useState<FilmEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/letterboxd");
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Request failed (${res.status})`);
        }
        const data = await res.json();
        if (!cancelled) {
          setFilms(data.films || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unexpected error fetching films.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <Skeleton />;
  if (error || !films || films.length === 0) {
    return <ErrorState message={error || "No films to show yet."} />;
  }
  return <Content films={films} />;
};

export default LetterboxdWidget;
