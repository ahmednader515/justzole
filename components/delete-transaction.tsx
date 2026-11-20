"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteSale } from "@/lib/sale-actions";

export function DeleteTransaction({
  id,
  productTitle,
  summary,
}: {
  id: string;
  productTitle: string;
  summary: string;
}) {
  const [open, setOpen] = useState(false);
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
        type="button"
        className="icon-button danger"
        title="Delete transaction"
        aria-label={`Delete transaction for ${productTitle}`}
        onClick={() => {
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
          <h2 id={headingId}>Delete this transaction?</h2>
          <p>
            <strong>{productTitle}</strong>
            <br />
            {summary}
          </p>
          <p id={descriptionId}>
            This permanently removes the sale and its quantity and revenue from
            your totals and analytics. This cannot be undone.
          </p>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <button
              className="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  try {
                    const form = new FormData();
                    form.set("id", id);
                    const result = await deleteSale(form);
                    if (result.error) setError(result.error);
                    else setOpen(false);
                  } catch {
                    setError(
                      "Could not delete this transaction. Please try again.",
                    );
                  }
                })
              }
            >
              {pending ? "Deleting…" : "Delete transaction"}
            </button>
            <button
              className="button button-outline"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
