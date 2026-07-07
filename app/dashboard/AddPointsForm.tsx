"use client";

import { useActionState, useEffect, useRef } from "react";
import { addTeamPointsAction, type AddPointsState } from "./actions";
import type { TeamWithPoints } from "./data";

const initialState: AddPointsState = {};

export function AddPointsForm({ teams }: { teams: TeamWithPoints[] }) {
  const [state, formAction, isPending] = useActionState(
    addTeamPointsAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-5 rounded-[16px] bg-soft-linen p-7"
    >
      <h2 className="text-lg font-semibold text-ink-umber">
        Adaugă sau scade puncte
      </h2>

      {state.error && (
        <p className="rounded-[8px] bg-warm-cream px-4 py-3 text-sm text-signal-red">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-[8px] bg-warm-cream px-4 py-3 text-sm text-sage-deep">
          Puncte înregistrate.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="teamId" className="text-sm font-medium text-ink-umber-soft">
          Echipă
        </label>
        <select
          id="teamId"
          name="teamId"
          required
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber"
        >
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-sm font-medium text-ink-umber-soft">
          Puncte (poate fi negativ, ex. -10)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step={1}
          required
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="reason" className="text-sm font-medium text-ink-umber-soft">
          Motiv (opțional)
        </label>
        <input
          id="reason"
          name="reason"
          type="text"
          maxLength={280}
          placeholder="ex. Câștigători ștafetă"
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-amber-glow px-6 py-3 text-sm font-semibold text-ink-umber transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border-sand disabled:text-ink-umber-soft"
      >
        {isPending ? "Se salvează…" : "Salvează"}
      </button>
    </form>
  );
}
