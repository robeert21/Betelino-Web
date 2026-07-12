"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteMaterialAction } from "../../actions";
import type { StationMaterialEntry } from "../../data";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function MaterialsList({ materials }: { materials: StationMaterialEntry[] }) {
  const [liveMaterials, setLiveMaterials] = useState(materials);

  // The upload form lives in a sibling component, so a successful upload
  // reaches this list only via the server revalidating `materials` — sync
  // local state (used for optimistic delete) whenever that prop changes.
  useEffect(() => {
    setLiveMaterials(materials);
  }, [materials]);

  if (liveMaterials.length === 0) {
    return (
      <p className="animate-fade-in rounded-[16px] bg-soft-linen px-7 py-7 text-sm text-ink-umber-soft">
        Niciun material încărcat încă.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {liveMaterials.map((material, index) => (
        <MaterialRow
          key={material.id}
          material={material}
          index={index}
          onDeleted={() =>
            setLiveMaterials((current) => current.filter((m) => m.id !== material.id))
          }
        />
      ))}
    </ul>
  );
}

function MaterialRow({
  material,
  index,
  onDeleted,
}: {
  material: StationMaterialEntry;
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
      const result = await deleteMaterialAction(material.id);
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
      className="animate-fade-in flex flex-col gap-3 rounded-[12px] bg-soft-linen p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <a
        href={`/api/materials/${material.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 flex-1 text-sm font-medium text-ink-umber hover:text-sage-deep hover:underline"
      >
        {material.fileName}
        <span className="ml-2 text-xs font-normal text-ink-umber-soft">
          {formatFileSize(material.fileSize)} · încărcat de {material.uploadedByName} ·{" "}
          {formatDate(material.createdAt)}
        </span>
      </a>

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
