"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action}>
      <input type="hidden" name="next" value={next} />
      <label className="cms-field">
        <span className="cms-label">Username</span>
        <input
          className="cms-input"
          name="username"
          autoComplete="username"
          defaultValue={state.username}
          key={state.username}
          required
          autoFocus={!state.username}
        />
      </label>
      <label className="cms-field">
        <span className="cms-label">Password</span>
        <input
          className="cms-input"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus={Boolean(state.username)}
        />
      </label>
      {state.error ? (
        <div className="cms-banner error" role="alert" style={{ marginBottom: 0 }}>
          {state.error}
        </div>
      ) : null}
      <button className="cms-btn primary" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
