"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNav({
  isAdmin,
  isCalauza,
}: {
  isAdmin: boolean;
  isCalauza: boolean;
}) {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Puncte" },
    { href: "/dashboard/amenzi", label: "Amenzi" },
    { href: "/dashboard/solicitari", label: "Solicitări" },
    ...(isCalauza || isAdmin ? [{ href: "/dashboard/echipa", label: "Membrii echipei" }] : []),
    ...(isAdmin ? [{ href: "/dashboard/membri", label: "Membri" }] : []),
  ];

  return (
    <nav className="flex flex-wrap gap-2 md:flex-col md:flex-nowrap md:gap-2">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep md:rounded-[10px] md:px-4 md:py-3 ${
              isActive
                ? "bg-soft-linen text-sage-deep"
                : "text-ink-umber-soft hover:bg-soft-linen hover:text-ink-umber"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
