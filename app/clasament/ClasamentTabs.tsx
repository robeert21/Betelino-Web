"use client";

import Image from "next/image";
import { useState } from "react";
import type { LeaderboardTeam, TopCamper } from "./data";

const TEAM_PHOTO: Record<string, string> = {
  Nature: "/teams/nature-face.png",
  Mystery: "/teams/mystery-face.png",
  Discovery: "/teams/discovery-face.png",
  Adventure: "/teams/adventure-face.png",
};

function teamPhoto(name: string) {
  return TEAM_PHOTO[name] ?? null;
}

function TeamAvatar({ name, sizes }: { name: string; sizes: string }) {
  const photo = teamPhoto(name);
  if (!photo) {
    return (
      <span className="font-shout text-2xl text-ink-umber-soft" aria-hidden>
        {name.charAt(0)}
      </span>
    );
  }
  return (
    <Image
      src={photo}
      alt={name}
      fill
      sizes={sizes}
      unoptimized
      className="object-cover"
    />
  );
}

const PODIUM_STYLES = [
  {
    // #1
    ring: "border-amber-glow",
    badge: "bg-amber-glow text-forest-night",
    points: "text-amber-glow",
    barBorder: "border-amber-glow/50",
    size: "h-[126px] w-[126px]",
    barHeight: "h-[150px]",
    crown: true,
  },
  {
    // #2
    ring: "border-warm-cream/60",
    badge: "bg-warm-cream/60 text-forest-night",
    points: "text-warm-cream/80",
    barBorder: "border-forest-mist",
    size: "h-24 w-24",
    barHeight: "h-[110px]",
    crown: false,
  },
  {
    // #3
    ring: "border-amber-deep/70",
    badge: "bg-amber-deep/70 text-warm-cream",
    points: "text-amber-deep",
    barBorder: "border-forest-mist",
    size: "h-24 w-24",
    barHeight: "h-20",
    crown: false,
  },
];

// Visual podium order: 2nd, 1st, 3rd
const PODIUM_ORDER = [1, 0, 2];

function PodiumSlot({
  team,
  rank,
  delay,
}: {
  team: LeaderboardTeam;
  rank: number;
  delay: number;
}) {
  const style = PODIUM_STYLES[rank];
  return (
    <div className="flex flex-col items-center">
      {style.crown && (
        <span className="mb-1 text-2xl" aria-hidden>
          👑
        </span>
      )}
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-full border-4 bg-forest-mist/40 ${style.ring} ${style.size} ${
          rank === 0 ? "mb-3.5 shadow-[0_0_0_6px_rgba(224,167,61,0.15)]" : "mb-3.5"
        }`}
      >
        <TeamAvatar name={team.name} sizes={rank === 0 ? "126px" : "96px"} />
      </div>
      <div
        className={`mb-2 flex items-center justify-center rounded-full font-extrabold ${style.badge} ${
          rank === 0 ? "h-[30px] w-[30px] text-sm" : "h-[26px] w-[26px] text-xs"
        }`}
      >
        {rank + 1}
      </div>
      <p
        className={`text-center font-extrabold text-warm-cream ${
          rank === 0 ? "text-lg" : "text-[0.9375rem]"
        }`}
      >
        {team.name}
      </p>
      <p className={`mb-4 font-bold tabular-nums ${style.points} ${rank === 0 ? "text-base" : "text-sm"}`}>
        {team.points.toLocaleString("ro-RO")} pct
      </p>
      <div
        className={`animate-grow-y w-full rounded-t-[14px] border border-b-0 bg-forest-mist/30 ${style.barHeight} ${style.barBorder}`}
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  );
}

function CamperPodiumSlot({
  camper,
  rank,
  delay,
}: {
  camper: TopCamper;
  rank: number;
  delay: number;
}) {
  const style = PODIUM_STYLES[rank];
  return (
    <div className="flex flex-col items-center">
      {style.crown && (
        <span className="mb-1 text-2xl" aria-hidden>
          👑
        </span>
      )}
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-full border-4 bg-forest-mist/40 ${style.ring} ${style.size} ${
          rank === 0 ? "mb-3.5 shadow-[0_0_0_6px_rgba(224,167,61,0.15)]" : "mb-3.5"
        }`}
      >
        <span className="font-shout text-2xl text-warm-cream" aria-hidden>
          {camper.name.charAt(0)}
        </span>
      </div>
      <div
        className={`mb-2 flex items-center justify-center rounded-full font-extrabold ${style.badge} ${
          rank === 0 ? "h-[30px] w-[30px] text-sm" : "h-[26px] w-[26px] text-xs"
        }`}
      >
        {rank + 1}
      </div>
      <p
        className={`text-center font-extrabold text-warm-cream ${
          rank === 0 ? "text-lg" : "text-[0.9375rem]"
        }`}
      >
        {camper.name}
      </p>
      <p className="mb-0.5 text-center text-xs font-semibold text-warm-cream/60">
        {camper.teamName ?? "Fără echipă"}
      </p>
      <p className={`mb-4 font-bold tabular-nums ${style.points} ${rank === 0 ? "text-base" : "text-sm"}`}>
        {camper.points.toLocaleString("ro-RO")} pct
      </p>
      <div
        className={`animate-grow-y w-full rounded-t-[14px] border border-b-0 bg-forest-mist/30 ${style.barHeight} ${style.barBorder}`}
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  );
}

type Tab = "general" | "individual";

const TAB_COPY: Record<Tab, { eyebrow: string; title: string; subtitle: string }> = {
  general: {
    eyebrow: "Clasament",
    title: "CINE ADUNĂ MAI MULTE COMORI?",
    subtitle:
      "Clasamentul se actualizează în fiecare seară, pe baza jocurilor și provocărilor din ziua respectivă. Fiecare misiune contează!",
  },
  individual: {
    eyebrow: "Clasament individual",
    title: "TOP 3 COPII DIN TOATĂ TABĂRA",
    subtitle:
      "Cei care au adunat cele mai multe puncte individuale pentru echipa lor, indiferent de echipă.",
  },
};

export function ClasamentTabs({
  teams,
  campers,
}: {
  teams: LeaderboardTeam[];
  campers: TopCamper[];
}) {
  const [tab, setTab] = useState<Tab>("general");
  const podium = teams.slice(0, 3);
  const rest = teams.slice(3);
  const maxPoints = teams[0]?.points ?? 0;
  const camperPodium = campers.slice(0, 3);
  const copy = TAB_COPY[tab];

  return (
    <div>
      <section className="relative overflow-hidden bg-forest-night">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(72, 145, 96, 0.55), transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-[1160px] px-6 pb-0 pt-16 text-center md:px-12 md:pt-20 xl:px-20">
          <div className="animate-fade-in flex items-center justify-center gap-2.5">
            <span className="h-[2px] w-7 bg-amber-glow" />
            <span className="text-[0.8125rem] font-bold uppercase tracking-[0.15em] text-amber-glow">
              {copy.eyebrow}
            </span>
            <span className="h-[2px] w-7 bg-amber-glow" />
          </div>
          <h1 className="animate-fade-in stagger-1 font-shout mx-auto mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] text-warm-cream">
            {copy.title}
          </h1>
          <p className="animate-fade-in stagger-2 mx-auto mt-6 max-w-[560px] text-lg leading-relaxed text-warm-cream/80">
            {copy.subtitle}
          </p>

          <div
            role="tablist"
            aria-label="Tip clasament"
            className="animate-fade-in stagger-2 mx-auto mt-8 inline-flex gap-1 rounded-full border border-warm-cream/15 bg-warm-cream/5 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "general"}
              onClick={() => setTab("general")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-200 ease-out ${
                tab === "general"
                  ? "bg-amber-glow text-forest-night"
                  : "text-warm-cream/70 hover:text-warm-cream"
              }`}
            >
              General
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "individual"}
              onClick={() => setTab("individual")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-200 ease-out ${
                tab === "individual"
                  ? "bg-amber-glow text-forest-night"
                  : "text-warm-cream/70 hover:text-warm-cream"
              }`}
            >
              Individual
            </button>
          </div>

          {tab === "general" ? (
            podium.length === 0 ? (
              <p className="pb-16 pt-10 text-warm-cream/70">
                Echipele apar aici automat de îndată ce sunt formate.
              </p>
            ) : (
              <div className="mx-auto mt-10 grid max-w-[820px] grid-cols-3 items-end gap-5 pb-0">
                {PODIUM_ORDER.map((rank, position) => {
                  const team = podium[rank];
                  if (!team) return <div key={rank} />;
                  return (
                    <PodiumSlot
                      key={team.id}
                      team={team}
                      rank={rank}
                      delay={0.3 + position * 0.12}
                    />
                  );
                })}
              </div>
            )
          ) : camperPodium.length === 0 ? (
            <p className="pb-16 pt-10 text-warm-cream/70">
              Copiii apar aici automat de îndată ce încep să adune puncte.
            </p>
          ) : (
            <div className="mx-auto mt-10 grid max-w-[820px] grid-cols-3 items-end gap-5 pb-0">
              {PODIUM_ORDER.map((rank, position) => {
                const camper = camperPodium[rank];
                if (!camper) return <div key={rank} />;
                return (
                  <CamperPodiumSlot
                    key={camper.id}
                    camper={camper}
                    rank={rank}
                    delay={0.3 + position * 0.12}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {tab === "general" && (
        <section className="bg-soft-linen px-6 py-14 md:px-12 md:py-20 xl:px-20">
          <div className="mx-auto max-w-[820px]">
            <div className="animate-fade-in mb-6 flex items-center gap-3.5">
              <span className="text-sm font-extrabold text-sage-deep">
                CLASAMENT COMPLET
              </span>
            </div>

            {rest.length === 0 ? (
              <p className="rounded-[16px] bg-warm-cream px-7 py-7 text-sm text-ink-umber-soft">
                {teams.length === 0
                  ? "Nicio echipă înregistrată încă."
                  : "Toate echipele sunt pe podium!"}
              </p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {rest.map((team, index) => {
                  const progress = maxPoints > 0 ? Math.round((team.points / maxPoints) * 100) : 0;
                  return (
                    <div
                      key={team.id}
                      className="animate-fade-in flex items-center gap-4.5 rounded-[16px] border border-border-sand bg-warm-cream p-4.5 md:gap-[18px] md:p-[18px]"
                      style={{ animationDelay: `${Math.min(index, 6) * 0.05}s` }}
                    >
                      <span className="w-[76px] shrink-0 text-base font-extrabold text-ink-umber-soft">
                        {index === 0 ? "Mențiune" : index + 4}
                      </span>
                      <div className="relative flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-full bg-soft-linen">
                        <TeamAvatar name={team.name} sizes="52px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mb-1.5 truncate text-base font-extrabold text-ink-umber">
                          {team.name}
                        </p>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-sand">
                          <div
                            className="animate-grow-x h-full rounded-full bg-sage-trust"
                            style={{
                              width: `${progress}%`,
                              animationDelay: `${0.15 + Math.min(index, 6) * 0.05}s`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="shrink-0 text-base font-extrabold tabular-nums text-ink-umber">
                        {team.points.toLocaleString("ro-RO")} pct
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {tab === "individual" && (
        <section className="bg-soft-linen px-6 py-14 md:px-12 md:py-20 xl:px-20">
          <div className="mx-auto max-w-[820px]">
            <p className="animate-fade-in text-center text-sm text-ink-umber-soft">
              Topul se actualizează live, după fiecare probă.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
