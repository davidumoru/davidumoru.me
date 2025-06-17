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

const HistoryIcon: FC<{ className?: string }> = ({ className }) => (
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
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

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

const MusicWidgetSkeleton: FC = () => (
  // Changed background from gray-3 to gray-4
  <div className="w-full rounded-xl bg-[var(--gray-4)] p-1.5 font-sans">
    {/* Changed border from gray-5 to gray-6 */}
    <div className="flex w-full animate-pulse items-center gap-x-4 rounded-lg border border-[var(--gray-6)] bg-[var(--gray-2)] p-3 shadow-sm">
      {/* Changed placeholder from gray-6 to gray-7 */}
      <div className="h-[60px] w-[60px] flex-shrink-0 rounded-md bg-[var(--gray-7)]"></div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 h-5 w-3/4 rounded bg-[var(--gray-7)]"></div>
        <div className="h-4 w-1/2 rounded bg-[var(--gray-7)]"></div>
      </div>
    </div>
    <div className="flex items-center gap-x-2 px-3 py-1.5">
      <div className="h-4 w-4 rounded bg-[var(--gray-7)]"></div>
      <div className="h-3 w-28 rounded bg-[var(--gray-7)]"></div>
    </div>
  </div>
);

const MusicWidgetError: FC<{ message: string }> = ({ message }) => (
  <div className="w-full rounded-xl border border-[var(--red-6)] bg-[var(--red-3)] p-4 font-sans text-sm text-[var(--red-11)]">
    <div className="flex items-center gap-x-3">
      <ErrorIcon className="h-5 w-5 flex-shrink-0" />
      <div>
        <p className="font-semibold">Error loading music data</p>
        <p className="mt-1 text-xs text-[var(--red-10)]">{message}</p>
      </div>
    </div>
  </div>
);

const MusicWidgetContent: FC<{ song: SongData }> = ({ song }) => (
  // Changed background from gray-3 to gray-4
  <div className="group w-full rounded-xl bg-[var(--gray-4)] p-1.5 font-sans shadow-md shadow-black/5">
    {/* Changed border from gray-5 to gray-6 */}
    <div className="flex w-full items-center gap-x-4 rounded-lg border border-[var(--gray-6)] bg-[var(--gray-2)] p-3">
      <img
        src={song.albumArtUrl}
        alt={`Album art for ${song.title}`}
        width={60}
        height={60}
        className="h-[60px] w-[60px] flex-shrink-0 rounded-md object-cover shadow-lg shadow-black/10 transition-transform duration-300 ease-in-out group-hover:scale-105"
      />
      <div className="min-w-0 flex-1">
        <a
          href={song.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          <p className="truncate font-semibold text-[var(--gray-12)]">
            {song.title}
          </p>
        </a>
        <p className="truncate text-sm text-[var(--gray-11)]">{song.artists}</p>
      </div>
    </div>

    <div className="flex items-center gap-x-2 px-3 py-1.5 text-xs text-[var(--gray-11)]">
      {song.isPlaying ? (
        <div className="flex h-4 w-4 items-end justify-center gap-px">
          <span className="h-full w-0.5 animate-[wave_1.2s_ease-in-out_infinite] rounded-full bg-[var(--green-9)] [animation-delay:-0.4s]"></span>
          <span className="h-2/3 w-0.5 animate-[wave_1.2s_ease-in-out_infinite] rounded-full bg-[var(--green-9)] [animation-delay:-0.2s]"></span>
          <span className="h-full w-0.5 animate-[wave_1.2s_ease-in-out_infinite] rounded-full bg-[var(--green-9)] [animation-delay:-0.6s]"></span>
          <span className="h-1/2 w-0.5 animate-[wave_1.2s_ease-in-out_infinite] rounded-full bg-[var(--green-9)]"></span>
        </div>
      ) : (
        <HistoryIcon className="h-3.5 w-3.5 flex-shrink-0" />
      )}
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
        const response = await fetch("/api/spotify");
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(
            errData.error || `API request failed: ${response.status}`
          );
        }
        const data: SongData = await response.json();
        setSongData(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("Failed to fetch Spotify data:", err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotifyData();
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes wave {
        0%, 100% { transform: scaleY(0.2); }
        50% { transform: scaleY(1); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) {
    return <MusicWidgetSkeleton />;
  }

  if (error || !songData) {
    return <MusicWidgetError message={error || "No data available."} />;
  }

  return <MusicWidgetContent song={songData} />;
};

export default MusicWidget;
