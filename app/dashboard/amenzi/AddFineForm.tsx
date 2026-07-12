"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { addFineAction, type AddFineState } from "../actions";
import type { CamperMember } from "../data";

const initialState: AddFineState = {};

export function AddFineForm({ members }: { members: CamperMember[] }) {
  const [state, formAction, isPending] = useActionState(
    addFineAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [submitId, setSubmitId] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectKey, setSelectKey] = useState(0);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setQuery("");
      setSelectedId("");
      setSelectKey((key) => key + 1);
    }
    if (state !== initialState) {
      setSubmitId((id) => id + 1);
    }
  }, [state]);

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((member) => member.name.toLowerCase().includes(q));
  }, [members, query]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-5 rounded-[16px] bg-soft-linen p-7"
    >
      <h2 className="text-lg font-semibold text-ink-umber">
        Adaugă o amendă
      </h2>

      {state.error && (
        <p
          key={`error-${submitId}`}
          className="animate-alert-in rounded-[8px] bg-warm-cream px-4 py-3 text-sm text-signal-red"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          key={`success-${submitId}`}
          className="animate-alert-in rounded-[8px] bg-warm-cream px-4 py-3 text-sm text-sage-deep"
        >
          Amendă înregistrată.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="fine-search" className="text-sm font-medium text-ink-umber-soft">
          Caută copil
        </label>
        <input
          id="fine-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Caută după nume…"
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="fine-userId" className="text-sm font-medium text-ink-umber-soft">
          Copil
        </label>
        <select
          key={selectKey}
          id="fine-userId"
          name="userId"
          required
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none"
        >
          <option value="" disabled>
            {filteredMembers.length === 0 ? "Niciun copil găsit" : "Alege un copil"}
          </option>
          {filteredMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="fine-reason" className="text-sm font-medium text-ink-umber-soft">
          Motiv
        </label>
        <input
          id="fine-reason"
          name="reason"
          type="text"
          maxLength={280}
          required
          placeholder="ex. Nerespectarea programului"
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="fine-amount" className="text-sm font-medium text-ink-umber-soft">
          Cost (lei)
        </label>
        <input
          id="fine-amount"
          name="amount"
          type="number"
          min={0}
          step={0.1}
          required
          placeholder="ex. 10"
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-amber-glow px-6 py-3 text-sm font-semibold text-ink-umber transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border-sand disabled:text-ink-umber-soft"
      >
        {isPending ? "Se salvează…" : "Salvează"}
      </button>
    </form>
  );
}
