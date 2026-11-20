"use client";

import { useId, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteReview } from "@/lib/review-actions";

export function DeleteReview({ id, author }: { id: string; author: string }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const headingId = useId();
  return (
    <>
      <button
        className="icon-button danger"
        aria-label={`Delete review by ${author}`}
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        <Trash2 size={16} />
      </button>
      {open && (
        <div className="modal-backdrop">
          <section
            className="modal panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
          >
            <h2 id={headingId}>Delete this review?</h2>
            <p>
              This permanently removes the review by {author} from the website.
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
                      await deleteReview(form);
                      setOpen(false);
                    } catch {
                      setError(
                        "Could not delete this review. Please try again.",
                      );
                    }
                  })
                }
              >
                {pending ? "Deleting…" : "Delete review"}
              </button>
              <button
                className="button button-outline"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
