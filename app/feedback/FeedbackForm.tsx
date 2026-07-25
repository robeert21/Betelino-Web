"use client";

import { useState, useTransition } from "react";
import { submitFeedback } from "./actions";
import { AUTHOR_NAME_MAX_LENGTH, MESSAGE_MAX_LENGTH } from "./schemas";
import type { LeaderOption } from "./data";
import { LeaderCombobox } from "./LeaderCombobox";

export function FeedbackForm({ leaders }: { leaders: LeaderOption[] }) {
  const [targetLeaderId, setTargetLeaderId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  const trimmedMessage = message.trim();
  const canSubmit = trimmedMessage.length >= 3;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (trimmedMessage.length < 3) {
      setError("Scrie un mesaj de cel puțin 3 caractere.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await submitFeedback({
        targetLeaderId: targetLeaderId || undefined,
        authorName: authorName.trim() || undefined,
        message: trimmedMessage,
      });
      if (!result.success) {
        setError(result.error ?? "A apărut o eroare. Încearcă din nou.");
        return;
      }
      setMessage("");
      setAuthorName("");
      setTargetLeaderId("");
      setFormResetKey((key) => key + 1);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in rounded-[16px] bg-soft-linen p-7 md:p-8">
      <label htmlFor="feedback-leader" className="text-sm font-semibold text-ink-umber">
        Lider <span className="font-normal text-ink-umber-soft">(opțional)</span>
      </label>
      <div className="mt-3">
        <LeaderCombobox
          key={formResetKey}
          inputId="feedback-leader"
          leaders={leaders}
          onChange={setTargetLeaderId}
        />
      </div>

      <label htmlFor="feedback-author-name" className="mt-6 block text-sm font-semibold text-ink-umber">
        Numele tău <span className="font-normal text-ink-umber-soft">(opțional)</span>
      </label>
      <input
        id="feedback-author-name"
        type="text"
        value={authorName}
        onChange={(event) => setAuthorName(event.target.value)}
        maxLength={AUTHOR_NAME_MAX_LENGTH}
        placeholder="Lasă gol pentru a rămâne anonim"
        className="mt-3 w-full rounded-xl border border-border-sand bg-warm-cream px-4 py-3 text-base text-ink-umber outline-none placeholder:text-ink-umber-soft/50 focus:border-sage-trust"
      />

      <label htmlFor="feedback-message" className="mt-6 block text-sm font-semibold text-ink-umber">
        Mesajul tău
      </label>
      <textarea
        id="feedback-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={MESSAGE_MAX_LENGTH}
        rows={4}
        placeholder="Ex: Mi-a plăcut foarte mult jocul de aseară de la foc de tabără..."
        className="mt-3 w-full resize-none rounded-xl border border-border-sand bg-warm-cream px-4 py-3 text-base leading-relaxed text-ink-umber outline-none placeholder:text-ink-umber-soft/50 focus:border-sage-trust"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-ink-umber-soft/70">
          {message.length}/{MESSAGE_MAX_LENGTH}
        </span>
        <div className="flex items-center gap-4">
          {sent && <span className="text-sm font-semibold text-sage-trust">Trimis. Mulțumim! ✓</span>}
          <button
            type="submit"
            disabled={isPending || !canSubmit}
            className="inline-flex min-h-[48px] flex-shrink-0 items-center gap-2.5 rounded-full bg-sage-deep px-7 py-3 text-base font-bold text-warm-cream transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sage-trust active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trimite
          </button>
        </div>
      </div>
      {error && <p className="mt-3 text-sm font-medium text-signal-red">{error}</p>}
    </form>
  );
}
