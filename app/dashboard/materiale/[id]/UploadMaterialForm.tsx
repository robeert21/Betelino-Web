"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function UploadMaterialForm({ folderId }: { folderId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Alege un fișier.");
      setSuccess(false);
      return;
    }

    setError(null);
    setSuccess(false);
    startTransition(async () => {
      // Uploads the raw file as the request body (not FormData) so the
      // route handler can stream it straight into R2 without buffering the
      // whole thing in Worker memory — needed for anything past a few MB.
      const params = new URLSearchParams({
        folderId,
        fileName: file.name,
        fileType: file.type,
      });
      try {
        const response = await fetch(`/api/materials/upload?${params}`, {
          method: "POST",
          body: file,
        });
        const result = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) {
          setError(result.error ?? "Încărcarea a eșuat.");
          return;
        }
        setSuccess(true);
        formRef.current?.reset();
        router.refresh();
      } catch {
        setError("Încărcarea a eșuat. Verifică conexiunea și încearcă din nou.");
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-[16px] bg-soft-linen p-7"
    >
      <h2 className="text-lg font-semibold text-ink-umber">Încarcă un material</h2>

      {error && (
        <p className="animate-alert-in rounded-[8px] bg-warm-cream px-4 py-3 text-sm text-signal-red">
          {error}
        </p>
      )}
      {success && (
        <p className="animate-alert-in rounded-[8px] bg-warm-cream px-4 py-3 text-sm text-sage-deep">
          Material încărcat.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="material-file" className="text-sm font-medium text-ink-umber-soft">
          Fișier (max 50MB)
        </label>
        <input
          ref={inputRef}
          id="material-file"
          name="file"
          type="file"
          required
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber file:mr-4 file:rounded-full file:border-0 file:bg-amber-glow file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 self-start rounded-full bg-amber-glow px-6 py-3 text-sm font-semibold text-ink-umber transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border-sand disabled:text-ink-umber-soft"
      >
        {isPending ? "Se încarcă…" : "Încarcă"}
      </button>
    </form>
  );
}
