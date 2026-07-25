"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Uploads via XHR (not fetch) purely to get upload-progress events — fetch
// has no API for tracking how much of the body has been sent, so on a slow
// connection a multi-MB video looks frozen on "Se încarcă…" with no feedback.
//
// STALL_TIMEOUT_MS guards against a request that never calls back at all —
// observed against this project's local dev setup (D1/R2 bindings proxied
// over a workerd RPC tunnel that occasionally drops a request silently).
// Without it, one hung file freezes the whole batch forever with no way to
// recover short of reloading the page. The timer resets on every progress
// tick, so it only fires when a request has gone genuinely quiet — not
// just because a big file is taking a while to transfer.
const STALL_TIMEOUT_MS = 30_000;

function uploadWithProgress(
  url: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<{ error?: string }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    let stallTimer: ReturnType<typeof setTimeout>;
    const resetStallTimer = () => {
      clearTimeout(stallTimer);
      stallTimer = setTimeout(() => xhr.abort(), STALL_TIMEOUT_MS);
    };

    xhr.upload.onprogress = (event) => {
      resetStallTimer();
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      clearTimeout(stallTimer);
      let result: { error?: string } = {};
      try {
        result = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON response, fall through with generic error below
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(result);
      } else {
        resolve({ error: result.error ?? "Încărcarea a eșuat." });
      }
    };
    xhr.onerror = () => {
      clearTimeout(stallTimer);
      resolve({ error: "Eroare de rețea." });
    };
    xhr.onabort = () => {
      clearTimeout(stallTimer);
      resolve({ error: "Încărcarea s-a blocat și a fost anulată. Încearcă din nou." });
    };

    resetStallTimer();
    xhr.send(file);
  });
}

type UploadState = {
  fileIndex: number;
  totalFiles: number;
  fileName: string;
  percent: number;
};

export function UploadGalleryForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [upload, setUpload] = useState<UploadState | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const files = inputRef.current?.files;
    if (!files || files.length === 0) {
      setError("Alege cel puțin o poză sau un video.");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);

    // Uploaded one at a time (not in parallel) — the same shared caption is
    // attached to every file. Files are sent as the raw request body (not
    // FormData) so each route handler call can hand the bytes straight to
    // R2 without extra copies.
    const caption = captionRef.current?.value ?? "";
    const failures: string[] = [];
    let uploaded = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUpload({ fileIndex: i + 1, totalFiles: files.length, fileName: file.name, percent: 0 });

      const params = new URLSearchParams({ fileName: file.name, fileType: file.type, caption });
      const result = await uploadWithProgress(`/api/gallery/upload?${params}`, file, (percent) =>
        setUpload((current) => (current ? { ...current, percent } : current)),
      );
      if (result.error) {
        failures.push(`${file.name}: ${result.error}`);
      } else {
        uploaded++;
      }
    }

    setUpload(null);
    if (uploaded > 0) {
      setSuccess(uploaded === 1 ? "Fișier încărcat." : `${uploaded} fișiere încărcate.`);
      formRef.current?.reset();
      router.refresh();
    }
    if (failures.length > 0) {
      setError(failures.join(" · "));
    }
  }

  const isPending = upload !== null;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-[16px] bg-soft-linen p-7"
    >
      <h2 className="text-lg font-semibold text-ink-umber">Încarcă poze sau video-uri</h2>

      {error && (
        <p className="animate-alert-in rounded-[8px] bg-warm-cream px-4 py-3 text-sm text-signal-red">
          {error}
        </p>
      )}
      {success && (
        <p className="animate-alert-in rounded-[8px] bg-warm-cream px-4 py-3 text-sm text-sage-deep">
          {success}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="gallery-file" className="text-sm font-medium text-ink-umber-soft">
          Fișiere (max 100MB fiecare, poți selecta mai multe)
        </label>
        <input
          ref={inputRef}
          id="gallery-file"
          name="file"
          type="file"
          accept="image/*,video/*"
          multiple
          required
          disabled={isPending}
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber file:mr-4 file:rounded-full file:border-0 file:bg-amber-glow file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="gallery-caption" className="text-sm font-medium text-ink-umber-soft">
          Descriere (opțional, se aplică tuturor fișierelor selectate)
        </label>
        <input
          ref={captionRef}
          id="gallery-caption"
          name="caption"
          type="text"
          maxLength={200}
          disabled={isPending}
          placeholder="Ex: Ziua 3 — foc de tabără"
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none disabled:opacity-60"
        />
      </div>

      {upload && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-warm-cream">
          <div
            className="h-full rounded-full bg-amber-glow transition-[width] duration-150 ease-out"
            style={{ width: `${upload.percent}%` }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 self-start rounded-full bg-amber-glow px-6 py-3 text-sm font-semibold text-ink-umber transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border-sand disabled:text-ink-umber-soft"
      >
        {isPending
          ? `Se încarcă ${upload.fileIndex}/${upload.totalFiles}… ${upload.percent}%`
          : "Încarcă"}
      </button>
    </form>
  );
}
