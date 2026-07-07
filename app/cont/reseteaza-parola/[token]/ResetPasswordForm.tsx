"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ActionState } from "../../actions";
import { FormField } from "../../components/FormField";
import { SubmitButton } from "../../components/SubmitButton";

const initialState: ActionState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(resetPasswordAction, initialState);

  return (
    <form action={formAction} className="mt-10 flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />

      {state.error && (
        <p className="animate-fade-in rounded-[8px] bg-soft-linen px-4 py-3 text-sm text-signal-red">
          {state.error}
        </p>
      )}

      <FormField
        label="Parolă nouă"
        name="password"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.password?.[0]}
        required
      />
      <FormField
        label="Confirmă parola nouă"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.confirmPassword?.[0]}
        required
      />

      <div className="mt-2">
        <SubmitButton>Salvează parola nouă</SubmitButton>
      </div>
    </form>
  );
}
