"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { deleteFolderAction } from "../../actions";
import type { StationFolderEntry } from "../../data";

export function FoldersList({
  stationId,
  folders,
}: {
  stationId: string;
  folders: StationFolderEntry[];
}) {
  const [liveFolders, setLiveFolders] = useState(folders);

  // The create form lives in a sibling component, so a new folder reaches
  // this list only via the server revalidating `folders` — sync local
  // state (used for optimistic delete) whenever that prop changes.
  useEffect(() => {
    setLiveFolders(folders);
  }, [folders]);

  if (liveFolders.length === 0) {
    return (
      <p className="animate-fade-in rounded-[16px] bg-soft-linen px-7 py-7 text-sm text-ink-umber-soft">
        Niciun folder creat încă.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {liveFolders.map((folder, index) => (
        <FolderCard
          key={folder.id}
          stationId={stationId}
          folder={folder}
          index={index}
          onDeleted={() => setLiveFolders((current) => current.filter((f) => f.id !== folder.id))}
        />
      ))}
    </ul>
  );
}

function FolderCard({
  stationId,
  folder,
  index,
  onDeleted,
}: {
  stationId: string;
  folder: StationFolderEntry;
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
      const result = await deleteFolderAction(folder.id);
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
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
      className="animate-fade-in flex items-center justify-between gap-3 rounded-[16px] bg-soft-linen p-6"
    >
      <Link href={`/dashboard/materiale/${stationId}/${folder.id}`} className="min-w-0 flex-1">
        <p className="font-semibold text-ink-umber">{folder.name}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.04em] text-sage-deep">
          {folder.materialCount} {folder.materialCount === 1 ? "material" : "materiale"}
        </p>
      </Link>

      <div className="flex shrink-0 items-center gap-3">
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
      </div>
    </li>
  );
}
