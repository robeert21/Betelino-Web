import { getCamperMembers, getAllFines } from "../data";
import { AddFineForm } from "./AddFineForm";
import { FinesTable } from "./FinesTable";

export const metadata = {
  title: "Amenzi — Dashboard lideri — Betelino",
};

export default async function DashboardFinesPage() {
  const [members, allFines] = await Promise.all([
    getCamperMembers(),
    getAllFines(),
  ]);

  return (
    <div>
      <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Amenzi
      </h1>
      <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        Adaugă o amendă unui copil. Motivul este obligatoriu și apare în
        contul copilului, alături de statusul plății.
      </p>

      <div className="mt-14">
        <AddFineForm members={members} />
      </div>

      <div className="mt-20">
        <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
          Istoric amenzi
        </h2>
        <div className="mt-6 rounded-[16px] bg-soft-linen px-7">
          <FinesTable fines={allFines} />
        </div>
      </div>
    </div>
  );
}
