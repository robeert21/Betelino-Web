"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createFolderAction, type CreateFolderState } from "../../actions";

const initialState: CreateFolderState = {};

export function CreateFolderForm({ stationId }: { stationId: string }) {
  const [state, formAction, isPending] = useActionState(
    createFolderAction.bind(null, stationId),
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [submitId, setSubmitId] = useState(0);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
    if (state !== initialState) {
      setSubmitId((id) => id + 1);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-5 rounded-[16px] bg-soft-linen p-7 sm:flex-row sm:items-end sm:gap-4"
    >
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="folder-name" className="text-sm font-medium text-ink-umber-soft">
          Nume folder
        </label>
        <input
          id="folder-name"
          name="name"
          type="text"
          maxLength={120}
          required
          placeholder="ex. Ziua 1"
          className="rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber transition-colors duration-200 ease-out hover:border-sage-trust/50 focus:border-sage-trust focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-amber-glow px-6 py-3 text-sm font-semibold text-ink-umber transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border-sand disabled:text-ink-umber-soft"
      >
        {isPending ? "Se creează…" : "Creează folder"}
      </button>

      {state.error && (
        <p
          key={`error-${submitId}`}
          className="animate-alert-in w-full rounded-[8px] bg-warm-cream px-4 py-3 text-sm text-signal-red sm:w-auto"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}
