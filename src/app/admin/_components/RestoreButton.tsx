"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { restoreAction } from "../actions";

export function RestoreButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (error) return <span className="cms-warn-text">{error}</span>;

  if (!confirming) {
    return (
      <button className="cms-btn small" onClick={() => setConfirming(true)}>
        Restore
      </button>
    );
  }

  return (
    <span className="cms-confirm">
      Make this version live?
      <button
        className="cms-btn small primary"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await restoreAction(id);
            if (!result.ok) {
              setError(result.error ?? "Restore failed.");
              return;
            }
            setConfirming(false);
            router.refresh();
          })
        }
      >
        {pending ? "Restoring…" : "Yes, restore"}
      </button>
      <button className="cms-btn small" disabled={pending} onClick={() => setConfirming(false)}>
        Cancel
      </button>
    </span>
  );
}
