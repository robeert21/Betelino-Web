"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteGalleryItemAction } from "../actions";
import type { GalleryItemEntry } from "@/app/galerie/data";
import { VideoThumbnail } from "@/app/galerie/VideoThumbnail";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function GalleryManageList({ items }: { items: GalleryItemEntry[] }) {
  const [liveItems, setLiveItems] = useState(items);

  // The upload form lives in a sibling component, so a successful upload
  // reaches this list only via the server revalidating `items` — sync local
  // state (used for optimistic delete) whenever that prop changes.
  useEffect(() => {
    setLiveItems(items);
  }, [items]);

  if (liveItems.length === 0) {
    return (
      <p className="animate-fade-in rounded-[16px] bg-soft-linen px-7 py-7 text-sm text-ink-umber-soft">
        Niciun fișier încărcat încă.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {liveItems.map((item, index) => (
        <GalleryRow
          key={item.id}
          item={item}
          index={index}
          onDeleted={() => setLiveItems((current) => current.filter((i) => i.id !== item.id))}
        />
      ))}
    </ul>
  );
}

function GalleryRow({
  item,
  index,
  onDeleted,
}: {
  item: GalleryItemEntry;
  index: number;
  onDeleted: () => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteGalleryItemAction(item.id);
      if (result.error) {
        setError(result.error);
        setConfirmingDelete(false);
      } else {
        onDeleted();
      }
    });
  }

  return (
    <li
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
      className="animate-fade-in flex flex-col gap-3 rounded-[16px] bg-soft-linen p-3"
    >
      <div className="relative aspect-square overflow-hidden rounded-[10px] bg-warm-cream">
        {item.fileType.startsWith("video/") ? (
          <VideoThumbnail src={`/api/gallery/${item.id}`} className="h-full w-full object-cover" />
        ) : (
          <img
            src={`/api/gallery/${item.id}?thumb=1`}
            alt={item.caption ?? item.fileName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-ink-umber">{item.fileName}</p>
        <p className="truncate text-[0.6875rem] text-ink-umber-soft">
          {formatFileSize(item.fileSize)} · {formatDate(item.createdAt)}
        </p>
      </div>

      {error && <p className="text-xs text-signal-red">{error}</p>}

      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        onBlur={() => setConfirmingDelete(false)}
        className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 ${
          confirmingDelete
            ? "bg-signal-red text-warm-cream"
            : "bg-warm-cream text-ink-umber-soft hover:text-signal-red"
        }`}
      >
        {isPending ? "Se șterge…" : confirmingDelete ? "Sigur, șterge" : "Șterge"}
      </button>
    </li>
  );
}
