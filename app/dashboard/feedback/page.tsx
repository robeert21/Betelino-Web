import { getFeedbackInbox } from "@/app/feedback/data";
import { getCurrentUser, isAdminRole } from "@/lib/auth";
import { FeedbackInbox } from "./FeedbackInbox";

export const metadata = {
  title: "Feedback — Dashboard lideri — Betelino",
};

export default async function DashboardFeedbackPage() {
  const [notes, currentUser] = await Promise.all([getFeedbackInbox(), getCurrentUser()]);
  const isAdmin = !!currentUser && isAdminRole(currentUser.role);

  return (
    <div>
      <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Feedback
      </h1>
      <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        Mesajele trimise de copii liderilor. Autorul apare doar dacă a ales
        să își pună numele — altfel mesajul este anonim.
      </p>

      <div className="mt-10">
        <FeedbackInbox notes={notes} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
