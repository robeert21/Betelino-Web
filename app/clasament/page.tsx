import { getLeaderboardTeams, getTopCampers } from "./data";
import { ClasamentTabs } from "./ClasamentTabs";

export const metadata = {
  title: "Clasament — Betelino",
};

export default async function ClasamentPage() {
  const [teams, campers] = await Promise.all([getLeaderboardTeams(), getTopCampers(3)]);

  return <ClasamentTabs teams={teams} campers={campers} />;
}
