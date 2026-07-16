"use client";

import { useMemo, useState, useTransition } from "react";
import {
  assignTeamAction,
  assignRoleAction,
  assignCabinAction,
  deleteMemberAction,
  resetMemberPasswordAction,
} from "./actions";
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
  "w-full rounded-[8px] border border-border-sand bg-warm-cream px-3.5 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border-sand";

const compactSelectClassName =
  "rounded-[8px] border border-border-sand bg-warm-cream px-3.5 py-2 text-xs text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border-sand";

export function MembersTable({
  members,
  teams,
  currentUserId,
  isAdmin,
}: {
  members: MemberEntry[];
  teams: TeamWithPoints[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [liveMembers, setLiveMembers] = useState(members);

  function handleRemoved(id: string) {
    setLiveMembers((current) => current.filter((member) => member.id !== id));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return liveMembers.filter((member) => {
      if (roleFilter !== "ALL" && member.role !== roleFilter) return false;
      if (!q) return true;
      return (
        member.name.toLowerCase().includes(q) ||
        (member.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [liveMembers, query, roleFilter]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const member of liveMembers) {
      counts[member.role] = (counts[member.role] ?? 0) + 1;
    }
    return counts;
  }, [liveMembers]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Caută după nume sau email…"
            className="w-full rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber placeholder:text-ink-umber-soft/70 transition-colors duration-200 ease-out focus:border-sage-trust focus:outline-none"
          />
        </div>
        <p className="text-xs text-ink-umber-soft">
          {filtered.length} din {liveMembers.length} membri
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterPill
          label={`Toți (${liveMembers.length})`}
          active={roleFilter === "ALL"}
          onClick={() => setRoleFilter("ALL")}
        />
        {ROLE_OPTIONS.map(([value, label]) => (
          <FilterPill
            key={value}
            label={`${label} (${roleCounts[value] ?? 0})`}
            active={roleFilter === value}
            onClick={() => setRoleFilter(value)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-[16px] bg-soft-linen px-7 py-7 text-sm text-ink-umber-soft">
          Niciun membru nu corespunde căutării.
        </p>
      ) : (
        <>
          {/* Desktop / wide tablet table */}
          <div className="mt-8 hidden overflow-x-auto rounded-[16px] bg-soft-linen xl:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-sand text-left text-ink-umber-soft">
                  <th className="px-7 py-5 font-medium">Membru</th>
                  <th className="w-[13%] px-4 py-5 font-medium">Rol</th>
                  <th className="w-[9%] px-4 py-5 font-medium">Puncte</th>
                  <th className="w-[18%] px-4 py-5 font-medium">Echipă</th>
                  <th className="w-[12%] px-4 py-5 font-medium">Cabană</th>
                  <th className="w-[9%] px-4 py-5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    teams={teams}
                    isSelf={member.id === currentUserId}
                    isAdmin={isAdmin}
                    onRemoved={handleRemoved}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout for phones and narrow tablets */}
          <ul className="mt-8 flex flex-col gap-4 xl:hidden">
            {filtered.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                teams={teams}
                isSelf={member.id === currentUserId}
                isAdmin={isAdmin}
                onRemoved={handleRemoved}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep ${
        active
          ? "bg-sage-trust text-warm-cream"
          : "bg-soft-linen text-ink-umber-soft hover:text-ink-umber"
      }`}
    >
      {label}
    </button>
  );
}

function useMemberControls(member: MemberEntry, onRemoved: (id: string) => void) {
  const [teamId, setTeamId] = useState(member.teamId ?? "");
  const [role, setRole] = useState(member.role);
  const [cabin, setCabin] = useState(member.cabin != null ? String(member.cabin) : "");
  const [teamError, setTeamError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [cabinError, setCabinError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
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
        onRemoved(member.id);
      }
    });
  }

  function handleResetPassword() {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    setResetError(null);
    startTransition(async () => {
      const result = await resetMemberPasswordAction(member.id);
      if (result.error) {
        setResetError(result.error);
        setConfirmingReset(false);
      } else {
        setTempPassword(result.tempPassword ?? null);
        setConfirmingReset(false);
      }
    });
  }

  return {
    teamId,
    role,
    cabin,
    teamError,
    roleError,
    cabinError,
    deleteError,
    confirmingDelete,
    resetError,
    confirmingReset,
    tempPassword,
    isPending,
    handleTeamChange,
    handleRoleChange,
    handleCabinChange,
    handleDelete,
    handleResetPassword,
    setConfirmingDelete,
    setConfirmingReset,
    setTempPassword,
  };
}

function MemberRow({
  member,
  teams,
  isSelf,
  isAdmin,
  onRemoved,
}: {
  member: MemberEntry;
  teams: TeamWithPoints[];
  isSelf: boolean;
  isAdmin: boolean;
  onRemoved: (id: string) => void;
}) {
  const c = useMemberControls(member, onRemoved);

  return (
    <tr className="border-b border-border-sand last:border-0 align-top">
      <td className="px-7 py-5">
        <p className="font-semibold text-ink-umber">{member.name}</p>
        {member.email && (
          <p className="mt-0.5 break-all text-xs text-ink-umber-soft">{member.email}</p>
        )}
      </td>
      <td className="px-4 py-5">
        {isAdmin ? (
          <select
            value={c.role}
            disabled={c.isPending || isSelf}
            onChange={(event) => c.handleRoleChange(event.target.value)}
            className={selectClassName}
          >
            {ROLE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-ink-umber">{ROLE_LABELS[member.role] ?? member.role}</p>
        )}
        {c.roleError && <p className="mt-2 max-w-[180px] text-xs text-signal-red">{c.roleError}</p>}
      </td>
      <td className="px-4 py-5 tabular-nums text-ink-umber">{member.points}</td>
      <td className="px-4 py-5">
        {isAdmin ? (
          <select
            value={c.teamId}
            disabled={c.isPending}
            onChange={(event) => c.handleTeamChange(event.target.value)}
            className={selectClassName}
          >
            <option value="">Neatribuit</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-ink-umber">
            {teams.find((team) => team.id === c.teamId)?.name ?? "Neatribuit"}
          </p>
        )}
        {c.teamError && <p className="mt-2 max-w-[180px] text-xs text-signal-red">{c.teamError}</p>}
      </td>
      <td className="px-4 py-5">
        <select
          value={c.cabin}
          disabled={c.isPending}
          onChange={(event) => c.handleCabinChange(event.target.value)}
          className={selectClassName}
        >
          <option value="">Neatribuită</option>
          {CABIN_OPTIONS.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
        {c.cabinError && <p className="mt-2 max-w-[180px] text-xs text-signal-red">{c.cabinError}</p>}
      </td>
      <td className="px-4 py-5 text-right">
        {isAdmin && !isSelf && (
          <div className="flex flex-col items-end gap-2">
            {c.confirmingReset && (
              <button
                type="button"
                onClick={() => c.setConfirmingReset(false)}
                disabled={c.isPending}
                className="text-xs font-medium text-ink-umber-soft transition-colors duration-200 ease-out hover:text-ink-umber disabled:opacity-60"
              >
                Anulează
              </button>
            )}
            <button
              type="button"
              onClick={c.handleResetPassword}
              disabled={c.isPending}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:cursor-not-allowed disabled:opacity-60 ${
                c.confirmingReset
                  ? "bg-sage-trust text-warm-cream hover:bg-sage-deep"
                  : "border border-border-sand text-ink-umber-soft hover:border-sage-trust/50 hover:text-ink-umber"
              }`}
            >
              {c.isPending && !c.confirmingDelete
                ? "Se resetează…"
                : c.confirmingReset
                  ? "Sigur, resetează"
                  : "Resetează parola"}
            </button>
            {c.confirmingDelete && (
              <button
                type="button"
                onClick={() => c.setConfirmingDelete(false)}
                disabled={c.isPending}
                className="text-xs font-medium text-ink-umber-soft transition-colors duration-200 ease-out hover:text-ink-umber disabled:opacity-60"
              >
                Anulează
              </button>
            )}
            <button
              type="button"
              onClick={c.handleDelete}
              disabled={c.isPending}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:cursor-not-allowed disabled:opacity-60 ${
                c.confirmingDelete
                  ? "bg-signal-red text-warm-cream hover:bg-signal-red/90"
                  : "border border-signal-red/30 text-signal-red hover:bg-signal-red/10"
              }`}
            >
              {c.isPending ? "Se șterge…" : c.confirmingDelete ? "Sigur, șterge" : "Șterge"}
            </button>
          </div>
        )}
        {c.deleteError && (
          <p className="mt-2 max-w-[180px] text-right text-xs text-signal-red">{c.deleteError}</p>
        )}
        {c.resetError && (
          <p className="mt-2 max-w-[180px] text-right text-xs text-signal-red">{c.resetError}</p>
        )}
        {c.tempPassword && (
          <TempPasswordCallout password={c.tempPassword} onDismiss={() => c.setTempPassword(null)} />
        )}
      </td>
    </tr>
  );
}

function MemberCard({
  member,
  teams,
  isSelf,
  isAdmin,
  onRemoved,
}: {
  member: MemberEntry;
  teams: TeamWithPoints[];
  isSelf: boolean;
  isAdmin: boolean;
  onRemoved: (id: string) => void;
}) {
  const c = useMemberControls(member, onRemoved);
  const hasFieldError = c.roleError || c.teamError || c.cabinError || c.deleteError || c.resetError;

  return (
    <li className="rounded-[16px] bg-soft-linen px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink-umber">{member.name}</p>
          {member.email && (
            <p className="mt-0.5 truncate text-xs text-ink-umber-soft">{member.email}</p>
          )}
        </div>

        <p className="shrink-0 tabular-nums text-sm font-semibold text-ink-umber">
          {member.points}p
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {isAdmin ? (
          <select
            value={c.role}
            disabled={c.isPending || isSelf}
            onChange={(event) => c.handleRoleChange(event.target.value)}
            className={compactSelectClassName}
          >
            {ROLE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          <span className="rounded-[8px] bg-warm-cream px-3.5 py-2 text-xs text-ink-umber-soft">
            {ROLE_LABELS[member.role] ?? member.role}
          </span>
        )}

        {isAdmin ? (
          <select
            value={c.teamId}
            disabled={c.isPending}
            onChange={(event) => c.handleTeamChange(event.target.value)}
            className={compactSelectClassName}
          >
            <option value="">Neatribuit</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        ) : (
          <span className="rounded-[8px] bg-warm-cream px-3.5 py-2 text-xs text-ink-umber-soft">
            {teams.find((team) => team.id === c.teamId)?.name ?? "Neatribuit"}
          </span>
        )}

        <select
          value={c.cabin}
          disabled={c.isPending}
          onChange={(event) => c.handleCabinChange(event.target.value)}
          className={compactSelectClassName}
        >
          <option value="">Cabană —</option>
          {CABIN_OPTIONS.map((number) => (
            <option key={number} value={number}>
              Cabana {number}
            </option>
          ))}
        </select>

        {isAdmin && !isSelf && (
          <div className="ml-auto flex shrink-0 items-center gap-3">
            {c.confirmingReset && (
              <button
                type="button"
                onClick={() => c.setConfirmingReset(false)}
                disabled={c.isPending}
                className="text-xs font-medium text-ink-umber-soft transition-colors duration-200 ease-out hover:text-ink-umber disabled:opacity-60"
              >
                Anulează
              </button>
            )}
            <button
              type="button"
              onClick={c.handleResetPassword}
              disabled={c.isPending}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:cursor-not-allowed disabled:opacity-60 ${
                c.confirmingReset
                  ? "bg-sage-trust text-warm-cream hover:bg-sage-deep"
                  : "border border-border-sand text-ink-umber-soft hover:border-sage-trust/50 hover:text-ink-umber"
              }`}
            >
              {c.confirmingReset ? "Sigur, resetează" : "Resetează parola"}
            </button>
            {c.confirmingDelete && (
              <button
                type="button"
                onClick={() => c.setConfirmingDelete(false)}
                disabled={c.isPending}
                className="text-xs font-medium text-ink-umber-soft transition-colors duration-200 ease-out hover:text-ink-umber disabled:opacity-60"
              >
                Anulează
              </button>
            )}
            <button
              type="button"
              onClick={c.handleDelete}
              disabled={c.isPending}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:cursor-not-allowed disabled:opacity-60 ${
                c.confirmingDelete
                  ? "bg-signal-red text-warm-cream hover:bg-signal-red/90"
                  : "border border-signal-red/30 text-signal-red hover:bg-signal-red/10"
              }`}
            >
              {c.isPending ? "Se șterge…" : c.confirmingDelete ? "Sigur, șterge" : "Șterge"}
            </button>
          </div>
        )}
      </div>

      {hasFieldError && (
        <p className="mt-2 text-xs text-signal-red">
          {c.roleError || c.teamError || c.cabinError || c.deleteError || c.resetError}
        </p>
      )}
      {c.tempPassword && (
        <TempPasswordCallout password={c.tempPassword} onDismiss={() => c.setTempPassword(null)} />
      )}
    </li>
  );
}

function TempPasswordCallout({
  password,
  onDismiss,
}: {
  password: string;
  onDismiss: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access may be unavailable; the password is still shown on screen.
    }
  }

  return (
    <div className="mt-3 max-w-xs rounded-[10px] border border-sage-trust/40 bg-sage-trust/10 px-4 py-3 text-left">
      <p className="text-xs font-medium text-ink-umber">Parolă nouă temporară:</p>
      <p className="mt-1 select-all break-all font-mono text-sm font-semibold text-ink-umber">
        {password}
      </p>
      <p className="mt-1 text-xs text-ink-umber-soft">
        Transmite-o membrului acum — nu va mai fi afișată din nou.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-medium text-sage-deep transition-colors duration-200 ease-out hover:text-sage-trust"
        >
          {copied ? "Copiat!" : "Copiază"}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs font-medium text-ink-umber-soft transition-colors duration-200 ease-out hover:text-ink-umber"
        >
          Ascunde
        </button>
      </div>
    </div>
  );
}
