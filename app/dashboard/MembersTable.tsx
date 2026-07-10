"use client";

import { useState, useTransition } from "react";
import { assignTeamAction, assignRoleAction, assignCabinAction, deleteMemberAction } from "./actions";
import type { MemberEntry, TeamWithPoints } from "./data";

const ROLE_LABELS: Record<string, string> = {
  CAMPER: "Camper",
  STAFF: "Lider",
  CALAUZA: "Călăuză",
  ADMIN: "Admin",
};

const ROLE_OPTIONS = Object.entries(ROLE_LABELS);
const CABIN_OPTIONS = Array.from({ length: 14 }, (_, i) => i + 1);

const selectClassName =
  "rounded-[8px] border border-border-sand bg-warm-cream px-3.5 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border-sand";

export function MembersTable({
  members,
  teams,
  currentUserId,
}: {
  members: MemberEntry[];
  teams: TeamWithPoints[];
  currentUserId: string;
}) {
  return (
    <div className="overflow-x-auto rounded-[16px] bg-soft-linen">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-sand text-left text-ink-umber-soft">
            <th className="px-7 py-5 font-medium">Nume</th>
            <th className="px-7 py-5 font-medium">Email</th>
            <th className="px-7 py-5 font-medium">Rol</th>
            <th className="px-7 py-5 font-medium">Puncte</th>
            <th className="px-7 py-5 font-medium">Echipă</th>
            <th className="px-7 py-5 font-medium">Cabană</th>
            <th className="px-7 py-5 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              teams={teams}
              isSelf={member.id === currentUserId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MemberRow({
  member,
  teams,
  isSelf,
}: {
  member: MemberEntry;
  teams: TeamWithPoints[];
  isSelf: boolean;
}) {
  const [teamId, setTeamId] = useState(member.teamId ?? "");
  const [role, setRole] = useState(member.role);
  const [cabin, setCabin] = useState(member.cabin != null ? String(member.cabin) : "");
  const [teamError, setTeamError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [cabinError, setCabinError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleTeamChange(value: string) {
    const previous = teamId;
    setTeamId(value);
    setTeamError(null);
    startTransition(async () => {
      const result = await assignTeamAction(member.id, value || null);
      if (result.error) {
        setTeamId(previous);
        setTeamError(result.error);
      }
    });
  }

  function handleRoleChange(value: string) {
    const previous = role;
    setRole(value);
    setRoleError(null);
    startTransition(async () => {
      const result = await assignRoleAction(member.id, value);
      if (result.error) {
        setRole(previous);
        setRoleError(result.error);
      }
    });
  }

  function handleCabinChange(value: string) {
    const previous = cabin;
    setCabin(value);
    setCabinError(null);
    startTransition(async () => {
      const result = await assignCabinAction(member.id, value ? Number(value) : null);
      if (result.error) {
        setCabin(previous);
        setCabinError(result.error);
      }
    });
  }

  function handleDelete() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteMemberAction(member.id);
      if (result.error) {
        setDeleteError(result.error);
        setConfirmingDelete(false);
      } else {
        setDeleted(true);
      }
    });
  }

  if (deleted) {
    return null;
  }

  return (
    <tr className="border-b border-border-sand last:border-0">
      <td className="px-7 py-5 font-semibold text-ink-umber">{member.name}</td>
      <td className="px-7 py-5 text-ink-umber-soft">{member.email}</td>
      <td className="px-7 py-5">
        <select
          value={role}
          disabled={isPending || isSelf}
          onChange={(event) => handleRoleChange(event.target.value)}
          className={selectClassName}
        >
          {ROLE_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {roleError && <p className="mt-2 max-w-[180px] text-xs text-signal-red">{roleError}</p>}
      </td>
      <td className="px-7 py-5 tabular-nums text-ink-umber">{member.points}</td>
      <td className="px-7 py-5">
        <select
          value={teamId}
          disabled={isPending}
          onChange={(event) => handleTeamChange(event.target.value)}
          className={selectClassName}
        >
          <option value="">Neatribuit</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        {teamError && <p className="mt-2 max-w-[180px] text-xs text-signal-red">{teamError}</p>}
      </td>
      <td className="px-7 py-5">
        <select
          value={cabin}
          disabled={isPending}
          onChange={(event) => handleCabinChange(event.target.value)}
          className={selectClassName}
        >
          <option value="">Neatribuită</option>
          {CABIN_OPTIONS.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
        {cabinError && <p className="mt-2 max-w-[180px] text-xs text-signal-red">{cabinError}</p>}
      </td>
      <td className="px-7 py-5 text-right">
        {!isSelf && (
          <div className="flex items-center justify-end gap-2">
            {confirmingDelete && (
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={isPending}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-ink-umber-soft transition-colors duration-200 ease-out hover:text-ink-umber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:opacity-60"
              >
                Anulează
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:cursor-not-allowed disabled:opacity-60 ${
                confirmingDelete
                  ? "bg-signal-red text-warm-cream hover:bg-signal-red/90"
                  : "border border-signal-red/30 text-signal-red hover:bg-signal-red/10"
              }`}
            >
              {isPending ? "Se șterge…" : confirmingDelete ? "Sigur, șterge" : "Șterge"}
            </button>
          </div>
        )}
        {deleteError && (
          <p className="mt-2 max-w-[220px] text-right text-xs text-signal-red">{deleteError}</p>
        )}
      </td>
    </tr>
  );
}
