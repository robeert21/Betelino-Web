import { getLeaderOptions } from "./data";
import { FeedbackForm } from "./FeedbackForm";

export const metadata = {
  title: "Feedback — Betelino",
};

export default async function FeedbackPage() {
  const leaders = await getLeaderOptions();

  return (
    <div>
      <section className="relative overflow-hidden bg-warm-cream">
        <div className="relative mx-auto max-w-[1800px] px-6 pb-8 pt-16 md:px-12 md:pb-10 md:pt-20 xl:px-20 2xl:px-28">
          <div className="animate-fade-in flex items-center gap-2.5">
            <span className="h-[2px] w-7 bg-sage-trust" />
            <span className="text-[0.8125rem] font-bold uppercase tracking-[0.15em] text-sage-trust">
              Feedback
            </span>
          </div>
          <h1 className="animate-fade-in stagger-1 font-display mt-5 text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[0.95] text-ink-umber">
            Ce ți-a plăcut la tabără?
          </h1>
          <p className="animate-fade-in stagger-2 mt-6 max-w-[65ch] text-lg leading-relaxed text-ink-umber-soft">
            Trimite un mesaj unui lider — un moment, o activitate, o vorbă
            bună. Nu trebuie să ai cont, iar numele tău este opțional: îl
            poți lăsa gol dacă vrei să rămână anonim.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[900px] px-6 pb-14 pt-2 md:px-12 md:pb-20 md:pt-4 xl:px-20 2xl:px-28">
        <FeedbackForm leaders={leaders} />
      </div>
    </div>
  );
}
