"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function CrosshairCursor() {
  const pathname = usePathname();
  const excluded = pathname === "/admin" || pathname.startsWith("/admin/");
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (excluded || !cursor) return;

    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0;
    let y = 0;

    function hide() {
      cancelAnimationFrame(frame);
      frame = 0;
      cursor!.dataset.visible = "false";
      cursor!.dataset.pressed = "false";
    }

    function move(event: PointerEvent) {
      if (!pointer.matches || event.pointerType === "touch") {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      cursor!.dataset.interactive = String(
        Boolean(
          target?.closest(
            "a, button, input, textarea, select, [role='button']",
          ),
        ),
      );
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        cursor!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        cursor!.dataset.visible = "true";
      });
    }

    function press(event: PointerEvent) {
      if (event.pointerType === "mouse") cursor!.dataset.pressed = "true";
    }
    function release() {
      cursor!.dataset.pressed = "false";
    }
    function visibility() {
      if (document.hidden) hide();
    }

    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerup", release, { passive: true });
    document.addEventListener("pointercancel", hide);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", hide);
    pointer.addEventListener("change", hide);

    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", hide);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", hide);
      pointer.removeEventListener("change", hide);
    };
  }, [excluded]);

  if (excluded) return null;

  return (
    <div ref={cursorRef} className="crosshair-cursor" aria-hidden="true">
      <svg viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="10" />
        <path d="M18 1v10M18 25v10M1 18h10M25 18h10" />
        <circle className="crosshair-center" cx="18" cy="18" r="1" />
      </svg>
    </div>
  );
}
