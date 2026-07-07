import { getShopRequests } from "../data";
import { ShopRequestsTable } from "../ShopRequestsTable";

export const metadata = {
  title: "Solicitări magazin — Dashboard lideri — Betelino",
};

export default async function DashboardShopRequestsPage() {
  const requests = await getShopRequests();

  return (
    <div>
      <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Solicitări magazin
      </h1>
      <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        Aprobă sau respinge cererile trimise de camperi din magazinul taberei.
        La aprobare, punctele sunt scăzute automat din contul membrului.
      </p>
      <div className="animate-fade-in stagger-2 mt-10">
        {requests.length === 0 ? (
          <p className="rounded-[16px] bg-soft-linen px-7 py-7 text-sm text-ink-umber-soft">
            Nicio solicitare înregistrată încă.
          </p>
        ) : (
          <ShopRequestsTable requests={requests} />
        )}
      </div>
    </div>
  );
}
