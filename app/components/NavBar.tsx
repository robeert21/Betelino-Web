"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE_ROUTES = [
  { href: "/", label: "Acasă", icon: HomeIcon },
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
      <header className="sticky top-0 z-40 hidden md:block bg-warm-cream shadow-[0_1px_0_0_var(--color-border-sand)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-10 py-5">
          <Link href="/" className="font-display text-xl text-ink-umber">
            Betelino
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
                      ? "text-sage-deep"
                      : "text-ink-umber-soft hover:text-ink-umber"
                  }`}
                >
                  {route.label}
                  <span
                    className={`absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sage-deep transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
