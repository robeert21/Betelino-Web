import { notFound } from "next/navigation";
import Link from "next/link";
import { getFolderDetail } from "../../../data";
import { UploadMaterialForm } from "../UploadMaterialForm";
import { MaterialsList } from "../MaterialsList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; folderId: string }>;
}) {
  const { folderId } = await params;
  const folder = await getFolderDetail(folderId);
  return { title: folder ? `${folder.name} — ${folder.stationName} — Betelino` : "Folder — Betelino" };
}

export default async function FolderDetailPage({
  params,
}: {
  params: Promise<{ id: string; folderId: string }>;
}) {
  const { id, folderId } = await params;
  const folder = await getFolderDetail(folderId);
  if (!folder || folder.stationId !== id) {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/dashboard/materiale/${id}`}
        className="animate-fade-in text-sm font-medium text-sage-deep hover:underline"
      >
        ← {folder.stationName}
      </Link>

      <h1 className="animate-fade-in stagger-1 mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        {folder.name}
      </h1>

      <div className="mt-14">
        <UploadMaterialForm folderId={folder.id} />
      </div>

      <div className="mt-20">
        <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
          Materiale
        </h2>
        <div className="mt-6">
          <MaterialsList materials={folder.materials} />
        </div>
      </div>
    </div>
  );
}
