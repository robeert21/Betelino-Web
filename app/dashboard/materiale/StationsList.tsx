import Link from "next/link";
import type { StationEntry } from "../data";

export function StationsList({ stations }: { stations: StationEntry[] }) {
  if (stations.length === 0) {
    return (
      <p className="animate-fade-in rounded-[16px] bg-soft-linen px-7 py-7 text-sm text-ink-umber-soft">
        Nicio zonă disponibilă.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {stations.map((station, index) => (
        <li key={station.id} style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
          <Link
            href={`/dashboard/materiale/${station.id}`}
            className="animate-fade-in block h-full rounded-[16px] bg-soft-linen p-7 transition-colors duration-200 ease-out hover:bg-warm-cream"
          >
            <p className="font-display text-lg font-medium text-ink-umber">{station.name}</p>
            {station.description && (
              <p className="mt-2 line-clamp-2 text-sm text-ink-umber-soft">{station.description}</p>
            )}
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-sage-deep">
              {station.materialCount} {station.materialCount === 1 ? "material" : "materiale"}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
