import Image from "next/image";
import Link from "next/link";

const DESTINATIONS = [
  {
    href: "/regulamente",
    title: "Regulamente",
    description: "Regulile jocurilor și programul zilnic al taberei.",
    accent: "bg-sage-trust/15 text-sage-deep",
    dot: "bg-sage-trust",
  },
  {
    href: "/magazin",
    title: "Magazin",
    description: "Solicită obiecte din magazinul taberei cu punctele tale.",
    accent: "bg-amber-glow/20 text-amber-deep",
    dot: "bg-amber-glow rotate-45 rounded-[4px]",
  },
  {
    href: "/cont",
    title: "Contul meu",
    description: "Vezi numele echipei tale, punctele individuale și punctele echipei.",
    accent: "bg-forest-night/10 text-forest-night",
    dot: "bg-transparent border-2 border-forest-night rounded-full",
  },
];

export default function Home() {
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
        <div className="relative mx-auto grid max-w-[1800px] items-center gap-12 px-6 py-16 md:min-h-[calc(100svh-72px)] md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:px-12 xl:px-20 2xl:px-28">
          <div>
            <div className="animate-fade-in flex items-center gap-2.5">
              <span className="h-[2px] w-7 bg-amber-glow" />
              <span className="text-[0.8125rem] font-bold uppercase tracking-[0.15em] text-amber-glow">
                Tabăra de vară 2026
              </span>
            </div>
            <h1 className="animate-fade-in stagger-1 font-shout mt-5 text-[clamp(3.25rem,8vw,6.75rem)] leading-[0.9] text-warm-cream">
              BETELINO
            </h1>
            <p className="animate-fade-in stagger-2 mt-6 max-w-lg text-xl leading-relaxed text-warm-cream/80">
              Bine ai venit, exploratorule! Aici găsești regulile jocurilor,
              magazinul taberei și contul tău cu echipa și punctele adunate
              zi de zi.
            </p>
            <div className="animate-fade-in stagger-3 mt-10 flex flex-wrap gap-4">
              <Link
                href="/cont"
                className="inline-flex items-center gap-2.5 rounded-full bg-amber-glow px-9 py-4 text-base font-bold text-forest-night transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep active:scale-[0.98]"
              >
                Vezi contul meu
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/regulamente"
                className="rounded-full border border-forest-mist px-8 py-4 text-base font-semibold text-warm-cream/90 transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-amber-glow hover:text-warm-cream active:scale-[0.98]"
              >
                Citește regulamentele
              </Link>
            </div>
          </div>

          <div className="flex justify-center pt-5 md:justify-end">
            <div className="relative flex w-fit items-end">
              <div
                className="absolute left-1/2 top-0 h-[340px] w-[340px] -translate-x-1/2 rounded-full md:h-[560px] md:w-[560px] xl:h-[620px] xl:w-[620px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(224,167,61,0.24), transparent 70%)",
                }}
              />
              <Image
                src="/homepage-hero-explorer.png"
                alt="Explorator cu harta comorii"
                width={720}
                height={720}
                priority
                className="relative w-full max-w-[400px] drop-shadow-[0_30px_40px_rgba(10,20,15,0.55)] md:max-w-[560px] xl:max-w-[620px]"
              />
              <div className="absolute bottom-2 left-0 flex items-center gap-2.5 rounded-2xl bg-warm-cream px-4 py-3 shadow-[0_12px_30px_-8px_rgba(10,20,15,0.4)]">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sage-trust">
                  <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-warm-cream" />
                </div>
                <span className="whitespace-nowrap text-sm font-extrabold text-ink-umber">
                  Aventura te așteaptă
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-soft-linen px-6 py-16 md:px-12 xl:px-20 2xl:px-28">
        <div className="mx-auto grid max-w-[1800px] gap-px overflow-hidden rounded-[22px] bg-border-sand md:grid-cols-3">
          {DESTINATIONS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`animate-fade-in stagger-${index + 1} group flex flex-col gap-2 bg-warm-cream p-8 transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 md:p-10`}
            >
              <span
                className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl ${item.accent}`}
              >
                <span className={`block h-5 w-5 ${item.dot}`} />
              </span>
              <span className="text-lg font-semibold text-ink-umber">
                {item.title}
              </span>
              <span className="text-sm leading-relaxed text-ink-umber-soft">
                {item.description}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
                Vezi
                <span className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
