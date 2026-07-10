"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addEmailAction, type ActionState } from "./actions";
import { FormField } from "./components/FormField";
import { SubmitButton } from "./components/SubmitButton";

const initialState: ActionState = {};

export function AddEmailForm() {
  const [state, formAction] = useActionState(addEmailAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      router.refresh();
    }
  }, [state.message, router]);

  if (state.message) {
    return (
      <p className="animate-fade-in rounded-[8px] bg-soft-linen px-4 py-3 text-sm text-sage-deep">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="flex-1">
        <FormField
          label="Adaugă un email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nume@exemplu.ro"
          error={state.error ?? state.fieldErrors?.email?.[0]}
          required
        />
      </div>
      <div className="sm:mt-8">
        <SubmitButton>Salvează</SubmitButton>
      </div>
    </form>
  );
}
