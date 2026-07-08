"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionState } from "../actions";
import { FormField } from "../components/FormField";
import { SubmitButton } from "../components/SubmitButton";

const initialState: ActionState = {};

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="mt-10 flex flex-col gap-5">
      {state.error && (
        <p className="animate-fade-in rounded-[8px] bg-soft-linen px-4 py-3 text-sm text-signal-red">
          {state.error}
        </p>
      )}

      <FormField
        label="Nume"
        name="lastName"
        autoComplete="family-name"
        error={state.fieldErrors?.lastName?.[0]}
        required
      />
      <FormField
        label="Prenume"
        name="firstName"
        autoComplete="given-name"
        error={state.fieldErrors?.firstName?.[0]}
        required
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email?.[0]}
        required
      />
      <FormField
        label="Parolă"
        name="password"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.password?.[0]}
        required
      />
      <FormField
        label="Confirmă parola"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.confirmPassword?.[0]}
        required
      />

      <div className="mt-2">
        <SubmitButton>Creează cont</SubmitButton>
      </div>

      <p className="mt-4 text-sm text-ink-umber-soft">
        Ai deja cont?{" "}
        <Link
          href="/cont/login"
          className="font-semibold text-sage-deep hover:text-sage-trust"
        >
          Autentifică-te
        </Link>
      </p>
    </form>
  );
}
