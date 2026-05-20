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

const PosterTooltip: FC<{ text: string }> = ({ text }) => (
  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-(--gray-12) px-2 py-1 text-xs font-medium text-(--gray-1) opacity-0 shadow-md transition-opacity duration-100 ease-out group-hover:opacity-100 group-hover:delay-150">
    {text}
  </div>
);

const Thumb: FC<{ film: FilmEntry }> = ({ film }) => {
  const [loaded, setLoaded] = useState(false);
  const label = `${film.title} (${film.year})${film.rating ? ` — ${renderStars(film.rating)}` : ""}`;
  return (
    <a
      href={film.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative block transition-transform duration-150 ease-out active:scale-[0.96]"
    >
      <PosterTooltip text={label} />
      <div className="relative aspect-2/3 w-full overflow-hidden rounded bg-(--gray-7) ring-1 ring-black/10 in-[.dark]:ring-white/10 transition-[transform,box-shadow,filter] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-md [@media(hover:hover)]:brightness-75 [@media(hover:hover)]:group-hover:brightness-100">
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
          <div className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] leading-tight text-(--gray-11)">
            {film.title}
          </div>
        )}
      </div>
    </a>
  );
};

const HeroPoster: FC<{ film: FilmEntry }> = ({ film }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative aspect-2/3 w-28 sm:w-32 shrink-0 overflow-hidden rounded-md bg-(--gray-7) shadow-sm ring-1 ring-black/10 in-[.dark]:ring-white/10">
      {!loaded && film.posterUrl && (
        <div className="absolute inset-0 animate-pulse bg-(--gray-7)" />
      )}
      {film.posterUrl ? (
        <img
          src={film.posterUrl}
          alt={`Poster for ${film.title}`}
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
  );
};

const Skeleton: FC = () => (
  <div className="w-full max-w-full rounded-[14px] bg-(--gray-4) p-1.5">
    <div className="rounded-lg border border-(--gray-6) bg-(--gray-2) p-3">
      <div className="flex flex-row gap-3 sm:gap-4">
        <div className="aspect-2/3 w-28 sm:w-32 shrink-0 rounded-md bg-(--gray-7) ring-1 ring-black/10 in-[.dark]:ring-white/10" />
        <div className="flex min-w-0 flex-1 flex-col gap-3 pt-3 sm:pt-5">
          <div className="space-y-1.5">
            <div className="h-4 w-3/4 rounded bg-(--gray-7)" />
            <div className="h-3 w-1/2 rounded bg-(--gray-7)" />
          </div>
          <div className="mt-auto grid grid-cols-3 sm:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={i >= 3 ? "hidden sm:block" : ""}>
                <div className="aspect-2/3 w-full rounded bg-(--gray-7) ring-1 ring-black/10 in-[.dark]:ring-white/10" />
              </div>
            ))}
          </div>
        </div>
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
      <Icon icon="alert" size="20" />
      <div>
        <p className="font-semibold">
          Unable to load Letterboxd activity
        </p>
        <p className="mt-1 text-xs text-(--red-10)">{message}</p>
      </div>
    </div>
  </div>
);

const Content: FC<{ films: FilmEntry[] }> = ({ films }) => {
  const [latest, ...rest] = films;

  return (
    <div className="w-full max-w-full rounded-[14px] bg-(--gray-4) p-1.5">
      <div className="rounded-lg border border-(--gray-6) bg-(--gray-2) p-3">
        <div className="flex flex-row gap-3 sm:gap-4">
          <HeroPoster film={latest} />
          <div className="flex min-w-0 flex-1 flex-col gap-3 pt-3 sm:pt-5">
            <div className="space-y-1.5">
              <a
                href={latest.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                <p
                  className="truncate text-base sm:text-lg font-semibold underline leading-tight text-(--gray-12) transition-colors duration-300"
                  style={{
                    textDecorationColor: "var(--gray-8)",
                    transition: "text-decoration-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.textDecorationColor =
                      "var(--gray-11)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.textDecorationColor =
                      "var(--gray-8)")
                  }
                >
                  {latest.title}
                </p>
              </a>
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-(--gray-11) tabular-nums">
                <span>Watched {formatWatched(latest.watchedDate)}</span>
                {latest.rating !== null && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-(--tomato-9)">
                      {renderStars(latest.rating)}
                    </span>
                  </>
                )}
                {latest.rewatch && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[10px] uppercase tracking-wide text-(--gray-10)">
                      rewatch
                    </span>
                  </>
                )}
              </p>
            </div>
            {rest.length > 0 && (
              <div className="mt-auto grid grid-cols-3 sm:grid-cols-6 gap-2">
                {rest.slice(0, 6).map((film, i) => (
                  <div
                    key={film.link || film.title}
                    className={i >= 3 ? "hidden sm:block" : ""}
                  >
                    <Thumb film={film} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-2 px-3 py-1.5 text-sm text-(--gray-11)">
        <Icon icon="movie" size="16" />
        <span className="truncate">Recently on Letterboxd</span>
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
