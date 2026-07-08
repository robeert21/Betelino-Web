"use client";

import { useState, useTransition } from "react";
import { assignTeamAction, assignRoleAction, deleteMemberAction } from "./actions";
import type { MemberEntry, TeamWithPoints } from "./data";

const ROLE_LABELS: Record<string, string> = {
  CAMPER: "Camper",
  STAFF: "Lider",
  ADMIN: "Admin",
};

const ROLE_OPTIONS = Object.entries(ROLE_LABELS);

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
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleTeamChange(value: string) {
    setTeamId(value);
    startTransition(async () => {
      await assignTeamAction(member.id, value || null);
    });
  }

  function handleRoleChange(value: string) {
    setRole(value);
    startTransition(async () => {
      await assignRoleAction(member.id, value);
    });
  }

  function handleDelete() {
    if (!confirm(`Ștergi definitiv contul lui ${member.name}? Această acțiune nu poate fi anulată.`)) {
      return;
    }
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteMemberAction(member.id);
      if (result.error) {
        setDeleteError(result.error);
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
          className="rounded-[8px] border border-border-sand bg-warm-cream px-3.5 py-2.5 text-sm text-ink-umber disabled:opacity-60"
        >
          {ROLE_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-7 py-5 tabular-nums text-ink-umber">{member.points}</td>
      <td className="px-7 py-5">
        <select
          value={teamId}
          disabled={isPending}
          onChange={(event) => handleTeamChange(event.target.value)}
          className="rounded-[8px] border border-border-sand bg-warm-cream px-3.5 py-2.5 text-sm text-ink-umber disabled:opacity-60"
        >
          <option value="">Neatribuit</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </td>
      <td className="px-7 py-5 text-right">
        {!isSelf && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-[8px] border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            Șterge
          </button>
        )}
        {deleteError && (
          <p className="mt-2 max-w-[220px] text-xs text-red-600">{deleteError}</p>
        )}
      </td>
    </tr>
  );
}
