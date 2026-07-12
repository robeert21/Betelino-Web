"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import type { DailyQuestion } from "../daily-question-data";
import { submitDailyAnswer } from "../daily-question-actions";

const TIME_LIMIT = 15;

type Phase = "idle" | "running" | "done";

export function DailyBibleQuestion({
  question,
  dateKey,
  dayLabel,
  loggedIn,
  initialResult,
}: {
  question: DailyQuestion | null;
  dateKey: string;
  dayLabel: string;
  loggedIn: boolean;
  initialResult: { selected: number | null } | null;
}) {
  const [phase, setPhase] = useState<Phase>(initialResult ? "done" : "idle");
  const [selected, setSelected] = useState<number | null>(initialResult?.selected ?? null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function persist(result: number | null) {
    startTransition(() => {
      submitDailyAnswer(dateKey, result);
    });
  }

  function handleStart() {
    setPhase("running");
    setTimeLeft(TIME_LIMIT);
    intervalRef.current = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase("done");
          setSelected(null);
          persist(null);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }

  function handleSelect(index: number) {
    if (phase !== "running") return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelected(index);
    setPhase("done");
    persist(index);
  }

  const answered = phase === "done";
  const timedOut = answered && selected === null;
  const progressPercent = (timeLeft / TIME_LIMIT) * 100;

  if (!loggedIn || !question) {
    return (
      <div className="rounded-[16px] bg-warm-cream/[0.04] p-7 ring-1 ring-inset ring-warm-cream/10 backdrop-blur-sm md:p-9">
        <div className="flex flex-col items-start gap-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-semibold leading-snug text-warm-cream md:text-2xl">
              Autentifică-te pentru a juca.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-warm-cream/60">
              Întrebarea zilei este legată de contul tău, ca să nu poți răspunde de mai multe ori.
            </p>
          </div>
          <Link
            href="/cont/login"
            className="inline-flex flex-shrink-0 items-center gap-2.5 rounded-full bg-amber-glow px-8 py-3.5 text-base font-bold text-forest-night transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep active:scale-[0.98]"
          >
            Autentificare
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    );
  }

  const isCorrect = selected === question.correctIndex;

  return (
    <div className="rounded-[16px] bg-warm-cream/[0.04] p-7 ring-1 ring-inset ring-warm-cream/10 backdrop-blur-sm md:p-9">
      {phase === "idle" && (
        <div className="animate-fade-in flex flex-col items-start gap-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-semibold leading-snug text-warm-cream md:text-2xl">
              Ai 15 secunde să răspunzi corect.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-warm-cream/60">
              {dayLabel} · o singură încercare pe zi
            </p>
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex flex-shrink-0 items-center gap-2.5 rounded-full bg-amber-glow px-8 py-3.5 text-base font-bold text-forest-night transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep active:scale-[0.98]"
          >
            Începe
            <span aria-hidden>→</span>
          </button>
        </div>
      )}

      {phase !== "idle" && (
        <>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xl font-semibold leading-snug text-warm-cream md:text-2xl">
              {question.question}
            </p>
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold tabular-nums ${
                phase === "running" && timeLeft <= 5
                  ? "border-signal-red text-signal-red"
                  : "border-amber-glow text-amber-glow"
              }`}
            >
              {phase === "running" ? timeLeft : "⏱"}
            </div>
          </div>

          {phase === "running" && (
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-warm-cream/10">
              <div
                className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
                  timeLeft <= 5 ? "bg-signal-red" : "bg-amber-glow"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {question.options.map((option, index) => {
              const isSelected = selected === index;
              const isRight = index === question.correctIndex;

              let stateClasses =
                "border-warm-cream/15 text-warm-cream/85 hover:border-amber-glow/60 hover:text-warm-cream";
              if (answered) {
                if (isRight) {
                  stateClasses = "border-sage-trust bg-sage-trust/15 text-warm-cream";
                } else if (isSelected && !isRight) {
                  stateClasses = "border-signal-red bg-signal-red/15 text-warm-cream";
                } else {
                  stateClasses = "border-warm-cream/10 text-warm-cream/40";
                }
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => handleSelect(index)}
                  className={`flex min-h-[52px] items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-[border-color,background-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-default ${stateClasses}`}
                >
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold ${
                      answered && isRight
                        ? "bg-sage-trust text-forest-night"
                        : answered && isSelected && !isRight
                          ? "bg-signal-red text-forest-night"
                          : "bg-warm-cream/10 text-warm-cream/70"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          <div
            className={`mt-6 flex items-center gap-2.5 overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              answered ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <span
              className={`text-sm font-semibold ${isCorrect ? "text-sage-trust" : "text-signal-red"}`}
            >
              {timedOut
                ? "Timpul a expirat! ⏱"
                : isCorrect
                  ? "Corect! ✓"
                  : "Mai aproape data viitoare."}
            </span>
            <span className="text-sm text-warm-cream/50">·</span>
            <span className="text-sm text-warm-cream/60">{question.reference}</span>
          </div>

          {!answered && (
            <p className="mt-6 text-xs uppercase tracking-[0.08em] text-warm-cream/40">
              {dayLabel} · o singură încercare pe zi
            </p>
          )}
        </>
      )}
    </div>
  );
}
