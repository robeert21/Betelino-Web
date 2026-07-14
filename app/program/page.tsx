import { SCHEDULE } from "./data";
import { ScheduleTabs } from "./ScheduleTabs";

export const metadata = {
  title: "Program — Betelino",
};

export default function ProgramPage() {
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
              Program
            </span>
          </div>
          <h1 className="animate-fade-in stagger-1 font-shout mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] text-warm-cream">
            PROGRAMUL TABEREI
          </h1>
          <p className="animate-fade-in stagger-2 mt-6 max-w-[65ch] text-lg leading-relaxed text-warm-cream/80">
            Orarul zilnic al taberei BETELINO. Programul poate suferi mici
            ajustări pe parcurs, anunțate din timp de lideri.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1800px] px-6 pb-14 pt-11 md:px-12 md:pb-20 md:pt-14 xl:px-20 2xl:px-28">
        <ScheduleTabs days={SCHEDULE} />
      </div>
    </div>
  );
}
