"use client";

import { useMemo, useState, useTransition } from "react";
import { hideFeedback } from "@/app/feedback/actions";
import type { FeedbackNote } from "@/app/feedback/data";

function formatDate(date: Date) {
  return date.toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Bucharest",
  });
}

function NoteCard({
  note,
  index,
  isAdmin,
  onHide,
}: {
  note: FeedbackNote;
  index: number;
  isAdmin: boolean;
  onHide: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await hideFeedback(note.id);
      onHide(note.id);
    });
  }

  return (
    <div
      className="animate-fade-in flex items-start justify-between gap-4 rounded-[14px] border border-border-sand bg-soft-linen p-6"
      style={{ animationDelay: `${Math.min(index, 6) * 0.04}s` }}
    >
      <div className="min-w-0">
        <p className="whitespace-pre-wrap text-base leading-relaxed text-ink-umber">{note.message}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.06em] text-ink-umber-soft/60">
          {note.authorName ?? "Anonim"} · către {note.targetLeaderName ?? "Toți liderii"} ·{" "}
          {formatDate(note.createdAt)}
        </p>
      </div>
      {isAdmin && (
        <div className="flex shrink-0 items-center gap-2.5">
          {confirming && (
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={isPending}
              className="text-xs font-medium text-ink-umber-soft transition-colors duration-200 ease-out hover:text-ink-umber disabled:opacity-60"
            >
              Renunță
            </button>
          )}
          <button
            type="button"
            onClick={handleClick}
            disabled={isPending}
            className={`text-xs font-semibold uppercase tracking-[0.04em] transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 ${
              confirming
                ? "rounded-full bg-signal-red px-4 py-2 text-warm-cream hover:bg-signal-red/90"
                : "text-signal-red/70 hover:text-signal-red"
            }`}
          >
            {isPending ? "Se șterge…" : confirming ? "Sigur, șterge" : "Șterge"}
          </button>
        </div>
      )}
    </div>
  );
}

export function FeedbackInbox({ notes, isAdmin }: { notes: FeedbackNote[]; isAdmin: boolean }) {
  const [items, setItems] = useState(notes);
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => (item.targetLeaderName ?? "Toți liderii").toLowerCase().includes(q));
  }, [items, query]);

  function handleHide(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  if (items.length === 0) {
    return (
      <p className="animate-fade-in rounded-[16px] bg-soft-linen px-7 py-8 text-sm leading-relaxed text-ink-umber-soft">
        Niciun mesaj primit încă.
      </p>
    );
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Caută după numele liderului… (implicit: toți liderii)"
        className="w-full max-w-xs rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber placeholder:text-ink-umber-soft/70 transition-colors duration-200 ease-out focus:border-sage-trust focus:outline-none"
      />

      {filteredItems.length === 0 ? (
        <p className="animate-fade-in mt-6 rounded-[14px] bg-soft-linen px-6 py-8 text-center text-sm leading-relaxed text-ink-umber-soft">
          Niciun mesaj găsit pentru „{query}”.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {filteredItems.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index} isAdmin={isAdmin} onHide={handleHide} />
          ))}
        </div>
      )}
    </div>
  );
}
