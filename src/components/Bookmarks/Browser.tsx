import { useState, useEffect, type FC } from "react";
import { Icon } from "../Icon/Icon";
import "./browser.css";

interface Bookmark {
  title: string;
  url: string;
}

interface BookmarkFolder {
  name: string;
  bookmarks: Bookmark[];
}

interface BrowserProps {
  folders: BookmarkFolder[];
  title?: string;
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const FaviconImage: FC<{ url: string; alt: string }> = ({ url, alt }) => {
  const [error, setError] = useState(false);

  let faviconSrc: string | undefined;
  try {
    const domain = new URL(url).hostname;
    faviconSrc = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (e) {
    faviconSrc = undefined;
  }

  if (error || !faviconSrc) {
    return (
      <div className="browser-favicon browser-favicon--placeholder">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12V16H11V12H8L12 8L16 12H13Z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={faviconSrc}
      alt={`${alt} favicon`}
      className="browser-favicon"
      width={16}
      height={16}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

const SidebarItem: FC<{
  bookmark: Bookmark;
  isSelected: boolean;
  onClick: () => void;
  isMobile: boolean;
}> = ({ bookmark, isSelected, onClick, isMobile }) => {
  const handleClick = () => {
    if (isMobile) {
      window.open(bookmark.url, "_blank", "noopener,noreferrer");
    } else {
      onClick();
    }
  };

  return (
    <button
      className={`browser-sidebar-item ${isSelected && !isMobile ? "browser-sidebar-item--selected" : ""}`}
      onClick={handleClick}
      type="button"
    >
      <FaviconImage url={bookmark.url} alt={bookmark.title} />
      <span className="browser-sidebar-item-title">{bookmark.title}</span>
      {isMobile && (
        <svg
          className="browser-external-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z" />
        </svg>
      )}
    </button>
  );
};

const SidebarFolder: FC<{
  folder: BookmarkFolder;
  isOpen: boolean;
  onToggle: () => void;
  selectedUrl: string | null;
  onSelectBookmark: (bookmark: Bookmark) => void;
  isMobile: boolean;
}> = ({
  folder,
  isOpen,
  onToggle,
  selectedUrl,
  onSelectBookmark,
  isMobile,
}) => {
  return (
    <div className="browser-sidebar-folder">
      <button
        className={`browser-sidebar-folder-header ${isOpen ? "browser-sidebar-folder-header--open" : ""}`}
        onClick={onToggle}
        type="button"
        aria-expanded={isOpen}
      >
        <Icon
          icon={isOpen ? "folderOpen" : "folder"}
          size="18"
          variant="line"
          className="browser-folder-icon"
        />
        <span className="browser-folder-name">{folder.name}</span>
      </button>
      {isOpen && (
        <div className="browser-sidebar-folder-content">
          {folder.bookmarks.map((bookmark) => (
            <SidebarItem
              key={bookmark.url}
              bookmark={bookmark}
              isSelected={selectedUrl === bookmark.url}
              onClick={() => onSelectBookmark(bookmark)}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Browser: FC<BrowserProps> = ({ folders, title = "Bookmarks" }) => {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  const handleSelectBookmark = (bookmark: Bookmark) => {
    setIsLoading(true);
    setSelectedBookmark(bookmark);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`browser ${isMobile ? "browser--mobile" : ""}`}>
      <div className="browser-window">

        {/* Sidebar */}
        <aside className="browser-sidebar">
          <div className="browser-sidebar-header">
            <div className="browser-sidebar-title-group">
              <span className="browser-sidebar-title">{title}</span>

              <span className="browser-sidebar-subtitle">
                A Folder from David
              </span>
            </div>

            <button
              onClick={() => window.history.back()}
              className="browser-back-link"
              type="button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z" />
              </svg>

              <span>Back</span>
            </button>
          </div>

          <div className="browser-sidebar-divider" />

          <nav className="browser-sidebar-nav">
            {folders.map((folder) => (
              <SidebarFolder
                key={folder.name}
                folder={folder}
                isOpen={openFolders.has(folder.name)}
                onToggle={() => toggleFolder(folder.name)}
                selectedUrl={selectedBookmark?.url || null}
                onSelectBookmark={handleSelectBookmark}
                isMobile={isMobile}
              />
            ))}
          </nav>
        </aside>

        {/* Main Content - only show on desktop */}
        {!isMobile && (
          <main className="browser-content">
            {selectedBookmark ? (
              <>
                {isLoading && (
                  <div className="browser-loading">
                    <div className="browser-loading-spinner" />

                    <span>Loading {selectedBookmark.title}...</span>
                  </div>
                )}

                <iframe
                  src={selectedBookmark.url}
                  title={selectedBookmark.title}
                  className="browser-iframe"
                  onLoad={handleIframeLoad}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  loading="lazy"
                />
              </>
            ) : (
              <div className="browser-empty-state">
                <div className="browser-empty-icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />

                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>

                <p className="browser-empty-title">Select a bookmark</p>

                <p className="browser-empty-subtitle">
                  Click on a folder to expand it, then select a site to preview
                </p>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
};

export default Browser;
