"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HeroMotion({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const content = contentRef.current;
    if (!hero || !content) return;

    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let x = 0;
    let y = 0;

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      hero!.style.setProperty("--hero-tilt-x", "0deg");
      hero!.style.setProperty("--hero-tilt-y", "0deg");
      hero!.style.setProperty("--hero-shift-x", "0px");
      hero!.style.setProperty("--hero-shift-y", "0px");
    }

    function move(event: PointerEvent) {
      if (
        !pointer.matches ||
        reducedMotion.matches ||
        event.pointerType === "touch"
      )
        return;
      x = event.clientX;
      y = event.clientY;
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = content!.getBoundingClientRect();
        const localX = x - bounds.left;
        const localY = y - bounds.top;
        const relativeX = Math.max(
          -0.5,
          Math.min(0.5, localX / bounds.width - 0.5),
        );
        const relativeY = Math.max(
          -0.5,
          Math.min(0.5, localY / bounds.height - 0.5),
        );
        hero!.style.setProperty("--hero-tilt-x", `${-relativeY * 9}deg`);
        hero!.style.setProperty("--hero-tilt-y", `${relativeX * 12}deg`);
        hero!.style.setProperty("--hero-shift-x", `${relativeX * 16}px`);
        hero!.style.setProperty("--hero-shift-y", `${relativeY * 12}px`);
      });
    }

    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", reset);
    pointer.addEventListener("change", reset);
    reducedMotion.addEventListener("change", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, { passive: true });
    return () => {
      reset();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      pointer.removeEventListener("change", reset);
      reducedMotion.removeEventListener("change", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-motion">
      <div ref={contentRef} className="hero container">
        {children}
      </div>
    </section>
  );
}
