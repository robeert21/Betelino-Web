import { notFound } from "next/navigation";
import Link from "next/link";
import { getStationOverview } from "../../data";
import { CreateFolderForm } from "./CreateFolderForm";
import { FoldersList } from "./FoldersList";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const station = await getStationOverview(id);
  return { title: station ? `${station.name} — Materiale — Betelino` : "Zonă — Betelino" };
}

export default async function StationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const station = await getStationOverview(id);
  if (!station) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/dashboard/materiale"
        className="animate-fade-in text-sm font-medium text-sage-deep hover:underline"
      >
        ← Toate zonele
      </Link>

      <h1 className="animate-fade-in stagger-1 mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        {station.name}
      </h1>
      {station.description && (
        <p className="animate-fade-in stagger-2 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
          {station.description}
        </p>
      )}

      <div className="mt-14">
        <CreateFolderForm stationId={station.id} />
      </div>

      <div className="mt-14">
        <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
          Foldere
        </h2>
        <div className="mt-6">
          <FoldersList stationId={station.id} folders={station.folders} />
        </div>
      </div>
    </div>
  );
}
