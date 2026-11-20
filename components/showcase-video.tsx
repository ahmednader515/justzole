"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { ProductVideo } from "./video";

export function ShowcaseVideo({ url, title }: { url: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <ProductVideo url={url} title={title} preview />
      <button
        type="button"
        className="showcase-video-expand"
        aria-label={`Enlarge ${title}`}
        aria-haspopup="dialog"
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
      >
        <span>
          <Maximize2 size={17} aria-hidden="true" /> Enlarge
        </span>
      </button>
      <dialog
        ref={dialog}
        className="video-lightbox"
        aria-label={title}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {open && (
          <div className="video-lightbox-panel">
            <div className="video-lightbox-heading">
              <span>{title}</span>
              <button
                type="button"
                aria-label="Close video"
                onClick={() => dialog.current?.close()}
              >
                <X size={22} />
              </button>
            </div>
            <ProductVideo url={url} title={title} preview />
          </div>
        )}
      </dialog>
    </>
  );
}
