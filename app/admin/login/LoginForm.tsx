"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../auth";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="mt-6">
      <label htmlFor="password" className="text-sm font-medium">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        aria-invalid={!!state.error}
        aria-describedby="password-error"
        className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
      />
      <p id="password-error" role={state.error ? "alert" : undefined} className="mt-2 min-h-5 text-sm text-danger">
        {state.error}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full rounded-full bg-accent-gradient px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
