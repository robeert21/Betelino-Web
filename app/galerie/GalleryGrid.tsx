"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryItemEntry } from "./data";
import { VideoThumbnail } from "./VideoThumbnail";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium" }).format(date);
}

// Unlike <img>, <video> has no native `loading="lazy"` — without this, every
// video tile in the grid starts a metadata request the moment the page
// loads, which is what made a gallery with several clips feel slow to open.
// Gating the `src` behind IntersectionObserver defers that fetch until the
// tile is actually about to be scrolled into view.
function useInView<T extends HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}

// Minimum horizontal drag distance (px) before a touch gesture counts as a
// swipe rather than a tap/scroll — keeps small accidental drags from
// flipping the image.
const SWIPE_THRESHOLD = 50;

// A plain `<a download>` always lands in the Downloads folder — there's no
// web API to write straight into Photos/Gallery. The Web Share API's file
// support is the closest thing: it opens the OS share sheet, and both iOS
// and Android offer a direct "Save Image/Video" action there that saves
// into Photos/Gallery with no manual move. Where that's unavailable (mainly
// desktop), we fall back to the ordinary download link.
async function shareToSave(url: string, fileName: string, fileType: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !("share" in navigator) || !("canShare" in navigator)) return false;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: fileType });
    if (!navigator.canShare({ files: [file] })) return false;
    await navigator.share({ files: [file] });
    return true;
  } catch (error) {
    // AbortError means the user dismissed the share sheet — not a failure,
    // just don't fall back to the download link on top of it.
    if (error instanceof Error && error.name === "AbortError") return true;
    return false;
  }
}

export function GalleryGrid({ items }: { items: GalleryItemEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goPrev = () => setOpenIndex((current) => (current === null ? current : Math.max(current - 1, 0)));
  const goNext = () =>
    setOpenIndex((current) => (current === null ? current : Math.min(current + 1, items.length - 1)));

  useEffect(() => {
    if (openIndex === null) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  if (items.length === 0) {
    return (
      <p className="animate-fade-in rounded-[16px] bg-soft-linen px-7 py-7 text-sm text-ink-umber-soft">
        Nicio poză sau video încărcat încă.
      </p>
    );
  }

  const openItem = openIndex === null ? null : items[openIndex];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <GalleryTile key={item.id} item={item} index={index} onOpen={() => setOpenIndex(index)} />
        ))}
      </div>

      {openItem && openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-umber/80 p-4 sm:p-8"
          onClick={() => setOpenIndex(null)}
        >
          {openIndex > 0 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goPrev();
              }}
              aria-label="Poza anterioară"
              className="fixed left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-umber/50 text-warm-cream transition-colors duration-200 ease-out hover:bg-ink-umber/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-glow sm:left-6"
            >
              <ChevronIcon direction="left" />
            </button>
          )}
          {openIndex < items.length - 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goNext();
              }}
              aria-label="Poza următoare"
              className="fixed right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-umber/50 text-warm-cream transition-colors duration-200 ease-out hover:bg-ink-umber/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-glow sm:right-6"
            >
              <ChevronIcon direction="right" />
            </button>
          )}

          <div
            className="flex max-h-full w-full max-w-3xl flex-col gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="relative flex max-h-[75vh] items-center justify-center overflow-hidden rounded-[16px] bg-ink-umber"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const delta = event.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (delta > SWIPE_THRESHOLD) goPrev();
                else if (delta < -SWIPE_THRESHOLD) goNext();
              }}
            >
              {openItem.fileType.startsWith("video/") ? (
                <video
                  key={openItem.id}
                  src={`/api/gallery/${openItem.id}`}
                  className="max-h-[75vh] w-full"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  key={openItem.id}
                  src={`/api/gallery/${openItem.id}`}
                  alt={openItem.caption ?? openItem.fileName}
                  className="max-h-[75vh] w-auto"
                />
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-[16px] bg-warm-cream p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                {openItem.caption && (
                  <p className="truncate text-sm font-medium text-ink-umber">{openItem.caption}</p>
                )}
                <p className="text-xs text-ink-umber-soft">
                  {formatDate(openItem.createdAt)} · încărcat de {openItem.uploadedByName} ·{" "}
                  {openIndex + 1}/{items.length}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {/* No `download` attribute here: the response's Content-Disposition
                    header already names the file. Adding a second name via this
                    attribute made some Android browsers (Samsung Internet) treat
                    the two as conflicting, which is what broke saving. */}
                <a
                  href={`/api/gallery/${openItem.id}?download=1`}
                  aria-disabled={downloading}
                  onClick={async (event) => {
                    if (downloading) {
                      event.preventDefault();
                      return;
                    }
                    // Try the native share sheet first — on phones it lets
                    // people save straight into Photos/Gallery. If it's
                    // unavailable or fails, let the click through to the
                    // plain download link underneath.
                    if (typeof navigator !== "undefined" && "share" in navigator && "canShare" in navigator) {
                      event.preventDefault();
                      setDownloading(true);
                      const shared = await shareToSave(
                        `/api/gallery/${openItem.id}`,
                        openItem.fileName,
                        openItem.fileType,
                      );
                      setDownloading(false);
                      if (!shared) {
                        window.location.href = `/api/gallery/${openItem.id}?download=1`;
                      }
                    }
                  }}
                  className="rounded-full bg-amber-glow px-5 py-2.5 text-sm font-semibold text-ink-umber transition-colors duration-200 ease-out hover:bg-amber-deep aria-disabled:pointer-events-none aria-disabled:opacity-60"
                >
                  {downloading ? "Se pregătește…" : "Descarcă"}
                </a>
                <button
                  type="button"
                  onClick={() => setOpenIndex(null)}
                  className="rounded-full bg-soft-linen px-5 py-2.5 text-sm font-semibold text-ink-umber-soft transition-colors duration-200 ease-out hover:text-ink-umber"
                >
                  Închide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryTile({
  item,
  index,
  onOpen,
}: {
  item: GalleryItemEntry;
  index: number;
  onOpen: () => void;
}) {
  const { ref, inView } = useInView<HTMLButtonElement>();
  const isVideo = item.fileType.startsWith("video/");

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
      className="animate-fade-in group relative aspect-square overflow-hidden rounded-[16px] bg-soft-linen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep"
    >
      {isVideo ? (
        <>
          {inView && (
            <VideoThumbnail
              src={`/api/gallery/${item.id}`}
              className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-ink-umber/20 transition-colors duration-200 group-hover:bg-ink-umber/30">
            <PlayIcon />
          </span>
        </>
      ) : (
        inView && (
          <img
            src={`/api/gallery/${item.id}?thumb=1`}
            alt={item.caption ?? item.fileName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        )
      )}
    </button>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
    >
      <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.85)" />
      <path d="M10 8.5v7l6-3.5Z" fill="#2b2118" />
    </svg>
  );
}
