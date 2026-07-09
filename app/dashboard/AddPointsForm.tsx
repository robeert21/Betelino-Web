"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { addTeamPointsAction, type AddPointsState } from "./actions";
import type { CamperMember, TeamWithPoints } from "./data";

const initialState: AddPointsState = {};

export function AddPointsForm({
  teams,
  members,
}: {
  teams: TeamWithPoints[];
  members: CamperMember[];
}) {
  const [state, formAction, isPending] = useActionState(
    addTeamPointsAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [submitId, setSubmitId] = useState(0);
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const [memberSelectKey, setMemberSelectKey] = useState(0);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setMemberSelectKey((key) => key + 1);
    }
    if (state !== initialState) {
      setSubmitId((id) => id + 1);
    }
  }, [state]);

  const teamMembers = useMemo(
    () => members.filter((member) => member.teamId === teamId),
    [members, teamId],
  );

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
          value={teamId}
          onChange={(event) => {
            setTeamId(event.target.value);
            setMemberSelectKey((key) => key + 1);
          }}
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out focus:border-sage-trust focus:outline-none"
        >
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="userId" className="text-sm font-medium text-ink-umber-soft">
          Copil (opțional)
        </label>
        <select
          key={memberSelectKey}
          id="userId"
          name="userId"
          defaultValue=""
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out focus:border-sage-trust focus:outline-none"
        >
          <option value="">Toată echipa</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-ink-umber-soft">
          Alege un copil pentru a-i atribui punctele lui individual (se adaugă și la echipă), sau lasă „Toată echipa” pentru puncte doar de echipă.
        </p>
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
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out focus:border-sage-trust focus:outline-none"
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
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out focus:border-sage-trust focus:outline-none"
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
