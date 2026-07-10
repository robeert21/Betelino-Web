"use client";

import { useRouter } from "next/navigation";
import type { TeamWithPoints } from "../data";

export function TeamPicker({
  teams,
  selectedTeamId,
}: {
  teams: TeamWithPoints[];
  selectedTeamId: string;
}) {
  const router = useRouter();

  return (
    <select
      value={selectedTeamId}
      onChange={(event) => router.push(`/dashboard/echipa?team=${event.target.value}`)}
      className="rounded-[8px] border border-border-sand bg-warm-cream px-3.5 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none"
    >
      {teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  );
}
