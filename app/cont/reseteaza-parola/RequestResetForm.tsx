"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction, type ActionState } from "../actions";
import { FormField } from "../components/FormField";
import { SubmitButton } from "../components/SubmitButton";

const initialState: ActionState = {};

export function RequestResetForm() {
  const [state, formAction] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-10 flex flex-col gap-5">
      {state.message && (
        <div className="animate-fade-in rounded-[8px] bg-soft-linen px-4 py-3 text-sm text-ink-umber">
          <p>{state.message}</p>
          {state.devResetLink && (
            <p className="mt-2 text-ink-umber-soft">
              Niciun serviciu de email nu este conectat încă, așa că link-ul
              de test apare direct aici:{" "}
              <Link
                href={state.devResetLink}
                className="font-semibold text-sage-deep hover:text-sage-trust"
              >
                Resetează parola
              </Link>
            </p>
          )}
        </div>
      )}

      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email?.[0]}
        required
      />

      <div className="mt-2">
        <SubmitButton>Trimite link de resetare</SubmitButton>
      </div>

      <p className="mt-4 text-sm text-ink-umber-soft">
        Ți-ai amintit parola?{" "}
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
