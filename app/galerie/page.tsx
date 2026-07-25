import { getGalleryItems } from "./data";
import { GalleryGrid } from "./GalleryGrid";

export const metadata = {
  title: "Galerie — Betelino",
};

export default async function GaleriePage() {
  const items = await getGalleryItems();

  return (
    <div>
      <section className="relative overflow-hidden bg-forest-night">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 78% 30%, rgba(72, 145, 96, 0.55), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1800px] px-6 py-16 md:px-12 md:py-20 xl:px-20 2xl:px-28">
          <div className="animate-fade-in flex items-center gap-2.5">
            <span className="h-[2px] w-7 bg-amber-glow" />
            <span className="text-[0.8125rem] font-bold uppercase tracking-[0.15em] text-amber-glow">
              Galerie
            </span>
          </div>
          <h1 className="animate-fade-in stagger-1 mt-5 font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.1] text-warm-cream">
            Poze și video-uri din tabără
          </h1>
          <p className="animate-fade-in stagger-2 mt-5 max-w-[60ch] leading-relaxed text-warm-cream/75">
            Momentele surprinse de echipă, adunate într-un singur loc. Le poți
            descărca oricând.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1800px] px-6 py-14 md:px-12 xl:px-20 2xl:px-28">
        <GalleryGrid items={items} />
      </div>
    </div>
  );
}
