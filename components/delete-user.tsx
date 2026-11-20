"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteUser } from "@/lib/user-actions";

export function DeleteUser({
  id,
  name,
  email,
}: {
  id: string;
  name: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
  }, [open]);

  return (
    <>
      <button
        className="icon-button danger"
        aria-label={`Delete account for ${name}`}
        title="Delete account"
        onClick={() => {
          setConfirmation("");
          setError("");
          setOpen(true);
        }}
      >
        <Trash2 size={16} />
      </button>
      {open && (
        <dialog
          ref={dialogRef}
          className="modal panel delete-confirm-dialog"
          aria-labelledby={headingId}
          aria-describedby={descriptionId}
          onCancel={(event) => {
            event.preventDefault();
            if (!pending) setOpen(false);
          }}
        >
          <h2 id={headingId}>Delete {name}’s account?</h2>
          <p id={descriptionId}>
            This permanently deletes the account and signs the user out of every
            active session. This cannot be undone.
          </p>
          <p className="delete-account-email">{email}</p>
          <form
            className="stack-form"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              start(async () => {
                try {
                  const result = await deleteUser(form);
                  if (result.error) setError(result.error);
                  else setOpen(false);
                } catch {
                  setError("Could not delete this account. Please try again.");
                }
              });
            }}
          >
            <input type="hidden" name="id" value={id} />
            <label>
              Type the account’s email to confirm
              <input
                name="email"
                type="email"
                required
                autoComplete="off"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                disabled={pending}
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              <button
                className="button"
                disabled={
                  pending ||
                  confirmation.trim().toLowerCase() !== email.toLowerCase()
                }
              >
                {pending ? "Deleting…" : "Delete account"}
              </button>
              <button
                type="button"
                className="button button-outline"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}
