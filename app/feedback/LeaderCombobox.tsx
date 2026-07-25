"use client";

import { useMemo, useRef, useState } from "react";
import type { LeaderOption } from "./data";

export function LeaderCombobox({
  leaders,
  onChange,
  inputId,
}: {
  leaders: LeaderOption[];
  onChange: (leaderId: string) => void;
  inputId?: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leaders;
    return leaders.filter((leader) => leader.name.toLowerCase().includes(q));
  }, [leaders, query]);

  function selectLeader(leader: LeaderOption | null) {
    setSelectedId(leader?.id ?? "");
    setQuery(leader?.name ?? "");
    setIsOpen(false);
    onChange(leader?.id ?? "");
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
      // If the typed text doesn't match a real selection, fall back to
      // "Toți liderii" instead of silently submitting stray text.
      if (!selectedId) setQuery("");
    }
  }

  return (
    <div ref={containerRef} onBlur={handleBlur} className="relative">
      <input
        id={inputId}
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setSelectedId("");
          onChange("");
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Toți liderii (scrie pentru a căuta un lider)"
        autoComplete="off"
        className="w-full rounded-xl border border-border-sand bg-warm-cream px-4 py-3 text-base text-ink-umber outline-none placeholder:text-ink-umber-soft/50 focus:border-sage-trust"
      />
      {isOpen && (
        <ul className="absolute z-10 mt-1.5 max-h-56 w-full overflow-y-auto rounded-[8px] border border-border-sand bg-warm-cream py-1.5 shadow-lg">
          <li>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectLeader(null)}
              className="block w-full px-4 py-2 text-left text-sm text-ink-umber-soft transition-colors duration-150 hover:bg-soft-linen"
            >
              Toți liderii
            </button>
          </li>
          {matches.length === 0 ? (
            <li className="px-4 py-2 text-sm text-ink-umber-soft">Niciun lider găsit.</li>
          ) : (
            matches.map((leader) => (
              <li key={leader.id}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectLeader(leader)}
                  className="block w-full px-4 py-2 text-left text-sm text-ink-umber transition-colors duration-150 hover:bg-soft-linen"
                >
                  {leader.name}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
