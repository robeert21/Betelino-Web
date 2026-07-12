"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE_ROUTES = [
  { href: "/", label: "Acasă", icon: HomeIcon },
  { href: "/clasament", label: "Clasament", icon: TrophyIcon },
  { href: "/program", label: "Program", icon: CalendarIcon },
  { href: "/regulamente", label: "Regulamente", icon: BookIcon },
  { href: "/magazin", label: "Magazin", icon: BagIcon },
  { href: "/cont", label: "Contul meu", icon: UserIcon },
];

const DASHBOARD_ROUTE = { href: "/dashboard", label: "Dashboard", icon: TeamIcon };

export function NavBar({ isLeader = false }: { isLeader?: boolean }) {
  const pathname = usePathname();
  const ROUTES = isLeader ? [...BASE_ROUTES, DASHBOARD_ROUTE] : BASE_ROUTES;

  return (
    <>
      <header className="sticky top-0 z-40 hidden md:block bg-forest-night shadow-[0_1px_0_0_var(--color-forest-mist)]">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-10 py-3.5 xl:px-20 2xl:px-28">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/camp-logo.png"
              alt="Betelino — Vânătoarea de comori"
              width={962}
              height={557}
              priority
              className="h-14 w-auto"
            />
          </Link>
          <nav className="flex items-center gap-8">
            {ROUTES.map((route) => {
              const isActive =
                route.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(route.href);
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`relative text-[0.8125rem] font-semibold uppercase tracking-[0.04em] transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? "text-amber-glow"
                      : "text-warm-cream/70 hover:text-warm-cream"
                  }`}
                >
                  {route.label}
                  <span
                    className={`absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-glow transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "scale-100 opacity-100"
                        : "scale-0 opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <header className="sticky top-0 z-40 flex md:hidden items-center justify-center bg-forest-night px-6 py-3 shadow-[0_1px_0_0_var(--color-forest-mist)]">
        <Link href="/" className="flex items-center">
          <Image
            src="/camp-logo.png"
            alt="Betelino — Vânătoarea de comori"
            width={962}
            height={557}
            priority
            className="h-9 w-auto"
          />
        </Link>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex md:hidden border-t border-border-sand bg-warm-cream">
        {ROUTES.map((route) => {
          const isActive =
            route.href === "/"
              ? pathname === "/"
              : pathname.startsWith(route.href);
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[0.6875rem] font-semibold transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 ${
                isActive ? "text-sage-deep" : "text-ink-umber-soft"
              }`}
            >
              <Icon active={isActive} />
              {route.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function TrophyIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path d="M7 5.5H4.5A1.5 1.5 0 0 0 3 7c0 2 1.5 3.5 3.5 3.5" />
      <path d="M17 5.5h2.5A1.5 1.5 0 0 1 21 7c0 2-1.5 3.5-3.5 3.5" />
      <path d="M12 14v3" />
      <path d="M8.5 20.5h7" />
      <path d="M9.5 17.5h5l.6 3h-6.2Z" />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 9.5h16" />
      <path d="M8 3.5v3" />
      <path d="M16 3.5v3" />
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
      <path d="M8 16.5h.01" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function BookIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5c0-.8.7-1.5 1.5-1.5H12v16H5.5c-.8 0-1.5.6-1.5 1.4Z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5.6 1.5 1.4Z" />
    </svg>
  );
}

function BagIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 8.5h11l1 12.5h-13z" />
      <path d="M9 8.5V6.8a3 3 0 0 1 6 0v1.7" />
    </svg>
  );
}

function TeamIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8.5" cy="8" r="3" />
      <circle cx="16" cy="9.5" r="2.5" />
      <path d="M3 20c.7-3.2 2.9-5 5.5-5s4.8 1.8 5.5 5" />
      <path d="M14.5 15.2c2.1.3 3.6 1.9 4.2 4.8" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6" />
    </svg>
  );
}
