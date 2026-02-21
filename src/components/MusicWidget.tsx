import { useState, useEffect, type FC } from "react";
import "../style/tailwind/index.css";

interface SongData {
  albumArtUrl: string;
  songUrl: string;
  title: string;
  artists: string;
  lastPlayed: string;
  isPlaying: boolean;
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

interface Bar {
  x: number;
  height: number;
  targetHeight: number;
}

const AudioVisualization: FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [bars, setBars] = useState<Bar[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const barCount = isMobile ? 11 : 15;
    const spacing = isMobile ? 20 : 15;
    const initialBars = Array.from({ length: barCount }, (_, i) => ({
      x: i * spacing + 10,
      height: 20,
      targetHeight: 20,
    }));
    setBars(initialBars);
  }, [isMobile]);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setBars((prev) =>
        prev.map((bar) => {
          const newHeight = bar.height + (bar.targetHeight - bar.height) * 0.1;
          if (Math.random() < 0.03) {
            return {
              ...bar,
              height: newHeight,
              targetHeight: 10 + Math.random() * 60,
            };
          }
          return { ...bar, height: newHeight };
        }),
      );
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const heightClass = isMobile ? "h-10" : "h-14";

  return (
    <div
      className={`flex items-center justify-center w-full max-w-32 ${heightClass}`}
    >
      <svg
        viewBox="0 0 240 100"
        className="w-full h-full"
        style={{ display: "block", maxWidth: "100%" }}
      >
        <defs>
          <linearGradient id="audioGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--tomato-9)" />
            <stop offset="100%" stopColor="var(--tomato-11)" />
          </linearGradient>
        </defs>
        {bars.map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={50 - bar.height / 2}
            width={8}
            height={bar.height}
            rx={4}
            fill="url(#audioGradient)"
          />
        ))}
      </svg>
    </div>
  );
};

const MusicWidgetSkeleton: FC = () => (
  <div className="w-full max-w-full rounded-xl bg-(--gray-4) p-1.5 overflow-x-auto">
    <div className="flex w-full items-center gap-x-2 sm:gap-x-4 rounded-lg border border-(--gray-6) bg-(--gray-2) p-2">
      <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-md bg-(--gray-7)"></div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 sm:h-5 w-3/4 rounded bg-(--gray-7)"></div>
        <div className="h-3 sm:h-4 w-1/2 rounded bg-(--gray-7)"></div>
      </div>
      <div className="flex items-center ml-2 min-w-0 h-16 sm:h-20 justify-end w-full max-w-20" />
    </div>
    <div className="flex items-center gap-x-2 px-3 py-1.5">
      <div className="h-3 w-3 rounded-full bg-(--gray-7)"></div>
      <div className="h-3 w-28 rounded bg-(--gray-7)"></div>
    </div>
  </div>
);

const MusicWidgetError: FC<{ message: string }> = ({ message }) => (
  <div className="w-full max-w-full rounded-xl border border-(--red-6) bg-(--red-3) p-4 text-sm text-(--red-11) overflow-x-auto">
    <div className="flex items-center gap-x-3">
      <ErrorIcon className="h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">Unable to load music activity</p>
        <p className="mt-1 text-xs text-(--red-10)">{message}</p>
      </div>
    </div>
  </div>
);

const AlbumArt: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0">
      {!loaded && (
        <div className="absolute inset-0 rounded-md bg-(--gray-7) animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        width={80}
        height={80}
        className={`h-16 w-16 sm:h-20 sm:w-20 rounded-md object-cover ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ position: "absolute", inset: 0 }}
        onLoad={() => setLoaded(true)}
        draggable={false}
      />
    </div>
  );
};

const MusicWidgetContent: FC<{ song: SongData }> = ({ song }) => (
  <div className="group w-full max-w-full rounded-xl bg-(--gray-4) p-1.5 overflow-x-auto">
    <div className="flex w-full items-center gap-x-2 sm:gap-x-4 rounded-lg border border-(--gray-6) bg-(--gray-2) p-2">
      <AlbumArt
        src={song.albumArtUrl}
        alt={`Album artwork for ${song.title} by ${song.artists}`}
      />
      <div
        className={`min-w-0 space-y-1 ${song.isPlaying ? "flex-1" : "flex-1 sm:mr-3"}`}
      >
        <a
          href={song.songUrl}
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
              (e.currentTarget.style.textDecorationColor = "var(--gray-11)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.textDecorationColor = "var(--gray-8)")
            }
          >
            {song.title}
          </p>
        </a>
        <p className="truncate text-sm sm:text-base text-(--gray-11)">
          {song.artists}
        </p>
      </div>
      <div
        className={`flex items-center min-w-0 h-16 sm:h-20 justify-end w-full ${song.isPlaying ? "max-w-24 sm:max-w-40" : "max-w-0"}`}
      >
        {song.isPlaying && <AudioVisualization />}
      </div>
    </div>
    <div className="flex items-center gap-x-2 px-3 py-1.5 text-sm text-(--gray-11)">
      <div
        className={`h-3 w-3 shrink-0 rounded-full ${
          song.isPlaying ? "bg-(--tomato-9)" : "bg-(--gray-8)"
        }`}
      ></div>
      <div className="truncate">{song.lastPlayed}</div>
    </div>
  </div>
);

const MusicWidget: FC = () => {
  const [songData, setSongData] = useState<SongData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const timestamp = Date.now();
        const response = await fetch(`/api/spotify?t=${timestamp}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(
            errData.error || `Failed to fetch music data (${response.status})`,
          );
        }
        const data: SongData = await response.json();
        setSongData(data);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while fetching your music data.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotifyData();
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchSpotifyData();
      }
    }, 45000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSpotifyData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (isLoading) {
    return <MusicWidgetSkeleton />;
  }

  if (error || !songData) {
    return <MusicWidgetError message={error || "No music data available."} />;
  }

  return <MusicWidgetContent song={songData} />;
};

export default MusicWidget;
