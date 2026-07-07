"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "../actions";
import { FormField } from "../components/FormField";
import { SubmitButton } from "../components/SubmitButton";

const initialState: ActionState = {};

export function LoginForm({ resetSucceeded }: { resetSucceeded: boolean }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-10 flex flex-col gap-5">
      {resetSucceeded && (
        <p className="animate-fade-in rounded-[8px] bg-soft-linen px-4 py-3 text-sm text-sage-deep">
          Parola a fost schimbată. Te poți autentifica acum.
        </p>
      )}
      {state.error && (
        <p className="animate-fade-in rounded-[8px] bg-soft-linen px-4 py-3 text-sm text-signal-red">
          {state.error}
        </p>
      )}

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
        autoComplete="current-password"
        error={state.fieldErrors?.password?.[0]}
        required
      />

      <div className="mt-2 flex items-center justify-between">
        <SubmitButton>Autentificare</SubmitButton>
        <Link
          href="/cont/reseteaza-parola"
          className="text-sm font-medium text-ink-umber-soft transition-colors hover:text-sage-deep"
        >
          Ai uitat parola?
        </Link>
      </div>

      <p className="mt-4 text-sm text-ink-umber-soft">
        Nu ai cont încă?{" "}
        <Link
          href="/cont/inregistrare"
          className="font-semibold text-sage-deep hover:text-sage-trust"
        >
          Creează un cont
        </Link>
      </p>
    </form>
  );
}
