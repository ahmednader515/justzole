"use client";
import Link from "next/link";
import { useActionState } from "react";
import { authenticate } from "@/lib/actions";
export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [state, action, pending] = useActionState(
    authenticate.bind(null, mode),
    {},
  );
  return (
    <form action={action} className="stack-form">
      {mode === "register" && (
        <label>
          Display name
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="What should we call you?"
          />
        </label>
      )}
      <label>
        Email address
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 8 : 1}
          maxLength={128}
          autoComplete={
            mode === "register" ? "new-password" : "current-password"
          }
          placeholder={
            mode === "register" ? "At least 8 characters" : "Your password"
          }
        />
      </label>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="button full-width" disabled={pending}>
        {pending
          ? "One moment…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </button>
      <p className="form-switch">
        {mode === "login"
          ? "New to the community?"
          : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/register" : "/login"}>
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
