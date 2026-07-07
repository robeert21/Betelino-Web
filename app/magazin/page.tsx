import { getShopItems, SHOP_CATEGORY_LABELS, type ShopCategory } from "./data";
import { ShopItemCard } from "./ShopItemCard";
import { CartProvider } from "./CartContext";
import { CartPanel } from "./CartPanel";

export const metadata = {
  title: "Magazin — Betelino",
};

const CATEGORY_ORDER: ShopCategory[] = ["gustari", "bursa-bufet", "suveniruri"];

export default async function MagazinPage() {
  const items = await getShopItems();

  return (
    <CartProvider>
      <div className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
        <p className="animate-fade-in text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
          Magazin
        </p>
        <h1 className="animate-fade-in stagger-1 font-display mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
          Magazinul taberei
        </h1>
        <p className="animate-fade-in stagger-2 mt-4 max-w-[65ch] leading-relaxed text-ink-umber-soft">
          Adaugă în coș ce ai nevoie din fiecare raft și trimite o singură
          cerere către instructori. Produsele se ridică de la magazinul din
          tabără.
        </p>

        <div className="mt-14 divide-y divide-border-sand">
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
                  <h2 className="font-display text-lg font-medium text-ink-umber">
                    {SHOP_CATEGORY_LABELS[category]}
                  </h2>
                  <span className="text-xs font-medium text-ink-umber-soft">
                    {categoryItems.length}{" "}
                    {categoryItems.length === 1 ? "produs" : "produse"}
                  </span>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {categoryItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${0.16 + index * 0.06}s` }}
                    >
                      <ShopItemCard item={item} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <CartPanel />
      </div>
    </CartProvider>
  );
}
