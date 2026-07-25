import { redirect } from "next/navigation";
import { getCurrentUser, isAdminRole } from "@/lib/auth";
import { getGalleryItems } from "@/app/galerie/data";
import { UploadGalleryForm } from "./UploadGalleryForm";
import { GalleryManageList } from "./GalleryManageList";

export const metadata = {
  title: "Galerie — Dashboard lideri — Betelino",
};

export default async function DashboardGaleriePage() {
  const user = await getCurrentUser();
  if (!user || !isAdminRole(user.role)) {
    redirect("/dashboard");
  }

  const items = await getGalleryItems();

  return (
    <div>
      <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Galerie
      </h1>
      <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        Încarcă poze și video-uri din tabără. Apar imediat pentru toată lumea
        în pagina publică Galerie.
      </p>

      <div className="mt-14">
        <UploadGalleryForm />
      </div>

      <div className="mt-14">
        <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
          Fișiere încărcate
        </h2>
        <div className="mt-6">
          <GalleryManageList items={items} />
        </div>
      </div>
    </div>
  );
}
