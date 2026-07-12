import { getStations } from "../data";
import { StationsList } from "./StationsList";

export const metadata = {
  title: "Materiale — Dashboard lideri — Betelino",
};

export default async function DashboardMaterialsPage() {
  const stations = await getStations();

  return (
    <div>
      <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Materiale
      </h1>
      <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        Alege o zonă și încarcă materialele necesare (reguli, poze, liste de
        recuzită) ca oricare lider să le poată prelua rapid.
      </p>

      <div className="mt-14">
        <StationsList stations={stations} />
      </div>
    </div>
  );
}
