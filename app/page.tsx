import Link from "next/link";

const DESTINATIONS = [
  {
    href: "/regulamente",
    title: "Regulamente",
    description: "Regulile jocurilor și programul zilnic al taberei.",
  },
  {
    href: "/magazin",
    title: "Magazin",
    description: "Solicită obiecte din magazinul taberei cu punctele tale.",
  },
  {
    href: "/cont",
    title: "Contul meu",
    description: "Vezi numele echipei tale, punctele individuale și punctele echipei.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
        <p className="animate-fade-in text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
          Tabăra de vară
        </p>
        <h1 className="animate-fade-in stagger-1 font-display mt-4 text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.05] text-ink-umber">
          Betelino
        </h1>
        <p className="animate-fade-in stagger-2 mt-3 max-w-xl text-lg text-ink-umber-soft">
          [Tema taberei din acest an — text de completat]
        </p>
        <p className="animate-fade-in stagger-2 mt-6 max-w-xl leading-relaxed text-ink-umber-soft">
          Bine ai venit! Aici găsești regulile jocurilor, magazinul taberei și
          contul tău cu echipa și punctele adunate zi de zi.
        </p>
        <div className="animate-fade-in stagger-3 mt-10 flex flex-wrap gap-4">
          <Link
            href="/cont"
            className="rounded-full bg-sage-trust px-8 py-3.5 text-sm font-semibold text-warm-cream transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sage-deep active:scale-[0.98]"
          >
            Vezi contul meu
          </Link>
          <Link
            href="/regulamente"
            className="rounded-full border border-border-sand bg-warm-cream px-7 py-3.5 text-sm font-semibold text-ink-umber transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink-umber-soft active:scale-[0.98]"
          >
            Citește regulamentele
          </Link>
        </div>
      </section>

      <section className="bg-soft-linen py-10">
        <div className="mx-auto grid max-w-4xl gap-px overflow-hidden rounded-[22px] bg-border-sand px-6 md:grid-cols-3 md:px-10">
          {DESTINATIONS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`animate-fade-in stagger-${index + 2} group flex flex-col gap-2 bg-soft-linen p-8 transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-warm-cream`}
            >
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
