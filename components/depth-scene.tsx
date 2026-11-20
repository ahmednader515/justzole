"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Adapted from the eased pointer/parallax and perspective-card ideas in:
// https://codepen.io/editor/Abdughafur-Khujzoda/pen/01a1bb0e-5c8e-7768-a2ec-0b603e819841
export function DepthScene({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let active: HTMLElement | null = null;
    let frame = 0;
    let lastTime = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    function clearCard(card: HTMLElement | null) {
      if (!card) return;
      delete card.dataset.depthActive;
      for (const property of [
        "--depth-x",
        "--depth-y",
        "--depth-light-x",
        "--depth-light-y",
      ])
        card.style.removeProperty(property);
    }

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      clearCard(active);
      active = null;
      x = y = targetX = targetY = 0;
    }

    function render(now: number) {
      frame = 0;
      if (!active) return;
      const elapsed = lastTime ? Math.min(now - lastTime, 64) : 16.7;
      lastTime = now;
      const easing = 1 - Math.pow(0.82, elapsed / 16.7);
      x += (targetX - x) * easing;
      y += (targetY - y) * easing;
      active.style.setProperty("--depth-x", `${x}`);
      active.style.setProperty("--depth-y", `${y}`);
      active.style.setProperty("--depth-light-x", `${(x + 0.5) * 100}%`);
      active.style.setProperty("--depth-light-y", `${(y + 0.5) * 100}%`);
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.001)
        frame = requestAnimationFrame(render);
    }

    function move(event: PointerEvent) {
      if (!pointer.matches || reduced.matches || event.pointerType === "touch")
        return;
      const card =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-depth-card]")
          : null;
      if (!card || !root!.contains(card)) {
        reset();
        return;
      }
      if (card !== active) {
        reset();
        active = card;
        active.dataset.depthActive = "true";
      }
      const bounds = card.getBoundingClientRect();
      targetX = Math.max(
        -0.5,
        Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5),
      );
      targetY = Math.max(
        -0.5,
        Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5),
      );
      if (!frame) frame = requestAnimationFrame(render);
    }

    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", reset);
    root.addEventListener("pointercancel", reset);
    pointer.addEventListener("change", reset);
    reduced.addEventListener("change", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, { passive: true });
    return () => {
      reset();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", reset);
      root.removeEventListener("pointercancel", reset);
      pointer.removeEventListener("change", reset);
      reduced.removeEventListener("change", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`depth-scene ${className ?? ""}`}
      aria-label={label}
    >
      {children}
    </div>
  );
}
