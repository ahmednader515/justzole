"use client";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions";
export function DeleteProduct({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false),
    [pending, start] = useTransition(),
    [error, setError] = useState("");
  return (
    <>
      <button
        className="icon-button danger"
        aria-label={`Delete ${title}`}
        onClick={() => setOpen(true)}
      >
        <Trash2 size={16} />
      </button>
      {open && (
        <div className="modal-backdrop">
          <section
            className="modal panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-heading"
          >
            <h2 id="delete-heading">Delete {title}?</h2>
            <p>
              This removes the product and its recorded sales. This cannot be
              undone.
            </p>
            {error && <p className="form-error">{error}</p>}
            <div className="form-actions">
              <button
                className="button"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    try {
                      const f = new FormData();
                      f.set("id", id);
                      await deleteProduct(f);
                      setOpen(false);
                    } catch {
                      setError("Could not delete product. Try again.");
                    }
                  })
                }
              >
                {pending ? "Deleting…" : "Delete product"}
              </button>
              <button
                className="button button-outline"
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
