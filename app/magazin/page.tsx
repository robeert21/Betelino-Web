import { getShopItems, SHOP_CATEGORY_LABELS, type ShopCategory } from "./data";
import { ShopItemCard } from "./ShopItemCard";
import { CartProvider } from "./CartContext";
import { CartPanel } from "./CartPanel";

export const metadata = {
  title: "Magazin — Betelino",
};

const CATEGORY_ORDER: ShopCategory[] = [
  "chipsuri-snacks",
  "dulciuri-gumate",
  "ciocolata-batoane",
  "biscuiti-napolitane",
  "porumb-dulce",
  "bauturi",
  "guma-menta",
  "igiena",
];

export default async function MagazinPage() {
  const items = await getShopItems();

  return (
    <CartProvider>
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
                Magazin
              </span>
            </div>
            <h1 className="animate-fade-in stagger-1 font-shout mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] text-warm-cream">
              MAGAZINUL TABEREI
            </h1>
            <p className="animate-fade-in stagger-2 mt-6 max-w-[65ch] text-lg leading-relaxed text-warm-cream/80">
              Adaugă în coș ce ai nevoie din fiecare raft și trimite o singură
              cerere către lideri. Produsele se ridică de la magazinul
              din tabără.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1800px] px-6 py-14 md:px-12 md:py-20 xl:px-20 2xl:px-28">
          <div className="mx-auto max-w-5xl divide-y divide-border-sand">
            {CATEGORY_ORDER.map((category, sectionIndex) => {
              const categoryItems = items.filter((item) => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <section
                  key={category}
                  className="animate-fade-in py-10 first:pt-0"
                  style={{ animationDelay: `${0.1 + sectionIndex * 0.08}s` }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="tabular-nums text-sm font-semibold text-sage-deep">
                      {String(sectionIndex + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-xl font-medium text-ink-umber">
                      {SHOP_CATEGORY_LABELS[category]}
                    </h2>
                  </div>

                  <div className="mt-7 grid gap-7 sm:grid-cols-2">
                    {categoryItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${0.16 + Math.min(index, 5) * 0.06}s` }}
                      >
                        <ShopItemCard item={item} />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mx-auto max-w-5xl">
            <CartPanel />
          </div>
        </div>
      </div>
    </CartProvider>
  );
}
